import AuthForm from "@/components/AuthForm"
import { AppProps } from "@/constants/declarations/app"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowRight } from "tabler-icons-react"

export default function AuthIntro({ clientManager }: AppProps) {

    const [introSkipped, setIntroSkipped] = useState(false)
    const [buttonInTimeout, setButtonInTimeout] = useState(false)
    const [textIndex, setTextIndex] = useState(0)
    const [started, setStarted] = useState(false)
    const [authFormShown, setAuthFormShown] = useState(false)
    const backgroundAnimationController = useAnimation()
    const videoAnimationController = useAnimation()
    const textContainerAnimationController = useAnimation()
    const textAnimationController = useAnimation()
    const buttonAnimationController = useAnimation()

    const introTexts = [
        {
            id: 'meet',
            text: 'Meet the next revolutionary chat platform.'
        },
        {
            id: 'connect',
            text: 'Connect with your friends and family through Bonmelo.'
        },
        {
            id: 'meet',
            text: 'Meet communities and friends with the interests you love most.'
        },
        {
            id: 'securityandprivacy',
            text: 'Bonmelo is built with privacy and security in mind, we handle the hard part for ya.'
        },
        {
            id: 'welcomeOutro',
            text: 'That should be all! We are happy to have you on board :3'
        },
    ]

    function nextText() {
        if (clientManager?.developmentMode != true) {
            if (buttonInTimeout == true) return
            setButtonInTimeout(true)
            setTimeout(() => {
                setButtonInTimeout(false)
            }, 3000)
        }
        textAnimationController.start({
            opacity: 0,
            translateY: 150,
            filter: 'blur(100px)'
        }).then(() => {
            if (introTexts[textIndex + 1]) {
                setTextIndex(textIndex + 1)
                textAnimationController.start({
                    opacity: 1,
                    translateY: 0,
                    filter: 'blur(0px)'
                })
            } else {
                // Show Auth Form
                setAuthFormShown(true)
            }
        })
    }

    function skipToForm() {
        setIntroSkipped(true)
        setStarted(true);
        setAuthFormShown(true)
    }

    function startAnimation() {
        setStarted(true);

        // set delay to match music
        const audioElem = (document.getElementById('introAudio') as HTMLAudioElement)
        audioElem.play();
        audioElem.addEventListener('ended', () => {
            audioElem.play();
        })
        // (document.getElementById('introVideo') as HTMLVideoElement).play();
        backgroundAnimationController.start({
            backgroundColor: '#000'
        }).then(() => {
            videoAnimationController.start({
                opacity: 0.8
            }).then(() => {
                textContainerAnimationController.start({
                    opacity: 1,
                    translateY: 0,
                    filter: 'blur(0px)'
                })
            })
        })
    }

    return (
        <>
            <div className={`${started ? 'hidden' : ''} w-screen h-screen flex flex-col items-center justify-center`}>
                <div className={'pb-4 text-center'}>
                    <h1 className={'font-bold text-xl'}>{'Welcome to Bonmelo!'}</h1>
                    <h3 className={'font-semibold text-xs text-gray-400'}>{'How would you like to continue?'}</h3>
                </div>
                <button className={'bg-blue-600 text-white px-14 py-2 rounded-xl'} onClick={() => startAnimation()}>
                    <h1 className={'font-bold'}>{'I\'m new! Let\'s get Started'}</h1>
                </button>
                <button onClick={() => skipToForm()} className={'text-blue-600 px-14 py-2.5 rounded-xl'}>
                    <h1 className={'font-medium text-xs'}>Sign in with email instead</h1>
                </button>
            </div>
            <div className={`absolute z-10 w-full h-full flex justify-center items-center shadow-md ${authFormShown ? '' : 'hidden'}`}>
                <img className={`absolute w-full h-full object-cover ${introSkipped ? '' : 'hidden'}`} src={'/assets/authBgImage3.png'} />
                <AuthForm clientManager={clientManager} />
            </div>
            <motion.div
            animate={backgroundAnimationController}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            initial={{ backgroundColor: '#fff' }}
            className={`fixed w-screen h-screen ${started ? '' : 'hidden'}`}
            >
                <audio
                id={'introAudio'}
                >
                    <source src={'/assets/introMusic.mp3'} type="audio/mp3" />
                </audio>
                <motion.video
                id={'introVideo'}
                animate={videoAnimationController}
                initial={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className={'w-full h-full object-cover fixed'}
                src={'/assets/backgroundAnimation.mp4'}
                autoPlay={true}
                controls={false}
                loop={true}
                />

                <motion.div
                animate={textContainerAnimationController}
                initial={{ opacity: 0, translateY: 150, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className={`absolute ${authFormShown ? 'hidden' : ''} w-full h-full text-white font-black tracking-normal text-3xl flex flex-col justify-center items-center`}>
                        <motion.div
                            animate={textAnimationController}
                            transition={{ duration: 0.7, ease: 'anticipate' }}
                            className={`text-center md:w-[600px] px-8 drop-shadow-lg`}
                        >
                            <h1>{introTexts[textIndex]?.text}</h1>
                        </motion.div>

                    <div className={`mt-5 text-center`}>
                        <h1 className={'text-sm font-medium'}>{textIndex + 1}/{introTexts.length}</h1>
                        <button onClick={() => nextText()} className={`w-20 h-10 bg-black ${buttonInTimeout ? 'bg-opacity-10 cursor-wait' : 'bg-opacity-40 hover:bg-opacity-50'} flex items-center justify-center rounded-xl mt-1.5`}>
                            <ArrowRight
                            />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
            {/* <div className={'fixed left-3 bottom-2 text-white'}>
                <h1 className={'font-bold'}>Now playing:</h1>
                <h3 className={'text-xs -mt-0.5'}>Many Times With You</h3>
            </div> */}
        </>
    )
}