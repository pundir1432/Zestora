'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/common/Modal';
import { SAMPLE_FLOORS } from '@/data/restaurantData';
import { RestaurantTable, Floor } from '@/types/restaurant';
import { 
  BiPlus, 
  BiFilterAlt, 
  BiTransferAlt, 
  BiMerge, 
  BiCheckCircle, 
  BiTime, 
  BiUser, 
  BiRupee, 
  BiCog, 
  BiRefresh, 
  BiSearch,
  BiCalendarCheck,
  BiTrash,
  BiCheck
} from 'react-icons/bi';
import { MdTableRestaurant, MdOutlineCleaningServices } from 'react-icons/md';

const WAITERS = ['Manoj Kumar', 'Sunil Rao', 'Deepak Sharma', 'Priya Menon', 'Vikas Patel'];

export default function TablesManagementPage() {
  const router = useRouter();
  const { 
    currentRestaurant, 
    isFeatureEnabled, 
    updateRestaurantFeatures,
    tables, 
    updateTableStatus, 
    assignWaiterToTable, 
    transferTable, 
    mergeTables 
  } = useAuth();

  const [floors, setFloors] = useState<Floor[]>(SAMPLE_FLOORS);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected table for inspector modal
  const [activeTable, setActiveTable] = useState<RestaurantTable | null>(null);

  // Modals state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);

  // Transfer state
  const [transferSource, setTransferSource] = useState<string>('');
  const [transferTarget, setTransferTarget] = useState<string>('');

  // Merge state
  const [mergeSource, setMergeSource] = useState<string>('');
  const [mergeTarget, setMergeTarget] = useState<string>('');

  // Reservation form
  const [reservationData, setReservationData] = useState({
    guestName: '',
    guestPhone: '',
    guestCount: 2,
    reservationTime: '8:00 PM',
    notes: '',
  });

  // New Table form
  const [newTableData, setNewTableData] = useState({
    number: '',
    floorId: floors[0]?.id || 'floor-1',
    capacity: 4,
    section: 'Main Dining',
  });

  // New Floor form
  const [newFloorData, setNewFloorData] = useState({
    name: '',
    code: '',
  });

  // Feature flag check
  const isEnabled = isFeatureEnabled('tableManagement');

  // Stats calculation
  const totalTables = tables.length;
  const availableCount = tables.filter(t => t.status === 'available').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const reservedCount = tables.filter(t => t.status === 'reserved').length;
  const cleaningCount = tables.filter(t => t.status === 'cleaning').length;
  const totalLiveGuests = tables.reduce((acc, t) => acc + (t.activeGuests || 0), 0);
  const totalOccupancyCap = tables
    .filter(t => t.status === 'occupied')
    .reduce((acc, t) => acc + t.capacity, 0);

  // Filtered tables
  const filteredTables = tables.filter(tbl => {
    if (selectedFloorId !== 'all' && tbl.floorId !== selectedFloorId) return false;
    if (selectedStatus !== 'all' && tbl.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = tbl.number.toLowerCase().includes(q);
      const matchSec = tbl.section.toLowerCase().includes(q);
      const matchFloor = tbl.floorName.toLowerCase().includes(q);
      const matchWaiter = tbl.assignedWaiter?.toLowerCase().includes(q);
      if (!matchNum && !matchSec && !matchFloor && !matchWaiter) return false;
    }
    return true;
  });

  // Handlers
  const handleQuickStatusChange = (tableId: string, newStatus: 'available' | 'occupied' | 'reserved' | 'cleaning') => {
    if (newStatus === 'available') {
      updateTableStatus(tableId, 'available', {
        currentOrderId: undefined,
        currentBillAmount: 0,
        activeGuests: 0,
        seatedAt: undefined,
      });
    } else if (newStatus === 'occupied') {
      updateTableStatus(tableId, 'occupied', {
        activeGuests: 2,
        seatedAt: 'Just now',
      });
    } else {
      updateTableStatus(tableId, newStatus);
    }
    if (activeTable && activeTable.id === tableId) {
      setActiveTable(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferSource && transferTarget && transferSource !== transferTarget) {
      transferTable(transferSource, transferTarget);
      setShowTransferModal(false);
      setTransferSource('');
      setTransferTarget('');
    }
  };

  const handleMergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mergeSource && mergeTarget && mergeSource !== mergeTarget) {
      mergeTables(mergeSource, mergeTarget);
      setShowMergeModal(false);
      setMergeSource('');
      setMergeTarget('');
    }
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTable) {
      updateTableStatus(activeTable.id, 'reserved', {
        activeGuests: reservationData.guestCount,
        seatedAt: `Reserved ${reservationData.reservationTime} (${reservationData.guestName})`,
      });
      setShowReserveModal(false);
      setActiveTable(prev => prev ? { ...prev, status: 'reserved' } : null);
    }
  };

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableData.number.trim()) return;

    const floorObj = floors.find(f => f.id === newTableData.floorId) || floors[0];
    const newTbl: RestaurantTable = {
      id: `tbl-${Date.now()}`,
      number: newTableData.number.trim().toUpperCase(),
      floorId: floorObj.id,
      floorName: floorObj.name,
      capacity: Number(newTableData.capacity),
      section: newTableData.section,
      status: 'available',
      assignedWaiter: 'Manoj Kumar',
    };

    updateTableStatus(newTbl.id, 'available', newTbl);
    setShowAddTableModal(false);
    setNewTableData({
      number: '',
      floorId: floors[0]?.id || 'floor-1',
      capacity: 4,
      section: 'Main Dining',
    });
  };

  const handleAddFloorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFloorData.name.trim()) return;

    const newFloor: Floor = {
      id: `floor-${Date.now()}`,
      name: newFloorData.name.trim(),
      code: (newFloorData.code || newFloorData.name.substring(0, 2)).toUpperCase(),
      restaurantId: currentRestaurant.id,
      tablesCount: 0,
    };

    setFloors(prev => [...prev, newFloor]);
    setShowAddFloorModal(false);
    setNewFloorData({ name: '', code: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return { bg: '#E8F8F0', border: '#16A36A', text: '#16A36A', label: 'Available' };
      case 'occupied':
        return { bg: '#FFF1E8', border: '#F47B35', text: '#F47B35', label: 'Occupied' };
      case 'reserved':
        return { bg: '#EBF3FC', border: '#3478D4', text: '#3478D4', label: 'Reserved' };
      case 'cleaning':
        return { bg: '#FEF8EA', border: '#EAA12D', text: '#B87B14', label: 'Cleaning' };
      default:
        return { bg: '#F5F7FA', border: '#7B8494', text: '#253247', label: status };
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        {/* Disabled Banner when business type does not use table management */}
        {!isEnabled ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4 bg-white">
            <div className="mx-auto bg-light rounded-circle p-4 mb-3" style={{ width: '90px', height: '90px' }}>
              <MdTableRestaurant size={42} className="text-secondary" />
            </div>
            <h4 className="fw-bold text-navy mb-2">Table Management Disabled for this Business Type</h4>
            <p className="text-muted-custom mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Your current business profile is set to <strong>{currentRestaurant.businessType}</strong>. 
              Table service and dining floor layouts are disabled by default for takeaway, delivery, or counter-only setups. 
              You can enable it anytime if you offer Dine-In seating.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                onClick={() => updateRestaurantFeatures({ tableManagement: true, dineIn: true })}
                className="btn btn-brand px-4 py-2"
              >
                Enable Table Management Now
              </button>
              <Link href="/owner/settings" className="btn btn-outline-secondary px-4 py-2">
                Configure in Settings
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="d-flex flex-column flex-md-row md-align-items-center justify-content-between gap-3 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h3 className="fw-bold text-navy mb-0">Table & Floor Management</h3>
                  <span className="badge badge-soft-brand px-2 py-1 rounded-pill small">
                    {currentRestaurant.name}
                  </span>
                </div>
                <p className="text-muted-custom mb-0 small">
                  Live visual layout across {floors.length} dining zones. Real-time table states, waiter assignments, and bill tracking.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(true)}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-none"
                >
                  <BiTransferAlt size={16} />
                  <span>Transfer Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMergeModal(true)}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-none"
                >
                  <BiMerge size={16} />
                  <span>Merge Tables</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFloorModal(true)}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-none"
                >
                  <BiPlus size={16} />
                  <span>Add Floor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(true)}
                  className="btn btn-brand btn-sm d-flex align-items-center gap-1 shadow-sm"
                >
                  <BiPlus size={16} />
                  <span>Add Table</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Counter Bar */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-2">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="text-muted-custom small mb-1">Total Tables</div>
                  <div className="fs-4 fw-bold text-navy">{totalTables}</div>
                  <div className="small text-secondary" style={{ fontSize: '11px' }}>{floors.length} active floors</div>
                </div>
              </div>
              <div className="col-6 col-lg-2">
                <div 
                  className={`card border-0 shadow-sm rounded-3 p-3 h-100 cursor-pointer ${selectedStatus === 'available' ? 'border border-success' : 'bg-white'}`}
                  onClick={() => setSelectedStatus(selectedStatus === 'available' ? 'all' : 'available')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-success small mb-1 fw-medium d-flex align-items-center gap-1">
                    <span className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }} />
                    Available
                  </div>
                  <div className="fs-4 fw-bold text-success">{availableCount}</div>
                  <div className="small text-muted" style={{ fontSize: '11px' }}>Ready for seating</div>
                </div>
              </div>
              <div className="col-6 col-lg-2">
                <div 
                  className={`card border-0 shadow-sm rounded-3 p-3 h-100 cursor-pointer ${selectedStatus === 'occupied' ? 'border border-warning' : 'bg-white'}`}
                  onClick={() => setSelectedStatus(selectedStatus === 'occupied' ? 'all' : 'occupied')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-brand small mb-1 fw-medium d-flex align-items-center gap-1">
                    <span className="rounded-circle bg-brand" style={{ width: '8px', height: '8px' }} />
                    Occupied
                  </div>
                  <div className="fs-4 fw-bold text-brand">{occupiedCount}</div>
                  <div className="small text-muted" style={{ fontSize: '11px' }}>{totalLiveGuests} seated guests</div>
                </div>
              </div>
              <div className="col-6 col-lg-2">
                <div 
                  className={`card border-0 shadow-sm rounded-3 p-3 h-100 cursor-pointer ${selectedStatus === 'reserved' ? 'border border-primary' : 'bg-white'}`}
                  onClick={() => setSelectedStatus(selectedStatus === 'reserved' ? 'all' : 'reserved')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-primary small mb-1 fw-medium d-flex align-items-center gap-1">
                    <span className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }} />
                    Reserved
                  </div>
                  <div className="fs-4 fw-bold text-primary">{reservedCount}</div>
                  <div className="small text-muted" style={{ fontSize: '11px' }}>Booked today</div>
                </div>
              </div>
              <div className="col-6 col-lg-2">
                <div 
                  className={`card border-0 shadow-sm rounded-3 p-3 h-100 cursor-pointer ${selectedStatus === 'cleaning' ? 'border border-warning' : 'bg-white'}`}
                  onClick={() => setSelectedStatus(selectedStatus === 'cleaning' ? 'all' : 'cleaning')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-warning small mb-1 fw-medium d-flex align-items-center gap-1">
                    <span className="rounded-circle bg-warning" style={{ width: '8px', height: '8px' }} />
                    Cleaning
                  </div>
                  <div className="fs-4 fw-bold text-warning">{cleaningCount}</div>
                  <div className="small text-muted" style={{ fontSize: '11px' }}>Turnover pending</div>
                </div>
              </div>
              <div className="col-12 col-lg-2">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="text-muted-custom small mb-1">Seated Guests</div>
                  <div className="fs-4 fw-bold text-navy">{totalLiveGuests} <span className="fs-6 fw-normal text-muted">/ {totalOccupancyCap} max</span></div>
                  <div className="small text-muted" style={{ fontSize: '11px' }}>Active dining covers</div>
                </div>
              </div>
            </div>

            {/* Filter Controls & Floor Tabs */}
            <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                {/* Floor Tabs */}
                <div className="d-flex align-items-center gap-2 overflow-x-auto pb-1 pb-md-0">
                  <button
                    type="button"
                    onClick={() => setSelectedFloorId('all')}
                    className={`btn btn-sm text-nowrap rounded-pill px-3 ${
                      selectedFloorId === 'all'
                        ? 'btn-navy text-white fw-semibold'
                        : 'btn-light text-navy'
                    }`}
                  >
                    All Floors ({tables.length})
                  </button>
                  {floors.map(fl => {
                    const count = tables.filter(t => t.floorId === fl.id).length;
                    return (
                      <button
                        key={fl.id}
                        type="button"
                        onClick={() => setSelectedFloorId(fl.id)}
                        className={`btn btn-sm text-nowrap rounded-pill px-3 ${
                          selectedFloorId === fl.id
                            ? 'btn-navy text-white fw-semibold'
                            : 'btn-light text-navy'
                        }`}
                      >
                        {fl.name} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Search & Status Filters */}
                <div className="d-flex align-items-center gap-2">
                  <div className="input-group input-group-sm" style={{ width: '220px' }}>
                    <span className="input-group-text bg-light border-subtle text-muted">
                      <BiSearch size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-subtle"
                      placeholder="Search table or waiter..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-select form-select-sm border-subtle text-navy"
                    style={{ width: '140px' }}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tables Grid Layout */}
            <div className="row g-3 mb-4">
              {filteredTables.length === 0 ? (
                <div className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                    <MdTableRestaurant size={42} className="text-muted mx-auto mb-2" />
                    <h6 className="fw-semibold text-navy">No Tables Match Current Filters</h6>
                    <p className="text-muted-custom small mb-3">Try switching floors or clearing your search filter.</p>
                    <button
                      type="button"
                      onClick={() => { setSelectedFloorId('all'); setSelectedStatus('all'); setSearchQuery(''); }}
                      className="btn btn-outline-secondary btn-sm mx-auto"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                filteredTables.map(tbl => {
                  const sc = getStatusColor(tbl.status);
                  const isMerged = !!tbl.mergedWithTable;

                  return (
                    <div key={tbl.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                      <div
                        className="card h-100 rounded-3 border transition-all position-relative shadow-sm"
                        style={{
                          borderColor: sc.border,
                          borderWidth: '1.5px',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                        }}
                        onClick={() => setActiveTable(tbl)}
                      >
                        {/* Card Header */}
                        <div
                          className="p-3 border-bottom d-flex align-items-center justify-content-between"
                          style={{ backgroundColor: sc.bg }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold fs-5 text-navy">{tbl.number}</span>
                            {isMerged && (
                              <span className="badge bg-secondary text-white small" title={`Merged with ${tbl.mergedWithTable}`}>
                                Merged {tbl.mergedWithTable}
                              </span>
                            )}
                          </div>
                          <span
                            className="badge rounded-pill fw-semibold"
                            style={{
                              backgroundColor: sc.border,
                              color: '#ffffff',
                              fontSize: '11px',
                            }}
                          >
                            {sc.label}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-3">
                          <div className="d-flex align-items-center justify-content-between text-muted-custom small mb-2">
                            <span>Capacity:</span>
                            <span className="fw-semibold text-navy">{tbl.capacity} Seats</span>
                          </div>

                          <div className="d-flex align-items-center justify-content-between text-muted-custom small mb-2">
                            <span>Section:</span>
                            <span className="text-navy">{tbl.section}</span>
                          </div>

                          <div className="d-flex align-items-center justify-content-between text-muted-custom small mb-2">
                            <span>Waiter:</span>
                            <span className="text-navy fw-medium">{tbl.assignedWaiter || 'Unassigned'}</span>
                          </div>

                          {/* Seated Guests or Current Bill */}
                          {tbl.status === 'occupied' && (
                            <div className="mt-3 p-2 rounded-2 bg-light border border-subtle">
                              <div className="d-flex align-items-center justify-content-between small mb-1">
                                <span className="text-muted">Seated:</span>
                                <span className="fw-medium text-navy">{tbl.seatedAt || 'Recently'}</span>
                              </div>
                              <div className="d-flex align-items-center justify-content-between small">
                                <span className="text-muted">Current Bill:</span>
                                <span className="fw-bold text-brand">₹{(tbl.currentBillAmount || 850).toFixed(2)}</span>
                              </div>
                            </div>
                          )}

                          {tbl.status === 'reserved' && (
                            <div className="mt-3 p-2 rounded-2 bg-light border border-subtle small text-primary">
                              <BiCalendarCheck className="me-1" />
                              {tbl.seatedAt || 'Booked for evening service'}
                            </div>
                          )}

                          {tbl.status === 'cleaning' && (
                            <div className="mt-3 p-2 rounded-2 bg-light border border-subtle small text-warning d-flex align-items-center gap-1">
                              <MdOutlineCleaningServices />
                              <span>Table being sanitized</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Quick Actions */}
                        <div className="p-2 border-top bg-light d-flex align-items-center justify-content-between">
                          <span className="text-muted" style={{ fontSize: '11px' }}>
                            {tbl.floorName.split(' ')[0]} Floor
                          </span>

                          <div className="d-flex gap-1">
                            {tbl.status === 'available' && (
                              <button
                                type="button"
                                className="btn btn-outline-brand btn-sm px-2 py-0"
                                style={{ fontSize: '11px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/owner/pos?table=${tbl.number}`);
                                }}
                              >
                                Take Order
                              </button>
                            )}

                            {tbl.status === 'occupied' && (
                              <button
                                type="button"
                                className="btn btn-brand btn-sm px-2 py-0 text-white"
                                style={{ fontSize: '11px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/owner/pos?table=${tbl.number}`);
                                }}
                              >
                                Open Bill
                              </button>
                            )}

                            {tbl.status === 'cleaning' && (
                              <button
                                type="button"
                                className="btn btn-success btn-sm px-2 py-0 text-white"
                                style={{ fontSize: '11px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickStatusChange(tbl.id, 'available');
                                }}
                              >
                                Mark Clean
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Table Details & Actions Drawer Modal */}
            {activeTable && (
              <Modal
                isOpen={!!activeTable}
                onClose={() => setActiveTable(null)}
                title={`Table ${activeTable.number} Details & Operations`}
                size="md"
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3 bg-light border">
                    <div>
                      <div className="fs-5 fw-bold text-navy">Table {activeTable.number}</div>
                      <div className="text-muted small">{activeTable.floorName} • {activeTable.section}</div>
                    </div>
                    <span
                      className="badge rounded-pill px-3 py-2 text-uppercase fw-semibold"
                      style={{
                        backgroundColor: getStatusColor(activeTable.status).border,
                        color: '#ffffff',
                      }}
                    >
                      {activeTable.status}
                    </span>
                  </div>

                  {/* Operational Controls */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">Quick Status Update</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${activeTable.status === 'available' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => handleQuickStatusChange(activeTable.id, 'available')}
                      >
                        Available
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeTable.status === 'occupied' ? 'btn-warning text-white' : 'btn-outline-secondary'}`}
                        onClick={() => handleQuickStatusChange(activeTable.id, 'occupied')}
                      >
                        Occupied
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeTable.status === 'reserved' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => {
                          setShowReserveModal(true);
                        }}
                      >
                        Reserve
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeTable.status === 'cleaning' ? 'btn-secondary text-white' : 'btn-outline-secondary'}`}
                        onClick={() => handleQuickStatusChange(activeTable.id, 'cleaning')}
                      >
                        Cleaning
                      </button>
                    </div>
                  </div>

                  {/* Waiter Assignment */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">Assigned Captain / Waiter</label>
                    <select
                      className="form-select form-select-sm"
                      value={activeTable.assignedWaiter || ''}
                      onChange={(e) => {
                        assignWaiterToTable(activeTable.id, e.target.value);
                        setActiveTable(prev => prev ? { ...prev, assignedWaiter: e.target.value } : null);
                      }}
                    >
                      {WAITERS.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  {/* Active Order Details */}
                  {activeTable.status === 'occupied' && (
                    <div className="p-3 rounded-3 bg-white border border-subtle mb-3">
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Active Guests:</span>
                        <span className="fw-semibold text-navy">{activeTable.activeGuests || 2} Persons</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Seated Time:</span>
                        <span className="fw-semibold text-navy">{activeTable.seatedAt || '40 mins ago'}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Current Bill Running:</span>
                        <span className="fw-bold text-brand fs-6">₹{(activeTable.currentBillAmount || 1240).toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-brand btn-sm flex-grow-1"
                          onClick={() => {
                            setActiveTable(null);
                            router.push(`/owner/pos?table=${activeTable.number}`);
                          }}
                        >
                          Punch More Items in POS
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={() => {
                            handleQuickStatusChange(activeTable.id, 'cleaning');
                            setActiveTable(null);
                          }}
                        >
                          Checkout & Clear
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between pt-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        setTransferSource(activeTable.id);
                        setShowTransferModal(true);
                      }}
                    >
                      Transfer to Another Table
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setActiveTable(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Modal>
            )}

            {/* Transfer Table Modal */}
            <Modal
              isOpen={showTransferModal}
              onClose={() => setShowTransferModal(false)}
              title="Transfer Order / Guests to Another Table"
            >
              <form onSubmit={handleTransferSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Source Table (Transfer From)</label>
                  <select
                    className="form-select"
                    value={transferSource}
                    onChange={(e) => setTransferSource(e.target.value)}
                    required
                  >
                    <option value="">Select occupied source table...</option>
                    {tables.filter(t => t.status === 'occupied').map(t => (
                      <option key={t.id} value={t.id}>
                        {t.number} ({t.floorName} - ₹{t.currentBillAmount || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-navy">Destination Table (Transfer To)</label>
                  <select
                    className="form-select"
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    required
                  >
                    <option value="">Select available destination table...</option>
                    {tables.filter(t => t.status === 'available').map(t => (
                      <option key={t.id} value={t.id}>
                        {t.number} ({t.floorName} - {t.capacity} Seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setShowTransferModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-brand" disabled={!transferSource || !transferTarget}>
                    Confirm Transfer
                  </button>
                </div>
              </form>
            </Modal>

            {/* Merge Tables Modal */}
            <Modal
              isOpen={showMergeModal}
              onClose={() => setShowMergeModal(false)}
              title="Merge Two Adjacent Tables for Large Group"
            >
              <form onSubmit={handleMergeSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Primary Table</label>
                  <select
                    className="form-select"
                    value={mergeSource}
                    onChange={(e) => setMergeSource(e.target.value)}
                    required
                  >
                    <option value="">Select primary table...</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.number} ({t.floorName} - {t.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-navy">Adjacent Table to Merge With</label>
                  <select
                    className="form-select"
                    value={mergeTarget}
                    onChange={(e) => setMergeTarget(e.target.value)}
                    required
                  >
                    <option value="">Select table to combine...</option>
                    {tables.filter(t => t.id !== mergeSource).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.number} ({t.floorName} - {t.capacity} Seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setShowMergeModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-brand" disabled={!mergeSource || !mergeTarget}>
                    Merge Tables
                  </button>
                </div>
              </form>
            </Modal>

            {/* Reserve Table Modal */}
            <Modal
              isOpen={showReserveModal}
              onClose={() => setShowReserveModal(false)}
              title={`Create Reservation for Table ${activeTable?.number || ''}`}
            >
              <form onSubmit={handleReserveSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Guest Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dr. Rajesh Verma"
                    value={reservationData.guestName}
                    onChange={(e) => setReservationData({ ...reservationData, guestName: e.target.value })}
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98765 11223"
                      value={reservationData.guestPhone}
                      onChange={(e) => setReservationData({ ...reservationData, guestPhone: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Expected Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="form-control"
                      value={reservationData.guestCount}
                      onChange={(e) => setReservationData({ ...reservationData, guestCount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-navy">Reservation Time Slot</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Today, 8:30 PM"
                    value={reservationData.reservationTime}
                    onChange={(e) => setReservationData({ ...reservationData, reservationTime: e.target.value })}
                    required
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setShowReserveModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-brand">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </Modal>

            {/* Add Table Modal */}
            <Modal
              isOpen={showAddTableModal}
              onClose={() => setShowAddTableModal(false)}
              title="Add New Dining Table"
            >
              <form onSubmit={handleAddTableSubmit}>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Table Identifier / Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. T-09 or RT-07"
                      value={newTableData.number}
                      onChange={(e) => setNewTableData({ ...newTableData, number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Capacity (Guests)</label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      className="form-control"
                      value={newTableData.capacity}
                      onChange={(e) => setNewTableData({ ...newTableData, capacity: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Floor / Level</label>
                    <select
                      className="form-select"
                      value={newTableData.floorId}
                      onChange={(e) => setNewTableData({ ...newTableData, floorId: e.target.value })}
                    >
                      {floors.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">Section / Area</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Window Booth, Family Lounge"
                      value={newTableData.section}
                      onChange={(e) => setNewTableData({ ...newTableData, section: e.target.value })}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddTableModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-brand">
                    Create Table
                  </button>
                </div>
              </form>
            </Modal>

            {/* Add Floor Modal */}
            <Modal
              isOpen={showAddFloorModal}
              onClose={() => setShowAddFloorModal(false)}
              title="Add New Dining Floor / Zone"
            >
              <form onSubmit={handleAddFloorSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Floor Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 2nd Floor Banquet Hall"
                    value={newFloorData.name}
                    onChange={(e) => setNewFloorData({ ...newFloorData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-navy">Code Prefix</label>
                  <input
                    type="text"
                    maxLength={3}
                    className="form-control"
                    placeholder="e.g. 2F or BQ"
                    value={newFloorData.code}
                    onChange={(e) => setNewFloorData({ ...newFloorData, code: e.target.value })}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddFloorModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-brand">
                    Save Floor
                  </button>
                </div>
              </form>
            </Modal>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
