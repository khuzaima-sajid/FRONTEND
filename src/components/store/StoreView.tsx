import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, CartItem } from '../../types';
import { CheckoutModal } from './CheckoutModal';
import {
  ShoppingBag,
  ShoppingCart,
  Tag,
  Check,
  ChevronRight,
  Package,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { products, orders } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [viewOrdersTab, setViewOrdersTab] = useState(false);

  const categories = ['All', 'Apparel', 'Headwear', 'Equipment'];

  const filteredProducts = products.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || 'Standard');
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const existingIndex = cart.findIndex(
      (c) => c.product.id === selectedProduct.id && c.size === selectedSize
    );

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        { product: selectedProduct, size: selectedSize, quantity },
      ]);
    }

    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            NaSCon 26 Official Club Store
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authentic match kit apparel, collegiate performance caps, and championship gear.
          </p>
        </div>

        {/* View Orders / Cart Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewOrdersTab(!viewOrdersTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              viewOrdersTab
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {viewOrdersTab ? 'Browse Catalog' : `Order History (${orders.length})`}
          </button>

          {cart.length > 0 && (
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                Checkout ({totalCartCount}) · ${totalCartAmount}
              </span>
            </button>
          )}
        </div>
      </div>

      {viewOrdersTab ? (
        /* Order History View */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Recent Purchases & Order Receipts</h3>
          {orders.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">No orders placed yet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Select an item from the catalog to test the checkout & stock reduction flow!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-white text-sm">
                        Order #{ord.id}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {ord.customerName} · {ord.paymentMethod} · {ord.date}
                    </div>
                    <div className="mt-2 text-xs text-slate-300">
                      {ord.items.map((it, idx) => (
                        <span key={idx} className="mr-3">
                          {it.quantity}x {it.name} ({it.size})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Total Paid</span>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      ${ord.totalAmount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Products Catalog */
        <div className="space-y-6">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900/85 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-slate-800">
                        {prod.badge}
                      </span>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-white">
                      ${prod.price}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold mb-1">
                      {prod.category} · {prod.clubName}
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80 mb-3">
                    <span className="text-slate-400">Stock Availability:</span>
                    <span
                      className={`font-mono font-semibold ${
                        prod.stock > 5 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {prod.stock > 0 ? `${prod.stock} left in club inventory` : 'Sold Out'}
                    </span>
                  </div>

                  <button
                    disabled={prod.stock <= 0}
                    onClick={() => handleOpenProduct(prod)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-xs transition-colors border border-slate-700 hover:border-emerald-500 flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <span>{prod.stock > 0 ? 'Select Size & Order' : 'Out of Stock'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Detail Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in">
            <div className="relative aspect-[16/9] bg-slate-950">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-300">
              <div>
                <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                  {selectedProduct.category} · {selectedProduct.clubName}
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedProduct.name}
                </h3>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  ${selectedProduct.price}
                </div>
                <p className="mt-2 text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Select Size / Fit Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg font-semibold border text-xs transition-colors ${
                        selectedSize === s
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-white text-sm font-bold w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedProduct.stock, q + 1))
                    }
                    className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart (${selectedProduct.price * quantity})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        cart={cart}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onClearCart={() => setCart([])}
      />
    </div>
  );
};
