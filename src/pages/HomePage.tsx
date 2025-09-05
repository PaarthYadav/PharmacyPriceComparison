import React, { useState } from 'react';
import { SearchForm } from '../components/SearchForm';
import { MedicationResults } from '../components/MedicationResults';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { SearchFilters, Medication, Pharmacy, MedicationPrice } from '../types';

export function HomePage() {
  const { state, dispatch } = useApp();
  const [searchResults, setSearchResults] = useState<{
    medications: Medication[];
    pharmacies: Pharmacy[];
    prices: MedicationPrice[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string, filters: SearchFilters) => {
    try {
      setLoading(true);
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const results = await apiService.searchMedications(query, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search medications. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (medicationId: string, pharmacyId: string, targetPrice: number) => {
    if (!state.user) {
      dispatch({ type: 'SET_ERROR', payload: 'Please sign in to create price alerts.' });
      return;
    }

    try {
      const alert = await apiService.createAlert({
        userId: state.user.id,
        medicationId,
        targetPrice,
        isActive: true,
      });
      dispatch({ type: 'ADD_ALERT', payload: alert });
      // Show success message
    } catch (error) {
      console.error('Error creating alert:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create price alert.' });
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find the Best <span className="text-blue-600">Medication Prices</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Compare prices across local pharmacies and get notified when your medications go on sale.
          Save money on prescriptions with real-time price tracking.
        </p>
      </div>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{state.error}</div>
            </div>
          </div>
        </div>
      )}

      {searchResults && (
        <MedicationResults
          medications={searchResults.medications}
          pharmacies={searchResults.pharmacies}
          prices={searchResults.prices}
          onCreateAlert={handleCreateAlert}
        />
      )}

      {!searchResults && !loading && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Save on Medications?</h3>
            <p className="text-gray-600 mb-6">
              Search for any medication to compare prices across local pharmacies and find the best deals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-semibold text-gray-900">Search</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Enter any medication name to start comparing prices
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-semibold text-gray-900">Compare</h4>
                <p className="text-sm text-gray-600 mt-2">
                  See real-time prices from pharmacies near you
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🔔</span>
                </div>
                <h4 className="font-semibold text-gray-900">Save</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Get alerts when prices drop and stock becomes available
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}