import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import type { FarmerListing, Language, MandiPrice } from '../types';
import { UI_STRINGS, popularCropPresets } from '../data/dummyData';

interface SellScreenProps {
  language: Language;
  mandiPrices: MandiPrice[];
  onAddListing: (listing: FarmerListing) => void;
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const SellScreen: FC<SellScreenProps> = ({
  language,
  mandiPrices,
  onAddListing,
  showToast,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.EN;

  const [selectedCropName, setSelectedCropName] = useState('Tomatoes');
  const [customCropName, setCustomCropName] = useState('');
  const [quantityKg, setQuantityKg] = useState<number>(200);
  const [expectedPrice, setExpectedPrice] = useState<number>(28);
  const [location, setLocation] = useState('Farm Sector 3, Deesa');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find reference mandi price for selected crop
  const referenceMandi = mandiPrices.find((p) =>
    p.cropName.toLowerCase().includes(selectedCropName.toLowerCase())
  );

  const handleSelectPreset = (crop: (typeof popularCropPresets)[0]) => {
    setSelectedCropName(crop.name);
    setExpectedPrice(crop.defaultPrice);
    if (crop.name === 'Tomatoes') {
      setPhotoPreview('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');
    } else if (crop.name === 'Onions') {
      setPhotoPreview('https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80');
    } else if (crop.name === 'Potatoes') {
      setPhotoPreview('https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80');
    } else if (crop.name === 'Wheat') {
      setPhotoPreview('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80');
    } else if (crop.name === 'Cotton') {
      setPhotoPreview('https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80');
    } else {
      setPhotoPreview('https://images.unsplash.com/photo-1589927986086-3d10fb5555ca?auto=format&fit=crop&w=600&q=80');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        showToast('success', 'Photo Selected', 'Crop photo uploaded successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalCropName = selectedCropName === 'Other' ? customCropName : selectedCropName;

    if (!finalCropName.trim()) {
      showToast('warning', 'Crop Name Required', 'Please choose or enter a crop name.');
      return;
    }
    if (quantityKg <= 0) {
      showToast('warning', 'Invalid Quantity', 'Quantity must be at least 1 kg.');
      return;
    }
    if (expectedPrice <= 0) {
      showToast('warning', 'Invalid Price', 'Expected price must be greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newListing: FarmerListing = {
        id: `list-${Date.now()}`,
        cropName: finalCropName,
        quantityKg,
        expectedPricePerKg: expectedPrice,
        totalValue: quantityKg * expectedPrice,
        listedDate: 'Just now',
        location,
        photoUrl: photoPreview || undefined,
        status: 'active',
      };

      onAddListing(newListing);
      setIsSubmitting(false);
      showToast(
        'success',
        'Listing Published!',
        `${quantityKg} kg ${finalCropName} listed at ₹${expectedPrice}/kg on APMC Mandi network.`
      );
    }, 400);
  };

  const totalEstimatedValue = quantityKg * expectedPrice;
  const finalCropDisplayName = selectedCropName === 'Other' ? (customCropName || 'Crop') : selectedCropName;

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md w-full">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-amber-600 shadow-sm flex-shrink-0">
            🌾
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight truncate">
              {t.sellTitle}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5 truncate">
              {t.sellSubtitle}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {/* Responsive 2-Column Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start w-full">
          {/* Left Column: Form Inputs (7 cols on lg:) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full">
            {/* 1. CROP SELECTION */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md space-y-3 w-full">
              <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                🌱 1. {t.cropNameLabel}
              </label>

              {/* Quick Crop Tap Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5 w-full">
                {popularCropPresets.map((crop) => {
                  const isSelected = selectedCropName === crop.name;
                  return (
                    <button
                      key={crop.name}
                      type="button"
                      onClick={() => handleSelectPreset(crop)}
                      className={`min-h-[58px] sm:min-h-[64px] p-2 rounded-2xl flex flex-col items-center justify-center transition-all border-2 text-center active:scale-95 ${
                        isSelected
                          ? 'bg-green-100 border-green-700 text-green-950 shadow-md ring-2 ring-green-600 font-extrabold'
                          : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100 font-bold'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl mb-0.5">{crop.icon}</span>
                      <span className="text-[11px] sm:text-xs leading-tight font-black truncate w-full">{crop.name}</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-600 font-bold truncate w-full">
                        {language === 'HI'
                          ? crop.hindi
                          : language === 'GU'
                          ? crop.gujarati
                          : ''}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Crop Input */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customCropName}
                  onChange={(e) => {
                    setCustomCropName(e.target.value);
                    setSelectedCropName('Other');
                  }}
                  placeholder="Or type custom crop name (e.g. Garlic / लहुसन)..."
                  className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* 2. QUANTITY & PRICE */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md space-y-3.5 sm:space-y-4 w-full">
              {/* Quantity Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <label
                    htmlFor="quantity-input"
                    className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide truncate"
                  >
                    ⚖️ 2. {t.quantityLabel}
                  </label>
                  <span className="text-[11px] font-bold text-slate-600 flex-shrink-0">Unit: kg</span>
                </div>

                <div className="flex rounded-2xl border-2 border-slate-300 bg-slate-50 focus-within:border-green-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100 overflow-hidden shadow-sm">
                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    step="10"
                    value={quantityKg || ''}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full h-14 px-4 text-xl sm:text-2xl font-black text-slate-950 bg-transparent outline-none"
                    placeholder="200"
                    required
                  />
                  <span className="inline-flex items-center px-4 bg-slate-200 text-slate-900 font-black text-sm sm:text-base border-l-2 border-slate-300 select-none">
                    KG
                  </span>
                </div>

                {/* Quick Quantity Increment Buttons */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-2">
                  {[50, 100, 200, 500].map((addAmount) => (
                    <button
                      key={addAmount}
                      type="button"
                      onClick={() => setQuantityKg((prev) => (prev || 0) + addAmount)}
                      className="h-10 sm:h-11 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl text-[11px] sm:text-xs font-black text-slate-800 active:scale-95 transition-all"
                    >
                      +{addAmount} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Expected Price Input */}
              <div className="pt-2 border-t-2 border-slate-200">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <label
                    htmlFor="price-input"
                    className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide truncate"
                  >
                    💵 3. {t.priceLabel}
                  </label>
                  {referenceMandi && (
                    <span className="text-[10px] sm:text-xs font-black text-green-900 bg-green-100 border border-green-400 px-2 py-0.5 rounded-lg flex-shrink-0">
                      {referenceMandi.marketName}: ₹{referenceMandi.pricePerKg}/kg
                    </span>
                  )}
                </div>

                <div className="flex rounded-2xl border-2 border-slate-300 bg-slate-50 focus-within:border-green-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100 overflow-hidden shadow-sm">
                  <span className="inline-flex items-center px-4 bg-slate-200 text-slate-900 font-black text-lg sm:text-xl border-r-2 border-slate-300 select-none">
                    ₹
                  </span>
                  <input
                    id="price-input"
                    type="number"
                    min="1"
                    step="1"
                    value={expectedPrice || ''}
                    onChange={(e) => setExpectedPrice(Number(e.target.value))}
                    className="w-full h-14 px-4 text-xl sm:text-2xl font-black text-slate-950 bg-transparent outline-none"
                    placeholder="28"
                    required
                  />
                  <span className="inline-flex items-center px-3 sm:px-4 bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border-l-2 border-slate-300 select-none">
                    per KG
                  </span>
                </div>
              </div>
            </div>

            {/* 3. PHOTO UPLOAD PLACEHOLDER */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md space-y-3 w-full">
              <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                📷 4. {t.photoLabel}
              </label>

              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-green-700 h-40 sm:h-44 group shadow-md">
                    <img
                      src={photoPreview}
                      alt="Crop preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                      <div className="flex items-center justify-between w-full text-white">
                        <span className="text-[11px] sm:text-xs font-black bg-green-700 px-2 py-0.5 rounded-lg border border-green-400">
                          ✓ Photo Attached
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/40">
                          Tap to Change 📸
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 sm:h-36 rounded-2xl border-2 border-dashed border-slate-300 hover:border-green-600 bg-slate-50 hover:bg-green-50/50 flex flex-col items-center justify-center p-3 text-center transition-all">
                    <span className="text-2xl sm:text-3xl mb-1">📸</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {t.tapToPhoto}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      High quality photos get faster buyer offers
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* 4. LOCATION INPUT */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-md w-full">
              <label
                htmlFor="location-input"
                className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5"
              >
                📍 5. Farm / Warehouse Location
              </label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold text-sm sm:text-base text-slate-900 focus:bg-white focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all shadow-inner"
                required
              />
            </div>
          </div>

          {/* Right Column: Sticky Summary, Payout Calculator & Submit Button */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 lg:sticky lg:top-24 w-full">
            {/* Live Listing Preview Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-lg space-y-3.5 w-full">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <span className="text-[11px] sm:text-xs font-black uppercase text-slate-500 tracking-wider">
                  Live Preview
                </span>
                <span className="bg-green-100 text-green-900 border border-green-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full">
                  🟢 Ready to List
                </span>
              </div>

              <div className="flex items-center gap-3">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={finalCropDisplayName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-100 text-green-900 border-2 border-green-700 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 font-black">
                    🌱
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 leading-tight truncate">
                    {finalCropDisplayName}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-1 truncate">
                    📦 Volume: <span className="font-black text-slate-900">{quantityKg} kg</span>
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 truncate">
                    📍 {location}
                  </p>
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-green-600 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-green-900">
                  <span>Price per kg:</span>
                  <span className="font-black text-sm sm:text-base">₹{expectedPrice}/kg</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-green-900">
                  <span>Total Volume:</span>
                  <span className="font-black text-sm sm:text-base">{quantityKg} kg</span>
                </div>
                <div className="pt-2 border-t border-green-300 flex items-baseline justify-between gap-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-green-950 truncate">
                    Estimated Total Payout:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-green-950 flex-shrink-0">
                    ₹{totalEstimatedValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Market Comparison Callout */}
              {referenceMandi && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-300 text-xs font-medium text-slate-700 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>{referenceMandi.marketName} Mandi:</span>
                    <span className="text-green-800 font-black">₹{referenceMandi.pricePerKg}/kg</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    {expectedPrice >= referenceMandi.pricePerKg
                      ? `Your price is ₹${expectedPrice - referenceMandi.pricePerKg}/kg above Mandi average.`
                      : `Your price is ₹${referenceMandi.pricePerKg - expectedPrice}/kg below Mandi rate for quick bulk sale.`}
                  </p>
                </div>
              )}

              {/* Massive Full-Width Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[60px] sm:min-h-[64px] rounded-2xl bg-green-700 hover:bg-green-800 active:scale-[0.98] text-white font-black text-lg sm:text-xl shadow-xl border-2 border-green-950 flex items-center justify-center gap-2.5 transition-all"
              >
                {isSubmitting ? (
                  <span className="inline-block w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl">📢</span>
                    <span>{t.publishButton}</span>
                    <span className="text-lg sm:text-xl">➔</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
