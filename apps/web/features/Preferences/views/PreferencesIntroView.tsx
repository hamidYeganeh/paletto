'use client';

import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/Button'
import Link from 'next/link';
import { usePreferencesStore } from "../store/PreferencesStore";

export const PreferencesIntroView = () => {
    const t = useTranslations('Common')
    const setIntroView = usePreferencesStore((state) => state.setIntroView)
    return (
        <section className="w-full h-full relative">
            <div className='h-36' />
            <div className="flex flex-col gap-6 px-4">
                <h2 className='text-3xl font-semibold text-primary-950'>{t('users.preferences.intro-view.title')}</h2>

                <p className='text-sm font-normal text-primary-950'>{t('users.preferences.intro-view.description')}</p>

                <div>
                    <Button onClick={() => setIntroView(false)}>
                        {t('users.preferences.intro-view.submit-title')}
                    </Button>
                </div>
            </div>

            <div className='absolute bottom-8 left-0 right-0 mx-auto flex justify-center'>
                <Link href={'/'} className='text-sm text-gray-950 font-semibold'>
                    {t('users.preferences.intro-view.skip')}
                </Link>
            </div>
        </section>
    )
}
