import { useState } from 'react';
import type { FC } from 'react';
import type {
  Screen,
  Language,
  FarmerProfile,
  FarmerListing,
  BuyerOrder,
  MandiPrice,
} from './types';
import {
  initialFarmerProfile,
  liveMandiPrices,
  initialListings,
  initialOrders,
} from './data/dummyData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NotificationToast } from './components/NotificationToast';
import type { ToastMessage } from './components/NotificationToast';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SellScreen } from './screens/SellScreen';
import { OrdersScreen } from './screens/OrdersScreen';

export const App: FC = () => {
  // Authentication state (default: false as requested)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Screen routing state
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Language state (EN / GU / HI)
  const [language, setLanguage] = useState<Language>('EN');

  // Application Data States
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(initialFarmerProfile);
  const [mandiPrices] = useState<MandiPrice[]>(liveMandiPrices);
  const [listings, setListings] = useState<FarmerListing[]>(initialListings);
  const [orders, setOrders] = useState<BuyerOrder[]>(initialOrders);

  // Toast notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = `${Date.now()}`;
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  // Auth Handlers
  const handleLoginSuccess = (mobileNumber: string) => {
    setFarmerProfile((prev) => ({
      ...prev,
      mobile: mobileNumber,
    }));
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('info', 'Logged Out', 'You have been safely logged out.');
  };

  // Order Handlers
  const handleAcceptOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'accepted' as const } : o))
    );

    // Update farmer earnings & sold volume
    setFarmerProfile((prev) => ({
      ...prev,
      totalEarnings: prev.totalEarnings + targetOrder.totalAmount,
      totalQuantitySoldKg: prev.totalQuantitySoldKg + targetOrder.quantityKg,
    }));

    showToast(
      'success',
      'Order Accepted!',
      `Accepted ${targetOrder.quantityKg} kg ${targetOrder.cropName} from ${targetOrder.buyerName}. ₹${targetOrder.totalAmount} added to total earnings!`
    );
  };

  const handleDeclineOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'declined' as const } : o))
    );
    showToast('info', 'Order Declined', 'The purchase request has been declined.');
  };

  // Listing Handlers
  const handleAddListing = (newListing: FarmerListing) => {
    setListings((prev) => [newListing, ...prev]);
    setFarmerProfile((prev) => ({
      ...prev,
      activeListingsCount: prev.activeListingsCount + 1,
    }));
    // Navigate back to Home screen to see active listings
    setCurrentScreen('home');
  };

  // Count pending orders for badge
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans selection:bg-green-200 w-full max-w-full overflow-x-hidden">
      {/* Floating Toast Message */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Responsive Header (with Desktop Navigation Bar built-in) */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        farmerName={farmerProfile.name}
        activeScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Main Content Area (Responsive width: full width on mobile, max-w-7xl on desktop) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 pb-24 md:pb-12 overflow-x-hidden">
        {!isAuthenticated ? (
          <LoginScreen
            language={language}
            onLoginSuccess={handleLoginSuccess}
            showToast={showToast}
          />
        ) : (
          <>
            {currentScreen === 'home' && (
              <HomeScreen
                farmerProfile={farmerProfile}
                mandiPrices={mandiPrices}
                listings={listings}
                language={language}
                onNavigateTo={setCurrentScreen}
                showToast={showToast}
              />
            )}

            {currentScreen === 'sell' && (
              <SellScreen
                language={language}
                mandiPrices={mandiPrices}
                onAddListing={handleAddListing}
                showToast={showToast}
              />
            )}

            {currentScreen === 'orders' && (
              <OrdersScreen
                orders={orders}
                language={language}
                onAcceptOrder={handleAcceptOrder}
                onDeclineOrder={handleDeclineOrder}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Bottom Navigation (Mobile only `md:hidden`, visible when logged in) */}
      {isAuthenticated && (
        <div className="md:hidden">
          <BottomNav
            activeScreen={currentScreen}
            onSelectScreen={setCurrentScreen}
            language={language}
            pendingOrdersCount={pendingOrdersCount}
          />
        </div>
      )}
    </div>
  );
};

export default App;
