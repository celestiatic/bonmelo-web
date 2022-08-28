import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/clients/store/hooks';
// import dynamic from 'next/dynamic'
// const WholeSidebar = dynamic(() => import('@/components/WholeSidebar'))
import WholeSidebar from '@/components/WholeSidebar';
import { LoadingOverlay, Skeleton } from '@mantine/core';
import ReactTimeAgo from 'react-time-ago'
import { isDev } from '@/constants/development';
import ProfileSmallDialog from '@/components/ProfileSmallDialog';
// const ProfileSmallDialog = dynamic(() => import('@/components/ProfileSmallDialog'))
import AvatarImage from '@/components/AvatarImage';
import { CirclePlus, MoodSmile, PhoneCall, Search, ThreeDCubeSphere } from 'tabler-icons-react';
import { AppProps } from '@/constants/declarations/app';
import ErrorBoundaryComponent from '@/components/ErrorBoundary';
// const Markdown = dynamic(() => import('@/components/Markdown'))
import Markdown from '@/components/Markdown'
// const ReactionToolDialog = dynamic(() => import('@/components/ReactionToolDialog'), {
//     ssr: false
// })
import ReactionToolDialog from '@/components/ReactionToolDialog';
import Head from 'next/head';
import LoadingScreen from '@/components/LoadingScreen';

export default function ChannelView({ clientManager }:AppProps) {

    const router = useRouter()
    const channelid = (router.query['channelid'] as string)
    const dispatcher = useAppDispatch()
    const [loadingMessages, setLoadingMessages] = useState(false)
    const usersData = useAppSelector((state) => state.UsersData)
    const channelsData = useAppSelector((state) => state.ChannelsData)
    const messages = useAppSelector((state) => state.MessagesData)
    const userData = usersData[clientManager?.user?.id]
    // const badges = useAppSelector((state) => state.badgesData)

    const channelData = channelsData[channelid]

    function scrollToBottom() {
        var objDiv = document.getElementById("chatContent");
        if (!objDiv) return
        // objDiv!.scrollTop = objDiv!.scrollHeight;
        objDiv.scrollTo({ top: objDiv!.scrollHeight, behavior: 'auto' })
    }

    function getChannelClient() {
        const [channelClient] = clientManager.channels.fetchFromCache([channelid])
        return channelClient
    }

    async function sendAction(event) {
        if (event?.key == 'Enter' && !event?.shiftKey) {
            // its a send event
            const messageContent = event?.target?.innerText
            // Value checks
            if (messageContent.trim()?.length == 0) return
            setTimeout(() => {
                event.target.innerHTML = "";
            }, 0)
            
            const channelClient = getChannelClient()
            channelClient?.send(messageContent)
        }
    }

    useEffect(() => {
        if (messages?.[channelid]) scrollToBottom()
    }, [messages?.[channelid]])

    // useEffect(() => {
    //     const messagesInChannel:Array<Messages> = messages?.[channelid]
    //     if (!messagesInChannel || !messagesInChannel.at(-1)) return
    //     const messageElem = document.getElementById(`message_${messagesInChannel.at(-1)?.id}`)
    //     if (messageElem) messageElem.scrollIntoView({ behavior: 'smooth' })
    // }, [messages?.[channelid]])

    useEffect(() => {
        if (!router.isReady) return
        let pageActive = true

        const handleRouteChange = (url, { shallow }) => {
            if (url == router.asPath) return
        }
        router.events.on('routeChangeStart', handleRouteChange);

        async function fetchEverything() {
            setLoadingMessages(true)
            clientManager.channels.fetch([channelid])
                .then(async ([channelClient]) => {
                    await channelClient.messages.fetchAll()
                    scrollToBottom()
                    setLoadingMessages(false)
                })
        }
        fetchEverything()

        return () => {
            pageActive = false
            router.events.off('routeChangeStart', handleRouteChange);
        }
    }, [router.isReady, router.query?.['channelid']])

    useEffect(() => {

        const chatContentElement = document.getElementById('chatContent')
        let onPaginationFetch = false

        chatContentElement!.addEventListener("scroll", async(ev) => {
            const chatContentElement2 = document.getElementById('chatContent')
            const userScrollHeight = chatContentElement2!.clientHeight + chatContentElement2!.scrollTop;
            const elemBottomHeight = chatContentElement2!.offsetHeight;
            const offsetAvailable = 200 // higher number means faster fetching before reaching top

            if ((elemBottomHeight + offsetAvailable) >= userScrollHeight) {
                if (onPaginationFetch) return
                onPaginationFetch = true

                // await dispatcher(updatePaginatedMessages(channelid, { before: messages?.[channelid]?.at(-1)?.id }))

                onPaginationFetch = false
            }
        });
    }, [])

    return (
        <ErrorBoundaryComponent
            componentName={'DirectChannelView'}
        >
            <Head>
                <title>{channelData?.name}</title>
            </Head>
            <LoadingScreen>
                <div className={`h-screen max-h-screen w-full bg-gradient-to-br bg-white text-white`}>
                    <div className={`w-full h-full font-Pishel`}>
                        <div className={`w-full h-full flex`}>
                            <WholeSidebar
                            clientManager={clientManager}
                            />
                            <div id="chatArea" className={`overflow-hidden bg-center bg-cover bg-no-repeat h-full w-full text-black`}>
                                <LoadingOverlay visible={loadingMessages && !isDev} />
                                <div id="topToolBar" className={`bg-white z-50 h-12 backdrop-saturate-150 backdrop-brightness-[0.98] px-7 w-full relative flex justify-between items-center shadow-sm`}>

                                    <div className={`flex items-center`}>
                                        <h1 className={`font-semibold text-black dark_p:text-white`}>{channelData?.name}</h1>
                                    </div>

                                    <div className={`flex flex-col items-center text-md font-Pishel`}>
                                        {/* <h1 className={`font-semibold text-black dark_p:text-white`}>{channelData?.name}</h1> */}
                                        {/* {(() => {
                                            if (!recipientData) return
                                            const activityStatusData = acitvityTypes[recipientData?.activityStatus]
                                            const activitySatusId = activityStatusData?.id
                                            if (appReady == false) {
                                                return (
                                                    <div className={`bg-gray-300 flex rounded-full px-2.5 justify-center`}>
                                                        <h1 className={`text-[12px] text-gray-500 font-semibold`}>Connecting...</h1>
                                                    </div>
                                                )
                                            } else if (activitySatusId == 'online') {
                                                return (
                                                    <div className={`bg-[#ccfbe0] flex rounded-full px-2.5 justify-center`}>
                                                        <h1 className={`text-[12px] text-[#4e946c] font-semibold`}>Online</h1>
                                                    </div>
                                                )
                                            } else if (activitySatusId == 'idle') {
                                                return (
                                                    <div className={`bg-yellow-200 flex rounded-full px-3 justify-center`}>
                                                        <h1 className={`text-[12px] text-yellow-600 font-semibold`}>Idle</h1>
                                                    </div>
                                                )
                                            } else if (activitySatusId == 'donotdisturb') {
                                                return (
                                                    <div className={`bg-red-500 rounded-full px-2.5 flex justify-center`}>
                                                        <h1 className={`text-[12px] text-red-200 font-semibold`}>Do not Disturb</h1>
                                                    </div>
                                                )
                                            } else if (activitySatusId == 'offline') {
                                                return (
                                                    <div className={`bg-gray-300 flex rounded-full px-2.5 justify-center`}>
                                                        <h1 className={`text-[12px] text-gray-500 font-semibold`}>Offline</h1>
                                                    </div>
                                                )
                                            }
                                        })()} */}
                                    </div>

                                    <div className={`flex items-center`}>
                                        <div className={`space-x-3 flex items-center`}>
                                            <button>
                                                <PhoneCall
                                                    className={`text-[#575861] dark_p:text-white`}
                                                    width={`23px`}
                                                    height={`23px`}
                                                />
                                            </button>
                                            <button>
                                                <Search
                                                    className={`text-[#575861] dark_p:text-white`}
                                                    color={`#575861`}
                                                    width={`23px`}
                                                    height={`23px`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={`relative h-full -mt-[77px]`}>
                                    <div id="chatContent" className={`overflow-x-hidden relative overflow-y-scroll w-full h-full pb-16 pt-[70px]`}>
                                        <div className={`w-full flex flex-col items-center mt-8 pb-5 text-center px-5`}>
                                            {/* <AvatarImage
                                            userId={recipientData?.id}
                                            imageClassName={`w-20 rounded-full`}
                                            /> */}
                                            <h1 className={`mt-2 font-bold`}>{channelData?.name}</h1>
                                            <h3 className={`text-xs`}>{`Here is the start to your magical conversation to ${channelData?.name}`}</h3>
                                        </div>
                                        {(() => {

                                            let lastrecipient = ''
                                            let lastTimeAgo = ''

                                            if (!messages?.[channelid]) {
                                                return (
                                                    <>
                                                        <div className={`px-5 py-10 w-full h-fit space-y-5`}>
                                                            <div className={`flex items-center w-full h-full`}>
                                                                <Skeleton height={42} width={42} circle />
                                                                <div className={`w-full h-full ml-4`}>
                                                                    <Skeleton height={15} width={150} radius={'xl'} />

                                                                    <div className={`mt-1.5 flex items-center space-x-1 w-full`}>
                                                                        <Skeleton height={13} width={'50%'} radius="xl" />
                                                                        <Skeleton height={13} width={'20%'} radius="xl" />
                                                                        <Skeleton height={13} width={'30%'} radius="xl" />
                                                                        <Skeleton height={13} width={'60%'} radius="xl" />
                                                                        <Skeleton height={13} width={'40%'} radius="xl" />
                                                                        <Skeleton height={13} width={'20%'} radius="xl" />
                                                                        <Skeleton height={13} width={'70%'} radius="xl" />
                                                                        <Skeleton height={13} width={'60%'} radius="xl" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={`flex items-center w-96 h-full`}>
                                                                <Skeleton height={42} width={42} circle />
                                                                <div className={`w-full h-full ml-4`}>
                                                                    <Skeleton height={15} width={150} radius={'xl'} />

                                                                    <div className={`mt-1.5 flex items-center space-x-1 w-full`}>
                                                                        <Skeleton height={13} width={'50%'} radius="xl" />
                                                                        <Skeleton height={13} width={'20%'} radius="xl" />
                                                                        <Skeleton height={13} width={'30%'} radius="xl" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={`flex items-center w-full h-full`}>
                                                                <Skeleton height={42} width={42} circle />
                                                                <div className={`w-full h-full ml-4`}>
                                                                    <Skeleton height={15} width={150} radius={'xl'} />

                                                                    <div className={`mt-1.5 flex items-center space-x-1 w-full`}>
                                                                        <Skeleton height={13} width={'50%'} radius="xl" />
                                                                        <Skeleton height={13} width={'30%'} radius="xl" />
                                                                        <Skeleton height={13} width={'20%'} radius="xl" />
                                                                        <Skeleton height={13} width={'80%'} radius="xl" />
                                                                        <Skeleton height={13} width={'20%'} radius="xl" />
                                                                        <Skeleton height={13} width={'30%'} radius="xl" />
                                                                        <Skeleton height={13} width={'90%'} radius="xl" />
                                                                        <Skeleton height={13} width={'50%'} radius="xl" />
                                                                    </div>
                                                                    <div className={`mt-1.5 flex items-center space-x-1 w-full`}>
                                                                        <Skeleton height={13} width={'30%'} radius="xl" />
                                                                        <Skeleton height={13} width={'40%'} radius="xl" />
                                                                        <Skeleton height={13} width={'10%'} radius="xl" />
                                                                        <Skeleton height={13} width={'60%'} radius="xl" />
                                                                        <Skeleton height={13} width={'40%'} radius="xl" />
                                                                        <Skeleton height={13} width={'20%'} radius="xl" />
                                                                        <Skeleton height={13} width={'60%'} radius="xl" />
                                                                        <Skeleton height={13} width={'90%'} radius="xl" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }

                                            const channelFromCache = clientManager?.channels?.fetchFromCache([channelid])[0]
                                            return (messages[channelData?.id as string] || [])?.slice()?.sort((a?, b?) => (Number(a?.timestamp) || 0) - (Number(b?.timestamp) || 0))?.map((unbuiltMessage) => {

                                                const message = channelFromCache?.messages?._rebuild(unbuiltMessage)
                                                // if (!message) return

                                                const messageContainerClick = () => {
                                                    if (clientManager?.developmentMode == true) {
                                                        console.log(unbuiltMessage)
                                                    }
                                                }
                                            
                                                const messageSent = message?.sent == true ?? false
                                                const embedExists = message?.embeds?.length != 0
                                                const Container = ({ children }) => (
                                                    <div className={`snap-center ${clientManager?.developmentMode == true ? 'cursor-pointer' : ''}`} id={`messageContainer_${message?.id}`} onClick={() => messageContainerClick()}>
                                                        {children}
                                                    </div>
                                                )
                                                const RawParsedMessage = () => (
                                                    <Markdown>
                                                        {message?.content as string}
                                                    </Markdown>
                                                )
                                                const ParsedMessage = () => (
                                                    <Container>
                                                        <RawParsedMessage />
                                                        <div>
                                                            <div id={`messageEditedLabel_${message?.id}`} className={`${message?.edited ? '' : 'hidden'}`}>
                                                                <h1 className={'text-[9px] text-secondaryForeground dark:text-secondaryForegroundDark opacity-50'}>{'(edited)'}</h1>
                                                            </div>
                                                        </div>
                                                        <div className={`pt-1 ${embedExists ? '' : 'hidden'}`}>
                                                            {(() => {
                                                                return message?.embeds?.map((messageEmbed) => {

                                                                    const ThumbnailComponent = () => (
                                                                        <img className={`h-72 w-fit rounded-md`} src={messageEmbed?.thumbnail} />
                                                                    )

                                                                    return messageEmbed?.frame ? (
                                                                        <div className={`h-fit w-fit max-w-[400px] px-3 py-3 rounded-lg bg-embedBackground dark:bg-embedBackgroundDark overflow-clip`} key={`messageEmbed_thumbnail_${message?.id}_${messageEmbed.id}`}>
                                                                            <div>
                                                                                <h2 className={`font-semibold text-secondaryForeground dark:text-secondaryForegroundDark`}>{messageEmbed?.author}</h2>
                                                                                <h1 className={`mt-0.5 font-semibold text-[17px] text-foreground dark:text-foregroundDark leading-6`}>{messageEmbed?.title}</h1>
                                                                                <h3 className={`text-xs mt-2 text-foreground dark:text-foregroundDark`}>{messageEmbed?.description}</h3>
                                                                            </div>
                                                                            <div className={`mt-3.5`}>
                                                                                <ThumbnailComponent />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <ThumbnailComponent />
                                                                    )
                                                                })
                                                            })()}
                                                        </div>
                                                    </Container>
                                                )
                                                let keepitin = false

                                                const clonedLastTimeAgo = lastTimeAgo
                                                lastTimeAgo = message?.timestamp as string
                                                
                                                if (message?.author?.id == lastrecipient && 100 * 1000 > (Math.abs(Number(message?.timestamp) - Number(clonedLastTimeAgo)))) {
                                                    keepitin = true
                                                } else {
                                                    keepitin = false
                                                }

                                                // Kept in - inline message
                                                if (keepitin == true) {
                                                    return (
                                                        <div key={`message_${message?.id}`} id={`message_${message?.id}`} className={`${messageSent ? 'opacity-100' : 'opacity-50'} pl-[69px] ${embedExists ? 'py-1' : 'py-0.5'} hover:bg-slate-100 dark_p:hover:bg-[#2A3036]`}>
                                                            <h1 className={`text-[13px] -mt-[1.5px] text-gray-600 dark_p:text-gray-200`}>
                                                                <ParsedMessage />
                                                            </h1>
                                                        </div>
                                                    )
                                                }

                                                // Sets
                                                lastrecipient = message?.author?.id as string

                                                return (
                                                    <div key={`message_${message?.id}`} id={`message_${message?.id}`} className={`${messageSent ? 'opacity-100' : 'opacity-50'} w-full mt-4 flex items-center py-0.5 px-5 hover:bg-slate-100 dark_p:hover:bg-[#2A3036]`}>
                                                        <ProfileSmallDialog
                                                        user={message?.author}
                                                        control={
                                                            <button className={`flex items-center`}>
                                                                <AvatarImage
                                                                buttonClassName={`hover:opacity-80 w-9 h-9`}
                                                                imageClassName={`h-full w-full rounded-full aspect-square object-cover shadow-md`}
                                                                userId={message?.author?.id}
                                                                />
                                                            </button>
                                                        }
                                                        />

                                                        <div className={`ml-3`}>
                                                            <button className={`text-left`}>
                                                                <div className={`flex items-center group`}>
                                                                    <h1 className={`text-sm font-semibold text-gray-700 dark_p:text-white`}>{message?.author?.username || 'Username not available'}</h1>
                                                                    <h3 className={`text-xs font-semibold text-gray-400 dark_p:text-gray-300 ml-1`}>
                                                                        <span>{`- `}</span>
                                                                        <ReactTimeAgo date={Number(message?.timestamp)} locale="en-US" />
                                                                    </h3>

                                                                    {/* <div className={`flex items-center ml-2 space-x-1`}>
                                                                        {(() => {
                                                                            return userBadges.map((badgeId) => {
                                                                                if (!badges) return
                                                                                const badge = badges.find((b) => b.nameId == badgeId)
                                                                                if (!badge) return
                                                                                
                                                                                // Checks
                                                                                if (!badge?.exclusive) return

                                                                                return (
                                                                                    <Badge
                                                                                        key={`userBadge_${user.id}_${badge.id}`}
                                                                                        size="xs"
                                                                                        variant={badge?.gradientStyle ? 'gradient' : 'filled'}
                                                                                        gradient={(badge.gradientStyle as any)}
                                                                                    >
                                                                                        {badge?.text || 'Unable to load badge text'}
                                                                                    </Badge>
                                                                                )
                                                                            })
                                                                        })()}
                                                                    </div> */}
                                                                </div>
                                                            </button>
                                                            <h1 className={`text-[13px] font-medium -mt-[1.5px] text-gray-700 dark_p:text-gray-200`}>
                                                                <ParsedMessage />
                                                            </h1>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        })()}
                                    </div>

                                    <div className={`w-full relative h-fit`}>
                                        <div className={'max-w-full absolute -bottom-5 left-5 right-7'}>
                                            <div className={`w-full h-fit bg-gray-100 shadow-md rounded-xl flex items-center px-3 py-2`}>
                                                <div>
                                                    <button className={`flex items-center`}>
                                                        <CirclePlus
                                                        />
                                                    </button>
                                                </div>

                                                <div className={`ml-3 w-full h-full flex items-center pr-2`}>
                                                    {/* <input
                                                        id={`invisible_messageInput`}
                                                        className={`hidden`}
                                                    /> */}
                                                    <span
                                                    id={`messageInput`}
                                                    role={'textbox'}
                                                    className={`spanBadge w-full h-full text-xs outline-none bg-transparent font-Pishel font-medium`}
                                                    onKeyDown={sendAction}
                                                    contentEditable={true}
                                                    data-placeholder={`Message @${channelData?.name}`}
                                                    data-focused-advice={`Message @${channelData?.name}`}
                                                    />
                                                </div>

                                                <div className={`ml-auto flex items-center space-x-2.5 h-full`}>
                                                        <ReactionToolDialog
                                                            channelid={channelid}
                                                            clientManager={clientManager}
                                                            control={
                                                                <button className={`flex items-center h-full`}>
                                                                    <ThreeDCubeSphere
                                                                        className={`text-black hover:text-gray-500`}
                                                                    />
                                                                </button>
                                                            }
                                                        />
                                                        <ReactionToolDialog
                                                            channelid={channelid}
                                                            clientManager={clientManager}
                                                            control={
                                                                <button className={`flex items-center h-full`}>
                                                                    <MoodSmile
                                                                        className={`text-black hover:text-gray-500`}
                                                                    />
                                                                </button>
                                                            }
                                                        />
                                                </div>
                                            </div>

                                            <div className={`mt-2 px-2 font-Pishel`}>
                                                <div id="typingIndicator">
                                                    <h2 className={`text-xs font-semibold text-gray-500 dark_p:text-gray-200`}>
                                                        {`${channelData?.name} `}
                                                        <span className={`font-medium text-gray-500 dark_p:text-gray-200`}>is typing...</span>
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingScreen>
        </ErrorBoundaryComponent>
    )
}