export class FulfillmentError extends Error {
  constructor(
    message: string,
    public readonly code: FulfillmentErrorCode,
    public readonly orderId?: string,
    public readonly supplierId?: string,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "FulfillmentError";
  }
}

export type FulfillmentErrorCode =
  | "SUPPLIER_UNAVAILABLE"
  | "SUPPLIER_REJECTED"
  | "SUPPLIER_TIMEOUT"
  | "INVENTORY_INSUFFICIENT"
  | "INVALID_ADDRESS"
  | "ORDER_NOT_FOUND"
  | "FORWARDING_FAILED"
  | "SYNC_FAILED"
  | "UNKNOWN";

export function isFulfillmentError(error: unknown): error is FulfillmentError {
  return error instanceof FulfillmentError;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export async function withRetry<T>(
  fn: () => Promise<T>,
  context: { orderId?: string; operation: string },
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof FulfillmentError && !error.retryable) {
        throw error;
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new FulfillmentError(
    `${context.operation} failed after ${MAX_RETRIES} attempts: ${lastError?.message}`,
    "FORWARDING_FAILED",
    context.orderId,
    undefined,
    false,
  );
}
