import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Medication, Pharmacy, MedicationPrice, PriceAlert } from '../types';

interface AppState {
  user: User | null;
  medications: Medication[];
  pharmacies: Pharmacy[];
  prices: MedicationPrice[];
  alerts: PriceAlert[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_MEDICATIONS'; payload: Medication[] }
  | { type: 'SET_PHARMACIES'; payload: Pharmacy[] }
  | { type: 'SET_PRICES'; payload: MedicationPrice[] }
  | { type: 'SET_ALERTS'; payload: PriceAlert[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ALERT'; payload: PriceAlert }
  | { type: 'REMOVE_ALERT'; payload: string }
  | { type: 'UPDATE_PRICE'; payload: MedicationPrice };

const initialState: AppState = {
  user: null,
  medications: [],
  pharmacies: [],
  prices: [],
  alerts: [],
  loading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_MEDICATIONS':
      return { ...state, medications: action.payload };
    case 'SET_PHARMACIES':
      return { ...state, pharmacies: action.payload };
    case 'SET_PRICES':
      return { ...state, prices: action.payload };
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_ALERT':
      return { ...state, alerts: [...state.alerts, action.payload] };
    case 'REMOVE_ALERT':
      return { ...state, alerts: state.alerts.filter(alert => alert.id !== action.payload) };
    case 'UPDATE_PRICE':
      return {
        ...state,
        prices: state.prices.map(price =>
          price.id === action.payload.id ? action.payload : price
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth-token');
    if (token) {
      // Validate token and set user
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            dispatch({ type: 'SET_USER', payload: data.user });
          }
        })
        .catch(() => {
          localStorage.removeItem('auth-token');
        });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}