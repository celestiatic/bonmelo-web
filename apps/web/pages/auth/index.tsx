import { supabase } from '@/clients/supabasePublic'
import { useRouter } from 'next/router';
import { useDebugValue, useEffect, useState } from 'react'
import greetingTime from 'greeting-time'
import { ArrowBack, BrandGithub } from 'tabler-icons-react';
import { motion, useAnimation } from 'framer-motion';
import { AppProps } from '@/constants/declarations/app';

enum StepName {
    Welcome,
    SignUp,
    SignIn,
    WelcomeFinished,
    WelcomeFailed
}

export default function AuthIndex({ clientManager }:AppProps) {

    const mainViewAnimationControl = useAnimation()
    const [errorMessage, setErrorMessage] = useState<string|null>(null)
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


    interface stepProcedureType {
        name: StepName,
        validate: () => Promise<StepName>
    }

    const stepsProcedure:Array<stepProcedureType> = [
        {
            name: StepName.Welcome,
            validate: async () => {
                const email = (document.getElementById('emailInput') as HTMLInputElement).value
                const { exists } = await clientManager._api.fetch('/auth/emails', {
                    method: 'POST',
                    body: {
                        email: email
                    }
                })
                if (exists) {
                    return StepName.SignIn
                } else {
                    return StepName.SignUp
                }
            }
        },
        {
            name: StepName.SignUp,
            async validate() {
                return StepName.SignUp
            }
        },
        {
            name: StepName.SignIn,
            async validate() {
                const email = (document.getElementById('emailInput') as HTMLInputElement).value
                const password = (document.getElementById('passwordInput') as HTMLInputElement).value
                if (!email || !password) {
                    setErrorMessage('Please fill all fields including email and password')
                    return StepName.WelcomeFailed
                }
                const { user, error } = await supabase.auth.signIn({ email: email, password: password })

                if (!error) {
                    window.location.href = '/app'
                    return StepName.WelcomeFinished
                } else {
                    // setTimeout(() => {
                    //     router.reload()
                    // }, 3000)
                    setErrorMessage(error?.message)
                    return StepName.WelcomeFailed
                }
            }
        }
    ]
    async function actionButtonClick() {
        setInProgress(true)
        pushCurrentStepHistory()

        const currentStepCount = stepsProcedure.findIndex((step) => step?.name == stepName)
        const currentStep = stepsProcedure[currentStepCount]

        // Validate screenName
        const nextStepName = await currentStep.validate()

        // Ease Screen Out
        await easeScreen()

        setStepName(nextStepName)
        setInProgress(false)

        await easeScreenBack()
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
                className={'w-full max-w-[400px]'}
                transition={{ ease: 'easeInOut', duration: 0.2 }}
                animate={mainViewAnimationControl}
                >
                    <div id={'screen_WelcomeScreen'} className={`${stepName == StepName.Welcome ? '' : 'hidden'}`}>
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
                                    id={'emailInput'}
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
                                        onClick={actionButtonClick}
                                        className={`${inProgress ? 'opacity-60 bg-gray-400 cursor-wait' : 'hover:opacity-80 bg-indigo-400'} shadow-md flex items-center justify-center mt-3 transition-all outline-none appearance-none rounded-xl py-3 text-gray-200 text-sm font-bold w-full`}
                                    >
                                        <h1 className={`font-Bonfont font-bold text-white ml-1.5`}>{`Continue`}</h1>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id={'screen_InviteCodeScreen'} className={`${stepName == StepName.SignUp ? '' : 'hidden'}`}>
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
                                        onClick={actionButtonClick}
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

                    <div id={'screen_SignInScreen'} className={`${stepName == StepName.SignIn ? '' : 'hidden'}`}>
                        <h1 className={`text-4xl font-Pishel font-bold text-white`}>{`Sign In`}</h1>

                        <div className={'mt-6 w-full'}>
                            <div id={'inviteCodeAuth'} className={''}>
                                <div>
                                    <h1 className={`text-sm font-Bonfont font-semibold text-white`}>{`Enter your password`}</h1>
                                    <input
                                        id={'passwordInput'}
                                        className={`bg-[#282A2F] mt-2 invalid:border-red-400 focus:valid:border-indigo-400 transition-all focus:border-[3px] outline-none appearance-none rounded-xl px-4 py-2.5 text-gray-200 placeholder-white placeholder-opacity-20 text-sm font-bold w-full`}
                                        disabled={inProgress}
                                        placeholder={'Your password'}
                                        type={'password'}
                                    />
                                </div>
                            </div>

                            <div id={'actionButtons'} className={'mt-5'}>
                                <div>
                                    <button
                                        onClick={actionButtonClick}
                                        className={`${inProgress ? 'opacity-60 bg-gray-400 cursor-wait' : 'hover:opacity-80 bg-indigo-400'} shadow-md flex items-center justify-center mt-3 transition-all outline-none appearance-none rounded-xl py-3 text-gray-200 text-sm font-bold w-full`}
                                    >
                                        <h1 className={`font-Bonfont font-bold text-white ml-1.5`}>{`Dive in`}</h1>
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

                    <div id={'screen_failed'} className={`${stepName == StepName.WelcomeFailed ? '' : 'hidden'}`}>
                        <h1 className={`text-4xl font-Pishel font-bold text-white text-center`}>{`Authentication Failed`}</h1>
                        <h3 className={`font-Torus font-medium text-white text-center mt-1.5`}>{errorMessage}</h3>

                        <div className={'w-full'}>

                            <div id={'actionButtons'} className={'mt-1.5'}>
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