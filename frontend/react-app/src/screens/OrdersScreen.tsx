import { useState } from 'react';
import type { FC } from 'react';
import type { BuyerOrder, Language } from '../types';
import { UI_STRINGS } from '../data/dummyData';

interface OrdersScreenProps {
  orders: BuyerOrder[];
  language: Language;
  onAcceptOrder: (orderId: string) => void;
  onDeclineOrder: (orderId: string) => void;
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const OrdersScreen: FC<OrdersScreenProps> = ({
  orders,
  language,
  onAcceptOrder,
  onDeclineOrder,
  showToast,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.EN;
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const acceptedOrders = orders.filter((o) => o.status === 'accepted');

  const displayedOrders = activeTab === 'pending' ? pendingOrders : acceptedOrders;

  const handleCallBuyer = (order: BuyerOrder) => {
    showToast('info', 'Connecting Call...', `Dialing ${order.buyerName} at ${order.buyerPhone}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Title & Stats */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-green-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-green-900 shadow-sm flex-shrink-0">
              📦
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                {t.ordersTitle}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                {t.ordersSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-2xl border-2 border-slate-300 flex-shrink-0">
            <span className="text-xs font-black text-slate-700">
              Total Requests: <span className="text-green-800 font-black">{orders.length}</span>
            </span>
          </div>
        </div>

        {/* Tab Filters (Responsive on Mobile & Desktop) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 pt-3 border-t-2 border-slate-200 w-full sm:max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`h-11 sm:h-12 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 sm:gap-2 border-2 transition-all truncate ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="truncate">⏳ Pending</span>
            <span className="bg-slate-950 text-white text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-black flex-shrink-0">
              {pendingOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accepted')}
            className={`h-11 sm:h-12 px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 sm:gap-2 border-2 transition-all truncate ${
              activeTab === 'accepted'
                ? 'bg-green-700 text-white border-green-900 shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="truncate">✓ Accepted</span>
            <span className="bg-white text-green-900 text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-black flex-shrink-0">
              {acceptedOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Orders Grid: 1 col on mobile, 2 cols on md/lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
        {displayedOrders.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border-2 border-slate-300 text-center space-y-3">
            <span className="text-4xl sm:text-5xl block">🌾</span>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">
              {activeTab === 'pending' ? 'No Pending Requests' : 'No Accepted Orders Yet'}
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-sm mx-auto">
              {activeTab === 'pending'
                ? 'When retailers and supermarkets submit direct purchase requests for your crops, they will show up here.'
                : 'Accepted purchase orders ready for warehouse or farm pickup will appear here.'}
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => {
            const isAccepted = order.status === 'accepted';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border-2 shadow-md transition-all flex flex-col justify-between space-y-3.5 w-full overflow-hidden ${
                  isAccepted
                    ? 'border-green-600 ring-2 ring-green-100'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {/* Order Top Bar: Buyer + Status Badge */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-800 flex items-center justify-center text-xl sm:text-2xl font-black flex-shrink-0">
                      🏢
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                        {order.buyerName}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-bold text-slate-600 truncate mt-0.5">
                        🏷️ {order.buyerType} • ⏱️ {order.orderTime}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-xl border flex-shrink-0 ${
                      isAccepted
                        ? 'bg-green-100 text-green-900 border-green-400'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {isAccepted ? '✓ Confirmed' : '⚡ Direct Request'}
                  </span>
                </div>

                {/* Crop & Deal Terms Details Box */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border-2 border-slate-200 grid grid-cols-2 gap-2 items-center">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-slate-500 block leading-none">
                      Crop & Qty
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 mt-1 block truncate">
                      {order.quantityKg} kg{' '}
                      <span className="text-green-800 font-black">{order.cropName}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 block truncate">
                      (
                      {language === 'HI'
                        ? order.hindiCropName
                        : language === 'GU'
                        ? order.gujaratiCropName
                        : order.cropName}
                      )
                    </span>
                  </div>

                  <div className="text-right min-w-0">
                    <span className="text-[10px] font-black uppercase text-slate-500 block leading-none">
                      Price Offered
                    </span>
                    <span className="text-lg sm:text-2xl font-black text-green-800 mt-1 block">
                      ₹{order.priceOfferedPerKg}
                      <span className="text-xs font-bold text-slate-600"> /kg</span>
                    </span>
                    <span className="text-[11px] font-black text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                      Total: ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Pickup & Location Details */}
                <div className="space-y-1 text-xs font-bold text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-emerald-800 flex-shrink-0">📍 Yard:</span>
                    <span className="text-slate-900 truncate">{order.deliveryLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-800 flex-shrink-0">🚚 Pickup:</span>
                    <span className="text-slate-900 font-extrabold truncate">{order.pickupSlot}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  {!isAccepted ? (
                    <>
                      {/* Prominent Accept Order Button (h-14 minimum touch target) */}
                      <button
                        type="button"
                        onClick={() => onAcceptOrder(order.id)}
                        className="flex-1 h-14 rounded-2xl bg-green-700 hover:bg-green-800 active:scale-[0.98] text-white font-black text-base shadow-md border-2 border-green-950 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span className="text-lg">✓</span>
                        <span>{t.acceptOrder}</span>
                      </button>

                      <div className="flex gap-2">
                        {/* Call Buyer Button */}
                        <button
                          type="button"
                          onClick={() => handleCallBuyer(order)}
                          className="flex-1 sm:flex-none h-14 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-300 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <span>📞</span>
                          <span>{t.callBuyer}</span>
                        </button>

                        {/* Decline Button */}
                        <button
                          type="button"
                          onClick={() => onDeclineOrder(order.id)}
                          className="h-14 w-12 rounded-2xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold text-sm border-2 border-slate-300 hover:border-rose-300 flex items-center justify-center active:scale-95 transition-all flex-shrink-0"
                          title="Decline"
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Accepted State Banner */
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="w-full h-14 rounded-2xl bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 border-2 border-emerald-950 shadow-md">
                        <span>✓</span>
                        <span>{t.orderAccepted}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCallBuyer(order)}
                        className="w-full sm:w-auto h-14 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-300 flex items-center justify-center gap-1.5 active:scale-95 transition-all flex-shrink-0"
                      >
                        <span>📞 {t.callBuyer}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
