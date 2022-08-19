import YTPlayer from 'yt-player'
import Script from 'next/script'
import { useEffect } from 'react'

export default function YoutubePlayer() {

    useEffect(() => {
        const player = new YTPlayer('#YoutubePlayer', {
            autoplay: true,
            controls: true,
            modestBranding: true,
            fullscreen: false
        })
        player.load('XQjZT2MN7Io')
    }, [])

    return (
        <div id={`YoutubePlayer_Wrapper`} className={`w-full h-full`}>
            <div id={`YoutubePlayer`}>

            </div>
        </div>
    )
}