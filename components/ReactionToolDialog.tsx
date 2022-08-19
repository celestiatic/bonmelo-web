// import { gifSearch } from "@/clients/apiPublic";
// import { useAppSelector } from "@/clients/store/hooks";
// import { Menu } from "@mantine/core";
// import { useDebouncedValue } from "@mantine/hooks";
// import { useEffect, useState } from "react";
// import { ClientManager } from "bonmelo.ts";

// export default function ReactionToolDialog({ control, channelid, clientManager }: { control: any, channelid: string, clientManager: ClientManager }) {

//     const channelsData = useAppSelector((state: any) => state.channelsData)
//     // const currentConversationData = channelsData ? channelsData?.find((convo) => convo.id == channelid) : []

//     const [inputValue, setInputValue] = useState('');
//     const [gifResult, setGifResult] = useState<Array<any>>([]);
//     const [debouncedInputValue] = useDebouncedValue(inputValue, 200, {
//         leading: true
//     });

//     async function sendGif(value) {
//         const [channelClient] = await clientManager.channels.fetchFromCache([channelid])
//         if (channelClient)
//             channelClient.send(value)
//     }

//     useEffect(() => {
//         (async () => {

//             if (debouncedInputValue.trim()?.length == 0) {
//                 setGifResult([])
//                 return
//             }
//             const gifResult = await gifSearch(debouncedInputValue)
//             setGifResult(gifResult)
//         })()
//     }, [debouncedInputValue])

//     return (
//         <Menu
//             placement={'start'}
//             position={'right'}
//             radius={'lg'}
//             p={0}
//             size={450}
//             control={
//                 control
//             }
//         >
//             <div className={`font-Pishel px-3.5 py-5 bg-[#21202F] h-96 w-full`}>
//                 <div className={`w-full`}>
//                     <div className={`flex items-center w-full`}>
//                         <img className={`w-20 h-fit`} src={`/assets/giphyLogo.png`} />
//                         {/* its tenor not giphy lav */}

//                         <div className={`ml-auto`}>
//                             <h1 className={`font-bold text-white text-sm`}>GIF Tool</h1>
//                         </div>
//                     </div>

//                     <div className={`mt-4 w-full`}>
//                         <input
//                             className={`outline-[#632C90] focus:outline bg-[#0D0C1B] outline-2 rounded-lg w-full h-8 px-2 text-[13px] text-white`}
//                             placeholder={`Search gifs..`}
//                             value={inputValue}
//                             onChange={(e) => setInputValue(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div className={`w-full h-full`}>
//                     <div className={`w-full h-full grid grid-cols-2 grid-flow-rows gap-x-2 gap-y-3 mt-3 overflow-y-scroll px-3 pt-4 pb-24`}>
//                         {(() => {
//                             return gifResult.map((gifData) => {
//                                 // if (gifData.size > 500000) return null
//                                 return (
//                                     <button onClick={() => sendGif(gifData?.itemurl)} className={`rounded-sm transition-all hover:outline outline-2 outline-blue-400 outline-offset-4`} key={`result_gif_${gifData?.id}`}>
//                                         <img className={`h-fit w-full rounded-sm`} src={gifData?.gif_preview_src} />
//                                     </button>
//                                 )
//                             })
//                         })()}
//                     </div>
//                 </div>
//             </div>
//         </Menu>
//     )
// }

export default function ReactionTool({ control, channelid, clientManager }) {
    return (
        <></>
    )
}