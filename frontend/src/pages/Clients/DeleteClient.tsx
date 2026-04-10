import {  useEffect,  useState } from "react";
import { FileText, Filter, Loader, Search, Trash2 } from "lucide-react";
import { Avatar } from "../../components/common/Avatar";
import { api } from "../../utils/api";
import { Button } from "../../components/common/Button";
import { InputField } from "../../components/common/InputField";

// import { Avatar } from "@/components/Avatar"; // keep your existing Avatar import

type ClientRow = {
    _id?: string;
    username?: string;
    phoneNumber?: string;
    vehicle?: string;
    email?: string;
    totalQuantity?: number | string;
    paidAmount?: number | string;
    nonPaidAmount?: number | string;
    isPaid?: boolean;
    createdAt: string;
    date?: string;
};



export function DeleteClient() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<ClientRow[]>([]);

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true);
            await api.delete(`/clients/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            setData(prevData => prevData.filter(client => client._id !== id));
        } catch (error) {
            console.error("Error deleting client:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
    const allClients = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/clients", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            setData(res.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setIsLoading(false);
        }
    }
    allClients();
    }, []);

    const formatDateTime = (raw?: string) => {
        if (!raw) return "-";
        const [date, timeWithMs] = raw.split("T");
        const time = timeWithMs?.split(".")[0]?.slice(0, 5);
        return `${date ?? "-"} / ${time ?? "-"}`;
    };

    const newData = data.filter((client) => {
        const term = searchTerm.toLowerCase();
            return (
            client.username?.toLowerCase().includes(term) ||
            client.phoneNumber?.toLowerCase().includes(term) ||
            client.email?.toLowerCase().includes(term) ||
            client.vehicle?.toLowerCase().includes(term)
            );
        });

    return (
        <>
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Clients</h1>
          <p className="text-on-surface-variant mt-1">Manage and delete your clients and their contact information.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="flex-1 max-w-sm">
          <InputField
            placeholder="Search clients..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="sm:w-auto w-full group">
             <Filter className="w-4 h-4 mr-2 text-on-surface-variant group-hover:text-on-surface" />
             More Filters
            </Button>
        </div>

        </div>
        <div className="overflow-hidden">
            <div
                className="overflow-scroll"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                <table className="hide-scrollbar w-full text-left border-collapse min-w-[800px] animate-in fade-in duration-500">
                    <thead className="overflow-scroll">
                        <tr className="bg-surface-container/30 text-xs uppercase tracking-wider text-on-surface-variant font-bold border-b ghost-border">
                            <th className="p-4">Client</th>
                            <th className="p-4">Phone Number</th>
                            <th className="p-4">Vehicle Number</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Quantity</th>
                            <th className="p-4">Cost</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y ghost-border overflow-scroll">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="p-8 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-on-surface-variant">
                                    No clients found
                                </td>
                            </tr>
                        ) : (
                            ((searchTerm.length > 0) ? newData : data).map((row) => (
                                <tr key={row._id} className="hover:bg-surface-container/30 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <Avatar fallback={row.username?.charAt(0) ?? "?"} size="sm" />
                                    <span className="font-semibold text-on-surface text-sm">
                                        {row.username ?? "-"}
                                    </span>
                                </td>

                                <td className="p-4 text-sm font-bold text-on-surface">
                                    {row?.phoneNumber ?? "-"}
                                </td>

                                <td className="p-4 text-sm font-bold text-on-surface">
                                    {row?.vehicle ?? "-"}
                                </td>

                                <td className="p-4 text-sm font-medium text-on-surface">
                                    {row.createdAt ? formatDateTime(row.date) : "-"}
                                </td>

                                <td className="p-4 text-sm text-on-surface-variant truncate max-w-[200px]">
                                    {row.totalQuantity ?? "-"}
                                </td>

                                <td className="p-4 text-sm font-medium text-on-surface">{row.nonPaidAmount ?? "-"}</td>

                                <td className={row.isPaid ? "p-4 text-green-500" : "p-4 text-red-500"}>
                                    {row.isPaid ? "Paid" : "Unpaid"}
                                </td>

                                <td className="p-4 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors inline-flex">
                                            <FileText className="w-4 h-4" />
                                        </button>

                                        <button
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors inline-flex"
                                            title="Delete client"
                                            onClick={() => row._id && handleDelete(row._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
        </>
    );
}