
import { Loader2, MessageSquare, UserSearch } from 'lucide-react';
import React from 'react';
import { api } from '../../utils/api';

export function Sms() {
    const [isLoading, setIsLoading] = React.useState(false)
    // const [smsData, setSmsData] = React.useState("")
    const handleSendSms = async () => {
        try {
            setIsLoading(true)
            const res = await api.post("sms/send/welcomeSMS",
                { eng: true },
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res.data.message)
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
                                    <button className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-semibold text-sm border-2 border-primary transition-all duration-200" type="button">Welcome Message</button>
                                    <button className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm hover:bg-surface-container-highest transition-all duration-200" type="button">Payment Reminder</button>
                                    <button className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm hover:bg-surface-container-highest transition-all duration-200" type="button">Custom</button>
                                </div>
                            </div>

                            {/* Recipient Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold tracking-tight text-on-surface-variant block">Recipient Selection</label>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <button className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface font-medium text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-all" type="button">
                                        All Clients
                                    </button>
                                    <button className="px-5 py-2 rounded-full bg-error-container/20 text-error-dim font-semibold text-sm flex items-center gap-2 border border-error-container/30" type="button">
                                        Clients with Dues <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full text-[10px]">24</span>
                                    </button>
                                </div>
                                <div className="relative flex items-center">
                                    <UserSearch className="absolute left-4 w-5 h-5 text-on-surface-variant" />
                                    <input className="w-full pl-12 pr-6 py-3.5 bg-surface-container-low border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-on-surface-variant/60 text-on-surface" placeholder="Search specific clients..." type="text" />
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold tracking-tight text-on-surface-variant block">Message Content</label>
                                    <span className="text-xs text-on-surface-variant/70 font-mono">124 / 160 characters</span>
                                </div>
                                <div className="relative group">
                                    <textarea className="w-full p-6 bg-surface-container-low border-0 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none placeholder:text-on-surface-variant/40 text-on-surface" placeholder="Enter your message here..." rows={6}></textarea>
                                    <div className="absolute bottom-4 left-6 flex flex-wrap gap-2">
                                        <button className="px-3 py-1.5 rounded-full bg-surface-container-highest text-[11px] font-bold text-on-surface-variant hover:text-primary transition-colors" type="button">{`{client_name}`}</button>
                                        <button className="px-3 py-1.5 rounded-full bg-surface-container-highest text-[11px] font-bold text-on-surface-variant hover:text-primary transition-colors" type="button">{`{due_amount}`}</button>
                                        <button className="px-3 py-1.5 rounded-full bg-surface-container-highest text-[11px] font-bold text-on-surface-variant hover:text-primary transition-colors" type="button">{`{station_name}`}</button>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Options */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold tracking-tight text-on-surface-variant block">Schedule Frequency</label>
                                <select className="w-full px-6 py-3.5 bg-surface-container-low border-0 outline-none rounded-full focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer text-on-surface">
                                    <option>Send Once (Now)</option>
                                    <option>Weekly Schedule</option>
                                    <option>Monthly Schedule</option>
                                </select>
                            </div>

                            <div className="pt-6">
                                <button onClick={handleSendSms} disabled={isLoading} className="w-full bg-primary text-on-primary py-4 rounded-full font-bold tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed" type="submit">
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
