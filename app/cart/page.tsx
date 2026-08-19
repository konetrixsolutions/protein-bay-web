"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FaLock, FaRegTrashAlt, FaShieldAlt, FaTag } from "react-icons/fa";
import { FiGift, FiInfo } from "react-icons/fi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { PiShoppingCartBold } from "react-icons/pi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getCartItems } from "@/lib/cartApi";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
  badge?: string;
};

type Coupon = {
  id?: string;
  code: string;
  discount?: number;
  discountAmount?: number;
  discountValue?: number;
  amount?: number;
  percentage?: number;
  discountType?: string;
  type?: string;
  value?: number;
  minOrderAmount?: number;
  minimumOrderAmount?: number;
  maxDiscount?: number;
  isActive?: boolean;
  expiresAt?: string;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [coupon, setCoupon] = useState("");

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [couponDiscount, setCouponDiscount] = useState(0);

  const [useReferralBonus, setUseReferralBonus] = useState(false);

  const [referralBalance, setReferralBalance] = useState(0);

  const [couponError, setCouponError] = useState("");

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const fetchCartItems = async () => {
    try {
      const cartData = await getCartItems();

      setCartItems(cartData.items ?? []);
      setDeliveryFee(cartData.deliveryFee ?? null);
      setReferralBalance(cartData.referralBalance ?? 0);

      // notify other parts of the app (Navbar) that cart updated
      try {
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {}
    } catch (error) {
      console.error("Cart items error:", error);

      setCartItems([]);
      setDeliveryFee(null);
      setReferralBalance(0);
      setUseReferralBonus(false);

      try {
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/coupons`,
          {
            withCredentials: true,
          },
        );

        const result = response.data;

        if (!result?.success) {
          throw new Error(result?.message || "Failed to fetch coupons");
        }

        const couponData = Array.isArray(result?.data)
          ? result.data
          : (result?.data?.coupons ?? []);

        setCoupons(couponData);
      } catch (error) {
        console.error("Coupons error:", error);
        setCoupons([]);
      }
    };

    fetchCoupons();
  }, []);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const referralDiscount = useReferralBonus
    ? Math.min(referralBalance, subtotal + (deliveryFee ?? 0))
    : 0;

  const totalDiscount = couponDiscount + referralDiscount;

  const totalBeforeDiscount = subtotal + (deliveryFee ?? 0);

  const payableAmount = Math.max(0, totalBeforeDiscount - totalDiscount);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    if (updatingItemId === itemId) {
      return;
    }

    try {
      setUpdatingItemId(itemId);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`,
        {
          quantity: newQuantity,
        },
        {
          withCredentials: true,
        },
      );

      await fetchCartItems();
    } catch (error) {
      console.error("Update cart quantity error:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    if (updatingItemId === itemId) {
      return;
    }

    try {
      setUpdatingItemId(itemId);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`,
        {
          withCredentials: true,
        },
      );

      await fetchCartItems();
    } catch (error) {
      console.error("Remove cart item error:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const getCouponDiscount = (selectedCoupon: Coupon) => {
    const fixedDiscount =
      selectedCoupon.discountAmount ??
      selectedCoupon.discount ??
      selectedCoupon.amount;

    const percentage =
      selectedCoupon.percentage ??
      (selectedCoupon.discountType?.toUpperCase() === "PERCENTAGE" ||
      selectedCoupon.type?.toUpperCase() === "PERCENTAGE"
        ? (selectedCoupon.discountValue ?? selectedCoupon.value)
        : undefined);

    const type = (
      selectedCoupon.discountType ??
      selectedCoupon.type ??
      ""
    ).toUpperCase();

    if (type === "PERCENTAGE" || type === "PERCENT") {
      const percentageValue = Number(percentage ?? 0);

      let calculatedDiscount = (subtotal * percentageValue) / 100;

      if (
        selectedCoupon.maxDiscount !== undefined &&
        selectedCoupon.maxDiscount !== null
      ) {
        calculatedDiscount = Math.min(
          calculatedDiscount,
          Number(selectedCoupon.maxDiscount),
        );
      }

      return Math.min(calculatedDiscount, subtotal);
    }

    if (fixedDiscount !== undefined && fixedDiscount !== null) {
      return Math.min(Number(fixedDiscount), subtotal);
    }

    const genericValue =
      selectedCoupon.discountValue ?? selectedCoupon.value ?? 0;

    return Math.min(Number(genericValue), subtotal);
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    setCouponError("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const selectedCoupon = coupons.find(
      (item) => item.code?.toUpperCase() === code,
    );

    if (!selectedCoupon) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponError("Invalid or expired coupon.");
      return;
    }

    if (selectedCoupon.isActive === false) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponError("This coupon is no longer active.");
      return;
    }

    if (
      selectedCoupon.expiresAt &&
      new Date(selectedCoupon.expiresAt).getTime() < Date.now()
    ) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponError("This coupon has expired.");
      return;
    }

    const minimumOrderAmount =
      selectedCoupon.minOrderAmount ?? selectedCoupon.minimumOrderAmount;

    if (
      minimumOrderAmount !== undefined &&
      subtotal < Number(minimumOrderAmount)
    ) {
      setAppliedCoupon(null);
      setCouponDiscount(0);

      setCouponError(`Minimum order value is ₹${Number(minimumOrderAmount)}.`);

      return;
    }

    const discount = getCouponDiscount(selectedCoupon);

    if (discount <= 0) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponError("This coupon does not have a valid discount.");
      return;
    }

    setAppliedCoupon(selectedCoupon.code);

    setCouponDiscount(Math.round(discount));
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCoupon("");
    setCouponError("");
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      console.log("Checkout:", {
        items: cartItems,
        subtotal,
        deliveryFee,
        coupon: appliedCoupon,
        couponDiscount,
        referralDiscount,
        payableAmount,
      });
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f9f4]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf4e9] text-[#3f7d3f]">
              <PiShoppingCartBold size={34} />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#173b1b]">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              href="/categories"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#173b1b] px-6 text-sm font-semibold text-white transition-all hover:bg-[#245528] hover:shadow-lg"
            >
              Explore Products
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f4]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* PAGE HEADER */}

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#173b1b] sm:text-4xl">
            My Cart{" "}
            <span className="text-[#6a766d]">
              ({totalItems} {totalItems === 1 ? "Item" : "Items"})
            </span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review your items and proceed to checkout.
          </p>
        </div>

        {/* MAIN GRID */}

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1.7fr_0.8fr]">
          {/* LEFT - CART ITEMS */}

          <section className="rounded-2xl border border-[#e1e7dd] bg-white p-4 shadow-[0_6px_25px_rgba(23,59,27,0.04)] sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#173b1b]">Cart Items</h2>

              <span className="text-xs font-medium text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Items */}

            <div className="mt-5 space-y-3">
              {cartItems.map((item) => {
                const isUpdating = updatingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#e4e8e1] bg-white p-3 transition-all duration-200 hover:border-[#cbdac5] hover:shadow-[0_6px_20px_rgba(23,59,27,0.04)] sm:p-4"
                  >
                    <div className="grid grid-cols-[88px_1fr] gap-4 sm:grid-cols-[150px_1fr] sm:gap-6">
                      {/* PRODUCT IMAGE */}

                      <Link
                        href={`/products/${item.productId}`}
                        className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f5ef]"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2 transition-transform duration-300 hover:scale-105 sm:p-4"
                        />
                      </Link>

                      {/* PRODUCT INFORMATION */}

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.productId}`}
                            className="min-w-0"
                          >
                            <h3 className="text-sm font-bold text-[#26382b] sm:text-base">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                              {item.subtitle}
                            </p>
                          </Link>
                        </div>

                        {/* Badge */}

                        {item.badge && (
                          <div className="mt-2 inline-flex rounded-lg border border-[#dce8d5] bg-[#f3f8f0] px-2.5 py-1 text-[10px] font-medium text-[#315d35]">
                            {item.badge}
                          </div>
                        )}

                        {/* Bottom section */}

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                          {/* Price */}

                          <div>
                            <p className="text-base font-bold text-[#173b1b]">
                              ₹{item.price}
                            </p>

                            <Button
                              onClick={() => removeItem(item.id)}
                              disabled={isUpdating}
                              variant="outline"
                              className="mt-2"
                            >
                              <FaRegTrashAlt size={10} />
                              {isUpdating ? "Removing..." : "Remove"}
                            </Button>
                          </div>

                          {/* Quantity + Total */}

                          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-5">
                            {/* Quantity */}

                            <div className="flex h-9 shrink-0 items-center overflow-hidden rounded-lg border border-[#dfe5dc]">
                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1 || isUpdating}
                                variant="primary"
                                className="h-9 w-9 min-w-9 shrink-0 p-0 text-base"
                              >
                                −
                              </Button>

                              <span className="flex h-9 min-w-9 shrink-0 items-center justify-center border-x border-[#dfe5dc] px-2 text-sm font-semibold text-[#26382b]">
                                {isUpdating ? "..." : item.quantity}
                              </span>

                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={isUpdating}
                                variant="primary"
                                className="h-9 w-9 min-w-9 shrink-0 p-0 text-base"
                              >
                                +
                              </Button>
                            </div>

                            {/* Item total */}

                            <p className="min-w-[70px] shrink-0 text-right text-sm font-bold text-[#173b1b] sm:text-base">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Secure checkout */}

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#dce7d8] bg-[#f6faf4] px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f0e1] text-[#287033]">
                <FaShieldAlt size={17} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#28572e]">
                  100% Secure Checkout
                </p>

                <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                  Your payments and personal details are safe with us.
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT - ORDER SUMMARY */}

          <aside className="lg:sticky lg:top-24">
            <section className="rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_6px_25px_rgba(23,59,27,0.04)] sm:p-6">
              {/* Header */}

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#173b1b]">
                  Order Summary
                </h2>

                {/* Mobile toggle */}

                <Button
                  onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                  variant="primary"
                  className="md:hidden"
                >
                  {mobileSummaryOpen ? (
                    <IoChevronUp size={16} />
                  ) : (
                    <IoChevronDown size={16} />
                  )}
                </Button>
              </div>

              {/* Desktop always visible / mobile expandable */}

              <div
                className={`${
                  mobileSummaryOpen ? "block" : "hidden"
                } mt-5 lg:block`}
              >
                {/* Price Breakdown */}

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#536056]">
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "Item" : "Items"})
                    </span>

                    <span className="font-medium text-[#26382b]">
                      ₹{subtotal}
                    </span>
                  </div>

                  {/* DELIVERY FEE */}

                  {deliveryFee !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-[#536056]">
                        <MdOutlineLocalShipping size={15} />
                        Delivery Fee
                        <FiInfo size={12} />
                      </span>

                      <span className="font-medium text-[#26382b]">
                        ₹{deliveryFee}
                      </span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#536056]">Coupon Discount</span>

                      <span className="font-semibold text-[#287033]">
                        -₹
                        {couponDiscount}
                      </span>
                    </div>
                  )}

                  {referralDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#536056]">Referral Bonus</span>

                      <span className="font-semibold text-[#287033]">
                        -₹
                        {referralDiscount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-5 border-t border-[#e6eae4]" />

                {/* Total */}

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#26382b]">
                    Total
                  </span>

                  <span className="text-lg font-bold text-[#173b1b]">
                    ₹{Math.max(0, totalBeforeDiscount - totalDiscount)}
                  </span>
                </div>

                {/* COUPON */}

                <div className="mt-5 rounded-xl border border-[#e4e8e1] bg-[#fbfcfa] p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4e9] text-[#3f7d3f]">
                      <FaTag size={13} />
                    </div>

                    <p className="text-xs font-semibold text-[#26382b]">
                      Have a Coupon Code?
                    </p>
                  </div>

                  {appliedCoupon ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-[#cfe0c9] bg-[#f1f8ef] px-3 py-2">
                      <div>
                        <p className="text-xs font-bold text-[#286333]">
                          {appliedCoupon}
                        </p>

                        <p className="text-[10px] text-muted-foreground">
                          ₹{couponDiscount} discount applied
                        </p>
                      </div>

                      <Button onClick={removeCoupon} variant="ghost">
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            applyCoupon();
                          }
                        }}
                        placeholder="Enter coupon code"
                        className="h-10 min-w-0 flex-1 rounded-lg border border-[#dfe5dc] bg-white px-3 text-xs outline-none transition-colors placeholder:text-[#9aa39b] focus:border-[#3f7d3f] focus:ring-2 focus:ring-[#3f7d3f]/10"
                      />

                      <Button onClick={applyCoupon} variant="primary">
                        Apply
                      </Button>
                    </div>
                  )}

                  {couponError && (
                    <p className="mt-2 text-[10px] font-medium text-red-500">
                      {couponError}
                    </p>
                  )}
                </div>

                {/* REFERRAL BONUS */}

                {referralBalance > 0 && (
                  <div className="mt-4 rounded-xl border border-[#dfe8db] bg-[#f8fbf6] p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f1e1] text-[#287033]">
                        <FiGift size={20} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#26382b]">
                            Use Referral Bonus
                          </p>

                          <FiInfo size={12} className="text-muted-foreground" />
                        </div>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Available balance: ₹{referralBalance}
                        </p>
                      </div>
                    </div>

                    <label className="mt-3 flex cursor-pointer items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useReferralBonus}
                          onChange={(e) =>
                            setUseReferralBonus(e.target.checked)
                          }
                          className="h-4 w-4 cursor-pointer accent-[#287033]"
                        />

                        <span className="text-xs text-[#405046]">
                          Apply ₹{referralBalance} Available
                        </span>
                      </div>

                      {useReferralBonus && (
                        <span className="text-sm font-bold text-[#287033]">
                          -₹
                          {referralDiscount}
                        </span>
                      )}
                    </label>
                  </div>
                )}

                {/* PAYABLE */}

                <div className="mt-4 rounded-xl border border-[#dfe8db] bg-gradient-to-br from-[#f8fbf6] to-white p-4">
                  <p className="text-xs font-bold text-[#26382b]">
                    Payable Amount
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#287033]">
                    ₹{payableAmount}
                  </p>

                  {totalDiscount > 0 && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#287033]">
                      ✨ You will save ₹{totalDiscount} on this order!
                    </p>
                  )}
                </div>

                {/* CHECKOUT */}

                <Button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  variant="primary"
                  className="mt-5 w-full"
                >
                  <FaLock size={13} />

                  {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>

                {/* Security */}

                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <FaShieldAlt size={12} className="text-[#3f7d3f]" />

                  <span>Safe & secure payments. Easy returns.</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
