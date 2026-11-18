'use client';

import React, { createContext, useContext, useState } from 'react';
import { Language, TRANSLATIONS } from '@/i18n/translations';
import {
  HospitalityTenant,
  HospitalityProperty,
  HospitalityOutlet,
  PlanTier,
  PLAN_TIERS,
  PlanTierConfig,
} from '@/mock/tenants';
import { HotelRoom, RoomStatus, HousekeepingTask } from '@/mock/rooms';
import { DormRoom, BedStatus } from '@/mock/beds';
import { StayReservation, GuestFolio, FolioCharge, FolioPayment } from '@/mock/reservations';
import { CampPackage, ActivitySlot, CampBookingWaiver } from '@/mock/camps';
import { ReadyBoardOrder, ReadyBoardStage } from '@/mock/orders';
import { FormIIIRecord } from '@/mock/compliance';
import { ApprovalRequestItem, AuditLogEntry, DayCloseRecord } from '@/mock/audit';
import { HospitalityNotification } from '@/mock/notifications';
import { SyncQueueItem } from '@/mock/sync';
import {
  userService,
  propertyService,
  bookingService,
  orderService,
  complianceService,
  auditService,
  notificationService,
} from '@/services';

export type NetworkStatus = 'online' | 'offline' | 'syncing' | 'sync_complete' | 'sync_failed';

interface HospitalityContextType {
  // Language EN / HI
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;

  // Multi-Tenant Hierarchy: Platform -> Tenant -> Property -> Outlet
  tenants: HospitalityTenant[];
  activeTenant: HospitalityTenant;
  activeProperty: HospitalityProperty;
  activeOutlet: HospitalityOutlet;
  selectTenant: (tenantId: string) => void;
  selectProperty: (propertyId: string) => void;
  selectOutlet: (outletId: string) => void;
  toggleTenantStatus: (tenantId: string) => void;

  // Plan Tiers (S / G / E)
  activePlanTier: PlanTier;
  activePlanConfig: PlanTierConfig;
  setPlanTierOverride: (tier: PlanTier) => void;
  hasPlanFeature: (featureKey: keyof PlanTierConfig['features']) => boolean;

  // Offline-First & Sync Center
  networkStatus: NetworkStatus;
  syncQueue: SyncQueueItem[];
  toggleOfflineMode: () => void;
  triggerSyncAll: () => void;
  retrySyncItem: (id: string) => void;
  resolveSyncConflict: (id: string, resolution: 'keep_local' | 'keep_server') => void;
  enqueueSyncEvent: (module: SyncQueueItem['module'], entityRef: string, summary: string) => void;

  // Live Restaurant / Ready Board / Kiosk / QR / Captain / Rider Orders
  readyBoardOrders: ReadyBoardOrder[];
  addLiveOrder: (order: Omit<ReadyBoardOrder, 'id' | 'createdAt' | 'elapsedMinutes'>) => ReadyBoardOrder;
  advanceOrderStage: (orderId: string, nextStage: ReadyBoardStage) => void;
  updateRiderDeliveryStatus: (orderId: string, status: ReadyBoardOrder['deliveryStatus']) => void;

  // Live Stay: Rooms, Dorms, Reservations, Folios, Housekeeping
  rooms: HotelRoom[];
  updateRoomStatus: (roomId: string, status: RoomStatus, maintenanceNote?: string) => void;
  dorms: DormRoom[];
  updateDormBed: (dormId: string, bedId: string, updates: Partial<{ status: BedStatus; guestName?: string; guestNationality?: string; isForeignGuest?: boolean; checkInDate?: string; checkOutDate?: string }>) => void;
  transferDormBed: (sourceDormId: string, sourceBedId: string, targetDormId: string, targetBedId: string) => void;
  reservations: StayReservation[];
  addReservation: (res: Omit<StayReservation, 'id' | 'bookingCode' | 'folioId'>) => StayReservation;
  updateReservationStatus: (resId: string, status: StayReservation['status']) => void;
  folios: GuestFolio[];
  postChargeToFolio: (folioId: string, charge: Omit<FolioCharge, 'id'>) => void;
  addPaymentToFolio: (folioId: string, payment: Omit<FolioPayment, 'id'>) => void;
  housekeepingTasks: HousekeepingTask[];
  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask['status']) => void;

  // Live Camp & Adventure
  campPackages: CampPackage[];
  activitySlots: ActivitySlot[];
  campBookings: CampBookingWaiver[];
  addCampBooking: (booking: Omit<CampBookingWaiver, 'id'>) => void;
  signCampWaiver: (bookingId: string) => void;
  toggleGuideCheckIn: (bookingId: string) => void;

  // Live Form III Compliance
  formIIIRecords: FormIIIRecord[];
  updateFormIIIRecord: (id: string, updates: Partial<FormIIIRecord>) => void;
  addFormIIIRecord: (record: Omit<FormIIIRecord, 'id'>) => void;

  // Live Approvals, Audit & Day Close
  approvals: ApprovalRequestItem[];
  decideApproval: (id: string, decision: 'Approved' | 'Rejected', note: string) => void;
  createApprovalRequest: (req: Omit<ApprovalRequestItem, 'id' | 'requestedAt' | 'status'>) => void;
  auditLogs: AuditLogEntry[];
  appendAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  dayClose: DayCloseRecord;
  updateDayClose: (updates: Partial<DayCloseRecord>) => void;

  // Live Notifications
  notifications: HospitalityNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushNotification: (n: Omit<HospitalityNotification, 'id' | 'timestamp' | 'read'>) => void;
}

const HospitalityContext = createContext<HospitalityContextType | undefined>(undefined);

export const HospitalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguage] = useState<Language>('en');
  const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  const t = (key: string) => TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || key;

  // Multi-Tenant Hierarchy
  const [tenants, setTenants] = useState<HospitalityTenant[]>(() => userService.getTenants());
  const [activeTenantId, setActiveTenantId] = useState<string>(tenants[0].id);
  const activeTenant = tenants.find(tn => tn.id === activeTenantId) || tenants[0];

  const [activePropertyId, setActivePropertyId] = useState<string>(activeTenant.properties[0].id);
  const activeProperty =
    activeTenant.properties.find(p => p.id === activePropertyId) || activeTenant.properties[0];

  const [activeOutletId, setActiveOutletId] = useState<string>(activeProperty.outlets[0].id);
  const activeOutlet =
    activeProperty.outlets.find(o => o.id === activeOutletId) || activeProperty.outlets[0];

  const selectTenant = (tenantId: string) => {
    const found = tenants.find(tn => tn.id === tenantId);
    if (!found) return;
    setActiveTenantId(found.id);
    setActivePropertyId(found.properties[0].id);
    setActiveOutletId(found.properties[0].outlets[0].id);
    setPlanOverride(null);
  };

  const selectProperty = (propertyId: string) => {
    const found = activeTenant.properties.find(p => p.id === propertyId);
    if (!found) return;
    setActivePropertyId(found.id);
    setActiveOutletId(found.outlets[0].id);
  };

  const selectOutlet = (outletId: string) => {
    setActiveOutletId(outletId);
  };

  const toggleTenantStatus = (tenantId: string) => {
    setTenants(prev =>
      prev.map(tn =>
        tn.id === tenantId
          ? { ...tn, status: tn.status === 'Suspended' ? 'Active' : 'Suspended' }
          : tn
      )
    );
  };

  // Plan Tiers (S / G / E)
  const [planOverride, setPlanOverride] = useState<PlanTier | null>(null);
  const activePlanTier: PlanTier = planOverride || activeTenant.planTier;
  const activePlanConfig = PLAN_TIERS[activePlanTier];
  const setPlanTierOverride = (tier: PlanTier) => setPlanOverride(tier);
  const hasPlanFeature = (featureKey: keyof PlanTierConfig['features']) => {
    return !!activePlanConfig.features[featureKey];
  };

  // Offline-First & Sync Center
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => notificationService.getSyncQueue());

  const enqueueSyncEvent = (module: SyncQueueItem['module'], entityRef: string, summary: string) => {
    const item: SyncQueueItem = {
      id: `SYNC-${Math.floor(900 + Math.random() * 900)}`,
      deviceName: `${activeOutlet.name} Terminal`,
      outletName: activeOutlet.name,
      module,
      entityRef,
      summary,
      createdAt: 'Just now',
      status: networkStatus === 'offline' ? 'Pending' : 'Synced',
      retryCount: 0,
    };
    setSyncQueue(prev => [item, ...prev]);
  };

  const toggleOfflineMode = () => {
    if (networkStatus === 'offline') {
      setNetworkStatus('syncing');
      setTimeout(() => {
        setSyncQueue(prev =>
          prev.map(item => (item.status === 'Pending' ? { ...item, status: 'Synced' } : item))
        );
        setNetworkStatus('sync_complete');
        setTimeout(() => setNetworkStatus('online'), 2500);
      }, 1200);
    } else {
      setNetworkStatus('offline');
    }
  };

  const triggerSyncAll = () => {
    if (networkStatus === 'offline') {
      setNetworkStatus('sync_failed');
      return;
    }
    setNetworkStatus('syncing');
    setTimeout(() => {
      setSyncQueue(prev =>
        prev.map(item =>
          item.status === 'Pending' || item.status === 'Failed'
            ? { ...item, status: 'Synced', errorOrConflictDetail: undefined }
            : item
        )
      );
      setNetworkStatus('sync_complete');
      setTimeout(() => setNetworkStatus('online'), 2000);
    }, 1000);
  };

  const retrySyncItem = (id: string) => {
    setSyncQueue(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: networkStatus === 'offline' ? 'Pending' : 'Synced', retryCount: item.retryCount + 1, errorOrConflictDetail: undefined }
          : item
      )
    );
  };

  const resolveSyncConflict = (id: string, resolution: 'keep_local' | 'keep_server') => {
    setSyncQueue(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'Synced',
              errorOrConflictDetail: `Resolved (${resolution === 'keep_local' ? 'Kept Local Device Snapshot' : 'Accepted Cloud Record'})`,
            }
          : item
      )
    );
  };

  // Live Orders & Ready Board
  const [readyBoardOrders, setReadyBoardOrders] = useState<ReadyBoardOrder[]>(() => orderService.getReadyBoardOrders());

  const addLiveOrder = (order: Omit<ReadyBoardOrder, 'id' | 'createdAt' | 'elapsedMinutes'>): ReadyBoardOrder => {
    const newOrd: ReadyBoardOrder = {
      ...order,
      id: `rb-${Date.now()}`,
      createdAt: 'Just now',
      elapsedMinutes: 0,
    };
    setReadyBoardOrders(prev => [newOrd, ...prev]);
    enqueueSyncEvent('POS Order', `Token #${newOrd.tokenNumber}`, `${newOrd.orderType} order for ${newOrd.customerShortName} (₹${newOrd.totalAmount})`);
    pushNotification({
      category: 'New Order',
      title: `New ${newOrd.orderType} Order (#${newOrd.tokenNumber})`,
      message: `${newOrd.customerShortName} (${newOrd.sourceLabel}) • ${newOrd.items.length} item(s) • ₹${newOrd.totalAmount}`,
      severity: 'info',
      actionHref: '/ready-board',
      actionLabel: 'View Ready Board',
    });
    return newOrd;
  };

  const advanceOrderStage = (orderId: string, nextStage: ReadyBoardStage) => {
    setReadyBoardOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, stage: nextStage } : o))
    );
    if (nextStage === 'READY') {
      const ord = readyBoardOrders.find(o => o.id === orderId);
      if (ord) {
        pushNotification({
          category: 'Ready Order',
          title: `Order #${ord.tokenNumber} is READY`,
          message: `${ord.customerShortName} (${ord.sourceLabel}) is now flashing READY on the pickup board.`,
          severity: 'success',
          actionHref: '/ready-board',
          actionLabel: 'Open Board',
        });
      }
    }
  };

  const updateRiderDeliveryStatus = (orderId: string, status: ReadyBoardOrder['deliveryStatus']) => {
    setReadyBoardOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, deliveryStatus: status, stage: status === 'Delivered' ? 'SERVED' : o.stage }
          : o
      )
    );
  };

  // Stay: Rooms, Dorms, Reservations, Folios, Housekeeping
  const [rooms, setRooms] = useState<HotelRoom[]>(() => propertyService.getRooms());
  const [dorms, setDorms] = useState<DormRoom[]>(() => propertyService.getDorms());
  const [reservations, setReservations] = useState<StayReservation[]>(() => bookingService.getReservations());
  const [folios, setFolios] = useState<GuestFolio[]>(() => bookingService.getFolios());
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(() => propertyService.getHousekeepingTasks());

  const updateRoomStatus = (roomId: string, status: RoomStatus, maintenanceNote?: string) => {
    setRooms(prev =>
      prev.map(r => (r.id === roomId ? { ...r, status, maintenanceNote: maintenanceNote ?? r.maintenanceNote } : r))
    );
  };

  const updateDormBed = (
    dormId: string,
    bedId: string,
    updates: Partial<{ status: BedStatus; guestName?: string; guestNationality?: string; isForeignGuest?: boolean; checkInDate?: string; checkOutDate?: string }>
  ) => {
    setDorms(prev =>
      prev.map(d =>
        d.id === dormId
          ? {
              ...d,
              beds: d.beds.map(b => (b.id === bedId ? { ...b, ...updates } : b)),
            }
          : d
      )
    );
  };

  const transferDormBed = (sourceDormId: string, sourceBedId: string, targetDormId: string, targetBedId: string) => {
    const srcDorm = dorms.find(d => d.id === sourceDormId);
    const srcBed = srcDorm?.beds.find(b => b.id === sourceBedId);
    if (!srcBed || !srcBed.guestName) return;

    setDorms(prev =>
      prev.map(d => {
        let updatedBeds = d.beds;
        if (d.id === sourceDormId) {
          updatedBeds = updatedBeds.map(b =>
            b.id === sourceBedId
              ? { ...b, status: 'Dirty' as BedStatus, guestName: undefined, guestNationality: undefined, isForeignGuest: false }
              : b
          );
        }
        if (d.id === targetDormId) {
          updatedBeds = updatedBeds.map(b =>
            b.id === targetBedId
              ? {
                  ...b,
                  status: 'Occupied' as BedStatus,
                  guestName: srcBed.guestName,
                  guestNationality: srcBed.guestNationality,
                  isForeignGuest: srcBed.isForeignGuest,
                  checkInDate: srcBed.checkInDate,
                  checkOutDate: srcBed.checkOutDate,
                }
              : b
          );
        }
        return { ...d, beds: updatedBeds };
      })
    );
  };

  const addReservation = (res: Omit<StayReservation, 'id' | 'bookingCode' | 'folioId'>): StayReservation => {
    const num = Math.floor(8850 + Math.random() * 900);
    const newFolioId = `FOL-${num}`;
    const newRes: StayReservation = {
      ...res,
      id: `RES-${num}`,
      bookingCode: `GH-2611-${num}`,
      folioId: newFolioId,
    };
    setReservations(prev => [newRes, ...prev]);

    const newFolio: GuestFolio = {
      id: newFolioId,
      reservationId: newRes.id,
      guestName: newRes.guestName,
      guestPhone: newRes.guestPhone,
      guestEmail: newRes.guestEmail,
      nationality: newRes.nationality,
      isForeignGuest: newRes.isForeignGuest,
      unitLabel: newRes.unitLabel,
      checkInDate: newRes.checkInDate,
      checkOutDate: newRes.checkOutDate,
      bookingSource: newRes.source === 'Goibibo' ? 'MakeMyTrip' : (newRes.source as GuestFolio['bookingSource']),
      status: 'Open',
      invoiceNumber: `INV/26-27/0${num}`,
      charges: [
        {
          id: `ch-${Date.now()}`,
          date: 'Today',
          category: newRes.unitType === 'Dorm Bed' ? 'Dorm Bed' : 'Room',
          description: `${newRes.unitLabel} (${newRes.nights} Night${newRes.nights > 1 ? 's' : ''})`,
          referenceNo: newRes.bookingCode,
          amount: Math.round(newRes.totalEstimate / 1.12),
          gstRate: 12,
          gstAmount: Math.round(newRes.totalEstimate - newRes.totalEstimate / 1.12),
          postedBy: 'Front Desk',
        },
      ],
      payments: newRes.paidAmount > 0
        ? [
            {
              id: `pay-${Date.now()}`,
              date: 'Today',
              method: 'UPI',
              referenceNo: `ADV-${num}`,
              amount: newRes.paidAmount,
              receivedBy: 'Front Desk',
            },
          ]
        : [],
    };
    setFolios(prev => [newFolio, ...prev]);

    if (newRes.isForeignGuest) {
      addFormIIIRecord({
        reservationId: newRes.id,
        propertyId: newRes.propertyId,
        propertyName: activeProperty.name,
        frroPropertyCode: activeProperty.frroPropertyCode,
        guestName: newRes.guestName,
        gender: 'Male',
        dateOfBirth: '1992-01-01',
        nationality: newRes.nationality,
        passportNumber: newRes.idNumber || 'PENDING',
        passportIssueDate: '2021-01-01',
        passportExpiryDate: '2031-01-01',
        passportPlaceOfIssue: newRes.nationality,
        visaNumber: 'PENDING',
        visaType: 'Tourist (e-TV)',
        visaIssueDate: '2026-10-01',
        visaExpiryDate: '2027-10-01',
        arrivalDateTime: 'Today (Just Checked In)',
        hoursRemaining: 23.9,
        deadlineLabel: '23h 55m remaining (24h window started)',
        addressInIndia: `${activeProperty.name}, ${activeProperty.location}, ${activeProperty.city}`,
        arrivedFrom: 'New Delhi',
        purposeOfVisit: 'Tourism & Yoga',
        nextDestination: 'TBD',
        unitLabel: newRes.unitLabel,
        status: 'Pending',
        departureDate: newRes.checkOutDate,
        departureReported: false,
        documents: [],
      });
    }

    enqueueSyncEvent('Room Check-in', newRes.bookingCode, `Created booking for ${newRes.guestName} (${newRes.unitLabel})`);
    return newRes;
  };

  const updateReservationStatus = (resId: string, status: StayReservation['status']) => {
    setReservations(prev => prev.map(r => (r.id === resId ? { ...r, status } : r)));
  };

  const postChargeToFolio = (folioId: string, charge: Omit<FolioCharge, 'id'>) => {
    const newCharge: FolioCharge = { ...charge, id: `ch-${Date.now()}` };
    setFolios(prev =>
      prev.map(f => (f.id === folioId ? { ...f, charges: [...f.charges, newCharge] } : f))
    );
    enqueueSyncEvent('Folio Charge', folioId, `Posted ${charge.category}: ${charge.description} (₹${charge.amount})`);
  };

  const addPaymentToFolio = (folioId: string, payment: Omit<FolioPayment, 'id'>) => {
    const newPay: FolioPayment = { ...payment, id: `pay-${Date.now()}` };
    setFolios(prev =>
      prev.map(f => (f.id === folioId ? { ...f, payments: [...f.payments, newPay] } : f))
    );
  };

  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask['status']) => {
    setHousekeepingTasks(prev => prev.map(tk => (tk.id === taskId ? { ...tk, status } : tk)));
  };

  // Camp & Adventure
  const [campPackages] = useState<CampPackage[]>(() => propertyService.getCampPackages());
  const [activitySlots, setActivitySlots] = useState<ActivitySlot[]>(() => propertyService.getActivitySlots());
  const [campBookings, setCampBookings] = useState<CampBookingWaiver[]>(() => propertyService.getCampBookings());

  const addCampBooking = (booking: Omit<CampBookingWaiver, 'id'>) => {
    const newBooking: CampBookingWaiver = { ...booking, id: `CB-${Math.floor(800 + Math.random() * 190)}` };
    setCampBookings(prev => [newBooking, ...prev]);
    setActivitySlots(prev =>
      prev.map(s =>
        s.id === booking.slotId
          ? {
              ...s,
              bookedCount: Math.min(s.capacity, s.bookedCount + booking.pax),
              status: s.bookedCount + booking.pax >= s.capacity ? 'Full' : s.status,
            }
          : s
      )
    );
    enqueueSyncEvent('Camp Waiver', newBooking.id, `Booked ${booking.guestName} (${booking.pax} Pax) for ${booking.slotLabel}`);
  };

  const signCampWaiver = (bookingId: string) => {
    setCampBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, waiverStatus: 'Signed', waiverSignedAt: 'Just now (Digital Sign)' } : b
      )
    );
  };

  const toggleGuideCheckIn = (bookingId: string) => {
    setCampBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, checkedInByGuide: !b.checkedInByGuide } : b))
    );
  };

  // Form III
  const [formIIIRecords, setFormIIIRecords] = useState<FormIIIRecord[]>(() => complianceService.getFormIIIRecords());
  const updateFormIIIRecord = (id: string, updates: Partial<FormIIIRecord>) => {
    setFormIIIRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };
  const addFormIIIRecord = (record: Omit<FormIIIRecord, 'id'>) => {
    const newRec: FormIIIRecord = { ...record, id: `F3-2611-${Math.floor(10 + Math.random() * 89)}` };
    setFormIIIRecords(prev => [newRec, ...prev]);
  };

  // Approvals, Audit & Day Close
  const [approvals, setApprovals] = useState<ApprovalRequestItem[]>(() => auditService.getApprovals());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => auditService.getAuditLogs());
  const [dayClose, setDayClose] = useState<DayCloseRecord>(() => auditService.getDayClose());

  const appendAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const log: AuditLogEntry = {
      ...entry,
      id: `AUD-${Math.floor(9100 + Math.random() * 899)}`,
      timestamp: 'Just now',
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const decideApproval = (id: string, decision: 'Approved' | 'Rejected', note: string) => {
    const item = approvals.find(a => a.id === id);
    setApprovals(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: decision, approver: 'Vikram Singhania (Owner)', decidedAt: 'Just now', decisionNote: note }
          : a
      )
    );
    if (item) {
      appendAuditLog({
        user: 'Vikram Singhania',
        role: 'Tenant Owner',
        device: 'Back Office Web',
        action: `${decision} ${item.type}`,
        objectType: item.type === 'Reopen Day' ? 'Day Close' : 'Bill',
        objectRef: item.id,
        oldValue: 'Pending',
        newValue: decision,
        reason: note || item.reason,
        severity: decision === 'Rejected' ? 'Warning' : 'Info',
      });
    }
  };

  const createApprovalRequest = (req: Omit<ApprovalRequestItem, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: ApprovalRequestItem = {
      ...req,
      id: `APR-${Math.floor(310 + Math.random() * 680)}`,
      requestedAt: 'Just now',
      status: 'Pending',
    };
    setApprovals(prev => [newReq, ...prev]);
    pushNotification({
      category: 'Approval Request',
      title: `New ${req.type} Request`,
      message: `${req.requestedBy} requested ${req.amountOrImpact}: ${req.reason}`,
      severity: 'warning',
      actionHref: '/owner/approvals',
      actionLabel: 'Review Now',
    });
  };

  const updateDayClose = (updates: Partial<DayCloseRecord>) => {
    setDayClose(prev => ({ ...prev, ...updates }));
  };

  // Notifications
  const [notifications, setNotifications] = useState<HospitalityNotification[]>(() =>
    notificationService.getNotifications()
  );

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const pushNotification = (n: Omit<HospitalityNotification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [
      { ...n, id: `ntf-${Date.now()}`, timestamp: 'Just now', read: false },
      ...prev,
    ]);
  };

  return (
    <HospitalityContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        tenants,
        activeTenant,
        activeProperty,
        activeOutlet,
        selectTenant,
        selectProperty,
        selectOutlet,
        toggleTenantStatus,
        activePlanTier,
        activePlanConfig,
        setPlanTierOverride,
        hasPlanFeature,
        networkStatus,
        syncQueue,
        toggleOfflineMode,
        triggerSyncAll,
        retrySyncItem,
        resolveSyncConflict,
        enqueueSyncEvent,
        readyBoardOrders,
        addLiveOrder,
        advanceOrderStage,
        updateRiderDeliveryStatus,
        rooms,
        updateRoomStatus,
        dorms,
        updateDormBed,
        transferDormBed,
        reservations,
        addReservation,
        updateReservationStatus,
        folios,
        postChargeToFolio,
        addPaymentToFolio,
        housekeepingTasks,
        updateHousekeepingStatus,
        campPackages,
        activitySlots,
        campBookings,
        addCampBooking,
        signCampWaiver,
        toggleGuideCheckIn,
        formIIIRecords,
        updateFormIIIRecord,
        addFormIIIRecord,
        approvals,
        decideApproval,
        createApprovalRequest,
        auditLogs,
        appendAuditLog,
        dayClose,
        updateDayClose,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        pushNotification,
      }}
    >
      {children}
    </HospitalityContext.Provider>
  );
};

export const useHospitality = () => {
  const ctx = useContext(HospitalityContext);
  if (!ctx) {
    throw new Error('useHospitality must be used within HospitalityProvider');
  }
  return ctx;
};
