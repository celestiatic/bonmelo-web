import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BrandSpotify } from "tabler-icons-react";
import { v4 } from 'uuid'
import { AppProps } from '@/constants/declarations/app'
import { toast } from "react-hot-toast";

export default function SpotifyConnection({ clientManager }: AppProps) {

    const [success, setSuccess] = useState<null|boolean>(null)
    const [currentFunc, setCurrentFunc] = useState('Connecting')
    const router = useRouter()
    function redirectToAuth() {
        const spotifyAuthUrl = 'https://accounts.spotify.com/authorize'
        const client_id = process.env['NEXT_PUBLIC_SPOTIFY_CLIENTID']
        const redirect_uri = window.location.href
        const stateId = v4()
        const scope = [
            'user-read-private',
            'user-read-email',
            'user-read-currently-playing',
            'user-modify-playback-state',
            'user-read-playback-state',
            'streaming'
        ].join(' ');

        router.push({
            pathname: spotifyAuthUrl,
            query: {
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: stateId
            }
        });

        // router.replace(spotifyAuthUrl, {
        //     query: {
        //         response_type: 'code',
        //         client_id: client_id,
        //         scope: scope,
        //         redirect_uri: redirect_uri,
        //         state: stateId
        //     }
        // })
    }
    
    useEffect(() => {
        if (!router?.isReady) return
        const code = router?.query['code']
        if (!code) return redirectToAuth()
        setCurrentFunc('Authorizing');

        (async () => {
            await clientManager._spotify.authorize(code.toString())
            .then(() => {
                setSuccess(true)
                window?.postMessage({
                    type: 'connected'
                })

                // setTimeout(() => {
                //     window.close()
                // }, 1500)
            })
            .catch((err) => {
                console.error(err)
                setSuccess(false)
            })
        })();
    }, [router?.isReady])

    return (
        <div className={`w-full h-screen bg-background dark:bg-backgroundDark flex flex-col items-center justify-center`}>
            <BrandSpotify
                className={`rounded-xl ${success == null ? 'text-white animate-pulse' : (success == true ? 'text-blue-400' : 'text-red-400')}`}
                size={75}
            />

            <div className={`mt-2 text-foreground dark:text-foregroundDark flex items-center`}>
                <div className={`${success == null ? '' : 'hidden'}`}>
                    <div className={`font-medium flex items-center space-x-1.5`}>
                        <h1>{currentFunc} your</h1>
                        <span className={`font-black`}>Spotify</span>
                        <h1>account to</h1>
                        <span className={`font-black`}>Bonmelo</span>
                    </div>
                    <div className={`mt-0.5`}>
                        <h1 className={`text-xs`}>This may take awhile..</h1>
                    </div>
                </div>

                <div className={`${success == true ? '' : 'hidden'}`}>
                    <div className={`font-medium flex items-center space-x-1.5`}>
                        <h1>Succesfully connected your</h1>
                        <span className={`font-black`}>Spotify</span>
                        <h1>account to</h1>
                        <span className={`font-black`}>Bonmelo!</span>
                    </div>
                    <div className={`font-medium text-xs flex items-center space-x-1.5`}>
                        <h1>This window will close in a few moments..</h1>
                    </div>
                </div>

                <div className={`${success == false ? '' : 'hidden'}`}>
                    <div className={`font-medium flex items-center space-x-1.5`}>
                        <h1>Failed to connect your</h1>
                        <span className={`font-black`}>Spotify</span>
                        <h1>account to</h1>
                        <span className={`font-black`}>Bonmelo!</span>
                    </div>
                </div>
            </div>
        </div>
    )
}