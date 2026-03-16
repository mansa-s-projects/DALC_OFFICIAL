interface SupplierNotificationPayload {
  supplierName: string;
  supplierId: string;
  event: 'created' | 'updated' | 'activated';
}

// Placeholder notification dispatcher for supplier lifecycle events.
// When the notifications table is implemented, this can write to DB + email pipeline.
export async function notifySupplierLifecycleEvent(payload: SupplierNotificationPayload): Promise<void> {
  console.info('[supplier-notification]', payload.event, payload.supplierId, payload.supplierName);
}
