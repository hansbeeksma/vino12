export type {
  Supplier,
  InventoryItem,
  FulfillmentOrder,
  FulfillmentOrderItem,
  ShippingAddress,
} from "./types";

export { FulfillmentError, isFulfillmentError, withRetry } from "./errors";

export {
  getActiveSuppliers,
  getSupplierById,
  getSupplierForWine,
  updateInventoryQuantity,
  getLowStockItems,
  getInventoryStats,
} from "./supplier-service";

export {
  submitOrderToSupplier,
  fetchSupplierInventory,
} from "./supplier-client";

export { forwardOrderToSuppliers } from "./order-forwarding";

export {
  syncAllSupplierInventory,
  syncSupplierInventory,
} from "./inventory-sync";

export { checkAndSendLowStockAlerts } from "./low-stock-alerts";
