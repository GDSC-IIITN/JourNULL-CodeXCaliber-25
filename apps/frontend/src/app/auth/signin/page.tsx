'use client';
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/animated-text";
import SignIn from "@/components/auth/sign-in";
import Image from "next/image";


export default function Login() {
    return (
        <div className="grid grid-cols-3 h-screen place-items-center bg-black">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                exit={{ opacity: 0, x: -100 }}
                className="col-span-3 md:col-span-1 flex items-center justify-center w-full">
                <SignIn></SignIn>
            </motion.div>
            <div className="col-span-2 relative hidden md:flex items-center justify-center">
                <Image width={1920} height={1080} alt="edi" className="w-full h-screen blur" src="/edi.png">
                </Image>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <AnimatedText />
                </div>

                {/* <h1 className="absolute text-9xl font-geist font-extrabold">JourNull</h1> */}
            </div>
        </div >
    )
} 