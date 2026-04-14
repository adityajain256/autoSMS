import { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Avatar } from '../../components/common/Avatar';
import { Search, Filter, Download, FileText, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';


export function Entries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get("/entries", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        setData(res.data);
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    fetchEntries();
  }, []);
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">SMS History</h1>
          <p className="text-on-surface-variant mt-1">Detailed log of all SMS communications.</p>
        </div>
        <Button variant="outline" className="shrink-0 group">
          <Download className="w-5 h-5 mr-2 text-on-surface-variant group-hover:text-on-surface" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="flex-1 max-w-md">
          <InputField
            placeholder="Search by ID, Client, or Message..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto w-full group">
          <Filter className="w-4 h-4 mr-2 text-on-surface-variant group-hover:text-on-surface" />
          Filters
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container/30 text-xs uppercase tracking-wider text-on-surface-variant font-bold border-b ghost-border">
                <th className="p-4">Client</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Vehicle Number</th>
                <th className="p-4">Date</th>
                <th className="p-4 ">Quentity</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y ghost-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-on-surface-variant">
                    No entries found
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row._id + 1} className="hover:bg-surface-container/30 transition-colors">
                    <td className="p-4 flex justify-center items-center gap-3">
                      <Avatar fallback={row.userId?.username?.charAt(0) || 'U'} size="sm" />
                    <span className="font-semibold text-on-surface text-sm">{row?.userId?.username}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-on-surface">{row?.userId?.phoneNumber}</td>
                  <td className="p-4 text-sm font-bold text-on-surface">{row?.userId?.vehicle}</td>
                  <td className="p-4 text-sm font-medium text-on-surface">{row?.date?.split("T")[0]}</td>
                  <td className="p-4 text-sm text-on-surface-variant truncate max-w-[200px]">
                    {row.quantity}
                  </td>
                  <td className="p-4 text-sm font-medium text-on-surface">{row.amount}</td>
                  <td className={row.isPaid ? "p-4 text-green-500" : "p-4 text-red-500"}>
                    {row.isPaid ? "Paid" : "Unpaid"}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors inline-flex">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t ghost-border text-sm text-on-surface-variant flex items-center justify-between">
          <span>Showing 1 to 3 of {data.length} entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
