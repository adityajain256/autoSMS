import {  useEffect,  useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { Avatar } from "../../components/common/Avatar";
import { api } from "../../utils/api";

// import { Avatar } from "@/components/Avatar"; // keep your existing Avatar import

type ClientRow = {
    _id: string;
    userId?: {
        username?: string;
        phoneNumber?: string;
        vehicle?: string;
    };
    date?: string;
    quantity?: number | string;
    amount?: number | string;
    isPaid?: boolean;
};



export function DeleteClient() {


    const [data, setData] = useState<ClientRow[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/clients/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            setData(prevData => prevData.filter(client => client._id !== id));
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };
    useEffect(() => {
    const allClients = async () => {
        try {
            const res = await api.get("/clients", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            setData(res.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
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

    return (
        <>
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-surface-container/30 text-xs uppercase tracking-wider text-on-surface-variant font-bold border-b ghost-border">
                        <th className="p-4">Client</th>
                        <th className="p-4">Phone Number</th>
                        <th className="p-4">Vehicle Number</th>
                        <th className="p-4">Date / Time</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Cost</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y ghost-border">
                    {data.map((row) => (
                        <tr key={row._id} className="hover:bg-surface-container/30 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                                <Avatar fallback={row.userId?.username?.charAt(0) ?? "?"} size="sm" />
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
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirm Delete Modal */}
            {selectedClientId && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-lg border ghost-border">
                        <h3 className="text-lg font-semibold text-on-surface">Delete Client</h3>
                        <p className="mt-2 text-sm text-on-surface-variant">Are you sure you want to delete this client? This action cannot be undone.</p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedClientId(null)}

                                className="px-4 py-2 rounded-md border ghost-border text-on-surface-variant hover:bg-surface-container/40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => selectedClientId && handleDelete(selectedClientId)}

                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}