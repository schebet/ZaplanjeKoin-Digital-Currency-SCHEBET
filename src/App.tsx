import React, { useState } from 'react';
import { Wallet, History, Home, UserPlus, Coins, ShoppingBag, Menu, X, Zap } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WalletView from './components/WalletView';
import Transactions from './components/Transactions';
import JoinSystem from './components/JoinSystem';
import Marketplace from './components/Marketplace';
import { BalanceProvider } from './contexts/BalanceContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'wallet':
        return <WalletView />;
      case 'transactions':
        return <Transactions />;
      case 'marketplace':
        return <Marketplace />;
      case 'join':
        return <JoinSystem />;
      default:
        return <Dashboard />;
    }
  };

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <BalanceProvider>
      <div className="flex flex-col min-h-screen">
        <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex flex-col items-center">
                <Zap className="h-8 w-8 text-yellow-400" />
                <span className="text-white font-bold mt-1">Шебет</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-4">
                <NavButton
                  icon={<Home />}
                  label="Почетна"
                  active={currentView === 'dashboard'}
                  onClick={() => handleNavClick('dashboard')}
                />
                <NavButton
                  icon={<Wallet />}
                  label="Новчаник"
                  active={currentView === 'wallet'}
                  onClick={() => handleNavClick('wallet')}
                />
                <NavButton
                  icon={<History />}
                  label="Трансакције"
                  active={currentView === 'transactions'}
                  onClick={() => handleNavClick('transactions')}
                />
                <NavButton
                  icon={<ShoppingBag />}
                  label="Пијаца"
                  active={currentView === 'marketplace'}
                  onClick={() => handleNavClick('marketplace')}
                />
                <NavButton
                  icon={<UserPlus />}
                  label="Придружи се"
                  active={currentView === 'join'}
                  onClick={() => handleNavClick('join')}
                />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute w-full bg-[#8B4513]/95 backdrop-blur-md">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavButton
                  icon={<Home />}
                  label="Почетна"
                  active={currentView === 'dashboard'}
                  onClick={() => handleNavClick('dashboard')}
                />
                <MobileNavButton
                  icon={<Wallet />}
                  label="Новчаник"
                  active={currentView === 'wallet'}
                  onClick={() => handleNavClick('wallet')}
                />
                <MobileNavButton
                  icon={<History />}
                  label="Трансакције"
                  active={currentView === 'transactions'}
                  onClick={() => handleNavClick('transactions')}
                />
                <MobileNavButton
                  icon={<ShoppingBag />}
                  label="Пијаца"
                  active={currentView === 'marketplace'}
                  onClick={() => handleNavClick('marketplace')}
                />
                <MobileNavButton
                  icon={<UserPlus />}
                  label="Придружи се"
                  active={currentView === 'join'}
                  onClick={() => handleNavClick('join')}
                />
              </div>
            </div>
          )}
        </nav>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          {renderView()}
        </main>
      </div>
    </BalanceProvider>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active 
          ? 'bg-[#8B4513]/40 text-white' 
          : 'text-gray-300 hover:bg-[#8B4513]/20 hover:text-white'
        }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function MobileNavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors
        ${active 
          ? 'bg-[#8B4513]/40 text-white' 
          : 'text-gray-300 hover:bg-[#8B4513]/20 hover:text-white'
        }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
}

export default App;