import { publicPages, communityactionsPages } from "@/constants/pages";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function HomeFooter() {

    const router = useRouter()
    const languageData = useSelector((state: any) => state.languageData);

    return (
        <div className={`flex items-center justify-center px-7 md:px-16 py-14 h-full min-h-[200px] bg-[#F7F9FC]`}>
            <div className={`w-[900px] h-full flex flex-col items-center justify-center`}>
                <div className={`font-bold font-Pishel flex justify-center`}>
                    <h1 className={`text-black text-2xl text-center flex flex-col justify-center items-center`}>
                        {languageData?.needHelpSupport[0]}
                        <button onClick={() => router.push('mailto:spacexliquid@gmail.com')} className={`text-transparent bg-clip-text bg-gradient-to-tr from-[#7A73FF] to-[#81E9FF] underline font-bold text-sm md:text-xl`}>{`spacexliquid@gmail.com`}</button>
                    </h1>
                </div>

                <div className={`w-full px-5 py-7`}>
                    <div className={`bg-gray-200 w-full h-0.5 rounded-full`} />
                </div>

                <div className={`grid-flow-row grid-cols-3 sm:grid-flow-col gap-x-7 gap-y-2 grid justify-center`}>
                    {(() => {
                        return publicPages.map((page) => {
                            return (
                                <button key={`footer_page_${page?.name}`} onClick={() => router.push(page?.href || '/')} className={`text-[#808080] hover:text-black transition-all text-lg font-Pishel font-bold`}>
                                    <h1>{languageData?.publicPages[page?.languageKey]}</h1>
                                </button>
                            )
                        })
                    })()}
                </div>

                <div className={`mt-14`}>
                    <button onClick={() => router.push('/app')} className={`bg-[#262626] px-4 py-2 font-bold rounded-xl text-[#C9C9C9]`}>
                        <h1>{languageData?.openPishelo[0]}</h1>
                    </button>
                </div>

                <div className={`mt-3 text-[#808080] font-semibold text-sm text-center`}>
                    <h1>{languageData?.pisheloTrademark[0]}</h1>
                </div>

                <div className={`w-full px-5 py-5`}>
                    <div className={`bg-gray-200 w-full h-0.5 rounded-full`} />
                </div>

                <div className={`grid-flow-row grid-cols-3 sm:grid-flow-col gap-x-7 gap-y-2 grid items-center justify-center`}>
                    {(() => {
                        return communityactionsPages.map((page) => {
                            return (
                                <button key={`footer_page_${page?.name}`} onClick={() => router.push(page?.href || '/')} className={`text-[#808080] hover:text-black transition-all text-md font-Pishel font-bold`}>
                                    <h1>{languageData?.publicPages[page?.languageKey]}</h1>
                                </button>
                            )
                        })
                    })()}
                </div>
            </div>
        </div>
    )
}