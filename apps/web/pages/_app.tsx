import '../styles/globals.css'
import { useDebugValue, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Tracker from '@openreplay/tracker/cjs';
import { MantineProvider, Notification } from '@mantine/core';
import { supabase } from '@/clients/supabasePublic';
import ErrorBoundaryComponent from '@/components/ErrorBoundary';
import { appVersion, isDev, serverAddress } from '@/constants/development';
import Head from 'next/head';
import { ClientManager } from "bonmelo.js"
import toast, { Toaster } from 'react-hot-toast';
import LoadingScreen from '@/components/LoadingScreen';
import { Provider } from 'react-redux';
import storeDemo from '@/clients/store'
import { timeAgoInit } from '@/clients/timeAgo';

const tracker = new Tracker({
  projectKey: (process.env['NEXT_PUBLIC_OPENREPLAY_KEY'] as string),
  __DISABLE_SECURE_MODE: isDev ? true : false,
  revID: appVersion,
  captureExceptions: true,
  captureIFrames: true,
  connAttemptCount: 16,
  connAttemptGap: 5000,
  respectDoNotTrack: false,
  obscureTextEmails: false,
  obscureTextNumbers: false,
  obscureInputEmails: false,
});
if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  tracker.start();
}

const AppWrapper = ({ Component, pageProps }) => {
  const [cacheData, setCacheData] = useState({});

  // useEffect(() => {
  //   const cacheDataInStorage = reactLocalStorage.getObject("cacheData");
  //   setCacheData(cacheDataInStorage['data'])
  // }, [])

  return (
    <Provider store={storeDemo}>
      <App Component={Component} pageProps={pageProps} />
    </Provider>
  )
}

const App = ({ Component, pageProps }) => {
  const router = useRouter()

  const [clientManager] = useState(() => new ClientManager({
    verbose: true,
    type: 'user',
    _devMode: isDev,
    web: true,
    reduxStore: storeDemo,
    endpoint: serverAddress
  }))

  // Register service worker
  useEffect(() => {
    // if ("serviceWorker" in navigator) {
    //   window.addEventListener("load", function () {
    //     navigator.serviceWorker.register("/sw.js").then(
    //       async function (registration) {
    //         await window.Notification.requestPermission();
    //         console.log("Service Worker registration successful with scope: ", registration.scope);
    //       },
    //       function (err) {
    //         console.log("Service Worker registration failed: ", err);
    //       }
    //     );
    //   });
    // }

    // store.subscribe(() => {
    //   const data = store.getState()

    //   if (data) {
    //     const wrappedData = {
    //       badgesData: data.badgesData,
    //       conversationsData: data.channelsData,
    //       userData: data.userData,
    //       usersData: data.usersData,
    //       themeData: data.themeData,
    //       languageData: data.languageData,
    //       messages: data.messages,
    //     }
    //     const digestedCacheHash = hashString(wrappedData)
    //     reactLocalStorage.setObject('cacheData', { data: wrappedData, integrity: digestedCacheHash })
    //   }
    // })

    // timeAgo Init
    timeAgoInit()
  }, [])


  // Requires
  const needsUserAuth = [
    '/app',
  ]

  function checkIfNeed(array: Array<string>, url: string): boolean {
    let result = false
    for (const path of array) {
      if (url.includes(path)) {
        result = true
        break;
      }
    }
    return result
  }

  // Authpoint
  useEffect(() => {
    if (!supabase.auth.session()?.user) {
      if (checkIfNeed(needsUserAuth, router.pathname)) {
        router.push('/auth')
      }
    }

    const sessionData = supabase.auth.session()
    clientManager.login(sessionData?.access_token as string)

      supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('authEventDataChange', event, session)

      switch (event) {
        case "SIGNED_OUT":
          // await store.dispatch(emptyUserData())
          router.replace('/auth')
          router.reload()
          break;
        case "TOKEN_REFRESHED":
          router.reload()
          break;
      }
      return
    })
  }, [])

  // Reduxpoint
  // const dispatch = useAppDispatch()

  useEffect(() => {
    (async () => {

      // set language and theme
      // dispatch(setLanguage({ language: 'en' }))
      // dispatch(setTheme('light'))

      // on offline
      let currentConnectionAlertToastId:string|null = null
      function offlineError() {
        let toastTimeout = 11500
        if (currentConnectionAlertToastId) {
          toast.dismiss(currentConnectionAlertToastId)
        }
        const errorToast = toast.error('Yikes, seems like Bonmelo disconnected from the internet, try checking your internet settings to get me back up and running!', {
          duration: toastTimeout,
        })
        currentConnectionAlertToastId = errorToast
      }
      function onlineSuccess() {
        let toastTimeout = 4500
        if (currentConnectionAlertToastId) {
          toast.dismiss(currentConnectionAlertToastId)
        }
        const successToast = toast.success('Successfully reconnected to the internet. Now fetching all new messages.', {
          duration: toastTimeout,
        })
        currentConnectionAlertToastId = successToast
        setTimeout(() => {
          router.reload()
        }, 300)
      }
     if (!window.navigator.onLine) {
      offlineError()
     }
      window.addEventListener('offline', () => {
        offlineError()
      })
      window.addEventListener('online', () => {
        onlineSuccess()
      })

      async function checkIfPageNeedsData(url) {
        if (checkIfNeed(needsUserAuth, url)) {
          const user = supabase.auth.user()
          if (user) {
            return true
          } else {
            router.push('/auth')
            return false
          }
        }
      }
      checkIfPageNeedsData(router.pathname)
      function handleRouteChange(url) {
        checkIfPageNeedsData(url)
      }

      // Spotify
      clientManager._spotify.once('authReady', () => {
        // clientManager._spotify.init()
      })


      router.events.on('routeChangeStart', handleRouteChange)
      // If the component is unmounted, unsubscribe
      // from the event with the `off` method:
      return () => {
        router.events.off('routeChangeStart', handleRouteChange)
      }
    })()
  }, [])

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        </Head>
        <ErrorBoundaryComponent
        componentName={'App'}
        >
              {/* <Suspense fallback={<h1>loading.</h1>}> */}
              <MantineProvider
                theme={{
                  /** Put your mantine theme override here */
                  colorScheme: 'light',
                }}
              >
                <div>
                  {/* <div className={`sm:fixed z-10 sm:right-8 sm:bottom-5 sm:w-fit w-full sm:max-w-sm space-y-2`}>
                    {(() => {
                      return notifications?.map((notification) => {

                        if (!notification?.id) return

                        return (
                          <Notification
                            key={`notification_alert_${notification?.id}`}
                            title={`${notification?.title || ''}`}
                            className={`sm:rounded-xl h-fit px-3`} icon={<X size={18} />} color="yellow"
                          >
                            {notification?.text || ''}
                          </Notification>
                        )
                      })
                    })()}
                  </div> */}
                <Toaster
                position={'bottom-right'}
                toastOptions={{
                  className: 'font-Bonfont font-semibold text-sm text-foreground dark:text-foregroundDark bg-alertDialog dark:bg-alertDialogDark rounded-xl shadow-lg',
                }}
                />
                </div>
                {/* <LoadingOverlay visible={!appReady} /> */}
                <LoadingScreen>
                  <Component clientManager={clientManager} {...pageProps} />
                </LoadingScreen>
              </MantineProvider>
              {/* </Suspense> */}
        </ErrorBoundaryComponent>
      </div>
    )
}

export default AppWrapper