import { useAppSelector } from "@/clients/store/hooks"
import { HTMLAttributes, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { gatewayAddress } from "@/constants/development"

export default function AvatarImage({ userId, imageClassName = '', buttonClassName = '' }: { userId, imageClassName?, buttonClassName? }) {

    const router = useRouter()
    const placeholderImageUrl = '/assets/avatarPlaceholder.png'
    const usersData = useAppSelector((state) => state.UsersData)
    const userData = usersData?.[userId]
    const [avatarImageUrl, setAvatarImageUrl] = useState(placeholderImageUrl)

    useEffect(() => {
        const userId = userData?.id
        const avatarId = userData?.avatarId
        const avatarURL = `${gatewayAddress}/api/v1/avatars/${userId}/${avatarId}`
        if (avatarId && userId) {
            const fetchAvatarImage = async () => {
                setAvatarImageUrl(placeholderImageUrl)
                const image = new Image()
                    image.addEventListener('load', () => {
                        setAvatarImageUrl(avatarURL)
                    })
                    image.addEventListener('error', () => {
                        setAvatarImageUrl(placeholderImageUrl)
                    })
                    image.src = avatarURL
            }
            fetchAvatarImage()
        }
    }, [userData?.avatarId])

    if (!userData || !usersData) return (
        <></>
    )

    return (
        <button className={`${buttonClassName}`}>
            <img
            src={avatarImageUrl}
            className={`aspect-square ${imageClassName}`}
            />
        </button>
    )
}