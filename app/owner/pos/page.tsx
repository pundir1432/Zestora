'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PosItemCard } from '@/components/pos/PosItemCard';
import { PosVariantModal } from '@/components/pos/PosVariantModal';
import { PosCart } from '@/components/pos/PosCart';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { SAMPLE_MENU_ITEMS, MENU_CATEGORIES } from '@/data/menuData';
import { SAMPLE_CUSTOMERS } from '@/data/customersData';
import { useAuth } from '@/context/AuthContext';
import { MenuItem } from '@/types/menu';
import { CartItem, Order } from '@/types/order';
import { 
  BiSearch, 
  BiFilterAlt, 
  BiDish, 
  BiCheckCircle, 
  BiReset,
  BiPackage
} from 'react-icons/bi';

function PosBillingContent() {
  const searchParams = useSearchParams();
  const initialTableParam = searchParams.get('table') || undefined;

  const { 
    currentRestaurant, 
    currentBranch, 
    tables, 
    addOrder, 
    deductRecipeIngredients 
  } = useAuth();

  const [menuItems, setMenuItems] = useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState<boolean>(false);
  const [nonVegOnlyFilter, setNonVegOnlyFilter] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      menuItemId: 'item-1',
      name: 'Paneer Tikka Angara',
      price: 290,
      quantity: 1,
      isVeg: true,
      selectedVariant: undefined,
    },
    {
      id: 'cart-init-2',
      menuItemId: 'item-6',
      name: 'Paneer Butter Masala',
      price: 340,
      quantity: 1,
      isVeg: true,
      selectedVariant: { id: 'var-1', name: 'Regular Portion', price: 340 },
    },
  ]);

  // Variant modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Success Alert & Receipt Preview
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [recipeNotice, setRecipeNotice] = useState<string>('');

  // Held Orders & Split Bill & Shortcuts State
  const [heldOrders, setHeldOrders] = useState<{
    id: string;
    heldAt: string;
    items: CartItem[];
    label: string;
    total: number;
  }[]>([
    {
      id: 'held-1',
      heldAt: '12:15 PM',
      label: 'Table 6 (Diners deciding desserts)',
      total: 720,
      items: [
        { id: 'h-1', menuItemId: 'item-1', name: 'Paneer Tikka Angara', price: 290, quantity: 2, isVeg: true },
        { id: 'h-2', menuItemId: 'item-3', name: 'Butter Garlic Naan', price: 70, quantity: 2, isVeg: true },
      ],
    },
  ]);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(2);

  const handleHoldCurrentCart = () => {
    if (cartItems.length === 0) return;
    const subtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const newHeld = {
      id: `held-${Date.now()}`,
      heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: `Order #${Math.floor(100 + Math.random() * 900)} (Counter Walk-in)`,
      total: subtotal,
      items: [...cartItems],
    };
    setHeldOrders([newHeld, ...heldOrders]);
    setCartItems([]);
    alert('Current bill held successfully! Cashier can proceed with next waiting guest.');
  };

  const handleRecallOrder = (heldId: string) => {
    const toRecall = heldOrders.find((h) => h.id === heldId);
    if (!toRecall) return;
    setCartItems(toRecall.items);
    setHeldOrders((prev) => prev.filter((h) => h.id !== heldId));
    setIsHeldModalOpen(false);
  };

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVeg = !vegOnlyFilter || item.isVeg;
    const matchesNonVeg = !nonVegOnlyFilter || !item.isVeg;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCat && matchesVeg && matchesNonVeg && matchesSearch;
  });

  const handleItemClick = (item: MenuItem) => {
    // If item has variants, add-ons, is weight based, custom cake, or coffee beverage, open customize modal
    const needsCustomization = 
      (item.variants && item.variants.length > 0) || 
      (item.addons && item.addons.length > 0) || 
      item.isWeightBased || 
      item.isCustomCake || 
      item.category === 'Coffee & Brews' || 
      item.category === 'Beverages';

    if (needsCustomization) {
      setCustomizingItem(item);
      setIsVariantModalOpen(true);
    } else {
      // Add directly to cart
      const existing = cartItems.find(c => c.menuItemId === item.id && !c.selectedVariant && !c.selectedWeightGrams);
      if (existing) {
        setCartItems(cartItems.map(c => c.id === existing.id ? { ...c, quantity: c.quantity + 1 } : c));
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          menuItemId: item.id,
          name: item.name,
          price: item.discountedPrice || item.price,
          quantity: 1,
          isVeg: item.isVeg,
        };
        setCartItems([...cartItems, newItem]);
      }
    }
  };

  const handleAddCustomizedItem = (cartItem: CartItem) => {
    setCartItems([...cartItems, cartItem]);
  };

  const handleUpdateQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
    } else {
      setCartItems(cartItems.map(c => c.id === cartItemId ? { ...c, quantity: newQty } : c));
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(cartItems.filter(c => c.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handlePlaceOrder = (orderData: Partial<Order>) => {
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      restaurantId: currentRestaurant.id,
      branchId: currentBranch?.id || 'branch-1',
      branchName: currentBranch?.name || 'Main Branch',
      customerName: orderData.customerName || 'Walk-in Customer',
      customerPhone: orderData.customerPhone || '+91 98765 43210',
      orderType: orderData.orderType || 'Dine In',
      tableNumber: orderData.tableNumber,
      assignedWaiter: orderData.assignedWaiter,
      items: cartItems.map(c => ({
        id: `oi-${Math.random()}`,
        menuItemId: c.menuItemId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        isVeg: c.isVeg,
        variantName: c.selectedVariant?.name,
        weightLabel: c.weightLabel,
        coffeeCustomization: c.coffeeCustomization,
        customCakeMessage: c.customCakeMessage,
        total: c.price * c.quantity,
      })),
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      discountCode: orderData.discountCode,
      taxGst: orderData.taxGst || 0,
      serviceCharge: orderData.serviceCharge || 0,
      packagingCharge: orderData.packagingCharge || 0,
      grandTotal: orderData.grandTotal || 0,
      paymentMethod: orderData.paymentMethod || 'UPI',
      splitPaymentDetails: orderData.splitPaymentDetails,
      paymentStatus: 'Paid',
      orderStatus: 'Preparing',
      createdAt: new Date().toISOString(),
      elapsedMinutes: 1,
      kotPrinted: true,
    };

    // 1. Add to live shared orders
    addOrder(newOrder);

    // 2. Trigger automatic recipe ingredient deduction
    const deductionResults = deductRecipeIngredients(
      cartItems.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity })),
      orderNum
    );

    let deductionText = '';
    if (deductionResults.length > 0) {
      deductionText = `Auto-deducted inventory stock for ${deductionResults.length} recipe items.`;
    }

    setLatestOrder(newOrder);
    setCartItems([]);
    setAlertMessage(`Bill Generated & KOT Dispatched for Order #${orderNum}!`);
    setRecipeNotice(deductionText);

    setTimeout(() => {
      setAlertMessage('');
      setRecipeNotice('');
    }, 6000);

    setIsReceiptOpen(true);
  };

  return (
    <>
      {/* Alert Banner for New Bill with Recipe Deduction notice */}
      {alertMessage && (
        <div className="alert alert-success d-flex align-items-center justify-content-between p-3 mb-3 rounded-3 shadow-sm border-0 bg-success text-white">
          <div className="d-flex align-items-center gap-2">
            <BiCheckCircle size={24} />
            <div>
              <strong className="fs-6 d-block">{alertMessage}</strong>
              {recipeNotice && (
                <span className="small text-white-50 d-flex align-items-center gap-1">
                  <BiPackage size={14} /> {recipeNotice}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light text-navy fw-semibold px-3 rounded-pill"
            onClick={() => setIsReceiptOpen(true)}
          >
            View / Print Receipt
          </button>
        </div>
      )}

      {/* Quick POS Action Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 bg-white p-2 px-3 rounded-3 shadow-sm border">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-dark font-monospace">TERMINAL #1</span>
          <span className="text-muted small">Cashier: Rohit Verma | Branch: Indiranagar</span>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard Shortcuts (F1 - F9)"
          >
            ⌨️ Shortcuts (F1)
          </button>
          <button
            type="button"
            className="btn btn-outline-warning text-dark btn-sm d-flex align-items-center gap-1"
            onClick={handleHoldCurrentCart}
            disabled={cartItems.length === 0}
            title="Hold Current Bill (F8)"
          >
            ⏸️ Hold Cart (F8)
          </button>
          <button
            type="button"
            className="btn btn-warning text-dark btn-sm d-flex align-items-center gap-1"
            onClick={() => setIsHeldModalOpen(true)}
            title="View Held Orders"
          >
            📋 Held Bills ({heldOrders.length})
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => setIsSplitModalOpen(true)}
            disabled={cartItems.length === 0}
            title="Split Bill Between Diners (F9)"
          >
            ✂️ Split Bill (F9)
          </button>
        </div>
      </div>

      {/* POS Dual Pane Layout */}
      <div className="row g-3" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* LEFT SECTION: Food Categories & Menu Grid */}
        <div className="col-12 col-lg-7 col-xl-8 d-flex flex-column">
          {/* Top Filter and Search Bar */}
          <div className="app-card p-3 mb-3 bg-white">
            <div className="row g-2 align-items-center">
              {/* Search */}
              <div className="col-12 col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-surface border-subtle text-muted">
                    <BiSearch size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-subtle"
                    placeholder="Search dishes by name or ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="btn btn-sm btn-light border-subtle"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Veg / Non-Veg Toggles */}
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center justify-content-md-end gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${
                      vegOnlyFilter ? 'btn-success text-white' : 'btn-outline-secondary'
                    }`}
                    onClick={() => {
                      setVegOnlyFilter(!vegOnlyFilter);
                      if (!vegOnlyFilter) setNonVegOnlyFilter(false);
                    }}
                  >
                    <span className="food-type-icon veg" />
                    <span className="small">Pure Veg</span>
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${
                      nonVegOnlyFilter ? 'btn-danger text-white' : 'btn-outline-secondary'
                    }`}
                    onClick={() => {
                      setNonVegOnlyFilter(!nonVegOnlyFilter);
                      if (!nonVegOnlyFilter) setVegOnlyFilter(false);
                    }}
                  >
                    <span className="food-type-icon non-veg" />
                    <span className="small">Non-Veg</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills Bar */}
            <div className="d-flex align-items-center gap-2 overflow-x-auto pt-3 border-top border-subtle mt-2 pb-1">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 text-nowrap ${
                  selectedCategory === 'All' ? 'btn-brand fw-bold shadow-sm text-white' : 'btn-light text-navy'
                }`}
                onClick={() => setSelectedCategory('All')}
              >
                All Menu ({menuItems.length})
              </button>

              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 text-nowrap ${
                    selectedCategory === cat.name ? 'btn-brand fw-bold shadow-sm text-white' : 'btn-light text-navy'
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-grow-1 overflow-y-auto pe-1" style={{ maxHeight: '720px' }}>
            {filteredItems.length === 0 ? (
              <div className="app-card p-5 text-center text-muted-custom">
                <BiDish size={48} className="text-muted mb-2" />
                <h6 className="fw-semibold text-navy">No food items found</h6>
                <p className="small mb-0">Try changing your search terms or filters</p>
              </div>
            ) : (
              <div className="row g-3">
                {filteredItems.map((item) => (
                  <div key={item.id} className="col-6 col-sm-4 col-md-3 col-lg-3">
                    <PosItemCard item={item} onAddToCart={handleItemClick} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Active Cart & Billing Terminal */}
        <div id="pos-cart-panel" className="col-12 col-lg-5 col-xl-4">
          <PosCart
            items={cartItems}
            customers={SAMPLE_CUSTOMERS}
            tables={tables}
            features={currentRestaurant.features}
            initialTable={initialTableParam}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onPrintPreview={() => {
              if (cartItems.length > 0) {
                const tempOrder: Order = {
                  id: 'temp-1',
                  orderNumber: 'PREVIEW-8921',
                  restaurantId: currentRestaurant.id,
                  branchId: currentBranch?.id || 'branch-1',
                  branchName: currentBranch?.name || 'Main Branch',
                  customerName: 'Walk-in Customer',
                  customerPhone: '+91 98765 43210',
                  orderType: 'Dine In',
                  tableNumber: initialTableParam || tables[0]?.number || 'T-01',
                  items: cartItems.map(c => ({
                    id: c.id,
                    menuItemId: c.menuItemId,
                    name: c.name,
                    price: c.price,
                    quantity: c.quantity,
                    isVeg: c.isVeg,
                    total: c.price * c.quantity,
                  })),
                  subtotal: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
                  discount: 0,
                  taxGst: +(cartItems.reduce((s, i) => s + i.price * i.quantity, 0) * 0.05).toFixed(2),
                  serviceCharge: 0,
                  packagingCharge: 0,
                  grandTotal: +(cartItems.reduce((s, i) => s + i.price * i.quantity, 0) * 1.05).toFixed(2),
                  paymentMethod: 'UPI',
                  paymentStatus: 'Paid',
                  orderStatus: 'Preparing',
                  createdAt: new Date().toISOString(),
                };
                setLatestOrder(tempOrder);
                setIsReceiptOpen(true);
              }
            }}
          />
        </div>
      </div>

      {/* Variant & Modifier Modal */}
      <PosVariantModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        item={customizingItem}
        onConfirm={handleAddCustomizedItem}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={latestOrder}
      />

      {/* Held Orders Modal */}
      {isHeldModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Held Bills Queue ({heldOrders.length})</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsHeldModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                {heldOrders.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    No orders currently on hold.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Held Time</th>
                          <th>Reference / Notes</th>
                          <th>Items Count</th>
                          <th className="text-end">Cart Total</th>
                          <th className="text-end pe-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        {heldOrders.map((h) => (
                          <tr key={h.id}>
                            <td className="fw-semibold text-dark">{h.heldAt}</td>
                            <td>{h.label}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {h.items.length} dishes
                              </span>
                            </td>
                            <td className="text-end fw-bold text-primary">₹{h.total}</td>
                            <td className="text-end pe-3">
                              <button
                                className="btn btn-sm btn-primary px-3 py-1 me-1"
                                onClick={() => handleRecallOrder(h.id)}
                              >
                                Recall to POS
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger px-2 py-1"
                                onClick={() => setHeldOrders(heldOrders.filter((it) => it.id !== h.id))}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsHeldModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Bill Modal */}
      {isSplitModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Split Dining Bill</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsSplitModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center p-3 bg-light rounded-3 mb-3">
                  <div className="text-muted small">Total Bill to Split</div>
                  <div className="display-6 fw-bold text-dark">
                    ₹{Math.round(cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0) * 1.05)}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Number of Ways to Split *</label>
                  <div className="btn-group w-100" role="group">
                    {[2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`btn btn-sm ${
                          splitCount === num ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setSplitCount(num)}
                      >
                        {num} Diners
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 border rounded-3 mb-3 bg-white text-center">
                  <span className="text-muted small">Equal Share per Guest:</span>
                  <div className="h3 fw-bold text-success mb-0">
                    ₹{Math.round(
                      (cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0) * 1.05) / splitCount
                    )}{' '}
                    <span className="fs-6 text-muted font-normal">/ person</span>
                  </div>
                </div>

                <div className="alert alert-light border small text-muted mb-0">
                  Cashier can accept multiple partial payments (e.g. Guest 1 pays via UPI, Guest 2 pays via Cash) and generate individual split receipts.
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsSplitModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm px-3"
                  onClick={() => {
                    alert(`Split bill generated for ${splitCount} guests! Individual payment prompts opened.`);
                    setIsSplitModalOpen(false);
                  }}
                >
                  Generate {splitCount} Split Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {isShortcutsOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">⌨️ POS Cashier Keyboard Shortcuts</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsShortcutsOpen(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="list-group list-group-flush small">
                  <div className="list-group-item d-flex justify-content-between px-0 py-2">
                    <kbd className="bg-dark text-white px-2 py-1">F1</kbd>
                    <span className="text-dark fw-medium">Open Shortcuts Help</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-0 py-2">
                    <kbd className="bg-dark text-white px-2 py-1">F2</kbd>
                    <span className="text-dark fw-medium">Jump Focus to Dish Search Bar</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-0 py-2">
                    <kbd className="bg-dark text-white px-2 py-1">F4</kbd>
                    <span className="text-dark fw-medium">Instant Cash Quick Pay</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-0 py-2">
                    <kbd className="bg-dark text-white px-2 py-1">F8</kbd>
                    <span className="text-dark fw-medium">Hold Current Cart Order</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-0 py-2">
                    <kbd className="bg-dark text-white px-2 py-1">F9</kbd>
                    <span className="text-dark fw-medium">Open Split Bill Calculator</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between px-0 py-2">
                    <kbd className="bg-dark text-white px-2 py-1">Esc</kbd>
                    <span className="text-dark fw-medium">Close Modal / Clear Search</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsShortcutsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Floating Cart Jump Bar */}
      {cartItems.length > 0 && (
        <div className="d-lg-none position-fixed bottom-0 start-0 end-0 p-3 bg-white border-top shadow-lg" style={{ zIndex: 1025 }}>
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div>
              <span className="badge bg-brand text-white rounded-pill me-1">{cartItems.reduce((s, i) => s + i.quantity, 0)} Items</span>
              <strong className="text-navy">₹{cartItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</strong>
            </div>
            <button
              type="button"
              className="btn btn-brand btn-sm text-white fw-bold px-3 py-1.5 shadow-sm"
              onClick={() => {
                document.getElementById('pos-cart-panel')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Cart & Checkout &darr;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function PosBillingPage() {
  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      <Suspense fallback={<div className="p-4 text-center">Loading POS terminal...</div>}>
        <PosBillingContent />
      </Suspense>
    </DashboardLayout>
  );
}
