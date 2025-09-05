export interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  dosage: string;
  manufacturer: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  distance?: number;
  rating: number;
  totalReviews: number;
}

export interface MedicationPrice {
  id: string;
  medicationId: string;
  pharmacyId: string;
  price: number;
  stock: number;
  lastUpdated: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'pharmacy_manager' | 'customer';
  pharmacyId?: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  medicationId: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface SearchFilters {
  priceRange: [number, number];
  maxDistance: number;
  availableOnly: boolean;
  sortBy: 'price' | 'distance' | 'rating';
  category?: string;
}

export interface DashboardStats {
  totalMedications: number;
  totalPharmacies: number;
  averagePrice: number;
  totalSearches: number;
  priceDropAlerts: number;
  stockAlerts: number;
}

export interface PriceTrend {
  medicationId: string;
  medicationName: string;
  data: Array<{
    date: string;
    price: number;
    pharmacyName: string;
  }>;
}