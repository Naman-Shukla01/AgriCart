import type { FC } from 'react';
import type { Language, Screen } from '../types';
import { UI_STRINGS } from '../data/dummyData';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAuthenticated: boolean;
  onLogout?: () => void;
  farmerName?: string;
  activeScreen?: Screen;
  onSelectScreen?: (screen: Screen) => void;
  pendingOrdersCount?: number;
}

export const Header: FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isAuthenticated,
  onLogout,
  farmerName = 'Ramesh Patel',
  activeScreen = 'home',
  onSelectScreen,
  pendingOrdersCount = 0,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.EN;

  const desktopNavItems: { id: Screen; label: string; icon: string; badge?: number }[] = [
    { id: 'home', label: t.navHome, icon: '🏠' },
    { id: 'sell', label: t.navSell, icon: '🌾' },
    { id: 'orders', label: t.navOrders, icon: '📦', badge: pendingOrdersCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-300 shadow-sm w-full max-w-full overflow-hidden">
      {/* High Contrast Sunlight Bar */}
      <div className="bg-green-800 text-white px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            <span className="font-bold truncate">{t.sunlightMode}</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-emerald-100 flex-shrink-0 text-[10px] sm:text-xs">
            <span>📍 Banaskantha Yard</span>
            <span className="hidden md:inline">🕒 Live Feed</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar (Fully responsive: fits on 320px mobile screens up to 4K desktop) */}
      <div className="px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4 w-full">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSelectScreen && onSelectScreen('home')}
            className="flex items-center gap-1.5 sm:gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-green-700 text-white flex items-center justify-center shadow-md border-2 border-green-900 font-black text-lg sm:text-2xl flex-shrink-0">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-green-900 leading-none">
                  Agri<span className="text-amber-500">Cart</span>
                </span>
                <span className="hidden sm:inline bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                  Kisan
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-bold text-slate-600 leading-tight">
                {t.appSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links (Visible on md:) */}
        {isAuthenticated && onSelectScreen && (
          <nav className="hidden md:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-300">
            {desktopNavItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectScreen(item.id)}
                  className={`h-10 px-4 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-green-700 text-white shadow-md border-2 border-green-900'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 border-2 border-transparent'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full border border-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Section: Compact Language Switcher & Logout */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Language Switcher Segmented Control */}
          <div className="bg-slate-100 p-0.5 sm:p-1 rounded-xl border-2 border-slate-300 flex items-center shadow-inner">
            {(['EN', 'GU', 'HI'] as const).map((lang) => {
              const isActive = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`h-8 sm:h-9 px-1.5 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-black transition-all flex items-center justify-center ${
                    isActive
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                  }`}
                  aria-label={`Switch to ${lang}`}
                >
                  <span className="sm:hidden">
                    {lang === 'EN' ? 'EN' : lang === 'GU' ? 'ગુજ' : 'हिं'}
                  </span>
                  <span className="hidden sm:inline">
                    {lang === 'EN' ? 'English' : lang === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* User Profile Badge (Desktop only) */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2 bg-green-50 border-2 border-green-600 px-3 py-1.5 rounded-xl">
              <span className="text-base">👨‍🌾</span>
              <div className="text-left">
                <span className="block text-xs font-black text-green-950 leading-tight">
                  {farmerName}
                </span>
                <span className="text-[10px] font-bold text-green-700">Deesa, GJ</span>
              </div>
            </div>
          )}

          {/* Quick Logout Button */}
          {isAuthenticated && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Logout / Exit"
              className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border-2 border-slate-300 hover:border-red-300 flex items-center justify-center gap-1 transition-colors font-bold text-xs flex-shrink-0"
              aria-label="Logout"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:inline">{t.logout}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
