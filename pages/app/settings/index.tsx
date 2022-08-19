import { supabase } from '@/clients/supabasePublic';
import { TextInput } from '@mantine/core';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/clients/store/hooks';
import { ArrowLeft, Fingerprint, ThreeDCubeSphere, UserCheck, Unlink, LayersLinked, Sticker, Flask } from 'tabler-icons-react';
import SettingSelectionButton from '@/components/SettingsSelectionButton';
import { SettingsTopbar } from '@/components/SettingsTopbar';
import AvatarImage from '@/components/AvatarImage';
import { AppProps } from '@/constants/declarations/app';

function AccountSettings({ clientManager }:AppProps) {

    const router = useRouter()
    const [user, setUser] = useState<User|null>(null)
    const usersData = useAppSelector((state) => state.UsersData)
    const userData = usersData[clientManager?.user?.id]
    // useEffect(() => {
    //     router.replace('/app/settings/account')
    // }, [])
    useEffect(() => {
        const user = supabase.auth.user()
        setUser(user)
    }, [])

    const SettingTitle = ({ title, description }) => (
        <div>
            <h1 className={`font-bold text-lg text-blue-900`}>{title}</h1>
            <h3 className={`text-xs font-medium text-gray-400`}>{description}</h3>
        </div>
    )
    const SettingSection = ({ title, description, children }) => (
        <>
            <SettingTitle
                title={title}
                description={description}
            />
            <div className={`w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4 gap-x-5 gap-y-5 pb-8`}>
                {children}
            </div>
        </>
    )

    return (
        <div className={`h-screen w-full`}>
            {/* <div id="alert" className={`flex w-full py-2 bg-[#D5E3F8] items-center justify-center px-7 text-center`}>
                <h1 className={`text-sm font-medium text-[#4251B7]`}>
                    {`Pishelo is under `}
                    <span className={`text-[#013FCA] font-semibold`}>{`development`}</span>
                    {`, do not expect everything to work correctly as expected <3`}
                </h1> 
            </div> */}
            <SettingsTopbar
            title={'Settings'}
            description={'View and update your app behavior and account details.'}
            Icon={ArrowLeft}
            />

            <div id="mainContent" className={`w-full h-fit py-5 px-5 flex justify-center`}>
                <div id="mainContent_rewrap1" className={`h-fit w-full max-w-[1100px]`}>
                    <div id="overview" className={`w-full h-20 flex items-center py-2 px-3`}>
                        <div id="overview_left" className={`w-full h-full flex items-center`}>
                            <AvatarImage
                                imageClassName={`h-14 w-fit aspect-square rounded-full shadow-md`}
                                userId={userData?.id}
                            />
                            

                            <div className={`ml-4`}>
                                <h1 className={`font-bold text-xl text-[#4E4F5E]`}>{userData?.username || 'Loading Username'}</h1>
                                <h3 className={`font-medium text-xs text-gray-500`}>{`${user?.email || 'Loading Email Address'} · ${userData?.id || 'Loading User ID'}`}</h3>
                            </div>
                        </div>

                        <div id="overview_right" className={`ml-auto w-48 h-10 hidden sm:flex`}>
                            <TextInput
                                placeholder="Search settings..."
                                radius={7}
                                required
                            />
                        </div>
                    </div>

                    <div className={`px-2 py-3`}>
                        <div className={`h-[2px] w-full bg-gray-200 rounded-full`}>

                        </div>
                    </div>

                    <div className={`w-full px-5 mt-3`}>
                        <div className={`w-full`}>
                            <SettingSection
                                title={'User Settings'}
                                description={'Customize Bonmelo to the way you like it.'}
                            >
                                <SettingSelectionButton
                                    Icon={UserCheck}
                                    title={'My Account'}
                                    description={'View, update, or manage your Bonmelo account details here'}
                                    href={'/app/settings/account'}
                                    active={false}
                                />

                                <SettingSelectionButton
                                    Icon={ThreeDCubeSphere}
                                    title={'User Profile'}
                                    description={'Customize your public profile page to suit your aesthetics ^-^'}
                                    href={'/app/settings/profile'}
                                    active={false}
                                />

                                <SettingSelectionButton
                                    Icon={Fingerprint}
                                    title={'Privacy and Security'}
                                    description={'Customize your privacy and secuity settings to suit your needs'}
                                    href={'/app/settings/privacysafety'}
                                    active={false}
                                />

                                <SettingSelectionButton
                                    Icon={LayersLinked}
                                    title={'Connections'}
                                    description={'Connect and manage your accounts to unlock special Bonmelo integrations'}
                                    href={'/app/settings/connections'}
                                    active={true}
                                />

                                <SettingSelectionButton
                                    Icon={Unlink}
                                    title={'Authorized Applications'}
                                    description={'View and manage your connected authorized applications'}
                                    href={'/app/settings/applications'}
                                    active={false}
                                />
                            </SettingSection>

                            <SettingSection
                                title={'Developer Settings'}
                                description={'Settings for developers to configure'}
                            >
                                <SettingSelectionButton
                                    Icon={Sticker}
                                    title={'Pishelo Care'}
                                    description={'Diagnose or resolve issues you may be having with Pishelo'}
                                    href={'/app/settings/experimentslab'}
                                    active={false}
                                />

                                <SettingSelectionButton
                                    Icon={Flask}
                                    title={'Pishelo Experiments Labs'}
                                    description={'Test new features before its officially released (experimental)'}
                                    href={'/app/settings/experimentslab'}
                                    active={false}
                                />
                            </SettingSection>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings
// export const getServerSideProps = withPageAuth({ redirectTo: '/login' });