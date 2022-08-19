import { useRouter } from "next/router"
import { useEffect } from "react"

export default function SettingSelectionButton({ Icon, title, description, href, active = true }) {

    const router = useRouter()

    useEffect(() => {
        router.prefetch(href)
    }, [])
    function redirectToSetting() {
        if (active != true) return
        router.push(href)
    }

    return (
        <button onClick={() => redirectToSetting()} className={`outline outline-2 ${active ? 'outline-blue-100' : 'outline-gray-300'} px-4 pb-2.5 pt-3 rounded-xl text-left ${active ? '' : 'cursor-not-allowed'} ${active ? 'hover:opacity-60' : 'opacity-50'} ${active ? 'hover:outline-blue-400' : ''} transition-all duration-50 shadow-md`}>
            <Icon
                color={'#000'}
                size={23}
            />
            <div className={`mt-2`}>
                <h1 className={`font-bold text-sm text-gray-900`}>{title}</h1>
                <h3 className={`font-medium text-[11px] text-gray-500 mt-0.5`}>{description}</h3>
            </div>
        </button>
    )
}