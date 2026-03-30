import { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Search, Filter, Download, FileText } from 'lucide-react';

const mockHistory = [
  { id: 'SMS-1029', client: 'Reliance Industries', message: 'Your Q2 tax filing is complete.', cost: '₹1.50', status: 'success', date: 'Oct 23, 2026 - 10:45 AM' },
  { id: 'SMS-1028', client: 'TCS', message: 'Pending documents required for audit.', cost: '₹1.50', status: 'pending', date: 'Oct 23, 2026 - 09:30 AM' },
  { id: 'SMS-1027', client: 'HDFC Bank', message: 'GST Notice 54A requires immediate attention.', cost: '₹0.00', status: 'error', date: 'Oct 22, 2026 - 04:15 PM' },
];

export function Entries() {
  const [searchTerm, setSearchTerm] = useState('');

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
                <th className="p-4">Entry ID</th>
                <th className="p-4">Client</th>
                <th className="p-4 w-1/3">Message Preview</th>
                <th className="p-4">Date</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y ghost-border">
              {mockHistory.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="p-4 text-sm font-bold text-on-surface">{row.id}</td>
                  <td className="p-4 flex items-center gap-3">
                    <Avatar fallback={row.client.charAt(0)} size="sm" />
                    <span className="font-semibold text-on-surface text-sm">{row.client}</span>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant truncate max-w-[200px]">
                    {row.message}
                  </td>
                  <td className="p-4 text-sm font-medium text-on-surface">{row.date}</td>
                  <td className="p-4 text-sm font-medium text-on-surface">{row.cost}</td>
                  <td className="p-4">
                    <Badge status={row.status as any}>{row.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors inline-flex">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t ghost-border text-sm text-on-surface-variant flex items-center justify-between">
          <span>Showing 1 to 3 of 12,450 entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
