import React, { useEffect } from "react";
import { Avatar } from "../../components/common/Avatar";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";


export function Profile() {
  const [profile, setProfile] = React.useState({
    adminName: "",
    email: "",
    phoneNumber: "",
    role: "",
    address: "",
    petrolPumpName: "",
    englishWelcomeSMS: "",
    hindiWelcomeSMS: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/hero")
  }
  const updateProfile = async () => {
    const payload = {
      adminName: profile.adminName,
      address: profile.address,
      petrolPumpName: profile.petrolPumpName,
      englishWelcomeSMS: profile.englishWelcomeSMS,
      hindiWelcomeSMS: profile.hindiWelcomeSMS,
    }
    try {
      setIsLoading(true)
      await api.patch("/auth/update/profile", payload, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },

      })
      setIsLoading(false)
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      navigate("/login");

      // ...removed console.error("Error updating profile:", error);
      setIsLoading(false)
    }
    setIsLoading(false)
  }



  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await api.get("auth/me", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        if(res.status == 403){
          navigate("/requestReset", { state: { agenda: "verify" } });
        }
        // ...removed console.log(res.data);
        setProfile(res.data.admin);

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    getProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-surface text-on-surface font-['Inter']">

      <div className="">
        <main className="bg-surface p-6 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <header className="mb-12">
              <h1 className="text-4xl font-bold text-on-surface tracking-tight">Profile Settings</h1>
              <p className="text-on-surface-variant mt-2">Manage your account identity and security preferences.</p>
            </header>
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Personal Information - Large Card */}
              <section className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative group">
                    <Avatar fallback="aj" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface">{profile?.adminName}</h3>
                    {/* <p className="text-sm text-on-surface-variant">{profile?.email}</p> */}
                    <p className="text-sm text-on-surface-variant">{profile?.phoneNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Full Name</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg" type="text" value={profile.adminName} onChange={(e) => setProfile({ ...profile, adminName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Company Name</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg" placeholder="Enter pump name" type="text" value={profile.petrolPumpName} onChange={(e) => setProfile({ ...profile, petrolPumpName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Email</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg" type="email" value={profile.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Phone Number</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg" type="tel" value={profile.phoneNumber} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Address</label>
                  <input className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 text-on-surface-variant px-4 py-3 rounded-t-lg" type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                </div>
                {/* <div className="col-span-full mt-8 mb-4 border-t border-outline-variant/10 pt-6">
                  <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Notification Messages</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Set default message templates for notifications.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">English Message</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg" placeholder="Type English message here..." type="text" value={profile.englishWelcomeSMS} onChange={(e) => setProfile({ ...profile, englishWelcomeSMS: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Hindi Message</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg" placeholder="हिंदी संदेश यहाँ टाइप करें..." type="text" value={profile.hindiWelcomeSMS} onChange={(e) => setProfile({ ...profile, hindiWelcomeSMS: e.target.value })} />
                  </div>
                </div>
                */}
                <div className="mt-10 flex justify-end">
                  <button onClick={() => updateProfile()} disabled={isLoading} className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed">
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div> 
              </section>
            </div>
            <footer className="mt-16 pt-12 pb-12 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-tertiary font-bold">Close Account</h4>
                <p className="text-xs text-on-surface-variant">All archived SMS data and filings will be permanently deleted.</p>
              </div>
              <button onClick={() => logOut()} className="px-6 py-2 border border-tertiary/20 text-tertiary rounded-full text-sm font-semibold hover:bg-tertiary/5 transition-colors">
                Log Out
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
