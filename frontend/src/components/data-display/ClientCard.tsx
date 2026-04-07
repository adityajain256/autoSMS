import { Delete, FuelIcon, IndianRupee, Mail, Phone } from "lucide-react";
import { api } from "../../utils/api";
import { Avatar } from "../common/Avatar";
import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { useEffect, useState } from "react";


export function ClientCard({searchTerm}: {searchTerm: string}) {

    const [data, setData] = useState([{
        _id: "",
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


      
      const newData = data.filter((client) => {
        const term = searchTerm.toLowerCase();
        return (
          client.username.toLowerCase().includes(term) ||
          client.phoneNumber.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.gstNumber.toLowerCase().includes(term) ||
          client.vehicle.toLowerCase().includes(term)
        );
      });


      useEffect(() => {
        const fetchClients = async () => {
          try {
            const res = await api.get("/clients", {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            });
            if(res.data.length > 0){

              setData(res.data);
            }else {
              return (
                <div>No Client Found</div>
              )
            }
          } catch (error) {
            console.log(error);
          }
        };

        fetchClients();
      }, []);
  return (

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(data[0].authId != "") ?((searchTerm.length > 0)? newData:data).map((client) => (
          <Card key={client._id} className="flex flex-col group cursor-pointer hover:border-primary/30 transition-all">



              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-row items-center gap-4">
                  <Avatar fallback={client.username?.charAt(0)} size="lg" className="group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300" />
                  <div>
                    <h3 className="text-lg font-bold text-on-surface leading-tight">{client.username}</h3>
                    <p className="text-sm font-medium text-on-surface-variant">{client.phoneNumber}</p>
                  </div>
                </div>
                
            <Link to={"/client/delete"}>
                
                <button className=" text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded p-1 transition-colors">
                  <Delete  className="w-5 h-5 text-red-500" />
                </button>
                </Link>

              </div>
            <Link to={"/create"} state={{ client: client._id }}>


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
  );
}