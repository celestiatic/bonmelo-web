// import { useAppSelector } from '@/clients/store/hooks'
import { motion, useAnimation } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function LoadingScreen() {

    const router = useRouter()
    // const appReady = useAppSelector((state) => state.appReady)
    const appReady = true
    const loadingAnimationControl = useAnimation()
    const [hidden, setHidden] = useState(true)
    
    useEffect(() => {
        if (!router?.asPath.includes('/app')) {
            setHidden(true)
            return
        }
        if (appReady == true) {
            loadingAnimationControl.start({
                opacity: 0
            }).then(() => {
                setHidden(true)
            })
        } else {
            setHidden(false)
            loadingAnimationControl.start({
                opacity: 1
            })
        }
    }, [appReady, router?.asPath])
    

    return (
        <motion.div
            className={`fixed h-full min-h-screen w-full bg-[#2F3136] text-white z-50 ${hidden ? 'hidden' : ''}`}
            animate={loadingAnimationControl}
        >
            <div className={`w-full min-h-screen flex flex-col justify-center items-center`}>
                <h1 className={`text-7xl animate-pulse`}>{`ʕ•́ᴥ•̀ʔっ`}</h1>
                {/* <h3 className={`mt-3`}>Loading Pishelchat</h3> */}
                <div className={`mt-7 text-center`}>
                    <h1 className={`font-semibold text-sm text-gray-500`}>This is an early development build</h1>
                    <h3 className={`font-semibold text-xs text-gray-400`}>{`Don't expect everything to work perfectly as expected.`}</h3>
                </div>
            </div>
        </motion.div>
    )
}

export default LoadingScreen