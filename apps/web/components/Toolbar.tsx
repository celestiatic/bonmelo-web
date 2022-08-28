import { Menu, Divider, Kbd } from '@mantine/core';
import { Settings, SwitchHorizontal, ThreeDCubeSphere, Message2, Friends } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/clients/store/hooks';
import AvatarImage from './AvatarImage';
import { ClientManager } from 'bonmelo.js';

function Toolbar({ clientManager }: { clientManager: ClientManager }) {

    const router = useRouter()
    const usersData = useAppSelector((state) => state.UsersData)
    const userData = usersData[clientManager?.user?.id]

    async function openSettings() {
        router.push('/app/settings')
    }

    return (
        <div className={`w-[67px] duration-300 transition-all h-full flex justify-center py-5 group`}>
            <div className={`space-y-7`}>
                
                <Menu
                className={`flex w-full justify-center`}
                radius={'lg'}
                control={
                    <button className={`w-full h-12 flex justify-center`}>
                        <AvatarImage
                            imageClassName={`w-11 rounded-full shadow-md hover:opacity-80 transition-all`}
                            userId={userData?.id}
                        />

                        <div className={`h-full w-24 hidden flex-col transition-all justify-center ml-2 font-Pishel text-black text-left whitespace-nowrap overflow-hidden text-ellipsis`}>
                            <h1 className={`font-semibold text-[16px]`}>{userData?.username}</h1>
                            <h3 className={`text-[11px] text-gray-600 overflow-hidden text-ellipsis`}>{userData?.activityMessage}</h3>
                        </div>
                    </button>
                }
                >
                    <Menu.Label>Customization</Menu.Label>
                    {/* <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
                    <Menu.Item icon={<MessageCircle size={14} />}>Messages</Menu.Item> */}
                    <Menu.Item
                    icon={<ThreeDCubeSphere size={16} />}
                    disabled={true}
                    rightSection={
                        <div>
                            <Kbd>⌘</Kbd> + <Kbd>P</Kbd>
                        </div>
                    }
                    >
                        Profile
                    </Menu.Item>

                    <Divider />

                    <Menu.Label>Pishelo Options</Menu.Label>
                    <Menu.Item
                    onClick={() => openSettings()}
                    icon={<Settings size={16} />}
                    rightSection={
                        <div>
                            <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
                        </div>
                    }
                    >Settings</Menu.Item>

                    <Divider />

                    <Menu.Item disabled={true} icon={<SwitchHorizontal size={14} />}>Switch Accounts</Menu.Item>
                </Menu>

                <div className={`space-y-5 w-full flex flex-col items-center`}>
                    <button onClick={() => router.push('/app')} className={`w-12 flex items-center justify-center`}>
                        <Message2
                        size={'30px'}
                            className={'text-black opacity-30 hover:opacity-20 transition-all'}
                        />
                    </button>

                    <button onClick={() => router.push('/app/channels/@me/friends')} className={`w-12 flex items-center justify-center`}>
                        <Friends
                            size={'30px'}
                            className={'text-black opacity-30 hover:opacity-20 transition-all'}
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toolbar