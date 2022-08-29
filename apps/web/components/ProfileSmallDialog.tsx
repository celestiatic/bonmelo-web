import { Menu } from "@mantine/core";
import AvatarImage from "./AvatarImage";
import Markdown from "./Markdown";
import { useAppSelector } from "@/clients/store/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function ProfileSmallDialog({ control, user }) {

    const router = useRouter()
    const activityProgressBar = useAnimation()
    const activityData = useAppSelector(state => state.ActivityData);
    const currentUserActivity = activityData[user?.id];

    useEffect(() => {
        if (!currentUserActivity) return
        activityProgressBar.start({
            width: `${(currentUserActivity!.progress!.current / currentUserActivity!.progress!.total) * 100}%`
        })
    }, [currentUserActivity])

    return (
        <div className={''}>
            <Menu
                className={`flex items-center`}
                placement={'start'}
                position={'right'}
                radius={'lg'}
                p={0}
                closeOnItemClick={false}
                size={275}
                sx={(theme) => ({
                    padding: '0px'
                })}
                control={
                    control
                }
            >
                <div className={`w-full h-full font-Pishel pb-5 bg-primaryBackground dark:bg-primaryBackgroundDark overflow-hidden`}>
                    <div>
                        <div id="banner" className={`w-full h-16`} style={{ backgroundColor: `${user?.bannerColor || '#222323'}` }} />

                        <button className={`group relative text-center -mt-8 ml-3 w-fit`}>
                            <AvatarImage
                                imageClassName={`transition-all group-hover:brightness-75 border-4 border-primaryBackground dark:border-primaryBackgroundDark h-fit w-[75px] rounded-full aspect-square object-cover relative`}
                                userId={user?.id}
                            />
                            <button style={{ transform: 'translate(-50%, -50%)' }} className={`hidden group-hover:block absolute z-50 px-2 w-full top-[50%] left-[50%] text-center text-white font-semibold text-[9px]`}>View Profile</button>
                        </button>
                    </div>

                    <div className={`mt-2 px-3.5`}>
                        <div className={`flex items-center`}>
                            <h1 className={`font-bold text-foreground dark:text-foregroundDark`}>{user?.username || 'Unknown username'}</h1>
                            <h3 className={`font-semibold text-xs ml-1 text-foreground dark:text-foregroundDark text-opacity-50`}>{`#${user?.discriminator}` || 'Unknown discriminator'}</h3>
                        </div>

                        <div id={`aboutme_user_${user?.id}`} className={`mt-3 ${user?.activityMessage ? 'block' : 'hidden'}`}>
                            <h1 className={`uppercase text-[10px] font-bold text-foreground dark:text-foregroundDark text-opacity-60`}>About Me</h1>
                            <Markdown
                                className={`text-[10px] font-medium text-foreground dark:text-foregroundDark mt-0.5`}
                            >
                                {user?.activityMessage || ''}
                            </Markdown>
                        </div>

                        <div id={`activity_user_${user?.id}`} className={`mt-4 ${currentUserActivity ? '' : 'hidden'}`}>
                            <h1 className={`uppercase text-[10px] font-bold text-foreground dark:text-foregroundDark text-opacity-60`}>{currentUserActivity?.type == 'spotify' ? 'Listening to Spotify' : ''}</h1>
                            <div className={'flex items-center mt-1.5'}>
                                <button onClick={() => window.open(currentUserActivity?.linkToProduct)} className={'hover:opacity-70 transition-all'}>
                                    <img className={'w-fit h-14 object-fit rounded-md'} src={`${currentUserActivity?.coverImage}`} />
                                </button>

                                <div className={'ml-2'}>
                                    <h1 className={`text-xs font-semibold text-foreground dark:text-foregroundDark`}>{currentUserActivity?.title}</h1>
                                    <h1 className={`text-[11px] font-medium text-foreground dark:text-foregroundDark`}>{currentUserActivity?.description}</h1>
                                    <h1 className={`text-[10px] mt-0.5 font-medium text-foreground dark:text-foregroundDark`}>Playing on {currentUserActivity?.currentDevice?.name}</h1>
                                </div>
                            </div>

                                <div className={'mt-3'}>
                                    <div>
                                        <div className={'bg-embedBackground opacity-80 w-full h-1.5 rounded-full shadow-xl overflow-hidden'}>
                                            <motion.div animate={activityProgressBar} initial={{ width: `${(currentUserActivity?.progress!.current / currentUserActivity?.progress!.total) * 100}%` }} transition={{ ease: 'easeInOut', duration: 0.5 }} className={'h-full bg-black'} />
                                        </div>

                                        <div className={'mt-0.5 flex items-center'}>
                                            <h1 className={'text-[11px] font-semibold text-secondaryForeground'}>{Math.round(currentUserActivity?.progress!.current / 1000)}</h1>
                                            <h1 className={'text-[11px] ml-auto font-semibold text-secondaryForeground'}>{Math.round(currentUserActivity?.progress!.total / 1000)}</h1>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </Menu>
        </div>
    )
}