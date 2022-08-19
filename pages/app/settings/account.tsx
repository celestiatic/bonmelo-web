import { useAppSelector } from "@/clients/store/hooks"
import { SettingsTopbar } from "@/components/SettingsTopbar"
import { ArrowLeft } from "tabler-icons-react"

export default function AccountSettings(props) {

    const userData = useAppSelector((state) => state.userData)

    return (
        <div className={`w-full h-screen bg-white`}>
            <SettingsTopbar
                title={'Settings'}
                description={'View and update your app behavior and account details.'}
                Icon={ArrowLeft}
            />
        </div>
    )
}