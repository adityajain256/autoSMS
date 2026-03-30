import { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { InputField } from '../../components/common/InputField';
import { Search, Plus, Filter, MoreVertical, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockClients = [
  { id: 1, name: 'Reliance Industries', contact: 'Mukesh Ambani', email: 'contact@ril.com', phone: '+91 9876543210', entries: 142 },
  { id: 2, name: 'TCS', contact: 'N. Chandrasekaran', email: 'admin@tcs.com', phone: '+91 9876543211', entries: 89 },
  { id: 3, name: 'HDFC Bank', contact: 'Sashidhar Jagdishan', email: 'info@hdfc.com', phone: '+91 9876543212', entries: 341 },
  { id: 4, name: 'Infosys', contact: 'Salil Parekh', email: 'contact@infosys.com', phone: '+91 9876543213', entries: 56 },
];

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Clients</h1>
          <p className="text-on-surface-variant mt-1">Manage your CA firm's clients and their contact information.</p>
        </div>
        <Button className="shrink-0 group">
          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add Client
        </Button>
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
      <Link to={"/entries/create"}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockClients.map((client) => (
            <Card key={client.id} className="flex flex-col group cursor-pointer hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-row items-center gap-4">
                  <Avatar fallback={client.name.charAt(0)} size="lg" className="group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300" />
                  <div>
                    <h3 className="text-lg font-bold text-on-surface leading-tight">{client.name}</h3>
                    <p className="text-sm font-medium text-on-surface-variant">{client.contact}</p>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded p-1 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mt-4 flex-1">
                <div className="flex items-center text-sm text-on-surface">
                  <Phone className="w-4 h-4 mr-3 text-on-surface-variant" />
                  {client.phone}
                </div>
                <div className="flex items-center text-sm text-on-surface">
                  <Mail className="w-4 h-4 mr-3 text-on-surface-variant" />
                  {client.email}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t ghost-border flex items-center justify-between">
                <span className="text-sm font-semibold text-on-surface-variant">Total SMS Entries</span>
                <span className="text-sm font-bold text-primary">{client.entries}</span>
              </div>
            </Card>
          ))}
        </div>
      </Link>
    </div>
  );
}
