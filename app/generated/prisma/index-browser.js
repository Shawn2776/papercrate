
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  userId: 'userId',
  after: 'after',
  before: 'before',
  entityId: 'entityId',
  entityType: 'entityType',
  performedAt: 'performedAt',
  payload: 'payload',
  deleted: 'deleted'
};

exports.Prisma.BankDetailScalarFieldEnum = {
  id: 'id',
  bankName: 'bankName',
  accountNumber: 'accountNumber',
  iban: 'iban',
  bic: 'bic',
  deleted: 'deleted'
};

exports.Prisma.BusinessScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tenantId: 'tenantId',
  createdById: 'createdById',
  updatedById: 'updatedById',
  businessType: 'businessType',
  businessCategory: 'businessCategory',
  businessSubcategory: 'businessSubcategory',
  legalBusinessName: 'legalBusinessName',
  doingBusinessAs: 'doingBusinessAs',
  ein: 'ein',
  businessState: 'businessState',
  onlineStatus: 'onlineStatus',
  onlineLink: 'onlineLink',
  businessEmail: 'businessEmail',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  zip: 'zip',
  city: 'city',
  isManualEntry: 'isManualEntry',
  deleted: 'deleted'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById',
  tenantId: 'tenantId',
  deleted: 'deleted'
};

exports.Prisma.DiscountScalarFieldEnum = {
  id: 'id',
  name: 'name',
  discountValue: 'discountValue',
  createdById: 'createdById',
  updatedById: 'updatedById',
  deleted: 'deleted'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  number: 'number',
  amount: 'amount',
  status: 'status',
  paymentType: 'paymentType',
  orderId: 'orderId',
  parentInvoiceId: 'parentInvoiceId',
  customerId: 'customerId',
  tenantId: 'tenantId',
  createdById: 'createdById',
  updatedById: 'updatedById',
  soldByUserId: 'soldByUserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deleted: 'deleted',
  taxExempt: 'taxExempt',
  taxExemptId: 'taxExemptId'
};

exports.Prisma.InvoiceDetailScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  productId: 'productId',
  quantity: 'quantity',
  taxId: 'taxId',
  discountId: 'discountId',
  lineTotal: 'lineTotal'
};

exports.Prisma.InvoiceSettingsScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  layout: 'layout',
  primaryColor: 'primaryColor',
  includeCustomerInfo: 'includeCustomerInfo',
  includePaymentTerms: 'includePaymentTerms',
  includeDueDate: 'includeDueDate',
  includeNotes: 'includeNotes',
  deleted: 'deleted'
};

exports.Prisma.InvoiceVersionScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  number: 'number',
  data: 'data',
  modifiedAt: 'modifiedAt',
  modifiedBy: 'modifiedBy'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  orderNumber: 'orderNumber',
  customerId: 'customerId',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deleted: 'deleted'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  sku: 'sku',
  name: 'name',
  description: 'description',
  variant: 'variant',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  imageUrl: 'imageUrl',
  specs: 'specs'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  amount: 'amount',
  date: 'date',
  method: 'method',
  status: 'status',
  reference: 'reference',
  createdById: 'createdById',
  updatedById: 'updatedById',
  deleted: 'deleted'
};

exports.Prisma.PaymentLogScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  logMessage: 'logMessage'
};

exports.Prisma.PaymentMethodScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  deleted: 'deleted'
};

exports.Prisma.PaymentStatusScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  deleted: 'deleted'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  price: 'price',
  imageUrl: 'imageUrl',
  variant: 'variant',
  sku: 'sku',
  barcode: 'barcode',
  qrCodeUrl: 'qrCodeUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById',
  description: 'description',
  tenantId: 'tenantId',
  archivedAt: 'archivedAt',
  category: 'category',
  isActive: 'isActive',
  metaDesc: 'metaDesc',
  metaTitle: 'metaTitle',
  metadata: 'metadata',
  primaryIdentifierType: 'primaryIdentifierType',
  primaryIdentifierValue: 'primaryIdentifierValue',
  stockAlertAt: 'stockAlertAt',
  stockQuantity: 'stockQuantity',
  tags: 'tags',
  unit: 'unit',
  visibility: 'visibility',
  slug: 'slug',
  deleted: 'deleted'
};

exports.Prisma.ProductIdentifierScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  type: 'type',
  value: 'value',
  imageUrl: 'imageUrl'
};

exports.Prisma.ProductVariantScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  sku: 'sku',
  barcode: 'barcode',
  price: 'price',
  imageUrl: 'imageUrl',
  specs: 'specs',
  deleted: 'deleted'
};

exports.Prisma.ShippingDetailScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  address: 'address',
  shippingDate: 'shippingDate',
  estimatedArrival: 'estimatedArrival',
  createdById: 'createdById',
  updatedById: 'updatedById',
  deleted: 'deleted'
};

exports.Prisma.TaxRateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  rate: 'rate',
  createdById: 'createdById',
  updatedById: 'updatedById',
  deleted: 'deleted'
};

exports.Prisma.TenantScalarFieldEnum = {
  id: 'id',
  name: 'name',
  companyName: 'companyName',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  zip: 'zip',
  zipPlus4: 'zipPlus4',
  email: 'email',
  website: 'website',
  isUspsValidated: 'isUspsValidated',
  createdAt: 'createdAt',
  invoiceCounter: 'invoiceCounter',
  invoiceFormat: 'invoiceFormat',
  invoicePrefix: 'invoicePrefix',
  isInvoiceSetup: 'isInvoiceSetup',
  autoResetYearly: 'autoResetYearly',
  lastResetYear: 'lastResetYear',
  defaultTaxRateId: 'defaultTaxRateId',
  deleted: 'deleted',
  plan: 'plan'
};

exports.Prisma.TenantMembershipScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  userId: 'userId',
  role: 'role',
  permissions: 'permissions',
  deleted: 'deleted'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  clerkId: 'clerkId',
  name: 'name',
  role: 'role',
  createdAt: 'createdAt',
  deleted: 'deleted'
};

exports.Prisma.ZipCacheScalarFieldEnum = {
  zip: 'zip',
  city: 'city',
  state: 'state',
  lat: 'lat',
  lng: 'lng',
  createdAt: 'createdAt'
};

exports.Prisma.ZipCityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  state: 'state',
  zipCode: 'zipCode'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  RETURNED: 'RETURNED',
  REFUNDED: 'REFUNDED',
  PAID_IN_FULL: 'PAID_IN_FULL',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING',
  UNPAID: 'UNPAID',
  PARTIALLY_UNPAID: 'PARTIALLY_UNPAID',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  AWAITING_FULFILLMENT: 'AWAITING_FULFILLMENT',
  AWAITING_SHIPMENT: 'AWAITING_SHIPMENT',
  AWAITING_DELIVERY: 'AWAITING_DELIVERY',
  AWAITING_PICKUP: 'AWAITING_PICKUP',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
  AWAITING_REVIEW: 'AWAITING_REVIEW',
  SENT: 'SENT',
  OVERDUE: 'OVERDUE',
  VOID: 'VOID'
};

exports.PaymentType = exports.$Enums.PaymentType = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  CHARGE: 'CHARGE',
  COD: 'COD',
  ON_ACCOUNT: 'ON_ACCOUNT',
  PAID_OUT: 'PAID_OUT',
  RETURNED: 'RETURNED'
};

exports.ProductIdentifierType = exports.$Enums.ProductIdentifierType = {
  SKU: 'SKU',
  BARCODE: 'BARCODE',
  QR: 'QR',
  UPC: 'UPC',
  CUSTOM: 'CUSTOM'
};

exports.PlanTier = exports.$Enums.PlanTier = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE'
};

exports.TenantRole = exports.$Enums.TenantRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  MANAGER: 'MANAGER',
  VIEWER: 'VIEWER',
  CUSTOM: 'CUSTOM'
};

exports.Permission = exports.$Enums.Permission = {
  INVITE_USERS: 'INVITE_USERS',
  MANAGE_USERS: 'MANAGE_USERS',
  ASSIGN_ROLES: 'ASSIGN_ROLES',
  ASSIGN_PERMISSIONS: 'ASSIGN_PERMISSIONS',
  VIEW_TENANT_SETTINGS: 'VIEW_TENANT_SETTINGS',
  UPDATE_TENANT_SETTINGS: 'UPDATE_TENANT_SETTINGS',
  CREATE_PRODUCT: 'CREATE_PRODUCT',
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  EDIT_PRODUCT: 'EDIT_PRODUCT',
  ARCHIVE_PRODUCT: 'ARCHIVE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  DELETE_PRODUCT_PERMANENTLY: 'DELETE_PRODUCT_PERMANENTLY',
  CREATE_ORDER: 'CREATE_ORDER',
  VIEW_ORDERS: 'VIEW_ORDERS',
  EDIT_ORDER: 'EDIT_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  DELETE_ORDER_PERMANENTLY: 'DELETE_ORDER_PERMANENTLY',
  CREATE_INVOICE: 'CREATE_INVOICE',
  VIEW_INVOICES: 'VIEW_INVOICES',
  EDIT_INVOICE: 'EDIT_INVOICE',
  DELETE_INVOICE: 'DELETE_INVOICE',
  DELETE_INVOICE_PERMANENTLY: 'DELETE_INVOICE_PERMANENTLY',
  RESTORE_INVOICE: 'RESTORE_INVOICE',
  VIEW_PAYMENTS: 'VIEW_PAYMENTS',
  REFUND_PAYMENT: 'REFUND_PAYMENT',
  EXPORT_DATA: 'EXPORT_DATA',
  MANAGE_BILLING: 'MANAGE_BILLING',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  ACCESS_BETA_FEATURES: 'ACCESS_BETA_FEATURES',
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  DELETE_PERMANENTLY: 'DELETE_PERMANENTLY',
  PURGE_ARCHIVED_DATA: 'PURGE_ARCHIVED_DATA'
};

exports.Role = exports.$Enums.Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPPORT: 'SUPPORT',
  DEVELOPER: 'DEVELOPER'
};

exports.Prisma.ModelName = {
  AuditLog: 'AuditLog',
  BankDetail: 'BankDetail',
  Business: 'Business',
  Customer: 'Customer',
  Discount: 'Discount',
  Invoice: 'Invoice',
  InvoiceDetail: 'InvoiceDetail',
  InvoiceSettings: 'InvoiceSettings',
  InvoiceVersion: 'InvoiceVersion',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Payment: 'Payment',
  PaymentLog: 'PaymentLog',
  PaymentMethod: 'PaymentMethod',
  PaymentStatus: 'PaymentStatus',
  Product: 'Product',
  ProductIdentifier: 'ProductIdentifier',
  ProductVariant: 'ProductVariant',
  ShippingDetail: 'ShippingDetail',
  TaxRate: 'TaxRate',
  Tenant: 'Tenant',
  TenantMembership: 'TenantMembership',
  User: 'User',
  ZipCache: 'ZipCache',
  ZipCity: 'ZipCity'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
