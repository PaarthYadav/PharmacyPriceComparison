import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, MapPin, Users, AlertCircle, DollarSign } from 'lucide-react';
import { DashboardStats } from '../types';
import { apiService } from '../services/api';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [priceTrends, setPriceTrends] = useState<any[]>([]);
  const [popularMeds, setPopularMeds] = useState<any[]>([]);
  const [topPharmacies, setTopPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, trendsData, popularData, pharmaciesData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getPriceTrends(),
        apiService.getPopularMedications(),
        apiService.getTopPharmacies(),
      ]);
      
      setStats(statsData);
      setPriceTrends(trendsData);
      setPopularMeds(popularData);
      setTopPharmacies(pharmaciesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Medications',
      value: stats?.totalMedications || 0,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Partner Pharmacies',
      value: stats?.totalPharmacies || 0,
      icon: MapPin,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Average Price',
      value: `$${stats?.averagePrice?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '-5%'
    },
    {
      title: 'Price Alerts',
      value: stats?.priceDropAlerts || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '+24%'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>Updated 5 minutes ago</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-600 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Price Trends</h3>
          <div className="space-y-4">
            {priceTrends.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No price trend data available</p>
              </div>
            ) : (
              priceTrends.slice(0, 5).map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{trend.name}</h4>
                    <p className="text-sm text-gray-600">Average price trend</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">${trend.averagePrice}</span>
                    <div className={`text-sm ${trend.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {trend.change > 0 ? '+' : ''}{trend.change}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Medications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Medications</h3>
          <div className="space-y-4">
            {popularMeds.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No popular medication data available</p>
              </div>
            ) : (
              popularMeds.slice(0, 5).map((med, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{med.name}</h4>
                    <p className="text-sm text-gray-600">{med.searches} searches</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">${med.avgPrice}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Pharmacies */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Pharmacies</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pharmacy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPharmacies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pharmacy data available</p>
                  </td>
                </tr>
              ) : (
                topPharmacies.slice(0, 5).map((pharmacy, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pharmacy.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pharmacy.city}, {pharmacy.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pharmacy.rating}/5 ⭐
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pharmacy.avgPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pharmacy.stockLevel > 80 ? 'bg-green-100 text-green-800' : 
                        pharmacy.stockLevel > 50 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {pharmacy.stockLevel}% stocked
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}