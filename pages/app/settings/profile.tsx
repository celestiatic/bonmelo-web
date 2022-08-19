import { SettingsTopbar } from "@/components/SettingsTopbar";
import { ArrowLeft } from "tabler-icons-react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ProfileSmallDialog from "@/components/ProfileSmallDialog";
import { useAppSelector } from "@/clients/store/hooks";
import { useEffect, useState } from "react";


export default function ProfileSettings() {

    const userData = useAppSelector((state) => state.userData)
    const [menuExpanded, setMenuExpanded] = useState(false)
    const [clonedUserData, setClonedUserData] = useState(userData)

    useEffect(() => {
        if (!userData) return
        setClonedUserData(userData)
    }, [userData])

    function reClone() {
        const reCloned = { ...clonedUserData }
        return {
            data: reCloned,
            setData() {
                setClonedUserData(this.data)
            }
        }
    }

    return (
        <div className={`w-screen h-screen flex flex-col items-center bg-primaryBackground dark:bg-primaryBackgroundDark`}>
            <SettingsTopbar
                title={'Profile Settings'}
                description={'View and update your public information.'}
                Icon={ArrowLeft}
            />
            <div className={`w-full h-full flex max-w-[1200px] mt-7 px-8`}>
                <div className={``}>
                    <div>
                        <h1 className={`font-Pishel font-bold text-xl text-foreground dark:text-foregroundDark`}>User Information</h1>
                        <h3 className={`font-Pishel font-medium text-sm text-foreground dark:text-foregroundDark w-[700px]`}>Here you can edit public information about yourself visible to Bonmelo users. The changes will be displayed for other users within a few moments.</h3>
                    </div>

                    <div className={`mt-5`}>
                        <Formik
                            initialValues={{ aboutMe: '' }}
                            onSubmit={(values, { setSubmitting }) => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <h1 className={`font-bold text-sm text-foreground dark:text-foregroundDark`}>About me</h1>
                                        <h3 className={`font-medium text-xs text-foreground dark:text-foregroundDark`}>You can use markdown and links if you prefer.</h3>
                                        <textarea
                                        className={`w-96 px-2.5 py-2.5 focus:outline outline-2 text-sm text-secondaryForeground dark:text-secondaryForegroundDark font-semibold outline-accent focus:shadow-md shadow-accent transition-all rounded-lg mt-3 bg-primaryBackground dark:bg-backgroundDark`}
                                        onChange={(ev) => {
                                            const value = ev.target.value
                                            const cloned = reClone()
                                            cloned.data.activityMessage = value
                                            cloned.setData()
                                            handleChange(ev)
                                        }}
                                        rows={5}
                                        name="aboutMe"
                                        >{userData?.activityMessage}</textarea>
                                        <ErrorMessage name="aboutMe" component="div" />
                                    </div>
                                    {/* <Field type="password" name="password" />
                                    <ErrorMessage name="password" component="div" /> */}
                                    <div className={`mt-7`}>
                                        <button className={`bg-accent dark:bg-accent text-white px-4 py-1.5 font-bold rounded-xl hover:opacity-75`} type="submit" disabled={isSubmitting}>
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className={`w-fit flex items-start h-full`}>
                    <ProfileSmallDialog
                        user={clonedUserData}
                        expanded={true}
                        control={
                            <button id="imaginaryProfileButton">
                                
                            </button>
                        }
                    />
                </div>
            </div>
        </div>
    )
}