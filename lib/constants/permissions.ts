// lib > constants > permissions.ts
import { Permission, TenantRole } from "@prisma/client";

export const defaultPermissionsByRole: Record<TenantRole, Permission[]> = {
  OWNER: [
    Permission.INVITE_USERS,
    Permission.MANAGE_USERS,
    Permission.ASSIGN_ROLES,
    Permission.ASSIGN_PERMISSIONS,

    Permission.VIEW_TENANT_SETTINGS,
    Permission.UPDATE_TENANT_SETTINGS,

    Permission.CREATE_PRODUCT,
    Permission.VIEW_PRODUCTS,
    Permission.EDIT_PRODUCT,
    Permission.ARCHIVE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.DELETE_PRODUCT_PERMANENTLY,

    Permission.CREATE_ORDER,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,
    Permission.CANCEL_ORDER,
    Permission.DELETE_ORDER,
    Permission.DELETE_ORDER_PERMANENTLY,

    Permission.CREATE_INVOICE,
    Permission.VIEW_INVOICES,
    Permission.EDIT_INVOICE,
    Permission.DELETE_INVOICE,
    Permission.DELETE_INVOICE_PERMANENTLY,
    Permission.RESTORE_INVOICE,

    Permission.VIEW_PAYMENTS,
    Permission.REFUND_PAYMENT,
    Permission.EXPORT_DATA,
    Permission.MANAGE_BILLING,

    Permission.VIEW_AUDIT_LOGS,
    Permission.ACCESS_BETA_FEATURES,
    Permission.PLATFORM_ADMIN,

    Permission.DELETE_PERMANENTLY,
    Permission.PURGE_ARCHIVED_DATA,
  ],
  ADMIN: [
    Permission.CREATE_PRODUCT,
    Permission.VIEW_PRODUCTS,
    Permission.EDIT_PRODUCT,
    Permission.ARCHIVE_PRODUCT,

    Permission.CREATE_ORDER,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,

    Permission.CREATE_INVOICE,
    Permission.VIEW_INVOICES,
    Permission.EDIT_INVOICE,

    Permission.VIEW_PAYMENTS,

    Permission.VIEW_TENANT_SETTINGS,
  ],
  MANAGER: [
    Permission.CREATE_PRODUCT,
    Permission.VIEW_PRODUCTS,
    Permission.EDIT_PRODUCT,

    Permission.CREATE_ORDER,
    Permission.VIEW_ORDERS,

    Permission.CREATE_INVOICE,
    Permission.VIEW_INVOICES,
  ],
  MEMBER: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_INVOICES,
  ],
  VIEWER: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_INVOICES,
  ],
  CUSTOM: [], // set manually
};
