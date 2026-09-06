import type { FC, ReactNode } from 'react';
import type { Screen, Language } from '../types';
import { UI_STRINGS } from '../data/dummyData';

interface BottomNavProps {
  activeScreen: Screen;
  onSelectScreen: (screen: Screen) => void;
  language: Language;
  pendingOrdersCount: number;
}

export const BottomNav: FC<BottomNavProps> = ({
  activeScreen,
  onSelectScreen,
  language,
  pendingOrdersCount,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.EN;

  const navItems: {
    id: Screen;
    label: string;
    sublabel: string;
    icon: (isActive: boolean) => ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'home',
      label: t.navHome,
      sublabel: language === 'HI' ? 'मंडी भाव' : language === 'GU' ? 'યાર્ડ ભાવ' : 'Overview',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform ${isActive ? 'scale-110' : ''}`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isActive ? '2' : '2.5'}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: 'sell',
      label: t.navSell,
      sublabel: language === 'HI' ? 'फसल लिस्ट' : language === 'GU' ? 'પાક વેચો' : 'New Listing',
      icon: (isActive) => (
        <div className={`relative flex items-center justify-center ${isActive ? 'scale-110' : ''}`}>
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill={isActive ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 'orders',
      label: t.navOrders,
      sublabel: language === 'HI' ? 'खरीद मांग' : language === 'GU' ? 'ખરીદ ઓર્ડર' : 'Requests',
      badge: pendingOrdersCount,
      icon: (isActive) => (
        <div className="relative">
          <svg
            className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform ${isActive ? 'scale-110' : ''}`}
            fill={isActive ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isActive ? '2' : '2.5'}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
              {pendingOrdersCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-300 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] w-full max-w-full">
      <div className="w-full max-w-md mx-auto flex items-stretch justify-around px-1.5 py-1">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectScreen(item.id)}
              className={`flex-1 min-h-[58px] sm:min-h-[64px] py-1 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all select-none relative min-w-0 ${
                isActive
                  ? 'bg-green-100 text-green-950 border-2 border-green-700 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent font-bold'
              }`}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <span className="absolute -top-1 w-8 sm:w-10 h-1 bg-green-700 rounded-full"></span>
              )}

              <div className="mb-0.5 sm:mb-1">{item.icon(isActive)}</div>
              <span className="text-xs sm:text-sm leading-none tracking-tight truncate w-full text-center">
                {item.label}
              </span>
              <span className={`text-[9px] sm:text-[10px] mt-0.5 leading-none truncate w-full text-center ${isActive ? 'text-green-800 font-bold' : 'text-slate-500 font-medium'}`}>
                {item.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
