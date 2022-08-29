import { openInNewWindow } from "@/clients/functions/window";
import { SettingsTopbar } from "@/components/SettingsTopbar";
import { useRouter } from "next/router";
import { ArrowLeft, BrandSpotify } from "tabler-icons-react";

export default function ConnectionsSetting() {

    const router = useRouter()
    
    const connectionsList = [
        {
            id: 'spotify',
            name: 'Spotify',
            Icon: BrandSpotify,
            callback: () => {
                const newWindow = openInNewWindow('/connections/spotify')
                newWindow.addEventListener("message", (event) => {
                    if (event.data?.['type'] === "connected") {
                        window.focus();
                    }
                });
            }
        }
    ]

    return (
        <div className={`w-full h-screen bg-primaryBackground dark:bg-primaryBackgroundDark pt-16`}>
            <SettingsTopbar
                title={'Connections'}
                description={'Connect and manage your accounts to unlock special Bonmelo integrations'}
                Icon={ArrowLeft}
            />

            <div className={`w-full h-full px-12`}>
                <div className={`w-full rounded-xl bg-gradient-to-br from-pink-300 to-orange-200 text-white px-4 py-3 mt-6`}>
                    <div>
                        <h1 className={`font-bold text-lg text-white`}>{'Connect your accounts'}</h1>
                        <h3 className={`font-semibold text-xs text-white`}>{'Connect and manage your accounts to unlock special Bonmelo integrations'}</h3>
                    </div>

                    <div className={`mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3`}>
                        {(() => {
                            return connectionsList.map((connection) => {
                                return (
                                    <button key={`connection_${connection?.id}`} onClick={() => connection?.callback()} className={`bg-black transition-all bg-opacity-20 hover:bg-opacity-40 py-2 rounded-xl flex flex-col items-center justify-center`}>
                                        <connection.Icon
                                            size={32}
                                        />
                                        <h1 className={`font-semibold text-xs`}>{connection?.name}</h1>
                                    </button>
                                )
                            })
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}