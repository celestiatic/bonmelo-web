import { Dialog, Transition } from '@headlessui/react'
import { useEffect, useState, Fragment } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useRouter } from 'next/router'
// import { userSignup } from '@/clients/apiPublic'
import { supabase } from '@/clients/supabasePublic'
import qrCode from 'qrcode'
import { PasswordInput } from '@mantine/core'
import { NextSeo } from 'next-seo'

export default function Auth(props) {

    const [isSignIn, setIsSignIn] = useState(true)
    const [showEmailVerification, setShowEmailVerification] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogDescription, setDialogDescription] = useState('')
    const [dialogDismissable, setDialogDismissable] = useState(true)

    const loginDialogAnimationControl = useAnimation()
    const router = useRouter()

    function closeModal() {
        setDialogIsOpen(false)
    }

    async function signUpForAccount() {
        setErrorMessage('Sign up disabled temporarily')
        // userSignup({ email, password, username })
        //     .then(() => {
        //         setShowEmailVerification(true)
        //     })
        //     .catch((err) => {
        //         setErrorMessage(`${err.reason}` || 'Unknown error')
        //         return
        //     })
    }

    async function signInToAccount() {
        // Set dialog state
        setDialogTitle('Signing in...')
        setDialogDescription('Please wait while we sign you in.')
        setDialogDismissable(false)
        setDialogIsOpen(true)

        const userdata = await supabase.auth.signIn({ email: email, password: password })
        const user = userdata.user || null
        if (user) {
            // router.push('/app')
            window.location.href = '/app'
        } else {
            // setErrorMessage(`${userdata.error?.message}` || 'Unknown error')
            setDialogTitle('Sign in failed')
            setDialogDescription(userdata?.error?.message || 'Unknown error')
            setDialogDismissable(true)
            setDialogIsOpen(true)
        }
    }

    useEffect(() => {
        qrCode.toCanvas(document.getElementById('qrCodeCanvas'), 'sample text', function (error) {
            if (error) console.error(error)
        })

        loginDialogAnimationControl.start({
            opacity: 1,
            translateY: 0
        })
    }, [])

    return (
        <div className={`h-full min-h-screen w-full transition-all`}>
            <NextSeo
                title={'Bonmelo'}
            />
            <Transition appear show={dialogIsOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={dialogDismissable ? closeModal : (() => null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-gray-900"
                                    >
                                        {dialogTitle}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-500">
                                            {dialogDescription}
                                        </p>
                                    </div>

                                    <div className={`mt-4 ${dialogDismissable ? '' : 'hidden'}`}>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-xl border border-transparent bg-blue-100 px-5 py-[9px] text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 shadow-sm transition-all duration-100"
                                            onClick={closeModal}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className={`bg-background dark:bg-backgroundDark transition-all md:bg-transparent`}>
                <img id="backgroundImage" className={`-z-10 absolute w-screen h-screen object-cover`} src={`/assets/authBgImage2.png`} />

                {/* <div className={`w-full fixed h-20 text-white flex items-center px-7`}>
                    <h1 className={`text-3xl font-black`}>Bonmelo</h1>
                </div> */}

                <div className={`w-full min-h-screen h-full flex pt-14 md:pt-0 md:items-center transition-all md:justify-center md:px-16`}>
                    <motion.div
                        animate={loginDialogAnimationControl}
                        initial={{ translateY: -100, opacity: 0 }}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                        className={`bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark w-full h-full transition-all ${isSignIn ? `md:w-[650px] lg:w-[850px]` : `md:w-[550px] lg:w-[650px]`} rounded-2xl md:shadow-xl md:outline outline-[3px] md:outline-indigo-700 py-5 px-5`}
                    >
                        <div className={`flex items-center ${showEmailVerification ? 'hidden' : 'block'}`}>
                            <div className={`w-full`}>
                                <h1 className={`font-bold text-2xl text-[#19114D] dark:text-white`}>{`Welcome back! 👋`}</h1>
                                <h3 className={`text-[13px] text-[#110b33] dark:text-white font-medium`}>Lets sign you into Bonmelo!</h3>

                                <div className={`mt-7 space-y-3`}>

                                    <div id="usernameForm" className={`${isSignIn ? 'hidden' : 'block'}`}>
                                        <h1 className={`text-gray-600 dark:text-gray-300 text-sm`}>Username</h1>
                                        <input
                                            placeholder="Enter your username."
                                            type={`text`}
                                            onChange={(ev) => setUsername(ev.currentTarget.value)}
                                            className={`text-black dark:text-white bg-[#F1F3F5] dark:bg-[#1e1e1e] mt-2 w-full px-4 py-2 rounded-lg focus:outline outline-2 outline-[#339AF0]`}
                                        />
                                    </div>

                                    <div id="emailForm">
                                        <h1 className={`text-gray-600 dark:text-gray-300 text-sm font-medium`}>Email Address</h1>
                                        <input
                                            placeholder="Enter your email."
                                            type={`email`}
                                            onChange={(ev) => setEmail(ev.currentTarget.value)}
                                            className={`text-black dark:text-white bg-[#F1F3F5] dark:bg-[#1e1e1e] mt-2 w-full px-4 py-2 rounded-lg focus:outline outline-2 outline-[#339AF0]`}
                                        />
                                    </div>

                                    <div id="passwordForm">
                                        <h1 className={`text-gray-600 dark:text-gray-300 text-sm font-medium`}>Password</h1>
                                        {/* <input
                                            placeholder="Enter your password."
                                            type={`password`}
                                            onChange={(ev) => setPassword(ev.currentTarget.value)}
                                            className={`text-white transition-all bg-[#1E1E1E] mt-2 w-full px-4 py-2 rounded-lg focus:outline outline-2 outline-[#FD6571]`}
                                        /> */}
                                        <PasswordInput
                                            className={`mt-2 bg-blue-50 dark:bg-[#1e1e1e] rounded-lg`}
                                            onChange={(ev) => setPassword(ev.currentTarget.value)}
                                            placeholder="Password"
                                            radius="md"
                                            size="md"
                                            variant="filled"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={`mt-3`}>
                                    <button onClick={() => isSignIn ? signInToAccount() : signUpForAccount()} className={`bg-[#a4a8cf] hover:bg-indigo-300 font-semibold rounded-xl transition-all mt-4 w-full py-2`}>
                                        <h1>{isSignIn ? 'Login' : 'Register'}</h1>
                                    </button>
                                </div>

                                <div className={`text-sm mt-5 space-y-1`}>
                                    <div className={`flex space-x-1`}>
                                        <h1 className={`text-black dark:text-white`}>{isSignIn ? `New to Bonmelo?` : `Already have an account?`}</h1>
                                        <button onClick={() => setIsSignIn(!isSignIn)} className={`text-red-400`}>{isSignIn ? `Create a new account` : 'Login'}</button>
                                    </div>

                                    <div className={`flex space-x-1`}>
                                        <h1 className={`text-black dark:text-white`}>Forgot your password?</h1>
                                        <button className={`text-red-400`}>Reset password</button>
                                    </div>
                                </div>
                            </div>

                            <div className={`${isSignIn ? 'hidden md:flex' : 'hidden'} flex-col text-center justify-center items-center h-full w-64 ml-10 mr-2 text-[#19114D] dark:text-white`}>
                                <canvas
                                    id="qrCodeCanvas"
                                    className={`w-40 h-40 rounded-2xl`}
                                />
                                <div className={`mt-8`}>
                                    <h1 className={`font-black text-xl`}>Login with QR Code</h1>
                                    <h3 className={`text-sm mt-1`}>Scan this with the Bonmelo mobile app to log in instantly.</h3>
                                </div>
                            </div>
                        </div>

                        <div className={`${showEmailVerification ? 'block' : 'hidden'}`}>
                            <h1 className={`font-black text-xl`}>Check your email 💖</h1>
                            <h3 className={`font-medium text-md`}>{`If the email you entered has not been signed up before, Click on the verification link sent to your email to continue. 🪐`}</h3>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}