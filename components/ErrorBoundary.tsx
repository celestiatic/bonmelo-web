import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useErrorBoundary } from "use-error-boundary"

export default function ErrorBoundaryComponent({ children, componentName }) {

    const [crashed, setCrahsed] = useState<boolean>(false)
    const {
        ErrorBoundary,
        didCatch,
        error,
        reset
    } = useErrorBoundary({
        onDidCatch(error, errorInfo) {
            console.error(`ErrorBoundary caught an error in Component ${componentName || 'Unknown'}:`, error, errorInfo)
            setCrahsed(true)
            // setTimeout(() => {
            //     // reset()
            //     router.reload()
            // }, 5000)
        },
    })

    useEffect(() => {
       console.log('didcatch: ', didCatch, crashed)
    }, [didCatch, crashed])

    return (
        <>
            {crashed ? (
                <div>
                    <div className={`fixed w-full h-14 px-5 bg-blue-600 flex flex-col justify-center items-center text-white`}>
                        <h1 className={`font-Pishel font-semibold text-sm`}>Pishelo has crashed and needs to restart</h1>
                        <h3 className={`font-Pishel font-medium text-xs`}>Refreshing in 5 seconds</h3>
                    </div>

                    <div className={`w-screen h-screen px-8 bg-[#35363B] text-center flex flex-col justify-center items-center text-white`}>
                        <h1 className={`font-Pishel font-bold text-xl`}>Oops...</h1>
                        <h1 className={`font-Pishel font-medium text-xs text-gray-300`}>Looks like Pishelo has crashed unexpectedly...</h1>
                        <h3 className={`font-Pishel font-medium text-xs text-gray-300`}>Automated Error reporting is currently not available, please report this issue to Pishelo.</h3>
                        <h3 className={`font-Pishel font-medium text-xs text-gray-400 mt-2`}>{error || 'Unknown Error'}</h3>
                    </div>
                </div>
            ) : (
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            )}
        </>
    )
}