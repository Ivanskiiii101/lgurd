export type CurrencyCode = "usd" | "eur" | "gbp";

export interface ProductNotes {
  top?: string[];
  heart?: string[];
  base?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Price stored in minor units (e.g. cents) for Stripe & DB safety. */
  priceCents: number;
  currency: CurrencyCode;
  /** e.g. 50 for 50ml flacon. */
  volumeMl: number;
  /** e.g. "Eau de Parfum", "Extrait de Parfum". */
  concentration: string;
  heroImageUrl: string;
  galleryImageUrls: string[];
  notes?: ProductNotes;
  tags?: string[];
  isLimitedEdition?: boolean;
  isFeatured?: boolean;
  /** SKU should map 1:1 with Stripe price/product. */
  stockKeepingUnit: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "payment_processing"
  | "payment_failed"
  | "paid"
  | "fulfilled"
  | "cancelled";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  stockKeepingUnit: string;
  quantity: number;
  unitPriceCents: number;
  currency: CurrencyCode;
}

export interface CustomerDetails {
  email: string;
  fullName: string;
  phone?: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  stateOrProvince?: string;
  postalCode: string;
  countryCode: string;
}

export interface Order {
  id: string;
  /** Stable identifier for the customer (from auth or Stripe). */
  customerId?: string;
  stripeCustomerId?: string;
  stripeCheckoutSessionId?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  currency: CurrencyCode;
  customerDetails: CustomerDetails;
  shippingAddress: ShippingAddress;
  placedAt: string;
  updatedAt: string;
}

