import Link from 'next/link'
import { useAppSelector } from '@/clients/store/hooks';
import AvatarImage from './AvatarImage';
import type { ClientManager } from 'bonmelo.ts';
function Sidebar({ clientManager }: { clientManager: ClientManager }) {

    const channels = useAppSelector((state) => state.ChannelsData)
    const messages = useAppSelector((state) => state.MessagesData)
    const usersData = useAppSelector((state) => state.UsersData)
    const userData = usersData[clientManager?.user?.id]

    const sortedChannels = Object.values(channels).sort((channel1, channel2) => {
        const channel1LastMessage = messages?.[channel1.id]?.at(-1)
        const channel2LastMessage = messages?.[channel2.id]?.at(-1)
        return Number(channel2LastMessage?.timestamp) - Number(channel1LastMessage?.timestamp)
    })

    return (
        <div className={`z-10 pr-2 py-2 h-full w-fit flex`}>
            <div className={`bg-white bg-opacity-50 text-[#081C33] shadow-xl rounded-xl h-full w-56 flex flex-col overflow-x-hidden overflow-y-hidden`}>
                <div className={`px-4 py-5 overflow-y-auto`}>
                    <div className={`flex items-center`}>
                        {/* <img className={`w-10 rounded-full`} src={`${userData?.avatarURL}`} />
                        <div className={`ml-2`}>
                            <h1 className={`font-Pishel font-semibold text-md`}>{userData.username}</h1>
                            <h3 className={`-mt-0.5 text-xs`}>{userData.activityMessage}</h3>
                        </div> */}
                        
                        <div className={`bg-black bg-opacity-5 w-full h-10 rounded-xl flex items-center px-4`}>
                            <input
                                className={`bg-transparent border-0 w-full h-full outline-none text-[11px] text-secondaryForeground dark:text-secondaryForegroundDark text-opacity-50 placeholder-foreground dark:placeholder-foregroundDark placeholder-opacity-50`}
                                placeholder={`Search your friend name, or chat`}
                            />
                        </div>
                    </div>

                    {/* <div className={`mt-5 w-full`}>
                        <h1 className={`font-bold text-lg font-Pishel`}>Stories</h1>

                        <div className={`flex space-x-2 mt-2 overflow-x-auto items-center`}>
                            <button className={`w-fit flex flex-col items-center hover:bg-opacity-5 hover:bg-black transition-all duration-100 px-4 py-3 rounded-xl`}>
                                <img src={`${userData.avatarURL}`} className={`w-12 rounded-full outline outline-2 outline-offset-[3px] outline-[#D3A7CC]`} />
                                <div className={`flex flex-col items-center`}>
                                    <h1 className={`font-Pishel font-medium text-xs mt-3`}>{userData.username}</h1>
                                </div>
                            </button>
                            {(() => {
                                return conversationsData?.map((convodata) => {
                                    const recipientsId = convodata.members.filter(authorid => authorid != userData?.id)
                                    const recipient = usersData?.find((user) => user.id === recipientsId[0])
                                    if (!recipient) return
                                    
                                    return (
                                        <button key={`story_user_${recipient?.id}`} className={`w-fit flex flex-col items-center hover:bg-opacity-5 hover:bg-black transition-all duration-100 px-4 py-3 rounded-xl`}>
                                            <img src={`${recipient?.avatarURL}`} className={`w-12 rounded-full outline outline-2 outline-offset-[3px] outline-[#D3A7CC]`} />
                                            <div className={`flex flex-col items-center`}>
                                                <h1 className={`font-Pishel font-medium text-xs mt-3`}>{recipient?.username}</h1>
                                            </div>
                                        </button>
                                    )
                                })
                            })()}
                        </div>
                    </div> */}

                    <div className={`mt-5 text-secondaryForeground dark:text-secondaryForegroundDark`}>
                        <h1 className={`font-bold text-md font-Pishel`}>Direct Chats</h1>
                        <div className={`mt-2 space-y-2 -ml-1`}>
                            {(() => {
                                return sortedChannels?.map((channel) => {

                                    const membersCount = channel?.members?.length

                                    return (
                                        <Link key={`direct_channel_${channel.id}`} shallow={true}  href={`/app/channels/@me/${channel.id}`}>
                                            <button className={`flex text-left w-full items-center group px-1.5 py-1.5 h-10 rounded-xl font-Pishel group hover:bg-hover transition-all duration-100`}>
                                                <img className={'h-full w-fit rounded-full'} src={'/assets/avatarPlaceholder.png'} />
                                                {/* <AvatarImage
                                                    imageClassName={`w-9 rounded-full object-cover`}
                                                    userId={channel.avatarURL}
                                                /> */}

                                                <div className={`ml-3`}>
                                                    <h1 className={`text-[13px] font-bold`}>{channel?.name}</h1>
                                                    <h1 className={`text-[10px] -mt-0.5 font-medium w-full overflow-hidden whitespace-nowrap text-ellipsis`}>{`${membersCount} ${membersCount > 1 ? 'Members' : 'Member'}`}</h1>
                                                </div>
                                            </button>
                                        </Link>
                                    )
                                })
                            })()}
                        </div>
                    </div>
                </div>
                <div className={`bg-background dark:bg-backgroundDark w-full h-12 mt-auto`}>
                    <div className={`w-full h-full flex px-2.5 py-1.5`}>
                        <div className={`w-fit h-full`}>
                            <AvatarImage
                                userId={userData?.id}
                                buttonClassName={'h-full h-full w-fit'}
                                imageClassName={'h-full rounded-full'}
                            />
                        </div>
                        <div className={`ml-1.5 text-sm flex flex-col justify-center leading-3`}>
                            <h1 className={`text-foreground font-semibold text-xs`}>{userData?.username}</h1>
                            <h3 className={`text-secondaryForeground font-medium text-[10px] w-36 truncate`}>{userData?.activityMessage}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar