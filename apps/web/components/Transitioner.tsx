import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export default function Transitioner({ children, visible, backgroundColor, callback }: { children?: React.ReactNode, visible?, backgroundColor: string, callback?: (visible) => void }) {

    const transitionAnimationControl = useAnimation()

    useEffect(() => {
        if (visible == true) {
            transitionAnimationControl.start({
                opacity: 1,
                scale: 1,
                borderRadius: 0
            }).then(() => {
                if (callback) callback(true)
            })
        } else {
            transitionAnimationControl.start({
                opacity: 0,
                scale: 0,
                borderRadius: 999
            }).then(() => {
                if (callback) callback(false)
            })
        }
    }, [visible])

    return (
        <div>
            <motion.div
            animate={transitionAnimationControl}
            initial={{ scale: 0, opacity: 0.3, borderRadius: 999 }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
            style={{ backgroundColor: backgroundColor }}
            className={`w-screen h-screen z-50 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center`}
            >
                {children}
            </motion.div>
        </div>
    )
}