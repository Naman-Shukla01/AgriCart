import { useState } from 'react';
import type { FC } from 'react';
import type {
  FarmerProfile,
  MandiPrice,
  FarmerListing,
  Language,
  Screen,
} from '../types';
import { UI_STRINGS } from '../data/dummyData';

interface HomeScreenProps {
  farmerProfile: FarmerProfile;
  mandiPrices: MandiPrice[];
  listings: FarmerListing[];
  language: Language;
  onNavigateTo: (screen: Screen) => void;
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const HomeScreen: FC<HomeScreenProps> = ({
  farmerProfile,
  mandiPrices,
  listings,
  language,
  onNavigateTo,
  showToast,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.EN;

  // Mandi prices interactive states
  const [isMandiCollapsed, setIsMandiCollapsed] = useState<boolean>(false);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedMarketFilter, setSelectedMarketFilter] = useState<string>('all');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Filtered mandi prices
  const displayedPrices = mandiPrices.filter((p) => {
    const matchCrop =
      selectedCropFilter === 'all' ||
      p.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchMarket =
      selectedMarketFilter === 'all' ||
      p.marketName.toLowerCase() === selectedMarketFilter.toLowerCase();
    return matchCrop && matchMarket;
  });

  const allMarkets = Array.from(new Set(mandiPrices.map((p) => p.marketName)));

  const handleVoiceListen = () => {
    setIsSpeaking(true);
    const audioText =
      language === 'HI'
        ? `नमस्ते रमेश भाई। आपकी कुल कमाई बारह हजार पांच सौ रुपये है। आज डीसा मंडी में टमाटर अट्ठाईस रुपये, मेहसाणा में प्याज बीस रुपये और बनासकांठा में आलू पंद्रह रुपये प्रति किलो चल रहा है।`
        : language === 'GU'
        ? `નમસ્તે રમેશભાઈ. તમારી કુલ કમાણી બાર હજાર પાંચસો રૂપિયા છે. ડીસા યાર્ડમાં ટામેટા અઠ્ઠાવીસ રૂપિયા અને મહેસાણામાં ડુંગળી વીસ રૂપિયા પ્રતિ કિલો છે.`
        : `Hello Ramesh. Your total earnings are 12,500 rupees. Live Mandi price in Deesa for Tomatoes is 28 rupees per kg, and Onions in Mehsana is 20 rupees per kg.`;

    showToast('info', '🔊 Voice Summary Playing', audioText);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(audioText);
      utterance.lang = language === 'HI' ? 'hi-IN' : language === 'GU' ? 'gu-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* 1. TOP HERO SECTION: GREETING & EARNINGS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch w-full">
        {/* Farmer Welcome & Quick Actions Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md flex flex-col justify-between space-y-3.5 sm:space-y-4 w-full">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-100 border-2 border-green-700 text-green-950 flex items-center justify-center text-2xl sm:text-3xl font-black shadow-sm flex-shrink-0">
                👨‍🌾
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">
                    {farmerProfile.name}
                  </h2>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-emerald-300 flex-shrink-0">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-0.5 truncate">
                  📍 {farmerProfile.village}, {farmerProfile.taluka}
                </p>
              </div>
            </div>

            {/* Voice speaker button */}
            <button
              type="button"
              onClick={handleVoiceListen}
              className={`h-11 px-2.5 sm:px-3 rounded-xl border-2 flex items-center gap-1 font-black text-xs transition-all active:scale-95 shadow-sm flex-shrink-0 ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse'
                  : 'bg-green-50 hover:bg-green-100 text-green-900 border-green-700'
              }`}
              title="Listen Voice Summary"
            >
              <span className="text-base">{isSpeaking ? '🔊' : '🔈'}</span>
              <span className="text-[11px] sm:text-xs">
                {language === 'HI' ? 'सुनें' : language === 'GU' ? 'સાંભળો' : 'Listen'}
              </span>
            </button>
          </div>

          {/* Quick Action Buttons for Farmer */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigateTo('sell')}
              className="h-14 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-black text-sm border-2 border-green-950 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="text-xl">🌾</span>
              <span>{t.navSell}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTo('orders')}
              className="h-14 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-black text-sm border-2 border-amber-600 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="text-xl">📦</span>
              <span>{t.navOrders}</span>
            </button>
          </div>
        </div>

        {/* Total Earnings Card (Prominent Green Banner) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-green-950 flex flex-col justify-between relative overflow-hidden w-full">
          <div className="relative z-10 space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-green-200 bg-green-950/50 px-2.5 py-1 rounded-lg border border-green-600/50 flex items-center gap-1.5 flex-shrink-0">
                💰 {t.totalEarnings}
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold text-emerald-200 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30 truncate">
                Verified Bank Transfer
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 my-0.5">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                ₹{farmerProfile.totalEarnings.toLocaleString('en-IN')}
              </span>
              <span className="text-emerald-300 font-extrabold text-xs sm:text-sm">INR (रुपये)</span>
            </div>

            {/* Metric Pills Grid (3 columns on both mobile & desktop with compact text safety) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-2 border-t border-green-600/60">
              <div className="bg-green-950/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-green-700/50 min-w-0">
                <span className="text-[9px] sm:text-[11px] font-bold text-green-200 block leading-tight truncate">
                  {t.pendingPayout}
                </span>
                <span className="text-xs sm:text-lg font-black text-amber-300 mt-0.5 block truncate">
                  ₹{farmerProfile.pendingPayout.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-green-950/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-green-700/50 min-w-0">
                <span className="text-[9px] sm:text-[11px] font-bold text-green-200 block leading-tight truncate">
                  {t.activeListings}
                </span>
                <span className="text-xs sm:text-lg font-black text-white mt-0.5 block truncate">
                  {listings.length} {language === 'HI' ? 'फसलें' : language === 'GU' ? 'પાક' : 'Crops'}
                </span>
              </div>

              <div className="bg-green-950/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-green-700/50 min-w-0">
                <span className="text-[9px] sm:text-[11px] font-bold text-green-200 block leading-tight truncate">
                  Total Sold
                </span>
                <span className="text-xs sm:text-lg font-black text-emerald-300 mt-0.5 block truncate">
                  {farmerProfile.totalQuantitySoldKg} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE MANDI PRICES (COLLAPSIBLE & FULLY RESPONSIVE) */}
      <section className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md transition-all w-full overflow-hidden">
        {/* Header Bar with Collapse Toggle Button */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-slate-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-3 w-3 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
                  {t.liveMandiPrices}
                </h3>
                <span className="bg-green-100 text-green-900 border border-green-400 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Collapse / Expand Toggle Control Button */}
          <button
            type="button"
            onClick={() => setIsMandiCollapsed(!isMandiCollapsed)}
            className="h-9 sm:h-11 px-2.5 sm:px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-[11px] sm:text-xs border-2 border-slate-300 flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0"
            aria-expanded={!isMandiCollapsed}
          >
            <span>{isMandiCollapsed ? '▼' : '▲'}</span>
            <span>
              {isMandiCollapsed
                ? language === 'HI'
                  ? 'देखें'
                  : language === 'GU'
                  ? 'જુઓ'
                  : 'Expand'
                : language === 'HI'
                ? 'संक्षिप्त'
                : language === 'GU'
                ? 'સંક્ષિપ્ત'
                : 'Collapse'}
            </span>
          </button>
        </div>

        {/* Mandi Content */}
        {!isMandiCollapsed ? (
          <div className="mt-3.5 space-y-3.5 w-full">
            {/* Filter Tabs: Markets & Crops (horizontal scrollable with zero clipping) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
              {/* Market Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full flex-nowrap">
                <button
                  type="button"
                  onClick={() => setSelectedMarketFilter('all')}
                  className={`h-8 px-2.5 rounded-xl text-[11px] font-black transition-all flex-shrink-0 border-2 ${
                    selectedMarketFilter === 'all'
                      ? 'bg-slate-900 text-white border-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  All Yards
                </button>
                {allMarkets.map((market) => (
                  <button
                    key={market}
                    type="button"
                    onClick={() => setSelectedMarketFilter(market)}
                    className={`h-8 px-2.5 rounded-xl text-[11px] font-black transition-all flex-shrink-0 border-2 ${
                      selectedMarketFilter === market
                        ? 'bg-green-700 text-white border-green-900 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    📍 {market}
                  </button>
                ))}
              </div>

              {/* Crop Filter Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto flex-nowrap">
                <button
                  type="button"
                  onClick={() => setSelectedCropFilter('all')}
                  className={`h-8 px-2.5 rounded-xl text-[11px] font-black transition-all flex-shrink-0 border-2 ${
                    selectedCropFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 border-amber-600'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  All Crops
                </button>
                {mandiPrices.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCropFilter(crop.cropName)}
                    className={`h-8 px-2 rounded-xl text-[11px] font-black transition-all flex-shrink-0 border-2 ${
                      selectedCropFilter === crop.cropName
                        ? 'bg-green-700 text-white border-green-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {crop.icon} {crop.cropName}
                  </button>
                ))}
              </div>
            </div>

            {/* Non-Collapsing Grid: Multi-column responsive cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-1 w-full">
              {displayedPrices.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-3.5 border-2 border-slate-300 hover:border-green-600 transition-all shadow-sm flex flex-col justify-between space-y-2.5 min-w-0 w-full"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{item.icon}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                          {item.cropName}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-600 truncate">
                          {language === 'HI'
                            ? item.hindiName
                            : language === 'GU'
                            ? item.gujaratiName
                            : ''}{' '}
                          • 📍 {item.marketName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-lg border flex-shrink-0 ${
                        item.trend === 'up'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}
                    >
                      {item.trend === 'up' ? '↗ +' : '↘ -'}₹{item.changeAmount}
                    </span>
                  </div>

                  {/* Bottom Bar: Price & Arrivals */}
                  <div className="pt-2 border-t-2 border-slate-200 flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 block leading-none">
                        Mandi Rate
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-green-900 leading-tight">
                        ₹{item.pricePerKg}
                        <span className="text-xs font-bold text-slate-600"> /kg</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 block leading-none">
                        Arrivals
                      </span>
                      <span className="text-xs font-black text-slate-800">
                        {item.arrivalVolume}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Collapsed State: Sleek Horizontal Compact Ticker */
          <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar py-1.5 w-full flex-nowrap">
            {mandiPrices.map((item) => (
              <div
                key={item.id}
                className="bg-slate-100 rounded-xl px-3 py-1.5 border-2 border-slate-300 flex items-center gap-2 flex-shrink-0"
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <span className="text-[11px] font-black text-slate-900 block leading-none truncate">
                    {item.cropName} ({item.marketName})
                  </span>
                  <span className="text-xs font-black text-green-900">
                    ₹{item.pricePerKg}/kg{' '}
                    <span
                      className={`text-[9px] font-bold ${
                        item.trend === 'up' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      ({item.trend === 'up' ? '+' : '-'}₹{item.changeAmount})
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. YOUR ACTIVE LISTINGS & MARKET INSIGHTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full">
        {/* Active Listings Section */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md space-y-3.5 w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {t.yourListings}
                </h3>
                <span className="bg-green-100 text-green-900 border border-green-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full">
                  {listings.length} Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTo('sell')}
              className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-xs border-2 border-green-950 shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all flex-shrink-0"
            >
              <span>+</span>
              <span>{t.addNewListing}</span>
            </button>
          </div>

          {/* Listings Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl p-3.5 border-2 border-slate-300 flex flex-col justify-between space-y-2.5 shadow-sm hover:border-green-600 transition-all w-full min-w-0"
              >
                <div className="flex items-start gap-2.5">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.cropName}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-slate-300 flex-shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-green-100 text-green-900 border-2 border-green-700 flex items-center justify-center text-2xl flex-shrink-0 font-black">
                      🌱
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                        {item.cropName}
                      </h4>
                      <span className="bg-green-100 text-green-900 border border-green-300 text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Live
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 mt-0.5 truncate">
                      📦 Qty: <span className="font-black text-slate-900">{item.quantityKg} kg</span>
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 truncate">
                      📍 {item.location}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t-2 border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-slate-500 block leading-none">
                      Your Price
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-950">
                      ₹{item.expectedPricePerKg}
                      <span className="text-xs font-bold text-slate-600">/kg</span>
                    </span>
                  </div>
                  <span className="text-xs font-black bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-xl">
                    ₹{item.totalValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Support & Buyer Connect Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-slate-950 shadow-md flex flex-col justify-between space-y-3.5 w-full">
          <div className="space-y-2.5">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/40 inline-block">
              ⚡ Direct Buyer Connect
            </span>
            <h4 className="text-base sm:text-lg font-black leading-snug text-white">
              Retailers in Ahmedabad & Mehsana are looking for fresh Tomatoes and Onions.
            </h4>
            <p className="text-xs font-medium text-slate-300">
              List your expected harvest 2-3 days ahead to get pre-harvest direct booking at peak market prices.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 block">Kisan Support Helpline</span>
            <span className="text-base sm:text-lg font-black text-amber-400 block">📞 1800-180-1551</span>
            <p className="text-[10px] font-medium text-slate-400">
              Free consultation in Hindi, Gujarati & English
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
