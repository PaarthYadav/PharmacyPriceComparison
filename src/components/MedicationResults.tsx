import React from 'react';
import { MapPin, Clock, Star, Package, DollarSign, Bell } from 'lucide-react';
import { Medication, Pharmacy, MedicationPrice } from '../types';

interface MedicationResultsProps {
  medications: Medication[];
  pharmacies: Pharmacy[];
  prices: MedicationPrice[];
  onCreateAlert: (medicationId: string, pharmacyId: string, targetPrice: number) => void;
}

export function MedicationResults({ medications, pharmacies, prices, onCreateAlert }: MedicationResultsProps) {
  const getPharmacyForPrice = (pharmacyId: string) => 
    pharmacies.find(p => p.id === pharmacyId);

  const getMedicationForPrice = (medicationId: string) =>
    medications.find(m => m.id === medicationId);

  const groupedResults = medications.map(medication => {
    const medicationPrices = prices
      .filter(p => p.medicationId === medication.id)
      .sort((a, b) => a.price - b.price);

    return {
      medication,
      prices: medicationPrices,
    };
  });

  if (groupedResults.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No medications found</h3>
        <p className="text-gray-600">Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedResults.map(({ medication, prices: medicationPrices }) => (
        <div key={medication.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{medication.name}</h3>
                <p className="text-gray-600 mb-2">Generic: {medication.genericName}</p>
                <p className="text-sm text-gray-500">{medication.dosage} • {medication.manufacturer}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {medication.category}
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {medicationPrices.map((price) => {
              const pharmacy = getPharmacyForPrice(price.pharmacyId);
              if (!pharmacy) return null;

              return (
                <div key={`${price.medicationId}-${price.pharmacyId}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{pharmacy.name}</h4>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{pharmacy.address}, {pharmacy.city}</span>
                            {pharmacy.distance && (
                              <span className="ml-2 text-sm text-blue-600">({pharmacy.distance.toFixed(1)} mi)</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{pharmacy.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({pharmacy.totalReviews})</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Today: {pharmacy.hours.monday}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            📞 {pharmacy.phone}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-1 text-green-600" />
                            <span className={`text-sm font-medium ${price.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {price.stock > 0 ? `${price.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Updated: {new Date(price.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="text-right md:text-left">
                          <div className="flex items-center justify-end md:justify-start">
                            <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                            <span className="text-2xl font-bold text-green-600">${price.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => onCreateAlert(medication.id, pharmacy.id, price.price * 0.9)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1"
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Set Price Alert
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}