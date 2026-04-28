
import { Card } from '../../components/common/Card';
// import { Badge } from '../../components/common/Badge';
// import { Avatar } from '../../components/common/Avatar';
import { ArrowUpRight,  Loader2} from 'lucide-react';

import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    totalSMS: 0,
    totalUser: 0,
    totalAmount: 0,
    totalClientInOneDay: 0,
    listOfSMS: [{
      _id: "",
      to: "",
      createdAt: "",
      body: "",
    }],
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/dashboard/stats", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        setData(res.data || {
          totalSMS: 0,
          totalUser: 0,
          totalAmount: 0,
          totalClientInOneDay: 0,
          listOfSMS: [{
            _id: "",
            to: "",
            createdAt: "",
            body: "",
          }],
        });
  
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);
  if(isLoading){
    <Loader2 className="w-8 h-8 animate-spin" />
  }
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Overview</h1>
        <p className="text-on-surface-variant">Here is a summary of your recent SMS campaigns and metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 select-none md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Total Messages Sent</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-on-surface" >{isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : data?.totalSMS || 0}</h2>
            <span className="flex items-center text-sm font-semibold text-primary">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> 12%
            </span>
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Total Clients</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-on-surface" >{isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : data?.totalUser || 0}</h2>
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Today's Total Client</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-on-surface">{isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : data?.totalClientInOneDay || 0}</h2>
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow lg:border-error/20">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Total Due Amount</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-error" >{isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : data?.totalAmount || 0}</h2>
          </div>
        </Card>
      </div>

      {/* Recent Entries Table */}
      <Card className="p-0 h-96 overflow-y-auto cursor-move">
        <div className="p-6 border-b ghost-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-on-surface">Recent SMS Entries</h3>
          <button className="text-sm font-semibold text-primary hover:text-primary-container">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] ">
            <thead>
              <tr className="bg-surface-container/30 text-xs uppercase tracking-wider text-on-surface-variant font-bold border-b ghost-border">
                <th className="p-4">Phone</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 text-right">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y ghost-border">
              {((data.listOfSMS) ) ? (
                data.listOfSMS.map((row) => (
                  <tr key={row._id || ''} className="hover:bg-surface-container/30 transition-colors">
          
                    <td className="p-4 text-sm font-medium text-on-surface">{row.to|| ''}</td>
                    <td className="p-4 text-sm text-on-surface-variant">{row.createdAt.toString().slice(0, 10) + " " + row.createdAt.toString().slice(11, 16) || ''}</td>
                    <td className="p-4 text-sm text-right text-on-surface">{row.body.slice(0, 30)}...</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-on-surface-variant">
                    No recent SMS entries found.
                  </td>
                </tr>
              )} 
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
