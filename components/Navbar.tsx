import React from 'react';
import { ShieldCheck, LayoutDashboard, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentView: 'user' | 'admin';
  setView: (view: 'user' | 'admin') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('user')}>
            <ShieldCheck className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-slate-800 tracking-tight">Sentinel<span className="text-blue-600">KYC</span></span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView('user')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'user' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                Verification Portal
              </div>
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'admin' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin Dashboard
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;