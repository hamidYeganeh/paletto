"use client";

import { PreferencesIntroView } from "./PreferencesIntroView"
import { PreferencesStepsView } from "./PreferencesStepsView"
import { usePreferencesStore } from "../store/PreferencesStore"
import Logo from "@/components/shared/Logo";
import dynamic from "next/dynamic";

const SilkBackground = dynamic(() => import('@/components/shared/SilkBackground'))

export const PreferencesView = () => {
    const isIntroView = usePreferencesStore((state) => state.isIntroView)
    return (
        <main className="h-dvh bg-primary-500 overflow-hidden relative">
            <div className="absolute inset-0 m-auto z-0">
                <SilkBackground
                    color="#3b6c57"
                    // color={isIntroView ? '#f7f5ed' : "#3b6c57"}
                    speed={12}
                    scale={1}
                    noiseIntensity={0.4}
                    fps={25} />
            </div>
            <div className="size-full relative z-50 max-w-md mx-auto">
                <div className="w-full h-auth-header-height-desktop flex flex-row items-center justify-center gap-1" >
                    <p className="text-sm text-white font-normal tracking-widest">Paletto</p>
                    <Logo size={'sm'} color={'secondary'} />
                </div>

                <div className="h-[calc(100dvh-var(--auth-header-height-desktop))] w-full">
                    {isIntroView ? <PreferencesIntroView /> : <PreferencesStepsView />}
                </div>
            </div>
        </main>
    )
}
