import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Search, Filter } from 'lucide-react';
import { ClientCard } from '../../components/data-display/ClientCard';
import { useState } from 'react';


export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  console.log(searchTerm);

  

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Clients</h1>
          <p className="text-on-surface-variant mt-1">Manage your CA firm's clients and their contact information.</p>
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
      
      <ClientCard searchTerm={searchTerm}/>
    </div>
  );
}
