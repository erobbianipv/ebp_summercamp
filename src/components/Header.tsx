import React from 'react';

export type View = 'scenarios' | 'sensitivity';

interface HeaderProps {
  activeView: View;
  onSelectView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onSelectView }) => {
  const navButtonClasses = (view: View) => 
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeView === view 
        ? 'bg-green-600 text-white'
        : 'text-white/60 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="bg-black py-4 px-4 md:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="https://i.imgur.com/otUSmY1.png" alt="Pallacanestro Varese Logo" className="h-12" />
          <div>
            <h1 className="text-2xl font-bold text-white">Pallacanestro Varese Elite Basketball Program</h1>
            <p className="text-sm text-white/60">Financial Planning & Scenario Analysis</p>
          </div>
        </div>
        <nav className="flex items-center bg-black p-1 rounded-lg">
          <button onClick={() => onSelectView('scenarios')} className={navButtonClasses('scenarios')}>
            Scenarios
          </button>
          <button onClick={() => onSelectView('sensitivity')} className={navButtonClasses('sensitivity')}>
            Sensitivity Matrix
          </button>

        </nav>
      </div>
    </header>
  );
};

export default Header;
