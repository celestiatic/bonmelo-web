import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Unlink } from "tabler-icons-react"

export default function LinkRedirect(props) {

    const router = useRouter()
    const [isValid, setIsValid] = useState(true)
    const [redirecting, setRedirecting] = useState(false)
    const { url, ref, integrity } = router.query

    useEffect(() => {
        if (!router.isReady) return
        const localIsValid = integrity == Buffer.from(url as string).toString('base64')
        setIsValid(localIsValid)
    }, [router?.isReady])

    function redirectToSite() {
        setRedirecting(true)

        setTimeout(() => {
            router.replace((url as string))
        }, 2000)
    }

    return (
        <div className={`w-screen h-screen bg-white`}>
            <div className={`${isValid ? 'hidden' : ''} w-full h-full`}>
                <div className={'w-full h-full text-center flex flex-col justify-center items-center px-5'}>
                    <h1 className={`font-bold text-black text-lg md:text-xl`}>{`Yikes! Unable to verify the integrity of this redirect`}</h1>
                    <h3 className={`font-medium text-gray-500 text-xs md:text-sm`}>{`This *seems* like a link that is taking you to ${url}`}</h3>
                    <h3 className={`${redirecting ? 'hidden' : ''} font-medium mt-0.5 text-gray-400 text-xs md:text-sm`}>{`Redirection not available since integrity could not be verified`}</h3>
                    <button onClick={() => window.close()} className={`text-white bg-gray-400 mt-3.5 hover:opacity-70 px-5 py-2 rounded-xl`}>
                        <h1 className={`font-semibold text-xs`}>{`Take me home to safety - Close this window`}</h1>
                    </button>
                </div>
            </div>
            <div className={`${isValid ? '' : 'hidden'} w-full h-full bg-white flex flex-col text-center justify-center items-center px-5 sm:px-12 md:px-24`}>
                <div>
                    <Unlink
                    size={60}
                    color={'#000'}
                    />
                </div>

                <div>
                    <h1 className={`font-bold text-black text-lg md:text-xl`}>{`${redirecting ? `Now redirecting` : `Are you sure you want to visit this link?`}`}</h1>
                    <h3 className={`font-medium text-gray-500 text-xs md:text-sm`}>{`This link is taking you to ${url}`}</h3>
                    <h3 className={`${redirecting ? 'hidden' : ''} font-medium mt-1.5 text-gray-400 text-xs md:text-sm`}>{`You're about to leave the app and go to an external website. - Links are snoopy woompies, they might be unsafe. - Attackers at may trick you into doing something dangerous like installing software or revealing your personal information. Make sure you're visiting a website that you trust`}</h3>
                </div>

                <div className={`mt-5`}>
                    <div>
                        <button onClick={() => redirectToSite()} className={`bg-blue-500 hover:opacity-80 text-white px-5 py-1.5 rounded-xl`}>
                            <h1 className={`font-bold text-white text-sm`}>{`I know what i'm doing, take me there anyway`}</h1>
                        </button>
                    </div>

                    <div>
                        <button onClick={() => window.close()} className={`text-gray-500 hover:opacity-70 px-5 py-2 rounded-xl`}>
                            <h1 className={`font-medium text-xs`}>{`Take me home to safety - Close this window`}</h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}