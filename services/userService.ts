import { HOSPITALITY_33_ROLES, MOCK_DEVICES, MOCK_SUPPORT_ACCESS, HospitalityRole, RegisteredDevice, SupportAccessSession } from '@/mock/users';
import { MOCK_TENANTS, HospitalityTenant, PLAN_TIERS, PlanTier, PlanTierConfig } from '@/mock/tenants';

/**
 * User, Tenant, Role & Device Service Interface (Mock Implementation)
 * Replace method internals with REST / GraphQL calls when backend is connected.
 */
export const userService = {
  getTenants(): HospitalityTenant[] {
    return MOCK_TENANTS;
  },
  getPlanTierConfig(tier: PlanTier): PlanTierConfig {
    return PLAN_TIERS[tier];
  },
  getRoles(): HospitalityRole[] {
    return HOSPITALITY_33_ROLES;
  },
  getDevices(): RegisteredDevice[] {
    return MOCK_DEVICES;
  },
  getSupportAccessRequests(): SupportAccessSession[] {
    return MOCK_SUPPORT_ACCESS;
  },
};
