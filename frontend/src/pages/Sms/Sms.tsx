
import { Loader2, Lock, MessageSquare } from 'lucide-react';
import React from 'react';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

export function Sms() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [smsData, setSmsData] = React.useState({
        englishWelcomeSMS: "",
        hindiWelcomeSMS: "",
        petrolPumpName: "",

    })
    const { addToast } = useToast();
    const [selectedLanguage, setSelectLanguage] = React.useState<"english" | "hindi">("english")
    const [selected, setselected] = React.useState<"welcome" | "due" | "custom">("welcome")

    const handleSendSms = async () => {
        try {
            setIsLoading(true)
            const res = await api.post("sms/send/welcomeSMS",
                { eng: selectedLanguage === "english", hindi: selectedLanguage === "hindi" },
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            addToast(res.data.message, "success")
        } catch (error) {
            addToast("Failed to send SMS.", "error")
        } finally {
            setIsLoading(false)
        }
    }
    const handleSendDueSms = async () => {
        try {
            setIsLoading(true)
            const res = await api.post("sms/send/dueSMS",
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            addToast(res.data.message, "success")

        } catch (error) {
            addToast("Failed to send due SMS.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCustomSms = async () => {
        try {
            setIsLoading(true)
            const res = await api.post("sms/sendSMS",
                { message: selectedLanguage === "english" ? smsData.englishWelcomeSMS : smsData.hindiWelcomeSMS },
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            addToast(res.data.message, "success")

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        const getSmsData = async () => {
            try {
                const res = await api.get("auth/me", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                console.log(res.data)
                setSmsData(res.data.admin)
            } catch (error) {
                console.log(error)
            }
        }
        getSmsData()
    }, [])
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12 w-full items-center">
            <main className="w-full max-w-2xl space-y-12">

                <div className="w-full">
                    {/* SEND SMS SECTION */}
                    <section className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_32px_32px_-4px_rgba(45,52,50,0.06)] border border-emerald-100/10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Send SMS</h2>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            {/* Campaign Type */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold tracking-tight text-on-surface-variant block">Select SMS Type</label>
                                <div className="flex flex-wrap gap-3">
                                    <button  className={`${selected === 'welcome' ? 'bg-green-500 text-error-dim' : 'bg-surface-container-high text-on-surface'} px-6 py-2.5 rounded-full font-medium text-sm hover:bg-surface-container-highest transition-all duration-200`} type="button" onClick={() => setselected('welcome')}>Welcome Message</button>
                                    <button  className={`${selected === 'due' ? 'bg-green-500 text-error-dim' : 'bg-surface-container-high text-on-surface'} px-6 py-2.5 rounded-full font-medium text-sm hover:bg-surface-container-highest transition-all duration-200`} type="button" onClick={() => setselected('due')}>Payment Reminder</button>
                                    <button className={`${selected === 'custom' ? 'bg-green-500 text-error-dim' : 'bg-surface-container-high text-on-surface-variant'} px-6 py-2.5 rounded-full font-medium text-sm hover:bg-surface-container-highest transition-all duration-200`} type="button" onClick={() => setselected('custom')}>Custom</button>
                                </div>
                            </div>

                            {/* Recipient Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold tracking-tight text-on-surface-variant block">Choose Language</label>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <button onClick={() => setSelectLanguage('english')} className={`${selectedLanguage === 'english' ? 'bg-green-500 text-error-dim' : 'bg-surface-container-high text-on-surface'} px-5 py-2 rounded-full font-semibold text-sm flex items-center gap-2 border border-error-container/30`} type="button">
                                        English
                                    </button>
                                    <button onClick={() => setSelectLanguage('hindi')} className={`${selectedLanguage === 'hindi' ? 'bg-green-500 text-error-dim' : 'bg-surface-container-high text-on-surface'} px-5 py-2 rounded-full font-semibold text-sm flex items-center gap-2 border border-error-container/30`} type="button">
                                        Hindi
                                    </button>
                                </div>
                                
                            </div>

                            {/* Message Input */}
                            <div className={`space-y-4 ${selected === 'custom' || selected === 'due' ? 'hidden' : 'block'}`}>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold tracking-tight text-on-surface-variant block">Message Content</label>
                                    <span className="text-xs text-on-surface-variant/70 font-mono">{(selectedLanguage === 'english' ? smsData?.englishWelcomeSMS ?? '' : smsData?.hindiWelcomeSMS ?? '').length} / 160 characters</span>
                                </div>
                                <span className={`text-xs text-red-500 ${(selectedLanguage === 'english' ? smsData?.englishWelcomeSMS ?? '' : smsData?.hindiWelcomeSMS ?? '').length > 160 ? 'block' : 'hidden'}`}>There must be 160 or less characters</span>
                                <div className="relative group">
                                    <textarea className="w-full p-6 bg-surface-container-low border-0 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none placeholder:text-on-surface-variant/40 text-on-surface" placeholder={selectedLanguage === 'english' ? smsData?.englishWelcomeSMS : smsData?.hindiWelcomeSMS} rows={6}>
                                    </textarea>
                                    <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
                                        <span >-{smsData.petrolPumpName}</span>
                                       
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Options */}
                            <div className="space-y-4 bg-gray-100/50 p-4 rounded-lg">
                                <Lock className="w-5 h-5 text-on-surface-variant" />
                                <label className="text-sm font-semibold tracking-tight text-on-surface-variant block">Schedule Frequency</label>
                                <select className="w-full px-6 py-3.5 bg-surface-container-low opacity-60 border-0 outline-none rounded-full focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer text-on-surface read-only:cursor-not-allowed" disabled>
                                    <option>Send Once (Now)</option>
                                    <option>Weekly Schedule</option>
                                    <option>Monthly Schedule</option>
                                </select>
                            </div>

                            <div className="pt-6">
                                <button onClick={(selected === 'welcome'? handleSendSms : selected === 'due' ? handleSendDueSms : handleCustomSms)} disabled={isLoading} className="w-full bg-primary text-on-primary py-4 rounded-full font-bold tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed" type="submit">
                                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {isLoading ? "Sending..." : "Send SMS"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
