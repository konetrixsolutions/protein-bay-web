import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type RawCartItem = any;

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
  badge?: string;
};

export async function getCartRaw() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined. Set it in your environment variables.");
  }

  const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
  const result = response.data;

  if (!result?.success) {
    throw new Error(result?.message || "Failed to fetch cart");
  }

  return result.data;
}

export async function getCartItems() {
  const cartData = await getCartRaw();

  const items = cartData?.items ?? [];

  const mappedItems: CartItem[] = items.map((item: RawCartItem) => {
    const product = item?.product;
    const variant = item?.variant;

    return {
      id: item?.id ?? "",
      productId: product?.id ?? variant?.productId ?? "",
      name: product?.name ?? "Product",
      subtitle: variant?.name ?? "",
      price: Number(variant?.price ?? 0),
      quantity: Number(item?.quantity ?? 1),
      image: product?.imageUrls?.[0] ?? "/images/product-placeholder.png",
      badge: Array.isArray(product?.badges) ? product.badges[0] : undefined,
    };
  });

  const apiDeliveryFee =
    cartData?.deliveryFee ?? cartData?.shippingFee ?? cartData?.deliveryCharge ?? cartData?.deliveryCharges;

  const apiReferralBalance =
    cartData?.referralBalance ?? cartData?.availableReferralBalance ?? cartData?.referralBonusBalance;

  return {
    items: mappedItems,
    deliveryFee: apiDeliveryFee !== undefined && apiDeliveryFee !== null ? Number(apiDeliveryFee) : null,
    referralBalance: apiReferralBalance !== undefined && apiReferralBalance !== null ? Number(apiReferralBalance) : 0,
  };
}

export async function getCartCount() {
  const { items } = await getCartItems();

  return items.reduce((total, item) => total + (item.quantity ?? 0), 0);
}
