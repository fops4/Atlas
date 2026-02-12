import React from 'react';
import { Users, Sprout, Package, Truck } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon }) => {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="mb-6 flex justify-center">
          {icon}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">{description}</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-800">
            🚧 Cette section est en cours de développement. 
            <br />
            Elle sera disponible dans une prochaine version.
          </p>
        </div>
      </div>
    </div>
  );
};

export const HRPage: React.FC = () => (
  <PlaceholderPage
    title="Ressources Humaines"
    description="Gestion du personnel, paie, sanctions et bonus"
    icon={<Users className="w-16 h-16 text-holding-500" />}
  />
);

export const OperationsPage: React.FC = () => (
  <PlaceholderPage
    title="Exploitation Agricole"
    description="Gestion des parcelles, tâches et opérations terrain"
    icon={<Sprout className="w-16 h-16 text-profit-500" />}
  />
);

export const LogisticsPage: React.FC = () => (
  <PlaceholderPage
    title="Logistique & Stocks"
    description="Inventaire des intrants, rations et mouvements de stock"
    icon={<Package className="w-16 h-16 text-orange-500" />}
  />
);

export const AssetsPage: React.FC = () => (
  <PlaceholderPage
    title="Parc Technique"
    description="Gestion des équipements et maintenance"
    icon={<Truck className="w-16 h-16 text-gray-500" />}
  />
);
