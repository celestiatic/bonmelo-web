import { useAppSelector } from "@/clients/store/hooks";
import AvatarImage from "@/components/AvatarImage";
import { SettingsTopbar } from "@/components/SettingsTopbar";
import WholeSidebar from "@/components/WholeSidebar";
import { AppProps } from "@/constants/declarations/app";
import { useRouter } from "next/router";
import { Friends, Message, PhoneCall } from "tabler-icons-react";

export default function ManageFriends() {
    return (
        <>
        </>
    )
}

// export default function ManageFriends({ clientManager }:AppProps) {

//     const router = useRouter()
//     const usersData = useAppSelector((state) => state.UsersData)
//     const userData = usersData[clientManager?.user?.id]
//     const channelsData = useAppSelector((state) => state.ChannelsData)

//     return (
//         <div className={`w-screen h-screen flex`}>
//             <WholeSidebar
//                 clientManager={clientManager}
//             />

//             <div className={`w-full h-full`}>
//                 <SettingsTopbar
//                 title={'Friends'}
//                 description={'Manage your friends'}
//                 Icon={Friends}
//                 />

//                 <div className={`px-7 py-5`}>
//                     <input
//                     placeholder={`Search`}
//                     className={`w-full h-9 bg-gray-200 rounded-lg px-4 font-semibold text-sm`}
//                     />

//                     <div className={`mt-3`}>
//                         <h1 className={`text-[11px] font-bold uppercase text-gray-500`}>{`Online - ${channelsData?.length || 0}`}</h1>

//                         <div className={`space-y-3 mt-3`}>
//                             {(() => {
//                                 return userData?.friends.map((friendData) => {
//                                     if (!friendData) return null

//                                     function arrayIncludes(array1: Array<any>, array2: Array<any>) {
//                                         let allMatched = true
//                                         for (const array1Item of array1) {
//                                             const matched = array2.includes(array1Item)
//                                             if (!matched) {
//                                                 allMatched = false
//                                                 break;
//                                             }
//                                         }
//                                         return allMatched
//                                     }

//                                     const friend = usersData[friendData?.id]
//                                     const conversationData = Object.values(channelsData).find((channel) => arrayIncludes(channel?.members, [userData.id, friendData?.id]))
//                                     console.log('owo', conversationData, friend)
//                                     if (!friend) return null
//                                     return (
//                                         <div className={`w-full flex items-center bg-gray-50 rounded-xl px-4 py-2.5`} key={`friendsUser_${friend.id}`}>
//                                             <div>
//                                                 <AvatarImage
//                                                     userId={friend?.id}
//                                                     imageClassName={`h-10 w-fit rounded-full shadow-md`}
//                                                 />

//                                                 <div className={`mt-2`}>
//                                                     <h1 className={`font-bold text-sm`}>{friend?.username}</h1>
//                                                     <h3 className={`font-medium text-[11px] text-gray-400`}>{friend?.activityMessage}</h3>
//                                                 </div>
//                                             </div>

//                                             <div className={`ml-auto flex items-center space-x-3`}>
//                                                 <button onClick={() => router.push(`/app/channels/@me/${conversationData?.id}`)} className={`w-10 h-10 bg-gray-200 hover:opacity-70 rounded-full flex justify-center items-center`}>
//                                                     <Message
//                                                         color={'#000'}
//                                                         className={`opacity-50`}
//                                                     />
//                                                 </button>

//                                                 <button className={`w-10 h-10 bg-gray-200 hover:opacity-70 rounded-full flex justify-center items-center`}>
//                                                     <PhoneCall
//                                                         color={'#000'}
//                                                         className={`opacity-50`}
//                                                     />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )
//                                 })
//                             })()}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }