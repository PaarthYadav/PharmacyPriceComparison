import { Medication, Pharmacy, MedicationPrice, PriceAlert, User, SearchFilters, DashboardStats } from '../types';

const API_BASE = '/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth-token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: Partial<User> & { password: string }): Promise<{ user: User; token: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(): Promise<{ user: User }> {
    return this.request('/auth/verify');
  }

  // Medications
  async searchMedications(query: string, filters?: SearchFilters): Promise<{
    medications: Medication[];
    prices: MedicationPrice[];
    pharmacies: Pharmacy[];
  }> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    return this.request(`/medications/search?${params}`);
  }

  async getMedications(): Promise<Medication[]> {
    return this.request('/medications');
  }

  async createMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
    return this.request('/medications', {
      method: 'POST',
      body: JSON.stringify(medication),
    });
  }

  // Pharmacies
  async getPharmacies(): Promise<Pharmacy[]> {
    return this.request('/pharmacies');
  }

  async createPharmacy(pharmacy: Omit<Pharmacy, 'id'>): Promise<Pharmacy> {
    return this.request('/pharmacies', {
      method: 'POST',
      body: JSON.stringify(pharmacy),
    });
  }

  async updatePharmacy(id: string, updates: Partial<Pharmacy>): Promise<Pharmacy> {
    return this.request(`/pharmacies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Prices
  async updatePrice(priceData: Omit<MedicationPrice, 'id' | 'lastUpdated'>): Promise<MedicationPrice> {
    return this.request('/prices', {
      method: 'POST',
      body: JSON.stringify(priceData),
    });
  }

  async getPriceHistory(medicationId: string): Promise<MedicationPrice[]> {
    return this.request(`/prices/history/${medicationId}`);
  }

  // Alerts
  async createAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): Promise<PriceAlert> {
    return this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    });
  }

  async getAlerts(): Promise<PriceAlert[]> {
    return this.request('/alerts');
  }

  async deleteAlert(id: string): Promise<void> {
    return this.request(`/alerts/${id}`, { method: 'DELETE' });
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/dashboard/stats');
  }

  async getPriceTrends(): Promise<any[]> {
    return this.request('/dashboard/price-trends');
  }

  async getPopularMedications(): Promise<any[]> {
    return this.request('/dashboard/popular-medications');
  }

  async getTopPharmacies(): Promise<any[]> {
    return this.request('/dashboard/top-pharmacies');
  }
}

export const apiService = new ApiService();