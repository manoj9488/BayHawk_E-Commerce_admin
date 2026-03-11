import type { Store } from '../../../types';
import { Badge } from '../../ui';
import { MapPin, Phone, Mail, Clock, Users, Package, Building, CheckCircle, XCircle } from 'lucide-react';
import { getStatusColor } from '../../../utils/helpers';

interface StoreDetailsProps {
  store: Store;
}

const DetailItem = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-500 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-800">{children}</p>
    </div>
  </div>
);

export function StoreDetails({ store }: StoreDetailsProps) {
  const getStoreTypeColor = (type: string) => {
    switch (type) {
      case 'retail': return 'bg-green-100 text-green-800';
      case 'warehouse': return 'bg-blue-100 text-blue-800';
      case 'pickup_point': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStoreTypeIcon = (type: string) => {
    switch (type) {
      case 'retail': return '🏪';
      case 'warehouse': return '🏭';
      case 'pickup_point': return '📦';
      default: return '🏢';
    }
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
          <p className="text-sm text-gray-500 font-mono">{store.code}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={`${getStoreTypeColor(store.storeType)} capitalize`}>
            {getStoreTypeIcon(store.storeType)} {store.storeType.replace('_', ' ')}
          </Badge>
          <Badge variant={getStatusColor(store.isActive ? 'active' : 'inactive')} className="flex items-center gap-1">
            {store.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {store.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {store.description && (
        <p className="text-gray-700">{store.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        {/* Left Column */}
        <div className="space-y-4">
          <DetailItem icon={<MapPin size={16} />} label="Address">
            {store.address.street}, {store.address.city}, {store.address.state} - {store.address.pincode}
          </DetailItem>
          <DetailItem icon={<Phone size={16} />} label="Contact Phone">
            {store.contactInfo.phone}
          </DetailItem>
          <DetailItem icon={<Mail size={16} />} label="Contact Email">
            {store.contactInfo.email}
          </DetailItem>
           <DetailItem icon={<Users size={16} />} label="Manager">
            {store.contactInfo.manager}
          </DetailItem>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <DetailItem icon={<Clock size={16} />} label="Operating Hours">
            {store.operatingHours.open} - {store.operatingHours.close}
          </DetailItem>
          <DetailItem icon={<Users size={16} />} label="Working Days">
            <div className="flex flex-wrap gap-1">
              {store.operatingHours.workingDays.map(day => (
                <Badge key={day} variant="secondary">{day}</Badge>
              ))}
            </div>
          </DetailItem>
          <DetailItem icon={<Package size={16} />} label="Capacity">
            Storage: {store.capacity.storage} units | Daily Orders: {store.capacity.dailyOrders} | Staff: {store.capacity.staff}
          </DetailItem>
          <DetailItem icon={<Building size={16} />} label="Connected Hub">
            Hub ID: {store.hubId}
          </DetailItem>
        </div>
      </div>

      <div className="border-t pt-4 text-sm text-gray-500">
        <p>Created by: {store.createdBy} on {new Date(store.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
