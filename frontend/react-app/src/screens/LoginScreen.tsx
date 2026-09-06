import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import type { Language } from '../types';
import { UI_STRINGS } from '../data/dummyData';

interface LoginScreenProps {
  language: Language;
  onLoginSuccess: (mobileNumber: string) => void;
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const LoginScreen: FC<LoginScreenProps> = ({
  language,
  onLoginSuccess,
  showToast,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.EN;
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4']);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (mobileNumber.length < 10) {
      showToast('warning', 'Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode(['1', '2', '3', '4']); // Pre-fill sample OTP for seamless testing
      showToast(
        'info',
        'OTP Sent (SMS)',
        'Simulated OTP code is 1234. Use it to login.'
      );
    }, 500);
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = cleaned;
    setOtpCode(newOtp);

    // Auto-focus next input if filled
    if (cleaned && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      showToast('warning', 'Mobile Number Required', 'Please enter your 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('success', 'Login Successful', `Welcome back to AgriCart Kisan Portal!`);
      onLoginSuccess(mobileNumber);
    }, 400);
  };

  const handleInstantDemoLogin = () => {
    showToast('success', 'Demo Login Activated', 'Logged in as Ramesh Patel (Deesa, Banaskantha)');
    onLoginSuccess('9876543210');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
        {/* Left Side: Rural Hero Banner & Benefits (5 cols on md:) */}
        <div className="md:col-span-5 bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 text-white shadow-xl border-2 border-green-950 text-center md:text-left relative overflow-hidden flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl border-2 border-white/20 shadow-inner mx-auto md:mx-0">
              🚜
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-1">
                Agri<span className="text-amber-400">Cart</span>
              </h1>
              <p className="text-amber-200 font-extrabold text-sm uppercase tracking-wider">
                {language === 'HI'
                  ? 'किसान फसल ई-मंडी'
                  : language === 'GU'
                  ? 'કિસાન પાક ઈ-માર્કેટ યાર્ડ'
                  : 'Direct Farmer Mandi Portal'}
              </p>
            </div>

            <p className="text-emerald-100 text-sm font-medium leading-relaxed">
              {language === 'HI'
                ? 'अपनी फसल सीधे सही दाम पर व्यापारियों को बेचें। बिना किसी बिचौलिए के पारदर्शी भुगतान।'
                : language === 'GU'
                ? 'વચ્ચેના દલાલ વગર સીધા વેપારીઓને યોગ્ય ભાવે પાક વેચો અને સમયસર ખાતામાં નાણાં મેળવો.'
                : 'Direct access to APMC live rates, bulk buyers, and verified transactions for your farm produce.'}
            </p>
          </div>

          <div className="pt-4 border-t border-green-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 justify-center md:justify-start">
              <span>✓ 100% Free for Farmers</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 justify-center md:justify-start">
              <span>✓ Real-time Mandi Rates</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 justify-center md:justify-start">
              <span>✓ Direct Bulk Buyer Requests</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card (7 cols on md:) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-green-600 animate-pulse"></div>
              <h2 className="text-2xl font-black text-slate-900">
                {language === 'HI' ? 'किसान लॉगिन' : language === 'GU' ? 'ખેડૂત લોગિન' : 'Farmer Login'}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
              OTP Verification
            </span>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Mobile Number Input */}
            <div>
              <label
                htmlFor="mobile-input"
                className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide"
              >
                📱 {t.mobileNumber}
              </label>
              <div className="flex rounded-2xl border-2 border-slate-300 bg-slate-50 focus-within:border-green-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100 overflow-hidden transition-all shadow-sm">
                <span className="inline-flex items-center px-4 bg-slate-200 text-slate-900 font-black text-lg border-r-2 border-slate-300 select-none">
                  +91
                </span>
                <input
                  id="mobile-input"
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full h-14 px-4 text-xl font-bold text-slate-950 tracking-wider bg-transparent outline-none placeholder:text-slate-400"
                  required
                />
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {language === 'HI'
                  ? 'ओटीपी सत्यापन के लिए 10 अंकों का नंबर दर्ज करें'
                  : language === 'GU'
                  ? 'OTP ચકાસણી માટે ૧૦ આંકડાનો નંબર દાખલ કરો'
                  : 'Enter your 10-digit registered mobile number'}
              </p>
            </div>

            {/* Get OTP Button */}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || mobileNumber.length < 10}
                className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-lg shadow-md border-2 border-amber-600 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <span className="inline-block w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>📩 {t.getOtp}</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4 pt-2 border-t-2 border-dashed border-slate-200">
                {/* OTP Input Fields */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      🔑 {t.otpLabel}
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-bold text-green-700 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        id={`otp-digit-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otpCode[index] || ''}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="h-14 text-center text-2xl font-black text-slate-950 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>
                  <div className="bg-green-50 border border-green-300 rounded-xl p-2.5 mt-2 flex items-center gap-2">
                    <span className="text-green-700 font-bold text-xs">💡 Demo OTP:</span>
                    <span className="bg-green-700 text-white font-mono text-xs px-2 py-0.5 rounded font-black tracking-widest">
                      1234
                    </span>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-green-700 hover:bg-green-800 active:scale-[0.98] text-white font-black text-lg shadow-lg border-2 border-green-950 flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>🚜 {t.loginBtn}</span>
                      <span>➔</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Quick Demo Bypass Button */}
          <div className="pt-2 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <span>⚡ {t.instantDemo}</span>
              <span className="text-xs text-slate-500 font-medium">(Skip OTP & Enter Portal)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
