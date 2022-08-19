import HomeFooter from '@/components/HomeFooter';
import HomeHeader from '@/components/HomeHeader';
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { publicPages } from '@/constants/pages';
import { useDispatch, useSelector } from 'react-redux';

const Home: NextPage = (props) => {

  const languageData = useSelector((state: any) => state.languageData);
  const router = useRouter()
  useEffect(() => {
    router.prefetch('/app')
  }, [])


  return (
    <div className={`h-full w-full min-h-screen`}>
      <HomeHeader
        colorScheme={`light`}
      />

      <div id="section1" className={`bg-gradient-to-br from-[#A873EB] via-[#F1405B] to-[#FFCB57] text-white w-full h-[550px] px-12 md:px-12`}>
        <div className={`flex items-center h-full pt-14 md:pt-0`}>
          <div>
            <h1 className={`font-bold text-2xl md:text-3xl font-Pishel`}>
              <span className={`text-[#FFF042]`}>{languageData?.frontHeadline[0]}</span>
              {` ${languageData?.frontHeadline[1]}`}
              <span className={`yellowUnderlineText font-PalmerLake text-5xl`}>{` ${languageData?.frontHeadline[2]}`}</span>
            </h1>
            <h3 className={`text-gray-200 font-semibold mt-1`}>{languageData?.frontHeadlineDescription[0]}</h3>

            <div className={`mt-5`}>
              <button onClick={() => router.push('/app')} className={`bg-[#FFF042] px-7 py-2 rounded-xl text-black font-bold`}>
                <h1>{languageData?.openPishelo[0]}</h1>
              </button>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  )
}

export default Home