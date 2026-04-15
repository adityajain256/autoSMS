import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Search, Filter } from 'lucide-react';
import { ClientCard } from '../../components/data-display/ClientCard';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../utils/api';


export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { addToast } = useToast();

  const handleExportToExcel = async (clientId: string) => {
    setIsExporting(true);
    try {
      const res = await api.get(`/clients//export/excel/${clientId}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      })
      const blob = new Blob([res.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clients_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      addToast('Clients exported successfully!', 'success');
    } catch {
      addToast('Failed to export clients. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  }


  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Clients</h1>
          <p className="text-on-surface-variant mt-1">Manage your clients and their contact information.</p>
        </div>
        <div>
          <Button className="w-full rounded-xl sm:w-auto" onClick={handleExportToExcel} disabled={isExporting}>
            Download Clients To Excel
          </Button>
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
      <div>
        <ClientCard searchTerm={searchTerm} />
      </div>
    </div>
  );
}
