# Complete Restaurant & Cafe Management SaaS – Product Features, Modules & User Guide

> **Document Version:** 2.4.0 (Enterprise Multi-Tenant Edition)  
> **Release Date:** November 2026  
> **Architecture:** Next.js 16 (App Router), TypeScript, Bootstrap 5, Recharts, React Icons  
> **Primary Theme:** Modern Culinary Navy (`#18263B`), Warm Spice Orange (`#F47B35`), Soft Slate Surface (`#F5F7FA`)  
> **Target Audience:** Restaurant Owners, Cafe Founders, Cloud Kitchen Operators, Bakery Managers, SaaS Administrators

---

# TABLE OF CONTENTS

- [PART 1: INTERNAL PRODUCT DOCUMENTATION (FOUNDER & TECHNICAL GUIDE)](#part-1-internal-product-documentation-founder--technical-guide)
  - [1. Executive Product Overview & Problem Statement](#1-executive-product-overview--problem-statement)
  - [2. Multi-Tenant Architecture & Data Isolation Model](#2-multi-tenant-architecture--data-isolation-model)
  - [3. Complete Sidebar & Navigation Directory](#3-complete-sidebar--navigation-directory)
  - [4. Role-Based Access Control (RBAC) Specification](#4-role-based-access-control-rbac-specification)
  - [5. Exhaustive Page-by-Page Technical & Functional Directory](#5-exhaustive-page-by-page-technical--functional-directory)
    - [5.1 Public & Authentication Layer](#51-public--authentication-layer)
    - [5.2 Business Onboarding Wizard](#52-business-onboarding-wizard)
    - [5.3 Core Sales & Billing Layer](#53-core-sales--billing-layer)
    - [5.4 Kitchen & Production Layer](#54-kitchen--production-layer)
    - [5.5 Inventory & Supply Chain Engine](#55-inventory--supply-chain-engine)
    - [5.6 Customer Relationship & Growth Modules](#56-customer-relationship--growth-modules)
    - [5.7 Human Resources & Shift Rostering](#57-human-resources--shift-rostering)
    - [5.8 Multi-Branch & Franchise Infrastructure](#58-multi-branch--franchise-infrastructure)
    - [5.9 Financial Intelligence & Fraud Surveillance](#59-financial-intelligence--fraud-surveillance)
    - [5.10 Artificial Intelligence & Predictive Modeling](#510-artificial-intelligence--predictive-modeling)
    - [5.11 SaaS Account, Marketplace & Licensing](#511-saas-account-marketplace--licensing)
    - [5.12 Super Admin Platform Management](#512-super-admin-platform-management)
  - [6. SaaS Subscription Lifecycle, Gateways & Grace Period Logic](#6-saas-subscription-lifecycle-gateways--grace-period-logic)
  - [7. Technical Integration Roadmap (Backend, DB, Payment Gateways & AI)](#7-technical-integration-roadmap-backend-db-payment-gateways--ai)
- [PART 2: CUSTOMER-FACING PRODUCT GUIDE (FOR RESTAURANT & CAFE OWNERS)](#part-2-customer-facing-product-guide-for-restaurant--cafe-owners)
  - [8. Welcome to the Next-Generation Restaurant OS](#8-welcome-to-the-next-generation-restaurant-os)
  - [9. Business Owner Registration & 7-Day Free Trial Guide](#9-business-owner-registration--7-day-free-trial-guide)
  - [10. Step-by-Step Daily Restaurant Workflows](#10-step-by-step-daily-restaurant-workflows)
  - [11. Complete Smart Inventory & Recipe Costing Guide](#11-complete-smart-inventory--recipe-costing-guide)
  - [12. Multi-Branch Operations & Central Commissary Control](#12-multi-branch-operations--central-commissary-control)
  - [13. Business Impact: 10 Operational Superpowers](#13-business-impact-10-operational-superpowers)
  - [14. Industry-Specific Playbooks & Feature Matrices](#14-industry-specific-playbooks--feature-matrices)
  - [15. Subscription Plans, Transparent Pricing & FAQ](#15-subscription-plans-transparent-pricing--faq)

---

# PART 1: INTERNAL PRODUCT DOCUMENTATION (FOUNDER & TECHNICAL GUIDE)

## 1. Executive Product Overview & Problem Statement

### 1.1 What This SaaS Platform Is
The platform is an **all-in-one, multi-tenant cloud operating system designed for modern food and beverage businesses**. Inspired by enterprise restaurant POS solutions like Zestora, Toast, and Square for Restaurants, it expands far beyond basic point-of-sale billing by unifying **omnichannel ordering, table management, multi-station kitchen display systems (KDS/KOT), recipe-level inventory auto-deduction, AI demand forecasting, cashier fraud detection, true P&L ledger accounting, and franchise network royalty tracking** into a cohesive web suite.

### 1.2 Core Problems Solved for Food Businesses
1. **Disjointed Software Stacks**: Most food businesses juggle 4 to 6 disconnected tools—one for offline billing, one for aggregator orders (Swiggy/Zomato), an Excel sheet for raw material inventory, a biometric device for staff attendance, and manual notebooks for table reservations. This platform consolidates everything into a single synchronized workspace.
2. **Raw Material Leakage & Pilferage**: Traditional POS systems record what was sold, but have zero connection to what raw materials were used. This system links every menu item to a multi-ingredient recipe bill-of-materials (BOM), automatically deducting exact grams/milliliters from live stock upon bill punch.
3. **Cashier Fraud & Theft**: Unauthorized order voids, unrecorded cash drawer opens, post-bill print cancellations, and split bill manipulations cost restaurants 3% to 7% of gross revenue. The platform incorporates a dedicated **Cashier Fraud & Anomaly Audit Engine** with risk scoring.
4. **Blind Financials & Cost Volatility**: Owners often know their top-line daily gross sales, but have no visibility into their true EBITDA, food cost percentages, fixed overhead allocations, or break-even daily run rates until months later. The built-in **Profit & Loss Studio** computes margins in real-time.
5. **Multi-Outlet Scaling Friction**: Transitioning from a single flagship cafe to a 5-branch network or franchise model typically breaks operations. This architecture provides seamless branch switching, commissary transfer management, and franchise royalty enforcement.

### 1.3 Key Architectural Differentiators
| Traditional POS Software | Our Next-Gen Multi-Tenant SaaS Platform |
| :--- | :--- |
| Installed locally on Windows PC; data trapped on physical hard disk | 100% Cloud-native Next.js App Router; accessible on tablet, mobile, PC |
| Single-store database; no native multi-brand or multi-branch awareness | Multi-tenant SaaS with tenant data isolation and centralized cross-branch analytics |
| Static inventory requiring manual daily stock counting | Dynamic recipe auto-deduction with low-stock alerts and purchase order generation |
| Generic billing screen | 15 configurable business formats (Fine dining, QSR, Cloud Kitchen, Bakery, etc.) |
| Expensive perpetual upfront licenses + paid annual support AMCs | Self-serve 7-day free trial, transparent monthly/annual billing via UPI AutoPay |
| Reactive historical reports | Predictive AI assistant, demand forecasting, and cashier anomaly alerts |

---

## 2. Multi-Tenant Architecture & Data Isolation Model

```
                    ┌────────────────────────────────────────────────────────┐
                    │               SUPER ADMIN CONTROL PLANE                │
                    │   • Global Tenant Directory    • License Policies      │
                    │   • Subscription Lifecycle     • Feature Marketplace   │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
  ┌──────────────────────────────┐                              ┌──────────────────────────────┐
  │   TENANT A: "The Roastery"   │                              │  TENANT B: "Cloud Kitchens"  │
  │   • Business Type: Cafe      │                              │  • Business Type: Delivery   │
  │   • Sub: Professional Plan   │                              │  • Sub: Enterprise Plan      │
  │   • Status: Active           │                              │  • Status: Active            │
  ├──────────────────────────────┤                              ├──────────────────────────────┤
  │ Outlets:                     │                              │ Outlets:                     │
  │ ├─ Indiranagar Flagship      │                              │ ├─ Koramangala Commissary    │
  │ └─ Koramangala Roastery      │                              │ ├─ Whitefield Dark Kitchen   │
  │ Isolated Data:               │                              │ └─ HSR Layout Hub            │
  │ • Menu & Custom Coffee Tags  │                              │ Isolated Data:               │
  │ • Dining Tables & QR Codes   │                              │ • Packaging Charge Modifiers │
  │ • Raw Ingredients & Recipes  │                              │ • Bulk POs & Vendor Ledgers  │
  │ • Cashiers, Baristas, Staff  │                              │ • Aggregator API Webhooks    │
  └──────────────────────────────┘                              └──────────────────────────────┘
```

- **Tenant Isolation**: Every business created during registration is assigned a unique `restaurantId`. All downstream entities—branches, menus, inventory raw materials, live orders, tables, customer profiles, staff accounts, and financial records—are scoped strictly to that tenant.
- **Client-Side Simulation & Hydration**: During the current frontend release, tenant state is managed in the reactive React `AuthContext` with deterministic browser `localStorage` persistence (`saas_businesses`, `saas_tenant_sub_status`, `saas_onboarding_draft`, `saas_trial_config`).
- **Production-Ready Schema Separation**: Data schemas defined in `types/restaurant.ts`, `types/order.ts`, `types/inventory.ts`, `types/saas.ts`, and `types/subscription.ts` map directly to relational foreign-key schemas (PostgreSQL / Supabase / Prisma / MongoDB multi-tenancy) for seamless backend integration.

---

## 3. Complete Sidebar & Navigation Directory

The sidebar navigation (`components/layout/Sidebar.tsx`) automatically adapts based on whether the logged-in user is a **Super Admin** or a **Restaurant Business Role** (and further filters items based on role-based permissions and active business features).

### 3.1 Super Admin Navigation Hierarchy
- **Core Platform**:
  - `Platform Dashboard` (`/super-admin/dashboard`) — Global MRR, active restaurants, churn, and system health
  - `Business Management` (`/super-admin/restaurants`) — Full tenant directory, status toggling, branch counts
  - `Owner Management` (`/super-admin/owners`) — Registered business founders, KYC details, verified phone/email
  - `Branch Management` (`/super-admin/branches`) — Physical outlets across all tenants, seating capacity
- **Monetization**:
  - `Subscription Plans` (`/super-admin/subscriptions`) — 1-click Activate, trial extension, plan change, coupon, policy config
  - `Gateways & Settlements` (`/super-admin/payments`) — Razorpay/Cashfree payout logs, gateway fees, settlement batches
  - `Platform Invoices` (`/super-admin/invoices`) — B2B GST tax invoice ledger, SAC 998313 audit trail
  - `Feature Marketplace` (`/super-admin/marketplace`) — Add-on apps catalog, commission pricing, tenant installations
  - `SaaS Coupons` (`/super-admin/coupons`) — Platform discount voucher management
- **Intelligence & Care**:
  - `Revenue Reports` (`/super-admin/reports`) — MRR, ARR, LTV, CAC, churn rate, plan distribution charts
  - `Support Tickets` (`/super-admin/tickets`) — Customer support desk, ticket resolution SLA tracker
  - `Notifications` (`/super-admin/notifications`) — Platform-wide broadcast announcements and release notes
  - `Platform Settings` (`/super-admin/settings`) — SMTP mailer, payment gateway API keys, security policies

### 3.2 Business Owner & Staff Navigation Hierarchy
- **Overview**:
  - `Dashboard` (`/owner/dashboard`) — Live outlet gross sales, net revenue, active orders, occupancy, quick actions
- **Sales & Customer Touchpoints**:
  - `POS / Billing` (`/owner/pos`) — Lightning billing, dynamic menu catalog, table selection, split bill, recipe deduction
  - `Orders` (`/owner/orders`) — Live order tracking (Dine-in, Takeaway, Delivery, Online), status transitions, receipt printing
  - `Tables` (`/owner/tables`) — Interactive graphical table layout, waiter assignment, floor switching, merge/transfer
  - `Reservations` (`/owner/reservations`) — Advance guest reservations, party sizes, deposit tracking, time slots
  - `Online Store & QR` (`/owner/online-ordering`) — QR ordering preview, digital store catalog, takeaway toggle
- **Operations & Kitchen**:
  - `Menu Management` (`/owner/menu`) — Categories, dishes, variants, addon groups, price overrides, out-of-stock toggles
  - `Kitchen / KOT` (`/owner/kot`) — Live Kitchen Order Ticket display, station routing, prep timers, bump bar
  - `Inventory` (`/owner/inventory`) — Raw materials, stock levels, low-stock warnings, reorder thresholds
  - `Suppliers` (`/owner/suppliers`) — Vendor contacts, GSTIN, payment terms, supply catalogs
  - `Purchase Orders` (`/owner/purchase-orders`) — PO creation, PO approval workflow, Goods Received Note (GRN) inspection
  - `Recipe & Costing` (`/owner/recipes`) — Dish Bill-of-Materials (BOM), ingredient costing, food cost %, gross margin
  - `Waste Management` (`/owner/waste`) — Spoilage logs, overproduction audit, chef wastage accountability
- **Customer Management**:
  - `Customers` (`/owner/customers`) — Guest directory, total spend, visit frequency, VIP badges, favorite dishes
  - `Loyalty & Rewards` (`/owner/loyalty`) — Points accrual rules, tier levels (Silver, Gold, Platinum), voucher redemption
  - `Customer Feedback` (`/owner/feedback`) — Star ratings, food quality reviews, net promoter score (NPS)
  - `Marketing Campaigns` (`/owner/campaigns`) — Automated SMS/WhatsApp promotional blasts, festive vouchers
- **Team Management**:
  - `Staff Directory` (`/owner/staff`) — Employee roster, salary, branch assignment, system login credentials
  - `Staff Attendance` (`/owner/attendance`) — Daily clock-in/out logs, shift hours, overtime calculations
  - `Shifts & Roster` (`/owner/shifts`) — Weekly rota planning, morning/evening kitchen shifts, coverage alerts
  - `Roles & Permissions` (`/owner/roles`) — Granular Role-Based Access Control matrix by module
- **Business Management**:
  - `Branches` (`/owner/branches`) — Multi-outlet configuration, outlet managers, daily revenue comparisons
  - `Expenses` (`/owner/expenses`) — Operating overheads (rent, electricity, gas cylinders, municipal fees)
  - `Discounts & Offers` (`/owner/offers`) — Flat discounts, percentage promos, combo meals, happy hours
  - `Franchise Network` (`/owner/franchise`) — Franchisee agreements, gross sales audit, royalty fee calculations
- **Intelligence & AI**:
  - `AI Copilot Assistant` (`/owner/ai-assistant`) — Conversational business AI assistant with preset analytical queries
  - `AI Demand Forecast` (`/owner/ai-forecasting`) — ML projected weekend sales, footfall, and raw ingredient reorder needs
  - `Profit & Loss (P&L)` (`/owner/profit-loss`) — True restaurant P&L, COGS breakdown, operational EBITDA, break-even calculator
  - `Business Analytics` (`/owner/analytics`) — Revenue charts, hourly heatmaps, dish sales velocity, average order value (AOV)
  - `Fraud Detection Audit` (`/owner/fraud-detection`) — Surveillance of unauthorized voids, suspicious discounts, cash drawer openings
- **Account & System**:
  - `Subscription & Billing` (`/owner/subscription`) — Active plan tier, trial countdown, lifecycle demo bar, GST invoice downloads
  - `Feature Marketplace` (`/owner/marketplace`) — 1-click installation of add-on modules (WhatsApp bot, Tally sync, UberDirect)
  - `Integrations Hub` (`/owner/integrations`) — Aggregators (Swiggy, Zomato), SMS gateways, payment terminal integration
  - `Settings` (`/owner/settings`) — Restaurant profile, GSTIN, FSSAI, tax rates (CGST/SGST), thermal receipt printer setup

---

## 4. Role-Based Access Control (RBAC) Specification

The system enforces role validation through the `<DashboardLayout allowedRoles={[...]}>` higher-order layout wrapper. Unauthorized access renders a restricted security screen with quick role switching.

| User Role | System Identifier | Default Landing Page | Primary Access Permissions & Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `super_admin` | `/super-admin/dashboard` | Unrestricted platform access across all tenants, SaaS licensing, MRR reports, subscription overrides. Cannot view private POS carts. |
| **Business Owner** | `restaurant_owner` | `/owner/dashboard` | Complete control over their own restaurant, all branches, staff salaries, recipes, P&L, franchise network, and billing subscription. |
| **Branch Manager** | `branch_manager` | `/owner/dashboard` | Scoped to assigned physical branch. Full POS, orders, tables, staff attendance, shift scheduling, inventory, and expense logging. Cannot change SaaS subscription. |
| **Cashier** | `cashier` | `/owner/pos` | High-speed POS billing, cart modifications, discount application, split billing, payment collection, daily cash drawer reconciliation. |
| **Floor Waiter** | `waiter` | `/owner/tables` | Graphical table layout, guest seating, mobile order punch, KOT dispatch, bill request. Cannot view inventory purchase prices or P&L. |
| **Kitchen Staff** | `kitchen_staff` | `/owner/kot` | Live KOT display, station-based food preparation, bump bar completion, waste logging. Blocked from customer CRM, POS billing, and finances. |
| **Accountant** | `accountant` | `/owner/reports` | Expenses, vendor purchase orders, P&L statements, GSTR-1 & GSTR-2B tax compliance, platform subscription tax invoices. Blocked from operational KOT/POS. |

---

## 5. Exhaustive Page-by-Page Technical & Functional Directory

### 5.1 Public & Authentication Layer

#### 1. Home / Landing Page (`/` – `app/page.tsx`)
- **Purpose**: Public showcase of the Zestora-inspired SaaS platform for prospective food business owners.
- **Features Displayed**: Hero section, interactive demo entry points, 15 supported business formats carousel, feature highlights (POS, Inventory, KOT, Multi-branch), live ROI calculator, pricing comparison table, customer testimonials, and FAQ accordion.
- **Buttons & Actions**:
  - `Start 7-Day Free Trial` ➔ Routes to `/register`.
  - `Sign In to Dashboard` ➔ Routes to `/login`.
  - `Explore Live Demo POS` ➔ Routes to `/order/demo`.
  - Monthly / Annual pricing cycle toggle with 20% discount calculation.

#### 2. Business Owner Sign Up (`/register` – `app/register/page.tsx`)
- **Purpose**: Self-serve registration enabling any restaurant founder to onboard without Super Admin assistance.
- **Features & Inputs**: Full Name, Work Email, Mobile Number, Password, Business/Brand Name, Business Type (15 options), Primary Cuisine, Outlets count, Address, City, State, Terms agreement.
- **Buttons & Actions**:
  - `Create Account & Continue to Onboarding` ➔ Validates inputs, saves draft into `saas_onboarding_draft`, provisions tenant in `AuthContext` with a 7-day free trial on the Starter plan, and routes to `/verify-email`.
  - `Sign In Here` ➔ Links to `/login`.

#### 3. Email Verification (`/verify-email` – `app/verify-email/page.tsx`)
- **Purpose**: Authenticates the owner's corporate email address via a 6-digit confirmation PIN.
- **Features & Inputs**: 6 individual numeric OTP cells, email display, 30s resend cooldown.
- **Buttons & Actions**:
  - `Fill Demo Code (849201)` ➔ Autofills the demo OTP.
  - `Verify & Continue Setup` ➔ Displays green success checkmark and redirects to `/verify-otp`.
  - `Resend Code` ➔ Simulates OTP re-dispatch.

#### 4. Mobile OTP Verification (`/verify-otp` – `app/verify-otp/page.tsx`)
- **Purpose**: Validates owner's WhatsApp/SMS mobile number for critical alerts, billing OTPs, and KOT notifications.
- **Features & Inputs**: 6 auto-advancing OTP inputs with backspace and clipboard paste support, registered phone pill with edit link, 30s timer, 256-bit bank grade encryption badge.
- **Buttons & Actions**:
  - `Fill Demo OTP (529143)` ➔ Injects valid test PIN.
  - `Verify & Start 7-Day Free Trial` ➔ Activates the free trial in `AuthContext` and launches `/onboarding`.
  - `Send OTP via WhatsApp` ➔ Simulates fallback OTP delivery over official WhatsApp Business API.

#### 5. User Login (`/login` – `app/login/page.tsx`)
- **Purpose**: Unified authentication portal supporting credential login and 1-click role-based switching.
- **Features & Inputs**: Email, password, remember me checkbox, **"Demo Quick Login as Role"** badge grid (Super Admin, Owner, Manager, Cashier, Waiter, Chef, Accountant).
- **Buttons & Actions**:
  - `Sign In to Workspace` ➔ Matches credentials against `data/authData.ts` and routes to role-specific dashboard.
  - Quick-switch buttons ➔ Instantly bypasses password for instant evaluator testing.
  - `Register Your Business` ➔ Directs to `/register`.
  - `Forgot Password?` ➔ Directs to `/forgot-password`.

#### 6. Forgot & Reset Password (`/forgot-password`, `/reset-password`)
- **Purpose**: Password recovery workflow via secure reset token.
- **Buttons & Actions**: Dispatches reset email link; provides new password input with strength indicator.

---

### 5.2 Business Onboarding Wizard

#### 7. 13-Step Business Onboarding (`/onboarding` – `app/onboarding/page.tsx`)
- **Purpose**: Comprehensive configuration studio tailored to the owner's specific food format.
- **The 13 Modular Steps**:
  1. *Owner Info*: Founder name, email, phone, corporate title.
  2. *Business Profile*: Brand name, tagline, description, address, pincode, operating hours.
  3. *Type & Format*: Selects format (Cafe, QSR, Fine Dining, Cloud Kitchen, Bakery, etc.) which dynamically unlocks operational flags (e.g. coffee tags, cake orders, table management).
  4. *Branches*: Flagship branch name, outlet code, manager name.
  5. *Order Channels*: Toggles Dine-in, Takeaway, Direct Delivery, Counter Pickup, QR Ordering.
  6. *Menu Catalog*: Initial categories, base currency, weight-based pricing toggle.
  7. *Table Layout*: Seating capacity, floor names (Ground Floor, Patio), total tables.
  8. *Billing & Tax*: GSTIN, FSSAI 14-digit license, CGST/SGST rates, service charge.
  9. *Payment Modes*: Cash, UPI, Cards, Split billing, UPI VPA.
  10. *Kitchen & KOT*: Kitchen display stations (Bakery, Barista, Hot Kitchen), auto-print KOT on punch, prep timers.
  11. *Staff Setup*: Initial staff headcount, default role assignment.
  12. *SaaS Plan*: Starter (₹1,499), Professional (₹2,999), Business (₹4,999), Enterprise (₹8,999) with 7-Day Free Trial included.
  13. *Review & Launch*: Summary audit card verifying all configurations.
- **Buttons & Actions**:
  - `Save & Continue Later` ➔ Saves progress to `localStorage.getItem('saas_onboarding_draft')`.
  - `Next Step` / `Previous Step` ➔ Advances through steps.
  - `Launch Restaurant Workspace` ➔ Finalizes setup, initializes live menu/tables/inventory, and navigates to `/owner/dashboard`.

---

### 5.3 Core Sales & Billing Layer

#### 8. Business Owner Dashboard (`/owner/dashboard` – `app/owner/dashboard/page.tsx`)
- **Purpose**: Central mission-control hub summarizing daily operations for the active branch or all branches.
- **KPI Metrics**: Today's Gross Sales, Net Revenue, Orders Count, Average Order Value (AOV), Active Dine-in Tables Occupancy %, Top Selling Category.
- **Visualizations**: 24-hour hourly sales trend chart, order channel breakdown (Dine-in vs Delivery vs Takeaway).
- **Interactive Widgets**: Quick-action pills (`New POS Bill`, `View Live Tables`, `Kitchen KOT`, `Add Menu Dish`, `Inventory Alert`), live orders list with instant status toggles.
- **Module Connections**: Feeds live order counts from `ordersData.ts` and updates dynamically as orders are created in POS.

#### 9. POS / Billing Terminal (`/owner/pos` – `app/owner/pos/page.tsx`)
- **Purpose**: High-speed touch-friendly billing interface used by cashiers and floor captains.
- **Features**:
  - Search dishes by keyword or shortcode.
  - Category filter pills (`Beverages`, `Appetizers`, `Breads`, `Main Course`, `Desserts`).
  - Veg / Non-Veg quick toggles.
  - Item customizer modal for portion variants (Half / Full) and add-on ingredients.
  - **Cart Management**: Real-time quantity adjustment, item deletion, item-level kitchen notes.
  - **Table Linkage**: Associate bill with specific dining table (`T-01` through `T-12`).
  - **Customer CRM Lookup**: Link customer mobile to auto-apply loyalty points and customer name.
  - **Discounts**: Flat currency (₹) or percentage (%) discount application.
  - **Payment Mode Selection**: Cash, UPI / QR, Credit Card, Split Payment.
  - **Recipe Deduction Integration**: Calls `deductRecipeIngredients()` upon bill punch, reducing ingredient stock levels in real time.
- **Buttons & Actions**:
  - `Hold Bill` / `Recall Held Orders` ➔ Park orders while guests decide.
  - `Split Bill` ➔ Split grand total across 2 to 6 diners evenly.
  - `Keyboard Shortcuts` ➔ Modal showing shortcut keys (`F2` Search, `F4` Hold, `F8` Checkout).
  - `Punch Order & Print Receipt` ➔ Adds order, marks table occupied, deducts recipe stock, and displays printable tax receipt modal.

#### 10. Live Orders Management (`/owner/orders` – `app/owner/orders/page.tsx`)
- **Purpose**: Operational list of all current and historical orders across dine-in, takeaway, and delivery.
- **Features**: Status tabs (`All`, `Pending`, `Preparing`, `Ready`, `Delivered`, `Completed`, `Cancelled`), order search by ID or customer, date range picker.
- **Table Data**: Order ID, Table # / Type, Customer info, Line items summary, Grand total, Payment status (Paid/Unpaid), Order Status badge.
- **Buttons & Actions**:
  - `Update Status` ➔ Moves order through lifecycle: `Pending` ➔ `Preparing` ➔ `Ready` ➔ `Completed`.
  - `Print KOT / Bill` ➔ Launches thermal receipt modal.

#### 11. Graphical Table Management (`/owner/tables` – `app/owner/tables/page.tsx`)
- **Purpose**: Visual floor plan for casual and fine dining restaurants.
- **Features**:
  - Floor switcher tabs (`Ground Floor`, `First Floor AC Lounge`, `Outdoor Patio`).
  - Color-coded table cards: **Green** (Available), **Red** (Occupied with active bill and elapsed timer), **Amber** (Reserved), **Blue** (Cleaning needed).
  - Shows seated guest count, assigned floor waiter, and running bill total.
- **Buttons & Actions**:
  - `New Order on Table` ➔ Opens POS pre-linked to that table number.
  - `Assign Waiter` ➔ Modal allocating floor staff.
  - `Transfer Table` ➔ Move party from Table A to Table B seamlessly.
  - `Merge Tables` ➔ Combine Table 3 + Table 4 for large banquet parties.
  - `Clear / Reset Table` ➔ Marks table available after sanitation.

#### 12. Advance Table Reservations (`/owner/reservations` – `app/owner/reservations/page.tsx`)
- **Purpose**: Books upcoming dining parties, prevents double-booking, and tracks guest dietary requests.
- **Features**: Calendar date selector, time slot filter (Lunch / Dinner / Late Evening), booking status (`Confirmed`, `Waitlisted`, `Seated`, `Cancelled`).
- **Buttons & Actions**:
  - `New Reservation` modal: Guest Name, Mobile, Party Size, Floor preference, Special Notes (e.g. Birthday, Anniversary).
  - `Mark Seated` ➔ Transitions table to occupied in live table module.

#### 13. Digital Store & QR Ordering (`/owner/online-ordering` – `app/owner/online-ordering/page.tsx`)
- **Purpose**: Self-serve digital storefront enabling contactless dining and direct delivery pickup.
- **Features**: Live QR code generator for tables, direct digital ordering URL (`/order/demo`), online store open/closed toggle, delivery radius configuration.
- **Buttons & Actions**:
  - `Download Table QR Standee` (Printable high-res PDF).
  - `Open Customer View` ➔ Launches responsive mobile ordering catalog.

---

### 5.4 Kitchen & Production Layer

#### 14. Kitchen Order Ticket (KOT) & KDS (`/owner/kot` – `app/owner/kot/page.tsx`)
- **Purpose**: Live Kitchen Display System replacing messy paper tickets with digital screens for head chefs and prep stations.
- **Features**:
  - Station routing tabs (`All Stations`, `Main Kitchen Hot Station`, `Barista Coffee Bar`, `Bakery & Pastry Oven`).
  - Ticket cards with elapsed preparation timers:
    - **Green header**: < 10 mins (On Schedule)
    - **Amber header**: 10–20 mins (Approaching Target)
    - **Red pulsating header**: > 20 mins (Delayed Prep Alert)
  - Clear item indicators: Dish name, quantity, portion size, and special chef instructions (e.g. *"Extra crispy naan, zero chili"*).
- **Buttons & Actions**:
  - `Start Preparing` ➔ Sets status to in-progress.
  - `Mark Ready (Bump)` ➔ Dispatches waiter alert that food is plated for pickup.
  - `Reprint KOT` ➔ Sends command to thermal kitchen printer.

#### 15. Recipe Management & Food Costing Studio (`/owner/recipes` – `app/owner/recipes/page.tsx`)
- **Purpose**: Connects culinary dishes to raw ingredient inventory to achieve accurate food costing and automated stock deduction.
- **Features**:
  - Dish Bill-of-Materials (BOM) calculator showing exact ingredient quantities (e.g. Paneer Tikka = 200g Paneer + 50ml Marinade Oil + 10g Masala).
  - Automated calculation of **Total Recipe Cost**, **Target Selling Price**, **Food Cost Percentage** (e.g. 28.5%), and **Gross Profit Margin** (71.5%).
  - Real-time margin warning if ingredient price spikes push food cost above 35%.
- **Buttons & Actions**:
  - `Create New Recipe` modal: Add ingredients, specify unit (kg, g, L, ml, pcs), and dynamic cost preview.
  - `Edit Recipe BOM` ➔ Adjust chef portioning.

#### 16. Food Waste Management (`/owner/waste` – `app/owner/waste/page.tsx`)
- **Purpose**: Tracks kitchen spoilage, prep errors, and overproduction to eliminate culinary leakage.
- **Features**: Waste logs by dish/ingredient, waste reason filter (`Overproduction`, `Expired Stock`, `Kitchen Mishap / Burnt`, `Customer Return`), cumulative financial waste cost.
- **Buttons & Actions**:
  - `Log Food Waste` modal: Item name, quantity lost, unit cost, responsible chef/staff, and corrective reason.

---

### 5.5 Inventory & Supply Chain Engine

#### 17. Raw Materials Inventory (`/owner/inventory` – `app/owner/inventory/page.tsx`)
- **Purpose**: Live stock room tracker for raw commodities (dairy, poultry, grain, beverages, packaging).
- **Features**:
  - Stock table: Item Name, Category, Current In-Stock, Unit (kg, L, pcs), Minimum Reorder Level, Cost per Unit, Stock Status (`In Stock`, `Low Stock`, `Out of Stock`).
  - Visual color badges highlighting critical items requiring replenishment.
- **Buttons & Actions**:
  - `Add Raw Material` modal: Item details, unit of measurement, initial stock, min buffer.
  - `Quick Stock Adjustment` ➔ Log physical inventory audits (+ / - variance).
  - `Generate Reorder PO` ➔ Auto-populates purchase order for low-stock items.

#### 18. Supplier & Vendor Directory (`/owner/suppliers` – `app/owner/suppliers/page.tsx`)
- **Purpose**: Contact and commercial ledger for dairy farms, poultry vendors, packaging manufacturers, and beverage distributors.
- **Features**: Vendor Name, Contact Person, Phone, Email, GSTIN, Payment Terms (Net 15 / Net 30), Supplied Categories, Total Outstanding Payable.
- **Buttons & Actions**:
  - `Add New Supplier` modal.
  - `View Supplied Products`.
  - `Call / WhatsApp Vendor` shortcut.

#### 19. Purchase Orders (PO) & GRN (`/owner/purchase-orders` – `app/owner/purchase-orders/page.tsx`)
- **Purpose**: Formal B2B procurement workflow from purchase requisition to Goods Received Note (GRN) verification.
- **Features**: PO Number, Vendor Name, Items summary, Total PO value, Approval Status (`Draft`, `Approved`, `Dispatched`, `Received / GRN Completed`, `Cancelled`).
- **Buttons & Actions**:
  - `Create Purchase Order` modal: Select supplier, line items, quantity, agreed unit cost.
  - `Approve PO` (Manager/Owner only).
  - `Accept GRN Delivery` ➔ Automatically credits current inventory levels by delivered quantities.

---

### 5.6 Customer Relationship & Growth Modules

#### 20. Customer CRM Directory (`/owner/customers` – `app/owner/customers/page.tsx`)
- **Purpose**: 360-degree customer relationship records capturing dining preferences and spend history.
- **Features**: Guest Name, Phone, Email, Total Visits, Lifetime Spend (LTV), Last Visit Date, Loyalty Tier, Dietary preference (Vegetarian, Jain, Non-Veg).
- **Buttons & Actions**:
  - `Add Customer Record`.
  - `View Dining History` ➔ See past order receipts.
  - `Send WhatsApp Promo`.

#### 21. Loyalty & Rewards Program (`/owner/loyalty` – `app/owner/loyalty/page.tsx`)
- **Purpose**: Retains diners through gamified point accrual and VIP milestone vouchers.
- **Features**:
  - Tier rules: Silver (1 pt / ₹100), Gold (1.5 pts / ₹100), Platinum (2 pts / ₹100).
  - Point redemption rules: 1 point = ₹1 cashback on bill.
  - Customer leaderboard by loyalty points balance.
- **Buttons & Actions**:
  - `Configure Tier Rules` modal.
  - `Manually Issue Reward Points`.

#### 22. Customer Feedback & NPS (`/owner/feedback` – `app/owner/feedback/page.tsx`)
- **Purpose**: Aggregates post-meal star ratings and qualitative reviews from QR checkout.
- **Features**: Overall Net Promoter Score (NPS), Average Rating (out of 5 stars), category breakdown (Food Taste, Ambience, Service Speed, Value for Money), review comments list.
- **Buttons & Actions**:
  - `Reply to Customer via WhatsApp/SMS`.
  - Filter reviews by 1-star (requires manager escalation) to 5-star praise.

#### 23. Marketing Campaigns & Broadcasts (`/owner/campaigns` – `app/owner/campaigns/page.tsx`)
- **Purpose**: Re-engages dormant customers with automated marketing messages.
- **Features**: Campaign Name, Channel (WhatsApp / SMS), Target Segment (All Customers, High Spenders, Inactive > 30 Days), Delivery stats (Sent, Delivered, Opened, Revenue Generated).
- **Buttons & Actions**:
  - `Launch New Campaign` modal with preview of WhatsApp template message.

---

### 5.7 Human Resources & Shift Rostering

#### 24. Staff Directory & Logins (`/owner/staff` – `app/owner/staff/page.tsx`)
- **Purpose**: Employee registry managing operational roles, contact info, and system logins.
- **Features**: Staff Name, Assigned Branch, Role (`Branch Manager`, `Cashier`, `Waiter`, `Chef`, `Accountant`), Base Salary, Shift Timings, Status (`Active` / `On Leave`).
- **Buttons & Actions**:
  - `Add New Employee` modal: Generates system username/PIN for POS login.
  - `Edit Permissions`.

#### 25. Attendance & Clock-In Tracker (`/owner/attendance` – `app/owner/attendance/page.tsx`)
- **Purpose**: Daily employee punch log tracking punctuality, worked hours, and overtime.
- **Features**: Date picker, employee attendance status (`Present`, `Late`, `Absent`, `Half-day`), Clock-in time, Clock-out time, Total logged hours.
- **Buttons & Actions**:
  - `Manual Punch Adjustment`.
  - `Export Monthly Attendance Sheet`.

#### 26. Weekly Shifts & Rostering (`/owner/shifts` – `app/owner/shifts/page.tsx`)
- **Purpose**: Visual timetable scheduling floor captains and kitchen staff across morning and evening shifts.
- **Features**: Weekly calendar grid (Monday–Sunday), shift slots (Morning: 09:00–16:00, Evening: 16:00–23:00), shift coverage warning indicators.
- **Buttons & Actions**:
  - `Assign Staff to Shift`.
  - `Copy Previous Week's Schedule`.

#### 27. Granular Roles & Permissions (`/owner/roles` – `app/owner/roles/page.tsx`)
- **Purpose**: Restricts system actions by employee role (e.g. prevent cashier from voiding bills without manager approval).
- **Features**: Permission matrix listing modules vs. roles with checkable permissions (`View`, `Create`, `Edit`, `Delete`, `Override`).

---

### 5.8 Multi-Branch & Franchise Infrastructure

#### 28. Multi-Branch Operations (`/owner/branches` – `app/owner/branches/page.tsx`)
- **Purpose**: High-level multi-outlet management for growing restaurant chains.
- **Features**: Outlet cards showing physical address, seating capacity, assigned manager, daily revenue, active orders count, and operational status (`Active` / `Inactive`).
- **Buttons & Actions**:
  - `Add New Branch` modal: Branch Name, Code, City, Pincode, Seating tables count.
  - `Switch Active Outlet` (or select "All Branches" in top navbar for aggregated analytics).

#### 29. Operating Expenses Ledger (`/owner/expenses` – `app/owner/expenses/page.tsx`)
- **Purpose**: Tracks operational overheads beyond inventory to establish true net profit.
- **Features**: Expense categories (`Rent & Lease`, `Utility - Electricity/Water`, `LPG Gas Cylinders`, `Cleaning & Sanitation`, `Equipment Maintenance`, `Marketing`), payee name, receipt upload status.
- **Buttons & Actions**:
  - `Record Expense` modal.
  - Monthly expense bar chart.

#### 30. Discounts, Coupons & Happy Hours (`/owner/offers` – `app/owner/offers/page.tsx`)
- **Purpose**: Configures promotional pricing rules applied during POS checkout.
- **Features**: Promo Code, Discount Type (% or Flat ₹), Minimum Bill Value, Maximum Discount Cap, Validity Period, Applicable Days.
- **Buttons & Actions**:
  - `Create Promo Offer`.
  - `Toggle Offer Active/Inactive`.

#### 31. Franchise Network & Royalties (`/owner/franchise` – `app/owner/franchise/page.tsx`)
- **Purpose**: For franchisors to audit franchisee outlets and collect royalty fees.
- **Features**: Franchisee Outlet Code, Branch Name, Franchisee Owner Name, Monthly Gross POS Sales, Agreed Royalty Percentage (e.g. 5.0%), Computed Royalty Due, Royalty Status (`Paid`, `Pending`, `Overdue`).
- **Buttons & Actions**:
  - `Add Franchise Outlet` modal.
  - `Generate Royalty Invoice`.

---

### 5.9 Financial Intelligence & Fraud Surveillance

#### 32. True Profit & Loss Statement (P&L) (`/owner/profit-loss` – `app/owner/profit-loss/page.tsx`)
- **Purpose**: Comprehensive financial statement accounting for revenues, Cost of Goods Sold (COGS), operating expenses, and net profit.
- **Features**:
  - Revenue Breakdown (Dine-in, Online Delivery, Takeaway).
  - COGS breakdown (Raw materials consumed via recipes + kitchen waste).
  - Operating Overheads (Staff payroll + rent + utilities).
  - Operating EBITDA margin % and Net Profit.
  - **Interactive Break-Even Simulator**: Input monthly fixed costs and average gross margin % to compute required monthly and daily break-even sales run rate.
- **Buttons & Actions**:
  - `Export P&L (PDF / Excel)` for chartered accountants.

#### 33. Business Reports & Sales Analytics (`/owner/reports`, `/owner/analytics`)
- **Purpose**: Deep statistical breakdown of restaurant performance.
- **Visualizations**: Daily sales bar chart, payment mode distribution pie chart (UPI vs Cards vs Cash), category contribution, APC (Average Per Cover), and peak hourly rush heatmaps.
- **Filters**: Date range (Today, Yesterday, Last 7 Days, Month to Date, Custom Range), branch filter.

#### 34. Cashier Fraud & Anomaly Audit (`/owner/fraud-detection` – `app/owner/fraud-detection/page.tsx`)
- **Purpose**: AI surveillance monitoring cashier irregularities that indicate pilferage or manual manipulation.
- **Features**:
  - Severity categories: **Critical Risk**, **Warning**, **Review**.
  - Monitored anomalies:
    - *Post-KOT bill cancellations without manager authorization*.
    - *Repeated cash drawer open events without an active bill*.
    - *Excessive 100% complimentary discounts by cashier*.
    - *Item void after kitchen preparation started*.
  - Estimated financial amount at risk.
- **Buttons & Actions**:
  - `Audit Incident` ➔ Inspect detailed transaction snapshot.
  - `Clear Incident` / `Flag for Investigation`.

---

### 5.10 Artificial Intelligence & Predictive Modeling

#### 35. AI Copilot Business Assistant (`/owner/ai-assistant` – `app/owner/ai-assistant/page.tsx`)
- **Purpose**: Interactive conversational AI providing instant operational answers.
- **Features**:
  - Natural language chat window with streaming replies.
  - Preset quick-prompt buttons:
    - *"What is our projected weekend demand?"*
    - *"Why did net profit dip on Tuesday?"*
    - *"Which 3 dishes have high popularity but low margin?"*
    - *"Generate ingredient reorder PO for Friday."*
  - Structured analytical cards with sentiment indicators and actionable suggestion pills.

#### 36. AI Demand & Ingredient Forecasting (`/owner/ai-forecasting` – `app/owner/ai-forecasting/page.tsx`)
- **Purpose**: Predictive machine-learning model calculating future ingredient consumption before the weekend rush.
- **Features**:
  - 7-day forward projection incorporating historical trends, weekend footfall multipliers, and scheduled table reservations.
  - Daily projected covers (diners) and expected gross sales.
  - **Critical Raw Material Reorder Alerts**: Identifies impending shortages (e.g. *"Fresh Chicken needed: 145 kg, current stock: 42 kg. Reorder 105 kg before Friday noon"*).
- **Buttons & Actions**:
  - `Auto-Generate Weekend POs` ➔ Drafts purchase orders for dairy and poultry vendors automatically.

---

### 5.11 SaaS Account, Marketplace & Licensing

#### 37. SaaS Subscription & Plan Hub (`/owner/subscription` – `app/owner/subscription/page.tsx`)
- **Purpose**: Self-serve subscription management, plan upgrades, auto-renewal toggles, and B2B GST tax invoice downloads.
- **Features**:
  - **Lifecycle Demo Simulator**: 1-click test buttons allowing the user to experience all subscription phases: `Trial (5d)`, `Active Paid`, `Payment Due`, `Grace Period (3d)`, `Suspended (Restricted)`.
  - Current Plan banner with active quota bars (Outlets used, Staff accounts, Monthly orders).
  - 4 Plan Cards (Starter, Professional, Business, Enterprise) with monthly/yearly pricing.
  - Auto-renewal mandate switch.
  - Billing & GST Tax Receipts table with SAC code `998313`.
- **Buttons & Actions**:
  - `Switch Plan` / `Renew Plan` ➔ Routes to checkout.
  - `View Tax Invoice` ➔ Opens printable official B2B GST Tax Invoice receipt.

#### 38. Dedicated SaaS Checkout (`/owner/subscription/checkout` – `app/owner/subscription/checkout/page.tsx`)
- **Purpose**: Production payment checkout architecture supporting Indian payment rails (Razorpay & Cashfree).
- **Features**:
  - Plan picker (Starter, Professional, Business, Enterprise) and billing cycle switcher (Save 20% on Annual).
  - Promo coupon validator (`GROWTH50`, `STARTUPFREE`, `FESTIVE20`, `WELCOME50`) with live subtotal deduction.
  - B2B GST tax invoice summary: Base price, Discount, Taxable base, 18% GST (CGST 9% + SGST 9%) with SAC `998313`, Total payable.
  - **Payment Tabs**:
    1. *UPI*: Dynamic QR code, UPI ID field, UPI AutoPay recurring mandate checkbox.
    2. *Cards*: Cardholder name, number, expiry, CVV, RBI-compliant e-mandate checkbox.
    3. *Net Banking*: HDFC, ICICI, SBI, Axis, Kotak, 40+ banks.
    4. *Recurring AutoPay*: e-NACH standing instruction mandate (Account #, IFSC).
  - **Interactive Gateway Simulation Modal**: Realistic Razorpay popup with **"Simulate Payment SUCCESS"** and **"Simulate Payment FAILURE"** test buttons.
  - **Confirmation & Failure Views**: Transaction ID, Order ID, downloadable tax invoice, or failure code with retry button.

#### 39. Feature Marketplace & Add-ons (`/owner/marketplace` – `app/owner/marketplace/page.tsx`)
- **Purpose**: App store allowing restaurants to activate third-party tools as their business scales.
- **Features**: Available add-on plugins (WhatsApp Automated Bot, Tally Prime Accounting Sync, Swiggy/Zomato Direct Aggregator Injection, UberDirect Fleet Dispatch, RFID Staff Cards).
- **Buttons & Actions**:
  - `Install Plugin` / `Manage Integration`.

#### 40. Platform Integrations (`/owner/integrations` – `app/owner/integrations/page.tsx`)
- **Purpose**: Configures API keys for SMS gateways (Twilio, Gupshup), payment machines (PineLabs, Paytm Soundbox), and food delivery aggregators.

#### 41. Restaurant & Tax Settings (`/owner/settings` – `app/owner/settings/page.tsx`)
- **Purpose**: General store profile, GSTIN, FSSAI number, bill header/footer text, thermal printer IP/Bluetooth configuration.

---

### 5.12 Super Admin Platform Management

#### 42. Super Admin Dashboard (`/super-admin/dashboard` – `app/super-admin/dashboard/page.tsx`)
- **Purpose**: Top-level SaaS commercial health dashboard for the platform founder and management team.
- **Key Metrics**: Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), Total Subscribed Businesses, Platform Churn Rate, Average Revenue Per User (ARPU).
- **Visualizations**: 12-month MRR growth trajectory, tenant distribution by plan tier (Starter vs Pro vs Business vs Enterprise), payment gateway collection health.

#### 43. Multi-Tenant Subscriptions Control (`/super-admin/subscriptions` – `app/super-admin/subscriptions/page.tsx`)
- **Purpose**: Centralized administrative control over every restaurant's license, lifecycle state, and billing rules.
- **Features**:
  - Status filter tabs: `All`, `Trial`, `Active`, `Payment Due`, `Grace Period`, `Suspended`.
  - **Global Policy Configuration Modal**: Sets platform-wide default Free Trial Duration (default: 7 days) and Grace Period Duration (default: 7 days).
  - **1-Click Tenant Controls**:
    - `Activate`: Instantly marks tenant Active and resets renewal date.
    - `Extend License`: Fast +30 Days or +1 Year license extensions.
    - `+7d Trial`: Grants complimentary trial days.
    - `Plan`: Switches tenant between Starter, Professional, Business, and Enterprise tiers.
    - `Promo`: Injects custom discount percentage.
    - `Suspend / Restore`: Moves tenant into restricted read-only mode or restores full access.
  - **Tier Pricing Editor**: Adjusts base rates for future signups.

#### 44. Business & Owner Registries (`/super-admin/restaurants`, `/super-admin/owners`, `/super-admin/branches`)
- **Purpose**: Master database of all onboarded restaurant legal entities, founder KYC data, and physical outlet counts.

#### 45. Platform Financials & Support (`/super-admin/payments`, `/super-admin/invoices`, `/super-admin/coupons`, `/super-admin/tickets`, `/super-admin/reports`, `/super-admin/settings`)
- **Purpose**: Audit trails of payment gateway fee deductions, customer support ticket SLAs, coupon code generation, and platform server configuration.

---

## 6. SaaS Subscription Lifecycle, Gateways & Grace Period Logic

### 6.1 State Machine & Tenant Access Matrix

```
   [ Sign Up ] ───► [ 7-Day Free Trial ] ───► [ Renewal Due ] ───► [ Payment Success ] ───► [ Active ]
                              │                      │                                          │
                              ▼                      ▼                                          │
                       (Trial Expired)        (AutoPay Failed)                                  │
                              │                      │                                          │
                              └───────────┬──────────┘                                          │
                                          ▼                                                     │
                                [ 7-Day Grace Period ]                                          │
                                          │                                                     │
                                          ▼                                                     │
                               (Grace Period Expired)                                           │
                                          │                                                     │
                                          ▼                                                     │
                             [ Suspended / Restricted ] ────────────────────────────────────────┘
                                 (Pay & Restore Access)
```

| Lifecycle Status | Top Banner Notification | POS Billing & Order Punching | Menu & Tables Setup | Historical Reports | Data Retention Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Trial** | `⏰ 7-Day Free Trial: X Days Left` | Full Access | Full Access | Full Access | 100% Protected |
| **Active** | None (Clean Header) | Full Access | Full Access | Full Access | 100% Protected |
| **Payment Due** | `⚠️ Renewal Due on [Date]` | Full Access | Full Access | Full Access | 100% Protected |
| **Grace Period** | `⚠️ Overdue: 7-Day Grace Active` | Full Access (Courtesy) | Full Access | Full Access | 100% Protected |
| **Suspended / Expired** | `🔒 Restricted Read-Only Mode` | **PAUSED (Read-Only)** | View Only | View & Export | **100% Protected (Never Deleted)** |
| **Cancelled** | Account Deactivated Banner | Blocked | Blocked | Export Available | Archived Safely |

### 6.2 Data Retention Policy
When a restaurant's subscription expires and the 7-day grace period lapses:
1. The platform **NEVER** deletes customer databases, menus, recipe records, or order logs.
2. The POS order creation modal displays a notice explaining that new billing is paused.
3. The owner can click **"Pay & Restore Access"** at any time. Upon payment completion, full operational functionality is instantly unlocked with zero data loss.

---

## 7. Technical Integration Roadmap (Backend, DB, Payment Gateways & AI)

To transition from the current frontend-only prototype to a full production deployment, use the following architectural blueprint:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               NEXT.JS APP ROUTER FRONTEND                              │
│         (React 19 / Bootstrap 5 / React Icons / Recharts / Context Architecture)       │
└───────────────────────────┬────────────────────────────────┬───────────────────────────┘
                            │ REST / GraphQL API Requests    │ Server Actions / Webhooks
                            ▼                                ▼
┌───────────────────────────────────────────────┐ ┌──────────────────────────────────────┐
│           BACKEND APPLICATION LAYER           │ │         EXTERNAL GATEWAYS            │
│  • Next.js Server Actions / Node.js Express   │ │  • Razorpay / Cashfree Subscriptions │
│  • Authentication: Supabase Auth / NextAuth   │ │  • WhatsApp Business Cloud API       │
│  • RBAC Middleware Authorization Checks       │ │  • Twilio / MSG91 SMS Gateway        │
│  • Recipe Auto-Deduction Engine (Transactions)│ │  • OpenAI / Claude / Gemini API      │
└───────────────────────┬───────────────────────┘ └──────────────────────────────────────┘
                        │ SQL Queries / ACID Transactions
                        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         POSTGRESQL MULTI-TENANT DATABASE                               │
│  • Row-Level Security (RLS) enforcing `tenant_id = auth.current_tenant_id()`           │
│  • Tables: tenants, branches, users, menu_items, recipes, inventory, orders, invoices  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART 2: CUSTOMER-FACING PRODUCT GUIDE (FOR RESTAURANT & CAFE OWNERS)

## 8. Welcome to the Next-Generation Restaurant OS

Dear Restaurant Founder & Food Entrepreneur,

Running a profitable cafe, restaurant, bakery, or cloud kitchen is one of the hardest businesses in the world. You manage customer hospitality, kitchen staff, volatile raw material costs, food wastage, and peak-hour delivery rush—often all at once.

Most software products in the market only solve one small piece of the puzzle:
- Traditional POS software just prints a paper receipt.
- Delivery aggregators charge steep 20% to 30% commissions.
- Inventory spreadsheets are forgotten after three days.
- You only discover whether you made a profit or loss when your accountant calls weeks after the month has ended.

**Our Multi-Tenant Restaurant OS changes everything.** Built specifically for Indian food businesses, it unifies your billing, live dining tables, kitchen displays, automated raw material recipe deductions, and true profit tracking into one easy-to-use cloud dashboard. Whether you run a single boutique coffee shop or a 10-outlet dining chain, you can manage your entire business from your phone, tablet, or laptop.

---

## 9. Business Owner Registration & 7-Day Free Trial Guide

Getting your food business up and running takes less than 3 minutes. **No credit card or upfront payment is required.**

```
Step 1: Sign Up       Step 2: Verify        Step 3: Business Setup   Step 4: Start Free Trial
[ Name & Brand ] ───► [ Email & Mobile ] ──► [ 13-Step Wizard ]  ──► [ Launch Workspace ]
```

1. **Visit the Sign Up Page**: Go to `/register` and enter your name, email, phone number, and restaurant brand name.
2. **Choose Your Business Type**: Select from 15 formats (Cafe, Casual Dining, Fast Food, Cloud Kitchen, Bakery, Sweet Shop, Pub, etc.). The system automatically configures features suited to your business.
3. **Verify Your Contact**: Enter the 6-digit email PIN and mobile OTP. (You can also receive your OTP directly on WhatsApp).
4. **Complete the 13-Step Setup Wizard**:
   - Set up your operating hours and primary outlet address.
   - Enter your GSTIN and 14-digit FSSAI license numbers.
   - Pick your initial menu categories (e.g. Coffee, Pastries, Main Course).
   - Enter your table layout if you offer dine-in seating.
5. **Start Your 7-Day Free Trial**: Select the subscription tier that matches your ambitions. Your 7-day trial starts immediately with full access to all POS, KOT, and inventory tools.
6. **Launch Your Workspace**: You land directly on your dashboard, ready to punch your first customer bill!

---

## 10. Step-by-Step Daily Restaurant Workflows

### 10.1 Dine-In Restaurant Workflow
```
Guest Arrives ──► Table Assigned ──► Order Placed ──► KOT to Kitchen ──► Food Plated ──► Bill Settled
```
1. **Host Seating**: The floor captain opens the **Tables Screen** (`/owner/tables`), clicks an available green table (e.g. `Table 4`), and logs party size (e.g. 4 guests).
2. **Order Taking**: The captain selects items on a tablet or mobile POS terminal. Dishes can have customized notes (e.g. *"Medium spicy, dressing on the side"*).
3. **Instant KOT Dispatch**: Clicking **"Punch Order"** instantly routes the Kitchen Order Ticket to the kitchen display screen (`/owner/kot`) or prints it at the hot station.
4. **Kitchen Preparation**: The chef taps **"Start Preparing"**; a live prep timer starts ticking. When ready, the chef taps **"Mark Ready"**, alerting the waiter.
5. **Billing & Split Payment**: When the meal is done, the cashier opens `Table 4` in POS, selects **"Split Bill"** if guests want to divide payment, accepts Cash/Card/UPI QR, and prints the GST-compliant receipt.
6. **Automatic Stock Update**: The system automatically deducts the exact raw ingredients (paneer, butter, flour) used to prepare the meal.

---

### 10.2 QSR, Cafe & Takeaway Workflow
```
Diner at Counter ──► High-Speed Punch ──► Instant UPI QR Scan ──► Token Generated ──► Barista Dispatches
```
1. Customer approaches the cafe counter.
2. The cashier taps items (e.g. *Hazelnut Cappuccino + Blueberry Muffin*).
3. A dynamic UPI QR code is presented on screen or printed on the token.
4. The customer scans with Google Pay / PhonePe; payment is verified in seconds.
5. A token receipt is handed to the customer while the Barista station screen immediately displays the coffee order.

---

### 10.3 Contactless Dining & QR Table Ordering
```
Customer Scans Table QR ──► Browses Digital Menu ──► Orders on Mobile ──► Order Enters KOT
```
1. Diners sit at their table and scan the custom table QR standee with their smartphone camera.
2. A fast digital menu loads on their phone—no app download required.
3. Diners browse photos, read descriptions, select variants, and tap **"Place Order"**.
4. The order drops directly into the POS and kitchen display, tagged with their exact table number.

---

## 11. Complete Smart Inventory & Recipe Costing Guide

Food businesses lose an average of **4% to 8% of revenue** to kitchen pilferage, unrecorded raw material spoilage, and inaccurate portioning. Here is how our inventory system protects your bottom line:

### 11.1 Connecting Recipes to Ingredients (Bill of Materials)
You can define exact recipe formulas for your menu items in the **Recipe Studio** (`/owner/recipes`):

| Menu Dish | Raw Ingredients Required | Quantity per Dish | Current Raw Material Cost | Selling Price | Food Cost % |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Cappuccino (Regular)** | Espresso Coffee Beans<br>Full Cream Fresh Milk<br>Paper Takeaway Cup | 18 grams<br>220 ml<br>1 piece | ₹18.00<br>₹14.30<br>₹4.50 | ₹190.00 | **19.3%** *(Healthy)* |
| **Paneer Tikka Angara** | Fresh Malai Paneer<br>Tikka Marinade & Spices<br>Mustard Oil & Butter | 200 grams<br>40 grams<br>25 ml | ₹68.00<br>₹12.00<br>₹6.50 | ₹290.00 | **29.8%** *(Ideal)* |
| **Woodfired Farm Pizza** | Pizza Dough Base<br>Mozzarella Cheese<br>Bell Peppers & Olives | 1 piece<br>120 grams<br>60 grams | ₹15.00<br>₹54.00<br>₹18.00 | ₹380.00 | **22.8%** *(High Profit)* |

### 11.2 Automated Real-Time Stock Deduction
- Whenever a cashier or waiter punches an order for 2 Cappuccinos, the system silently updates the raw materials inventory:
  - Coffee beans: `-36 grams`
  - Fresh milk: `-440 ml`
  - Paper cups: `-2 pieces`
- You never have to manually weigh stock at the end of every night just to know what you used.

### 11.3 Low Stock Warnings & One-Click Purchase Orders
- When coffee bean stock drops below your safety buffer (e.g. 5 kg), the inventory screen highlights the item in **Red** with a **"Low Stock"** badge.
- With one click on **"Generate Reorder PO"**, the system creates a purchase order pre-addressed to your coffee roaster supplier with agreed unit pricing.

---

## 12. Multi-Branch Operations & Central Commissary Control

Scaling from one location to multiple outlets introduces operational complexity. Our platform provides native multi-branch control:

1. **Centralized Brand Switcher**: View high-level performance across all outlets from a single login, or drill down into a specific branch.
2. **Independent Branch Menus & Pricing**: Set different prices or availability across outlets (e.g. Airport branch vs High Street cafe).
3. **Consolidated Vendor Purchasing**: Order dairy, grain, and packaging in bulk through central purchase orders to negotiate volume discounts.
4. **Cross-Branch Employee Roster**: Staff members can be transferred between outlets without recreating user profiles or retraining.
5. **Franchise Royalty Engine**: If you franchise your brand, the platform tracks gross sales per franchisee and computes contractual royalty percentages automatically.

---

## 13. Business Impact: 10 Operational Superpowers

1. **3x Faster Billing**: Streamlined POS workflow lets cashiers clear counter queues in seconds with UPI QR integration.
2. **Zero Paper KOT Chaos**: Digital kitchen screens eliminate lost paper tickets, misread handwriting, and delayed meal prep.
3. **End Raw Material Pilferage**: Recipe auto-deduction ensures every gram of paneer, chicken, cheese, or coffee is accounted for.
4. **Stop Cashier Theft**: Anomaly surveillance flags unauthorized order voids, cash drawer open events, and split-bill manipulation.
5. **Know Your Real Daily Profit**: The true P&L ledger accounts for raw materials, staff salaries, rent, and electricity to display actual net profit.
6. **Keep Customers Coming Back**: Built-in loyalty rewards, anniversary vouchers, and targeted WhatsApp campaigns drive repeat dining.
7. **Predict Weekend Demand with AI**: Smart forecasting projects customer footfall and warns you of raw ingredient shortages before Friday noon.
8. **Prevent Table Bottlenecks**: Interactive floor plans show seated times and table statuses, helping captains turn tables faster during peak hours.
9. **Tax & Legal Peace of Mind**: Automatic 5% restaurant GST (CGST 2.5% + SGST 2.5%) or 18% enterprise GST calculations with FSSAI compliance on every receipt.
10. **Run Your Restaurant from Anywhere**: Access sales, inventory, and staff attendance live from your mobile browser while away from the outlet.

---

## 14. Industry-Specific Playbooks & Feature Matrices

| Feature Module | ☕ Small Coffee Cafe | 🍽️ Casual / Fine Dining | 🥡 Cloud / Dark Kitchen | 🥖 Artisan Bakery | 🍔 Fast Food / QSR |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Touch POS Billing** | Required | Required | Required | Required | Required |
| **Interactive Tables** | Optional | **Critical** | Not Needed | Optional | Not Needed |
| **Kitchen Displays (KDS)**| Barista Screen | Multi-Station KOT | Dispatch Screen | Pastry Oven KDS | Kitchen Bump Bar |
| **Recipe Stock Deduction**| Coffee & Milk | Full Dish BOM | Raw Ingredients | Flour, Butter, Eggs | Buns, Patties, Oil |
| **Digital QR Ordering** | Table & Counter | Dine-in Table QR | Online Web Store | Digital Catalog | Kiosk / Counter QR |
| **Advance Reservations**| Not Needed | **Critical** | Not Needed | Custom Cake Bookings| Not Needed |
| **Weight-Based Pricing**| Coffee Beans | Not Needed | Not Needed | **Critical (Cakes)** | Not Needed |
| **Aggregator API Sync** | Optional | Optional | **Critical** | Optional | Recommended |

---

## 15. Subscription Plans, Transparent Pricing & FAQ

### 15.1 Commercial Pricing Packages

| Plan Tier | Monthly Billing | Annual Billing *(Save 20%)* | Branch & Staff Limits | Included Core Capabilities |
| :--- | :---: | :---: | :--- | :--- |
| **Starter** | ₹1,499 / mo | **₹1,199 / mo**<br>*(₹14,388 billed yearly)* | 1 Outlet<br>Up to 5 Staff Users | Cloud POS, digital menu, basic inventory, closing Z-reports, standard email support. |
| **Professional**<br>*(Most Popular)* | ₹2,999 / mo | **₹2,399 / mo**<br>*(₹28,788 billed yearly)* | Up to 2 Outlets<br>Up to 15 Staff Users | Interactive dining tables, QR table ordering, multi-station KDS, recipe studio, loyalty CRM, priority support. |
| **Business**<br>*(Growth Engine)* | ₹4,999 / mo | **₹3,999 / mo**<br>*(₹47,988 billed yearly)* | Up to 5 Outlets<br>Up to 35 Staff Users | AI demand forecasting, WhatsApp bot, purchase orders & GRN, cashier fraud detection, dedicated customer manager. |
| **Enterprise**<br>*(Enterprise Grade)*| ₹8,999 / mo | **₹7,199 / mo**<br>*(₹86,388 billed yearly)* | Unlimited Outlets<br>Up to 250 Staff Users | Franchise royalty tracking, Tally ERP sync, aggregator direct injection, custom roles, 99.99% uptime SLA. |

*Note: All prices are subject to standard 18% GST (SAC 998313). Input tax credit (ITC) is fully claimable with a valid GSTIN.*

---

### 15.2 Frequently Asked Questions (FAQ)

**Q: Do I need special hardware or expensive POS machines to use this platform?**  
*A: No. The platform is 100% cloud-based and runs in any modern browser on standard Android tablets, iPads, Windows desktop PCs, laptops, and smartphones. It connects seamlessly to standard Bluetooth, USB, and Wi-Fi thermal receipt printers.*

**Q: What happens when my 7-day free trial ends?**  
*A: You can choose to upgrade to any paid tier (Monthly or Yearly) using UPI, Credit/Debit Card, or Net Banking. If you do not upgrade immediately, your account enters a 7-day courtesy grace period during which you can still settle payment.*

**Q: Will my restaurant data be deleted if I don't renew in time?**  
*A: Never. We maintain a strict Data Protection Guarantee. Your menus, customer contacts, recipe formulations, and past order history remain safely preserved. When you renew, full operational functionality is instantly restored.*

**Q: Can I use this for multiple branches located in different cities?**  
*A: Yes. You can create multiple outlets under a single account. Each branch has its own local staff, inventory, and tables, while you can view aggregated sales from anywhere.*

**Q: Is the software compliant with Indian tax and food safety regulations?**  
*A: Yes. Receipts print with your 14-digit FSSAI license and GSTIN, with automatic CGST and SGST splits and support for B2B tax invoice generation.*

---

*Zestora-Inspired Multi-Tenant Restaurant Management SaaS Platform © 2026. All rights reserved.*
