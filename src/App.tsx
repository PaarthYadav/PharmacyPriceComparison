import React from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  // Simple routing logic - in a real app, you'd use React Router
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/dashboard') setCurrentPage('dashboard');
      else if (path === '/admin') setCurrentPage('admin');
      else setCurrentPage('home');
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Set initial page

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppProvider>
      <Layout>
        {renderCurrentPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;