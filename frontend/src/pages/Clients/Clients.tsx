import { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { InputField } from '../../components/common/InputField';
import { Search, Filter, MoreVertical, Phone, Mail, IndianRupee, FuelIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([{
    id: "",
    authId: "",
    username: "",
    email: "",
    phoneNumber: "",
    gstNumber: "",
    vehicle: "",
    totalQuantity: 0.00,
    paidAmount: 0.00,
    nonPaidAmount: 0.00,
    address: ""
  }]);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(data[0].authId != "") ? data.map((client) => (
          <Card key={client._id} className="flex flex-col group cursor-pointer hover:border-primary/30 transition-all">
            <Link to={"/entries/create"} state={{ client: client._id }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-row items-center gap-4">
                  <Avatar fallback={client.username?.charAt(0)} size="lg" className="group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300" />
                  <div>
                    <h3 className="text-lg font-bold text-on-surface leading-tight">{client.username}</h3>
                    <p className="text-sm font-medium text-on-surface-variant">{client.phoneNumber}</p>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded p-1 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mt-4 flex-1">
                <div className="flex items-center text-sm text-on-surface">
                  <Phone className="w-4 h-4 mr-3 text-on-surface-variant" />
                  {client.phoneNumber}
                </div>
                <div className="flex items-center text-sm text-on-surface">
                  <Mail className="w-4 h-4 mr-3 text-on-surface-variant" />
                  {client.email}
                </div>
              </div>
              <div className='w-full h-0.5 mt-4 bg-on-surface-variant opacity-50' />
              <div className="mt-0.5 pt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-on-surface-variant">Primary Value</span>
                <span className="text-sm font-bold text-primary">{client.vehicle || client.gstNumber}</span>
              </div>
              <div className='w-full h-0.5 mt-4 bg-on-surface-variant opacity-50' />

              <div className='flex flex-row justify-between gap-4 mt-4'>
                <div className="flex items-center text-sm text-green-500">
                  <IndianRupee className="w-4 h-4 mr-3 text-green-500" />
                  {client.paidAmount?.toFixed(2)}
                </div>
                <div className="flex items-center text-sm text-red-500">
                  <IndianRupee className="w-4 h-4 mr-3 text-red-500" />
                  {client.nonPaidAmount?.toFixed(2)}
                </div>
                <div className="flex items-center text-sm text-on-surface">
                  <FuelIcon className="w-4 h-4 mr-3 text-on-surface-variant" />
                  {client.totalQuantity?.toFixed(2)} Ltr
                </div>
              </div>
            </Link>
          </Card>
        )) : <div>No clients found</div>}
      </div>
    </div>
  );
}
