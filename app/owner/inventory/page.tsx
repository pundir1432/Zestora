'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SAMPLE_STOCK_MOVEMENTS, SAMPLE_PURCHASE_ORDERS } from '@/data/inventoryData';
import { useAuth } from '@/context/AuthContext';
import { InventoryItem, StockMovement, PurchaseOrder } from '@/types/inventory';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatNumber } from '@/utils/formatters';
import { inventoryService } from '@/services';
import { 
  BiPackage, 
  BiPlus, 
  BiMinus, 
  BiSearch, 
  BiErrorCircle, 
  BiTrendingUp, 
  BiHistory, 
  BiCheckCircle,
  BiCalendar,
  BiShoppingBag,
  BiReceipt,
  BiDetail
} from 'react-icons/bi';

export default function InventoryPage() {
  const { inventory, recentDeductions } = useAuth();
  const campGear = inventoryService.getCampGearInventory();
  const [activeTab, setActiveTab] = useState<'stock' | 'camp_gear' | 'po' | 'deductions' | 'ledger' | 'expiry'>('stock');
  const [movements, setMovements] = useState<StockMovement[]>(SAMPLE_STOCK_MOVEMENTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(SAMPLE_PURCHASE_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [isNewPoOpen, setIsNewPoOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form states
  const [stockQty, setStockQty] = useState<number>(10);
  const [stockReason, setStockReason] = useState<string>('Supplier delivery received');

  // New PO Form state
  const [poSupplier, setPoSupplier] = useState('Nandini Dairy Cooperative');
  const [poExpectedDate, setPoExpectedDate] = useState('2026-11-20');
  const [poItemName, setPoItemName] = useState('Fresh Malai Paneer');
  const [poItemQty, setPoItemQty] = useState(25);
  const [poNotes, setPoNotes] = useState('Standard morning replenishment');

  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStockLevel);
  const totalValuation = inventory.reduce((sum, i) => sum + i.currentStock * i.purchasePrice, 0);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const handleOpenStockIn = (item: InventoryItem) => {
    setSelectedItem(item);
    setStockQty(10);
    setStockReason('Supplier morning replenishment batch');
    setIsStockInOpen(true);
  };

  const handleSaveStockIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newMov: StockMovement = {
      id: `sm-${Date.now()}`,
      inventoryItemId: selectedItem.id,
      itemName: selectedItem.name,
      type: 'Stock In',
      quantity: Number(stockQty),
      unit: selectedItem.unit,
      reason: stockReason,
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      recordedBy: 'Kavita Reddy',
    };
    setMovements([newMov, ...movements]);
    setIsStockInOpen(false);
  };

  const handleOpenStockOut = (item: InventoryItem) => {
    setSelectedItem(item);
    setStockQty(5);
    setStockReason('Issued to kitchen for daily cooking');
    setIsStockOutOpen(true);
  };

  const handleSaveStockOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newMov: StockMovement = {
      id: `sm-${Date.now()}`,
      inventoryItemId: selectedItem.id,
      itemName: selectedItem.name,
      type: 'Stock Out',
      quantity: Number(stockQty),
      unit: selectedItem.unit,
      reason: stockReason,
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      recordedBy: 'Chef Harpreet Singh',
    };
    setMovements([newMov, ...movements]);
    setIsStockOutOpen(false);
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierName: poSupplier,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: poExpectedDate,
      totalAmount: poItemQty * 250,
      items: [
        {
          inventoryItemId: 'inv-1',
          name: poItemName,
          quantity: poItemQty,
          unit: 'kg',
          costPerUnit: 250,
          totalCost: poItemQty * 250,
        }
      ],
      notes: poNotes,
    };
    setPurchaseOrders([newPO, ...purchaseOrders]);
    setIsNewPoOpen(false);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-navy mb-1">Inventory & Supply Chain</h4>
          <p className="text-muted-custom small mb-0">
            Real-time raw material stock, recipe auto-deduction logs, purchase orders, and perishable expiry tracking
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-soft-brand py-2 px-3 rounded-pill fw-semibold" suppressHydrationWarning>
            Stock Valuation: ₹{formatNumber(totalValuation)}
          </span>
          <button
            type="button"
            className="btn btn-brand btn-sm d-flex align-items-center gap-1 shadow-sm text-white"
            onClick={() => setIsNewPoOpen(true)}
          >
            <BiPlus size={16} />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Alert */}
      {lowStockItems.length > 0 && (
        <div className="alert alert-danger border-danger border-opacity-25 d-flex align-items-center justify-content-between mb-4 rounded-3 p-3">
          <div className="d-flex align-items-center gap-2">
            <BiErrorCircle size={24} className="text-danger flex-shrink-0" />
            <div>
              <strong className="text-navy">{lowStockItems.length} Raw Ingredients Below Reorder Threshold!</strong>
              <div className="small text-muted-custom">
                {lowStockItems.map(i => `${i.name} (${i.currentStock} ${i.unit} left)`).join(' • ')}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => setActiveTab('po')}
          >
            Draft Restock Orders
          </button>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="card border-0 shadow-sm rounded-3 p-2 mb-4 bg-white">
        <div className="d-flex align-items-center gap-2 overflow-x-auto">
          <button
            type="button"
            className={`btn btn-sm text-nowrap rounded-pill px-3 ${
              activeTab === 'stock' ? 'btn-brand text-white fw-bold shadow-sm' : 'btn-light text-navy'
            }`}
            onClick={() => setActiveTab('stock')}
          >
            Raw Materials Stock ({inventory.length})
          </button>

          <button
            type="button"
            className={`btn btn-sm text-nowrap rounded-pill px-3 ${
              activeTab === 'camp_gear' ? 'btn-brand text-white fw-bold shadow-sm' : 'btn-light text-navy'
            }`}
            onClick={() => setActiveTab('camp_gear')}
          >
            Camp &amp; Adventure Gear ({campGear.length})
          </button>

          <button
            type="button"
            className={`btn btn-sm text-nowrap rounded-pill px-3 ${
              activeTab === 'po' ? 'btn-brand text-white fw-bold shadow-sm' : 'btn-light text-navy'
            }`}
            onClick={() => setActiveTab('po')}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>

          <button
            type="button"
            className={`btn btn-sm text-nowrap rounded-pill px-3 ${
              activeTab === 'deductions' ? 'btn-brand text-white fw-bold shadow-sm' : 'btn-light text-navy'
            }`}
            onClick={() => setActiveTab('deductions')}
          >
            Recipe Auto-Deduction Log ({recentDeductions.length})
          </button>

          <button
            type="button"
            className={`btn btn-sm text-nowrap rounded-pill px-3 ${
              activeTab === 'expiry' ? 'btn-brand text-white fw-bold shadow-sm' : 'btn-light text-navy'
            }`}
            onClick={() => setActiveTab('expiry')}
          >
            Perishable Expiry Tracker
          </button>

          <button
            type="button"
            className={`btn btn-sm text-nowrap rounded-pill px-3 ${
              activeTab === 'ledger' ? 'btn-brand text-white fw-bold shadow-sm' : 'btn-light text-navy'
            }`}
            onClick={() => setActiveTab('ledger')}
          >
            Stock Movement Ledger
          </button>
        </div>
      </div>

      {/* TAB: CAMP & ADVENTURE GEAR STOCK */}
      {activeTab === 'camp_gear' && (
        <div className="app-card overflow-hidden mb-4">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h6 className="fw-bold text-navy mb-0">Camp, Rafting &amp; Trekking Gear Inventory</h6>
              <span className="text-muted-custom small">Shivpuri Rapids Eco Camp &amp; Tapovan Trek Store</span>
            </div>
            <span className="badge badge-soft-brand">Live Safety Audit</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr className="text-muted-custom">
                  <th>Gear / Equipment</th>
                  <th>Category</th>
                  <th className="text-center">Total Units</th>
                  <th className="text-center">In Use</th>
                  <th className="text-center">Damaged</th>
                  <th className="text-center">Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {campGear.map(item => {
                  const avail = item.totalUnits - item.inUseUnits - item.damagedUnits;
                  const isLow = avail < item.minAlertUnits;
                  return (
                    <tr key={item.id}>
                      <td className="fw-bold text-navy">{item.name}</td>
                      <td><span className="badge bg-light text-navy border">{item.category}</span></td>
                      <td className="text-center fw-semibold">{item.totalUnits}</td>
                      <td className="text-center text-primary fw-semibold">{item.inUseUnits}</td>
                      <td className="text-center text-danger fw-semibold">{item.damagedUnits}</td>
                      <td className="text-center fw-bold text-navy">{avail}</td>
                      <td>
                        <span className={`badge rounded-pill ${isLow ? 'badge-soft-danger' : 'badge-soft-success'}`}>
                          {isLow ? 'Low Buffer Alert' : 'Healthy Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1: RAW MATERIALS STOCK */}
      {activeTab === 'stock' && (
        <>
          {/* Filter and Search Bar */}
          <div className="app-card p-3 mb-4 bg-white">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6 col-lg-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-surface border-subtle text-muted">
                    <BiSearch size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-subtle"
                    placeholder="Search raw ingredient, supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4 ms-auto">
                <div className="d-flex align-items-center justify-content-md-end gap-2">
                  <span className="text-muted-custom small fw-semibold">Category:</span>
                  <select
                    className="form-select form-select-sm border-subtle w-auto"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains & Flour">Grains & Flour</option>
                    <option value="Spices & Oils">Spices & Oils</option>
                    <option value="Beverages & Syrups">Beverages & Syrups</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="app-card overflow-hidden mb-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted-custom">
                    <th>Ingredient Name</th>
                    <th>Category</th>
                    <th className="text-center">Current Stock</th>
                    <th className="text-center">Min. Reorder Level</th>
                    <th className="text-end">Unit Price</th>
                    <th>Preferred Supplier</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th className="text-end">Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold text-navy">{item.name}</div>
                        <div className="text-muted-custom font-monospace" style={{ fontSize: '11px' }}>Batch: {item.batchNumber}</div>
                      </td>
                      <td className="small">{item.category}</td>
                      <td className="text-center fw-bold fs-6">
                        <span className={item.currentStock <= item.minStockLevel ? 'text-danger' : 'text-navy'}>
                          {item.currentStock} {item.unit}
                        </span>
                      </td>
                      <td className="text-center small text-muted-custom">{item.minStockLevel} {item.unit}</td>
                      <td className="text-end fw-semibold text-navy small">₹{item.purchasePrice} / {item.unit}</td>
                      <td className="small">
                        <div>{item.supplierName}</div>
                        <div className="text-muted-custom" style={{ fontSize: '11px' }}>{item.supplierContact}</div>
                      </td>
                      <td className="small text-muted-custom">{item.expiryDate || 'N/A'}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-success p-1 px-2 d-flex align-items-center gap-1"
                            onClick={() => handleOpenStockIn(item)}
                            title="Stock In (Receipt)"
                          >
                            <BiPlus size={14} /> In
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger p-1 px-2 d-flex align-items-center gap-1"
                            onClick={() => handleOpenStockOut(item)}
                            title="Stock Out (Kitchen Issue / Wastage)"
                          >
                            <BiMinus size={14} /> Out
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: PURCHASE ORDERS */}
      {activeTab === 'po' && (
        <div className="app-card overflow-hidden mb-4">
          <div className="p-3 border-bottom border-subtle bg-surface d-flex align-items-center justify-content-between">
            <h6 className="fw-bold text-navy mb-0">Supplier Purchase Orders</h6>
            <button
              type="button"
              className="btn btn-brand btn-sm text-white"
              onClick={() => setIsNewPoOpen(true)}
            >
              + Create PO
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Order Date</th>
                  <th>Expected Delivery</th>
                  <th>Items Ordered</th>
                  <th className="text-end">Total Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po.id}>
                    <td className="fw-bold text-brand small">{po.poNumber}</td>
                    <td className="fw-semibold text-navy small">{po.supplierName}</td>
                    <td className="small text-muted-custom">{po.createdAt || po.orderDate}</td>
                    <td className="small text-navy">{po.expectedDeliveryDate}</td>
                    <td className="small">
                      {po.items.map(i => `${i.quantity}${i.unit} ${i.name || i.itemName}`).join(', ')}
                    </td>
                    <td className="text-end fw-bold text-navy small" suppressHydrationWarning>₹{formatNumber(po.totalAmount)}</td>
                    <td>
                      <span className={`badge ${
                        po.status === 'Received' ? 'badge-soft-success' :
                        po.status === 'Shipped' ? 'badge-soft-info' : 'badge-soft-warning'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RECIPE AUTO-DEDUCTION LOG */}
      {activeTab === 'deductions' && (
        <div className="app-card overflow-hidden mb-4">
          <div className="p-3 border-bottom border-subtle bg-surface">
            <h6 className="fw-bold text-navy mb-1">Live Recipe Auto-Deductions</h6>
            <p className="text-muted-custom small mb-0">
              Every dish punched at the POS terminal automatically consumes raw ingredient stock based on mapped recipe proportions.
            </p>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Time</th>
                  <th>Order Ref</th>
                  <th>Auto-Deduction Summary</th>
                  <th>Dishes Cooked</th>
                </tr>
              </thead>
              <tbody>
                {recentDeductions.map((d) => (
                  <tr key={d.id}>
                    <td className="small text-muted-custom">{d.timestamp}</td>
                    <td className="fw-bold text-brand small">{d.orderNumber || 'POS Ticket'}</td>
                    <td className="small text-navy fw-medium">{d.details}</td>
                    <td className="small text-muted-custom">{d.itemsCount} Items</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PERISHABLE EXPIRY TRACKER */}
      {activeTab === 'expiry' && (
        <div className="app-card overflow-hidden mb-4">
          <div className="p-3 border-bottom border-subtle bg-surface">
            <h6 className="fw-bold text-navy mb-1">Perishable Shelf-Life & Expiry Calendar</h6>
            <p className="text-muted-custom small mb-0">
              Monitor fresh produce, dairy, bakery fillings, and meat batches to minimize kitchen wastage.
            </p>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Raw Ingredient</th>
                  <th>Category</th>
                  <th>Batch #</th>
                  <th>Current Stock</th>
                  <th>Expiry Date</th>
                  <th>Urgency Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory
                  .filter(i => !!i.expiryDate)
                  .sort((a, b) => (a.expiryDate || '').localeCompare(b.expiryDate || ''))
                  .map(item => (
                    <tr key={item.id}>
                      <td className="fw-semibold text-navy small">{item.name}</td>
                      <td className="small">{item.category}</td>
                      <td className="font-monospace small text-muted-custom">{item.batchNumber}</td>
                      <td className="fw-bold text-navy small">{item.currentStock} {item.unit}</td>
                      <td className="fw-bold small text-navy">{item.expiryDate}</td>
                      <td>
                        <span className="badge badge-soft-warning">Fresh Stock</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: STOCK MOVEMENTS LEDGER */}
      {activeTab === 'ledger' && (
        <div className="app-card overflow-hidden mb-4">
          <div className="p-3 border-bottom border-subtle bg-surface d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <BiHistory className="text-brand" size={18} />
              <h6 className="fw-bold text-navy mb-0">Stock In / Stock Out Ledger</h6>
            </div>
            <span className="badge bg-light text-navy border">Audit Trail</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted-custom">
                  <th>Date & Time</th>
                  <th>Ingredient Item</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason / Operational Note</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((mov) => (
                  <tr key={mov.id}>
                    <td className="small text-muted-custom">{mov.date}</td>
                    <td className="fw-semibold text-navy small">{mov.itemName}</td>
                    <td>
                      <span className={`badge ${
                        mov.type === 'Stock In' ? 'badge-soft-success' :
                        mov.type === 'Wastage' ? 'badge-soft-danger' : 'badge-soft-info'
                      }`}>
                        {mov.type}
                      </span>
                    </td>
                    <td className="fw-bold small">{mov.quantity} {mov.unit}</td>
                    <td className="small text-muted-custom">{mov.reason}</td>
                    <td className="small">{mov.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Purchase Order */}
      <Modal
        isOpen={isNewPoOpen}
        onClose={() => setIsNewPoOpen(false)}
        title="Create New Supplier Purchase Order"
        size="md"
      >
        <form onSubmit={handleCreatePo}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Select Supplier</label>
            <select
              className="form-select"
              value={poSupplier}
              onChange={(e) => setPoSupplier(e.target.value)}
            >
              <option value="Nandini Dairy Cooperative">Nandini Dairy Cooperative</option>
              <option value="Amul Dairy Supplies">Amul Dairy Supplies</option>
              <option value="Suguna Poultry Farm">Suguna Poultry Farm</option>
              <option value="Sri Balaji Wholesale Traders">Sri Balaji Wholesale Traders</option>
              <option value="Fortune Agro Foods">Fortune Agro Foods</option>
            </select>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-8">
              <label className="form-label small fw-semibold text-navy">Item to Restock</label>
              <input
                type="text"
                className="form-control"
                value={poItemName}
                onChange={(e) => setPoItemName(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold text-navy">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={poItemQty}
                onChange={(e) => setPoItemQty(Number(e.target.value))}
                min={1}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Expected Delivery Date</label>
            <input
              type="date"
              className="form-control"
              value={poExpectedDate}
              onChange={(e) => setPoExpectedDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Delivery Instructions / Notes</label>
            <textarea
              className="form-control"
              rows={2}
              value={poNotes}
              onChange={(e) => setPoNotes(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setIsNewPoOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand text-white">
              Dispatch Purchase Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Stock In */}
      <Modal
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        title="Record Stock In (Replenish)"
        subtitle={selectedItem ? `${selectedItem.name} (${selectedItem.unit})` : ''}
        size="sm"
      >
        <form onSubmit={handleSaveStockIn}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Quantity to Add ({selectedItem?.unit})</label>
            <input
              type="number"
              className="form-control form-control-sm border-subtle"
              value={stockQty}
              onChange={(e) => setStockQty(Number(e.target.value))}
              min={1}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Invoice / Delivery Reason</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              value={stockReason}
              onChange={(e) => setStockReason(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsStockInOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-brand btn-sm text-white">
              Confirm Stock In
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Stock Out */}
      <Modal
        isOpen={isStockOutOpen}
        onClose={() => setIsStockOutOpen(false)}
        title="Record Stock Out / Wastage"
        subtitle={selectedItem ? `${selectedItem.name} (${selectedItem.unit})` : ''}
        size="sm"
      >
        <form onSubmit={handleSaveStockOut}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-navy">Quantity to Deduct ({selectedItem?.unit})</label>
            <input
              type="number"
              className="form-control form-control-sm border-subtle"
              value={stockQty}
              onChange={(e) => setStockQty(Number(e.target.value))}
              min={1}
              max={selectedItem?.currentStock || 100}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-navy">Purpose / Kitchen Reason</label>
            <input
              type="text"
              className="form-control form-control-sm border-subtle"
              value={stockReason}
              onChange={(e) => setStockReason(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsStockOutOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger btn-sm">
              Confirm Deduction
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
