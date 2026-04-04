
import { Card } from '../../components/common/Card';
// import { Badge } from '../../components/common/Badge';
// import { Avatar } from '../../components/common/Avatar';
import { ArrowUpRight } from 'lucide-react';

import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';


// const mockData = [
//   { id: 1, client: 'Reliance Industries', name: 'Mukesh Ambani', phone: '+91 9876543210', status: 'success', date: 'Oct 23, 10:45 AM', type: 'Tax Reminder' },
//   { id: 2, client: 'TCS', name: 'N. Chandrasekaran', phone: '+91 9876543211', status: 'pending', date: 'Oct 23, 09:30 AM', type: 'Filing Done' },
//   { id: 3, client: 'HDFC Bank', name: 'Sashidhar Jagdishan', phone: '+91 9876543212', status: 'error', date: 'Oct 22, 04:15 PM', type: 'GST Notice' },
//   { id: 4, client: 'Infosys', name: 'Salil Parekh', phone: '+91 9876543213', status: 'success', date: 'Oct 22, 11:20 AM', type: 'Tax Reminder' },
// ];

export function Dashboard() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    totalSMS: 0,
    totalUser: 0,
    totalAmount: 0
  });

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/dashboard/stats", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(res.data)
      setData(res.data);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    fetchDashboardData();
  }, []);
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
            <h2 className="text-4xl font-bold text-on-surface" >{data.totalSMS}</h2>
            <span className="flex items-center text-sm font-semibold text-primary">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> 12%
            </span>
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Total Clients</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-on-surface" >{data.totalUser}</h2>
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Today's Total Client</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-on-surface">144</h2>
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow lg:border-error/20">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Total Due Amount</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-error" >{data.totalAmount}</h2>
          </div>
        </Card>
      </div>

      {/* Recent Entries Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b ghost-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-on-surface">Recent SMS Entries</h3>
          <button className="text-sm font-semibold text-primary hover:text-primary-container">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container/30 text-xs uppercase tracking-wider text-on-surface-variant font-bold border-b ghost-border">
                <th className="p-4">Client</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            {/* <tbody className="divide-y ghost-border">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <Avatar fallback={row.name.charAt(0)} size="sm" />
                    <div>
                      <div className="font-semibold text-on-surface text-sm">{row.client}</div>
                      <div className="text-xs text-on-surface-variant">{row.name}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-on-surface">{row.phone}</td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-on-surface bg-surface-container px-2.5 py-1 rounded-md">
                      {row.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">{row.date}</td>
                  <td className="p-4">
                    <Badge status={row.status as any}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </Card>
    </div>
  );
}
