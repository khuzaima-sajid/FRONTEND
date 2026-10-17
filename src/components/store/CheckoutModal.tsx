import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CartItem, Order } from '../../types';
import { ShoppingBag, X, CheckCircle2, AlertCircle, CreditCard, ShieldCheck } from 'lucide-react';

interface CheckoutModalProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  isOpen,
  onClose,
  onClearCart,
}) => {
  const { currentUser, createOrder } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || 'Hamza Malik');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'manager@nascon.test');
  const [paymentMethod, setPaymentMethod] = useState('University Sports Card / NFC');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (simulateFailure) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setErrorMessage('Transaction Declined: Insufficient department allocation or demo simulation error.');
      }, 600);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = createOrder(cart, customerName, customerEmail, paymentMethod);
      setIsProcessing(false);

      if (res.success && res.orderId) {
        setReceiptOrder({
          id: res.orderId,
          items: cart.map((c) => ({
            productId: c.product.id,
            name: c.product.name,
            price: c.product.price,
            quantity: c.quantity,
            size: c.size,
          })),
          totalAmount,
          customerName,
          customerEmail,
          status: 'Confirmed',
          date: new Date().toISOString().split('T')[0],
          paymentMethod,
        });
        onClearCart();
      }
    }, 600);
  };

  const handleDone = () => {
    setReceiptOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {receiptOrder ? 'Official Order Receipt' : 'Complete Club Store Order'}
              </h2>
              <span className="text-[11px] text-slate-400">
                NaSCon Official Merchandise Desk
              </span>
            </div>
          </div>
          <button
            onClick={receiptOrder ? handleDone : onClose}
            aria-label="Close dialog"
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[80vh] text-xs text-slate-300">
          {receiptOrder ? (
            /* Receipt Screen */
            <div className="space-y-4">
              <div className="text-center py-3 space-y-1">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Payment Successful</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Order ID: <strong className="text-white">{receiptOrder.id}</strong>
                </p>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px] uppercase font-bold">
                  Status: {receiptOrder.status}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-white font-medium">{receiptOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white font-medium">{receiptOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Payment:</span>
                  <span className="text-white font-medium">{receiptOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-white font-medium">{receiptOrder.date}</span>
                </div>

                <div className="pt-2">
                  <div className="text-slate-400 text-[10px] uppercase mb-1">Purchased Items:</div>
                  {receiptOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-0.5">
                      <span className="text-white">
                        {it.quantity}x {it.name} ({it.size})
                      </span>
                      <span className="text-emerald-400 font-bold">
                        ${it.price * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Paid:</span>
                  <span className="text-emerald-400">${receiptOrder.totalAmount}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Inventory stock levels have been automatically updated. Order logged to your account.
              </p>

              <button
                type="button"
                onClick={handleDone}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                Done & Return to Store
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order summary */}
              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Order Items ({cart.length})</h4>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="truncate max-w-[240px]">
                        <span className="font-semibold text-white">{item.product.name}</span>
                        <div className="text-[11px] text-slate-400">
                          Size: {item.size} · Qty: {item.quantity}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-sm">
                    <span className="text-white">Total Amount</span>
                    <span className="text-emerald-400 font-mono">${totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Customer details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Receipt Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Payment Method (Demonstration)
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="University Sports Card / NFC">
                    University Sports Card / NFC Wallet
                  </option>
                  <option value="Collegiate Department Account">
                    Collegiate Department Account
                  </option>
                  <option value="Cash on Pitch Pickup">
                    Cash at Pitch Merchandise Desk
                  </option>
                </select>
              </div>

              {/* Demo Payment simulation toggle */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200">Simulate Payment Failure</span>
                  <div className="text-[10px] text-slate-400">
                    Test error handling & retry states for evaluators
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md transition-transform active:scale-95 disabled:opacity-70 flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <span className="inline-block animate-spin mr-1">↻</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Pay ${totalAmount}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
