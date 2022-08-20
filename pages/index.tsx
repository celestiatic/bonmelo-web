import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAnimation, motion } from 'framer-motion';
import Typewriter from 'typewriter-effect/dist/core';
import { isDev } from '@/constants/development';
import { ArrowRight } from 'tabler-icons-react';

const Home: NextPage = (props) => {

  const topBarAnimationControl = useAnimation();
  const section1AnimationControl = useAnimation();

  const router = useRouter()
  useEffect(() => {
    router.prefetch('/app')

    // Animations
    setTimeout(() => {
      const typewriter = new Typewriter('#heroText1', {
        strings: [
          'The joyful chat app.',
          'The feature-packed chat app.',
          'The everyone-needs chat app.',
        ],
        pauseFor: 1000,
        loop: true,
        deleteSpeed: 2,
        autoStart: true,
        devMode: isDev
      });

      section1AnimationControl.start({
        translateY: '0px',
        opacity: 1
      }).then(() => {
        section1AnimationControl.start({
          scale: 1,
          transition: { ease: 'anticipate', duration: 0.75 }
        })

        setTimeout(() => {
          topBarAnimationControl.start({
            translateY: '0px',
            opacity: 1
          })
        }, 160)
      })
    }, 500)
  }, [])

  function redirectToApp() {
    router.push('/app')
  }


  return (
    <div className={`h-full w-full min-h-screen bg-[#FAFAFC]`}>
      <motion.div
      id={'topBar'}
      initial={{ translateY: '-100px', opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      animate={topBarAnimationControl}
      className={'fixed z-50 w-full h-[70px] lg:h-20 bg-white shadow-sm lg:bg-transparent lg:shadow-none flex items-center justify-between px-5 lg:px-16'}
      >
        <div id={'topBar_branding'}>
          <h1 className={'font-Torus font-semibold text-xl md:text-2xl lg:text-3xl'}>{'Bonmelo'}</h1>
        </div>

        <div id={'topBar_actionButtons'} className={'flex items-center space-x-5'}>
          <button onClick={() => redirectToApp()} className={'hover:opacity-70 transition-all'}>
            <h1 className={'font-TTInterface font-semibold text-black'}>{'Log in'}</h1>
          </button>

          <button onClick={() => redirectToApp()} className={'bg-black px-4 md:px-5 py-1.5 rounded-xl flex justify-center items-center shadow-md hover:opacity-80 transition-all'}>
            <h1 className={'font-TTInterface font-semibold text-white text-sm md:text-base'}>{'Register for free'}</h1>
            <ArrowRight
            color={'#fff'}
            size={20}
            className={'ml-1'}
            />
          </button>
        </div>
      </motion.div>

      <div className={'w-full h-full flex justify-center px-10 md:px-20 lg:px-24'}>
        <div className={'max-w-[1100px]'}>
          <motion.div
          id={'section1'}
          animate={section1AnimationControl}
          initial={{ translateY: '50px', opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
            className={'font-TTInterface text-[40px] md:text-[58px] lg:text-[68px] tracking-[-0.02em] leading-[1.05em] h-screen w-full flex flex-col justify-center'}
          >
            <h1 id={'heroText1'} className={'font-bold'}>{}</h1>
            <h3 className={'font-bold mt-2 text-[#AFAFB1]'}>{'Open source chat platform, all features jampacked in one.'}</h3>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home