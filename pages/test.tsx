import YoutubePlayer from "@/components/YoutubePlayer";
import { AppProps } from "@/constants/declarations/app";
import { useAppSelector } from "@/clients/store/hooks";

export default function TestPage({ clientManager }:AppProps) {

    const channels = useAppSelector((state) => state)

    return (
        <div className={`w-full h-screen bg-yellow-200`}>
            <div>
                <h1>{JSON.stringify(channels)}</h1>
            </div>
            <YoutubePlayer />
        </div>
    )
}