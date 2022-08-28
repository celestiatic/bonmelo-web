import { useRouter } from "next/router";
import { ArrowLeft, Icon } from "tabler-icons-react";

export function SettingsTopbar({ title, description, Icon }) {

    const router = useRouter()

    return (
        <div id="topBar" className={`w-full flex px-5 py-3 shadow-sm bg-primaryBackground dark:bg-primaryBackgroundDark`}>
            <div id="topBar_left" className={`flex items-center`}>
                <button onClick={() => router.back()} className={`hover:opacity-50 transition-all`}>
                    <Icon
                        className={'text-secondaryForeground dark:text-secondaryForegroundDark'}
                        size={28}
                    />
                </button>

                <div className={`flex items-center h-full w-full ml-3`}>
                    <h1 className={`font-bold text-xl text-foreground dark:text-foregroundDark`}>{title}</h1>

                    <div className={`px-3 py-1 h-full`}>
                        <div className={`w-[3px] h-full bg-gray-200 rounded-full`}>

                        </div>
                    </div>

                    <h3 className={`font-medium text-xs text-secondaryForeground dark:text-secondaryForegroundDark`}>{description}</h3>
                </div>
            </div>
        </div>
    )
}