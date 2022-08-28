import { supabase } from '@/clients/supabasePublic'
import { useRouter } from 'next/router';
import { useDebugValue, useEffect, useState } from 'react'
import greetingTime from 'greeting-time'
import { ArrowBack, BrandGithub } from 'tabler-icons-react';
import { motion, useAnimation } from 'framer-motion';

enum StepName {
    Welcome = 'Welcome',
    SignUp = 'SignUp'
}

export default function AuthIndex({ dataProps }) {

    const mainViewAnimationControl = useAnimation()
    const [inProgress, setInProgress] = useState(false)
    const [stepHistory, setStepHistory] = useState<Array<StepName>>([])
    const [stepName, setStepName] = useState<StepName>(StepName.Welcome)
    const router = useRouter()

    // how to iterate through every element in array

    useEffect(() => {
        if (!router.isReady) return

        const user = supabase.auth.user()
        if (user) {
            router.push('/app')
        } else {
            // router.push('/auth/intro')
        }
    }, [router.isReady])

    function pushCurrentStepHistory() {
        setStepHistory(prev => [...prev, stepName])
    }
    function removeCurrentStepHistory() {
        setStepHistory(prev => prev.slice(0, -1))
    }
    function getPreviousStep() {
        return stepHistory.at(stepHistory.length - 2)
    }

    async function easeScreen() {
        return new Promise((resolve, reject) => {
            mainViewAnimationControl.start({
                opacity: 0,
                translateX: '-50px',
                scale: 0.97
            }).then(() => {
                resolve(true)
            })
        })
    }

    async function easeScreenBack() {
        return new Promise((resolve, reject) => {
            mainViewAnimationControl.set({
                opacity: 0,
                translateX: '50px',
            })
            mainViewAnimationControl.start({
                opacity: 1,
                translateX: '0px',
                scale: 1
            }).then(() => {
                resolve(true)
            })
        })
    }

    async function continueButtonClick() {
        setInProgress(true)
        pushCurrentStepHistory()
        await easeScreen()
        setStepName(StepName.SignUp)
        setInProgress(false)
        mainViewAnimationControl.set({
            opacity: 0,
            translateX: '50px',
        })
        mainViewAnimationControl.start({
            opacity: 1,
            translateX: '0px',
            scale: 1
        })
    }

    async function backButtonClick() {
        const stepBefore = getPreviousStep()
        setInProgress(true)
        removeCurrentStepHistory()
        await easeScreen()
        setStepName(stepBefore as StepName)
        setInProgress(false)
        easeScreenBack()
    }


    return (
        <div className={'h-screen w-screen bg-black flex'}>
            <div className={'bg-[#131315] flex-1 hidden lg:block'}>
                <h1 className={`text-3xl font-Pishel font-bold text-white mt-4 ml-4 tracking-tighter`}>{`Bonmelo.`}</h1>
            </div>

            <div className={'bg-[#1C1D1F] flex-[2] flex flex-col items-center justify-center px-8'}>
                <motion.div
                id={'mainViewContainer'}
                className={'w-full max-w-[350px]'}
                transition={{ ease: 'easeInOut', duration: 0.2 }}
                animate={mainViewAnimationControl}
                >
                    <div id={'WelcomeScreen'} className={`${stepName == StepName.Welcome ? '' : 'hidden'}`}>
                        <h1 className={`text-4xl font-Pishel font-bold text-white`}>{`${greetingTime(new Date())}!`}</h1>

                        <div className={'mt-4 w-full'}>
                            <div id={'thirdPartyAuth'}>
                                <h1 className={`text-sm font-Bonfont font-semibold text-white`}>{`Continue with a third-party`}</h1>
                                <button
                                    className={`bg-[#111315] opacity-50 cursor-not-allowed outline outline-gray-700 flex items-center justify-center mt-3 transition-all outline-none appearance-none rounded-xl px-4 py-2 text-gray-200 text-sm font-bold w-full`}
                                >
                                    <BrandGithub/>
                                    <h1 className={`font-Bonfont font-semibold text-white ml-1.5`}>{`Github`}</h1>
                                </button>
                            </div>

                            <div className={'w-full h-14 flex items-center'} >
                                <div className={'bg-white bg-opacity-5 w-full h-0.5 rounded-full'} />
                            </div>

                            <div id={'emailAuth'} className={''}>
                                <div>
                                    <h1 className={`text-sm font-Bonfont font-semibold text-white`}>{`Or enter your email address`}</h1>
                                    <input
                                    className={`bg-[#282A2F] mt-2 invalid:border-red-400 focus:valid:border-indigo-400 transition-all focus:border-[3px] outline-none appearance-none rounded-xl px-4 py-2.5 text-gray-200 placeholder-white placeholder-opacity-20 text-sm font-bold w-full`}
                                    autoComplete={'email'}
                                    disabled={inProgress}
                                    // pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                                    // required
                                    type={'email'}
                                    placeholder={'Email address'}
                                    />
                                </div>
                            </div>

                            <div id={'actionButtons'} className={'mt-5'}>
                                <div>
                                    <button
                                        onClick={continueButtonClick}
                                        className={`${inProgress ? 'opacity-60 bg-gray-400 cursor-wait' : 'hover:opacity-80 bg-indigo-400'} shadow-md flex items-center justify-center mt-3 transition-all outline-none appearance-none rounded-xl py-3 text-gray-200 text-sm font-bold w-full`}
                                    >
                                        <h1 className={`font-Bonfont font-bold text-white ml-1.5`}>{`Continue`}</h1>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id={'WelcomeScreen'} className={`${stepName == StepName.SignUp ? '' : 'hidden'}`}>
                        <h1 className={`text-4xl font-Pishel font-bold text-white`}>{`Sign Up`}</h1>

                        <div className={'mt-6 w-full'}>
                            <div id={'inviteCodeAuth'} className={''}>
                                <div>
                                    <h1 className={`text-sm font-Bonfont font-semibold text-white`}>{`Enter an invite code`}</h1>
                                    <input
                                        className={`bg-[#282A2F] mt-2 invalid:border-red-400 focus:valid:border-indigo-400 transition-all focus:border-[3px] outline-none appearance-none rounded-xl px-4 py-2.5 text-gray-200 placeholder-white placeholder-opacity-20 text-sm font-bold w-full`}
                                        disabled={inProgress}
                                        placeholder={'Invite Code'}
                                    />
                                </div>
                            </div>

                            <div id={'actionButtons'} className={'mt-5'}>
                                <div>
                                    <button
                                        onClick={continueButtonClick}
                                        className={`${inProgress ? 'opacity-60 bg-gray-400 cursor-wait' : 'hover:opacity-80 bg-indigo-400'} shadow-md flex items-center justify-center mt-3 transition-all outline-none appearance-none rounded-xl py-3 text-gray-200 text-sm font-bold w-full`}
                                    >
                                        <h1 className={`font-Bonfont font-bold text-white ml-1.5`}>{`Continue`}</h1>
                                    </button>
                                </div>

                                <div>
                                    <button
                                        onClick={backButtonClick}
                                        className={`${inProgress ? 'opacity-20 cursor-wait' : 'hover:opacity-50'} shadow-md flex items-center justify-center transition-all outline-none appearance-none rounded-xl py-3 text-white text-sm font-bold w-full`}
                                    >
                                        <ArrowBack />
                                        <h1 className={`font-Bonfont font-bold text-white ml-1.5`}>{`Back`}</h1>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
};