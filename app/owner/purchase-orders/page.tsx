'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_SUPPLIERS } from '@/data/saasData';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiCart,
  BiPlus,
  BiCheckCircle,
  BiTimeFive,
  BiFile,
  BiSearch,
  BiDownload,
  BiPackage,
  BiCheckDouble,
  BiXCircle,
} from 'react-icons/bi';

interface PurchaseOrderItem {
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  branchName: string;
  createdAt: string;
  expectedDelivery: string;
  status: 'Draft' | 'Sent' | 'Partially Received' | 'Fully Received' | 'Cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  paymentTerms: string;
  notes?: string;
}

const INITIAL_POS: PurchaseOrderRecord[] = [
  {
    id: 'po-1',
    poNumber: 'PO-202611-001',
    supplierId: 'sup-1',
    supplierName: 'Dairy Fresh Farms',
    branchName: 'Indiranagar Branch',
    createdAt: '2026-11-15',
    expectedDelivery: '2026-11-17',
    status: 'Sent',
    paymentTerms: 'Net 15 Days',
    totalAmount: 18500,
    gstAmount: 925,
    grandTotal: 19425,
    items: [
      { itemName: 'Fresh Malai Paneer', quantity: 30, unit: 'kg', unitPrice: 340, totalPrice: 10200 },
      { itemName: 'Full Cream Milk', quantity: 80, unit: 'litres', unitPrice: 65, totalPrice: 5200 },
      { itemName: 'Amul Table Butter', quantity: 6, unit: 'kg', unitPrice: 516, totalPrice: 3100 },
    ],
  },
  {
    id: 'po-2',
    poNumber: 'PO-202611-002',
    supplierId: 'sup-2',
    supplierName: 'Green Valley Fresh Produce',
    branchName: 'Indiranagar Branch',
    createdAt: '2026-11-14',
    expectedDelivery: '2026-11-15',
    status: 'Fully Received',
    paymentTerms: 'Immediate UPI',
    totalAmount: 9400,
    gstAmount: 0,
    grandTotal: 9400,
    items: [
      { itemName: 'Hybrid Tomatoes', quantity: 50, unit: 'kg', unitPrice: 42, totalPrice: 2100 },
      { itemName: 'Red Onions (Nashik)', quantity: 80, unit: 'kg', unitPrice: 45, totalPrice: 3600 },
      { itemName: 'Fresh Garlic & Ginger', quantity: 15, unit: 'kg', unitPrice: 246, totalPrice: 3700 },
    ],
  },
  {
    id: 'po-3',
    poNumber: 'PO-202611-003',
    supplierId: 'sup-3',
    supplierName: 'Coastal Poultry & Meats',
    branchName: 'Indiranagar Branch',
    createdAt: '2026-11-16',
    expectedDelivery: '2026-11-18',
    status: 'Draft',
    paymentTerms: 'Net 7 Days',
    totalAmount: 24800,
    gstAmount: 1240,
    grandTotal: 26040,
    items: [
      { itemName: 'Tender Fresh Chicken Curry Cut', quantity: 70, unit: 'kg', unitPrice: 220, totalPrice: 15400 },
      { itemName: 'Boneless Chicken Breast Fillet', quantity: 30, unit: 'kg', unitPrice: 280, totalPrice: 8400 },
      { itemName: 'Fresh Farm Eggs (Tray of 30)', quantity: 5, unit: 'trays', unitPrice: 200, totalPrice: 1000 },
    ],
  },
  {
    id: 'po-4',
    poNumber: 'PO-202611-004',
    supplierId: 'sup-4',
    supplierName: 'Spice Route Exporters',
    branchName: 'Koramangala Branch',
    createdAt: '2026-11-12',
    expectedDelivery: '2026-11-14',
    status: 'Partially Received',
    paymentTerms: 'Advance 50%',
    totalAmount: 14500,
    gstAmount: 725,
    grandTotal: 15225,
    items: [
      { itemName: 'Kashmiri Saffron (Grade A)', quantity: 0.05, unit: 'kg', unitPrice: 150000, totalPrice: 7500 },
      { itemName: 'Green Cardamom (8mm Bold)', quantity: 2, unit: 'kg', unitPrice: 2200, totalPrice: 4400 },
      { itemName: 'Cinnamon Sticks & Star Anise', quantity: 3, unit: 'kg', unitPrice: 866, totalPrice: 2600 },
    ],
  },
];

export default function BusinessOwnerPurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_POS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New PO form
  const [supplierName, setSupplierName] = useState(SAMPLE_SUPPLIERS[0]?.name || 'Dairy Fresh Farms');
  const [branchName, setBranchName] = useState('Indiranagar Branch');
  const [expectedDate, setExpectedDate] = useState('2026-11-20');
  const [paymentTerms, setPaymentTerms] = useState('Net 15 Days');
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([
    { itemName: 'Fresh Raw Material', quantity: 10, unit: 'kg', unitPrice: 150, totalPrice: 1500 },
  ]);

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchSearch =
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.branchName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || po.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [purchaseOrders, searchTerm, statusFilter]);

  const openPOCount = useMemo(
    () => purchaseOrders.filter((po) => po.status === 'Sent' || po.status === 'Draft' || po.status === 'Partially Received').length,
    [purchaseOrders]
  );

  const totalSpend = useMemo(
    () => purchaseOrders.filter((po) => po.status !== 'Cancelled').reduce((acc, po) => acc + po.grandTotal, 0),
    [purchaseOrders]
  );

  const handleUpdateItem = (idx: number, field: keyof PurchaseOrderItem, val: any) => {
    setPoItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = Number(copy[idx].quantity) || 0;
        const price = Number(copy[idx].unitPrice) || 0;
        copy[idx].totalPrice = qty * price;
      }
      return copy;
    });
  };

  const handleAddItemRow = () => {
    setPoItems((prev) => [
      ...prev,
      { itemName: '', quantity: 5, unit: 'kg', unitPrice: 100, totalPrice: 500 },
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (poItems.length > 1) {
      setPoItems((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const rawTotal = poItems.reduce((acc, it) => acc + it.totalPrice, 0);
    const gst = Math.round(rawTotal * 0.05);

    const newPO: PurchaseOrderRecord = {
      id: `po-${Date.now()}`,
      poNumber: `PO-202611-00${purchaseOrders.length + 1}`,
      supplierId: 'sup-gen',
      supplierName,
      branchName,
      createdAt: new Date().toISOString().split('T')[0],
      expectedDelivery: expectedDate,
      status: 'Sent',
      paymentTerms,
      items: poItems,
      totalAmount: rawTotal,
      gstAmount: gst,
      grandTotal: rawTotal + gst,
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setShowAddModal(false);
  };

  const handleMarkGRNReceived = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === poId ? { ...po, status: 'Fully Received' } : po
      )
    );
    if (selectedPO?.id === poId) {
      setSelectedPO({ ...selectedPO, status: 'Fully Received' });
    }
    alert('GRN (Goods Received Note) generated! Stock levels in Inventory have been updated automatically.');
  };

  const getStatusBadge = (status: PurchaseOrderRecord['status']) => {
    switch (status) {
      case 'Fully Received':
        return <span className="badge bg-success-subtle text-success border border-success-subtle"><BiCheckCircle className="me-1" />Fully Received</span>;
      case 'Partially Received':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><BiPackage className="me-1" />Partially Received</span>;
      case 'Sent':
        return <span className="badge bg-info-subtle text-info border border-info-subtle"><BiTimeFive className="me-1" />Sent to Vendor</span>;
      case 'Draft':
        return <span className="badge bg-secondary-subtle text-dark border"><BiFile className="me-1" />Draft</span>;
      case 'Cancelled':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle"><BiXCircle className="me-1" />Cancelled</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'accountant']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Purchase Orders & GRN Receiving</h1>
            <p className="text-muted small mb-0">
              Procure raw materials from certified vendors, generate purchase orders, and verify Goods Received Notes (GRN).
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <BiPlus size={18} /> Raise Purchase Order
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Open Purchase Orders</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiCart size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">{openPOCount} Orders</h3>
              <span className="text-muted small">Awaiting delivery & inspection</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Total Monthly Procurement</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiPackage size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalSpend)}</h3>
              <span className="text-success small fw-medium">Budget within 32% food cost limit</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">GRN Delivery Accuracy</span>
                <span className="p-2 rounded bg-info-subtle text-info">
                  <BiCheckDouble size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">98.2%</h3>
              <span className="text-muted small">Weighment & invoice matching</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by PO number, supplier, or branch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
                {['All', 'Sent', 'Partially Received', 'Fully Received', 'Draft'].map((status) => (
                  <button
                    key={status}
                    className={`btn btn-sm ${
                      statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PO Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="ps-3 py-3">PO Number</th>
                    <th>Supplier Vendor</th>
                    <th>Branch</th>
                    <th>Order Date</th>
                    <th>Expected Date</th>
                    <th>Items Count</th>
                    <th>Grand Total</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredPOs.map((po) => (
                    <tr key={po.id}>
                      <td className="ps-3 fw-bold text-dark font-monospace">{po.poNumber}</td>
                      <td>
                        <div className="fw-semibold text-dark">{po.supplierName}</div>
                        <div className="text-muted small">{po.paymentTerms}</div>
                      </td>
                      <td>{po.branchName}</td>
                      <td>{po.createdAt}</td>
                      <td>{po.expectedDelivery}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {po.items.length} items
                        </span>
                      </td>
                      <td className="fw-bold text-dark" suppressHydrationWarning>
                        ₹{formatNumber(po.grandTotal)}
                      </td>
                      <td>{getStatusBadge(po.status)}</td>
                      <td className="text-end pe-3">
                        <button
                          className="btn btn-outline-primary btn-sm px-2 py-1"
                          onClick={() => setSelectedPO(po)}
                        >
                          View / GRN
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail / GRN Modal */}
        {selectedPO && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Purchase Order: {selectedPO.poNumber}</h5>
                    <div className="text-muted small">Vendor: {selectedPO.supplierName} | Destination: {selectedPO.branchName}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedPO(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="text-muted small me-2">Delivery SLA:</span>
                      <span className="fw-semibold text-dark">{selectedPO.expectedDelivery}</span>
                    </div>
                    <div>{getStatusBadge(selectedPO.status)}</div>
                  </div>

                  <div className="table-responsive border rounded mb-3">
                    <table className="table table-sm align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Item Description</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-center">Unit</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        {selectedPO.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold text-dark">{it.itemName}</td>
                            <td className="text-center">{it.quantity}</td>
                            <td className="text-center">{it.unit}</td>
                            <td className="text-end" suppressHydrationWarning>₹{formatCurrency(it.unitPrice)}</td>
                            <td className="text-end fw-bold" suppressHydrationWarning>₹{formatNumber(it.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light small">
                        <tr>
                          <td colSpan={4} className="text-end text-muted">Subtotal:</td>
                          <td className="text-end fw-semibold" suppressHydrationWarning>₹{formatNumber(selectedPO.totalAmount)}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-end text-muted">Applicable GST:</td>
                          <td className="text-end" suppressHydrationWarning>₹{formatNumber(selectedPO.gstAmount)}</td>
                        </tr>
                        <tr className="fw-bold">
                          <td colSpan={4} className="text-end text-dark">Invoice Grand Total:</td>
                          <td className="text-end text-primary" suppressHydrationWarning>₹{formatNumber(selectedPO.grandTotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {selectedPO.status !== 'Fully Received' && (
                    <div className="alert alert-warning border small d-flex justify-content-between align-items-center mb-0">
                      <div>
                        <strong>Inward Inspection:</strong> Have items arrived at the loading dock? Verify weights and quality before creating Goods Received Note.
                      </div>
                      <button
                        className="btn btn-success btn-sm flex-shrink-0 ms-3 d-flex align-items-center gap-1"
                        onClick={() => handleMarkGRNReceived(selectedPO.id)}
                      >
                        <BiCheckCircle /> Inward GRN & Update Stock
                      </button>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedPO(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => alert(`Downloading PDF PO ${selectedPO.poNumber}...`)}
                  >
                    <BiDownload className="me-1" /> Download PDF PO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create PO */}
        {showAddModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleCreatePO}>
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold">Create New Purchase Order (PO)</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Select Vendor *</label>
                        <select
                          className="form-select form-select-sm"
                          value={supplierName}
                          onChange={(e) => setSupplierName(e.target.value)}
                        >
                          {SAMPLE_SUPPLIERS.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name} ({s.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Destination Branch *</label>
                        <select
                          className="form-select form-select-sm"
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                        >
                          <option value="Indiranagar Branch">Indiranagar Branch</option>
                          <option value="Koramangala Branch">Koramangala Branch</option>
                          <option value="Whitefield Central Commissary">Whitefield Central Commissary</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Expected Delivery Date *</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={expectedDate}
                          onChange={(e) => setExpectedDate(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold">Payment Terms</label>
                        <select
                          className="form-select form-select-sm"
                          value={paymentTerms}
                          onChange={(e) => setPaymentTerms(e.target.value)}
                        >
                          <option value="Net 15 Days">Net 15 Days</option>
                          <option value="Net 30 Days">Net 30 Days</option>
                          <option value="Immediate UPI">Immediate UPI</option>
                          <option value="50% Advance">50% Advance</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-top pt-3 mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold small text-dark mb-0">Raw Material Line Items</h6>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm py-0 px-2"
                          onClick={handleAddItemRow}
                        >
                          <BiPlus /> Add Item Row
                        </button>
                      </div>

                      {poItems.map((it, idx) => (
                        <div key={idx} className="row g-2 align-items-center mb-2">
                          <div className="col-5">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Item name (e.g. Basmati Rice)"
                              required
                              value={it.itemName}
                              onChange={(e) => handleUpdateItem(idx, 'itemName', e.target.value)}
                            />
                          </div>
                          <div className="col-2">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              placeholder="Qty"
                              min={1}
                              required
                              value={it.quantity}
                              onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                            />
                          </div>
                          <div className="col-2">
                            <select
                              className="form-select form-select-sm"
                              value={it.unit}
                              onChange={(e) => handleUpdateItem(idx, 'unit', e.target.value)}
                            >
                              <option value="kg">kg</option>
                              <option value="litres">litres</option>
                              <option value="pcs">pcs</option>
                              <option value="packets">packets</option>
                              <option value="trays">trays</option>
                            </select>
                          </div>
                          <div className="col-2">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              placeholder="₹/Unit"
                              min={1}
                              required
                              value={it.unitPrice}
                              onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                            />
                          </div>
                          <div className="col-1 text-center">
                            <button
                              type="button"
                              className="btn btn-sm text-danger p-0"
                              onClick={() => handleRemoveItemRow(idx)}
                            >
                              <BiXCircle size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Dispatch PO to Vendor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
