import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, FileText, Map, ArrowRight, Fuel, BellRing } from 'lucide-react';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

export function Signup() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        adminName: "",
        phoneNumber: "",
        password: "",
        address: "",
        email: "",
        petrolPumpName: "",
        role: "admin",
    });
    const { addToast } = useToast();

    const handleSignup = async () => {
        try {
            if (formData.phoneNumber === "") {
                addToast("Phone number is required", "error");
                return;
            }
            if (formData.password.includes(".") || formData.password.includes(",") || formData.password.includes(" ") || formData.password.length < 8) {
                addToast("Password cannot contain comma or dot or space and must be at least 8 characters", "error");
                return;
            }
            if (formData.adminName === "") {
                addToast("Name is required", "error");
                return;
            }
            if (formData.address === "") {
                addToast("Address is required", "error");
                return;
            }
            if (formData.email === "") {
                addToast("Email is required", "error");
                return;
            }
            if (formData.petrolPumpName === "") {
                addToast("Petrol pump name is required", "error");
                return;
            }
            setIsLoading(true);
            const response = await api.post("/auth/register/admin", formData);
            localStorage.setItem("token", response.data.token);
            addToast("Signup successful", "success");
            navigate("/dashboard");
        } catch (error: any) {
            console.log(error);
            addToast(error.response.data.message, "error");
        }
    };

    return (

        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eafaf1] to-white relative selection:bg-primary/20">

            {/* Decorative Blur Elements (Optional enhancements mapping to the organic feel) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -left-40 top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -right-20 bottom-20 w-[30rem] h-[30rem] bg-emerald-100/40 rounded-full blur-3xl" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10 w-full">

                {/* Main Card */}
                <div className="w-full max-w-[640px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-12 border border-gray-100 relative">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-14 h-14 bg-[#d1f2e1] text-[#006c49] rounded-full flex items-center justify-center mb-4">
                            <BellRing className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">AUTOSMS</h1>
                        <p className="text-sm font-medium text-gray-500 text-center">
                            SMS Manager: Management Solutions
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="flex flex-col gap-6">

                        {/* Full Name */}
                        <div className="space-y-1.5 focus-within:text-primary">
                            <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                Full Name
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-gray-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.adminName}
                                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full bg-[#f4f6f5] hover:bg-[#eff1f0] focus:bg-white h-[52px] pl-11 pr-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Grid Row 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5 focus-within:text-primary">
                                <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                    Phone Number
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-gray-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        placeholder="+91 00000 00000"
                                        className="w-full bg-[#f4f6f5] hover:bg-[#eff1f0] focus:bg-white h-[52px] pl-11 pr-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 focus-within:text-primary">
                                <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="name@firm.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#f4f6f5] hover:bg-[#eff1f0] focus:bg-white h-[52px] pl-11 pr-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grid Row 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5 focus-within:text-primary">
                                <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-gray-400">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="JohnDue@123"
                                        className="w-full bg-[#f4f6f5] hover:bg-[#eff1f0] focus:bg-white h-[52px] pl-11 pr-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* <div className="space-y-1.5 focus-within:text-primary">
                                <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                    Amount
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-gray-400">
                                        <Wallet className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="₹ 0.00"
                                        className="w-full bg-[#f4f6f5] hover:bg-[#eff1f0] focus:bg-white h-[52px] pl-11 pr-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
                                    />
                                </div>
                            </div> */}
                            <div className="space-y-1.5 focus-within:text-primary">
                                <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                    Petrol Pump Name
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-gray-400">
                                        <Fuel className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Petrol Pump Name"
                                        value={formData.petrolPumpName}
                                        onChange={(e) => setFormData({ ...formData, petrolPumpName: e.target.value })}
                                        className="w-full bg-[#f4f6f5] hover:bg-[#eff1f0] focus:bg-white h-[52px] pl-11 pr-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Office Address (Textarea style) */}
                        <div className="space-y-1.5 focus-within:text-primary">
                            <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-4 text-gray-400">
                                    <Map className="w-4 h-4" />
                                </div>
                                <textarea
                                    placeholder="Enter your complete firm address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-[#f4f6f5] hover:bg-[#eff1f0] focus:bg-white min-h-[100px] pt-4 pb-4 pl-11 pr-4 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none resize-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSignup}
                            className={cn(
                                "w-full h-[56px] mt-2 rounded-[1.25rem] bg-[#006c49] hover:bg-[#005a3c] text-white font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-[0_8px_16px_-4px_rgba(0,108,73,0.3)] hover:shadow-[0_12px_20px_-4px_rgba(0,108,73,0.4)] disabled:opacity-70",
                                isLoading && "animate-pulse"
                            )}
                        >
                            {isLoading ? (
                                <span>Creating Account...</span>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-600">Already have an account? </span>
                            <Link to="/login" className="text-sm font-bold text-[#006c49] hover:underline underline-offset-4 decoration-2">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>

            </div>

            {/* Footer */}
            <footer className="w-full p-6 sm:px-12 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
                <span className="text-gray-800 font-bold">Emerald Ledger</span>
                <span className="text-center text-[#006c49]/70">© 2024 Emerald Ledger CA Solutions. Organic Precision for Tax Management.</span>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
}
