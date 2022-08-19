import { ClientManager } from '@/clients/manager'
import LoadingScreen from '@/components/LoadingScreen'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const WholeSidebar = dynamic(() => import('@/components/WholeSidebar'))

interface AppProps {
    clientManager: ClientManager
}

const App = ({ clientManager }: AppProps) => {

    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) return
    }, [router?.isReady])

    return (
        <div className={`h-screen min-h-screen w-full bg-gradient-to-br bg-[#EEF0EB] text-white`}>
            <div className={`flex w-full h-full`}>
                <WholeSidebar
                    clientManager={clientManager}
                />
                <div className={`h-full min-h-screen w-full bg-[#F8DC5D] flex flex-col justify-center items-center font-semibold text-center px-5`}>
                    <div className={`max-w-[600px]`}>
                        <h1 className={`text-[#8B554F] text-xl font-extrabold`}>Welcome to Bonmelo Chat!</h1>
                        <h1 className={`text-[#8B554F] text-sm`}>{`We are more than delighted to have you onboard to try out this site, feel free to look around! Let lav know if there is any concerns or room for improvements to be made.`}</h1>
                        <h3 className={`block sm:hidden text-xs mt-5 text-yellow-900 opacity-40`}>{`Your current device is too teeny tiny, try using a desktop or a iPad to access full features of this site, you can also zoom out or turn your device landscape and see if that helps.`}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App