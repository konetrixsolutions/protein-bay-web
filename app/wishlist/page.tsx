"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FaHeart, FaStar, FaShoppingBag } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastContainer, toast } from "react-toastify";

type WishlistItem = {
  id: string;
  productId: string;

  name: string;
  subtitle: string;

  variantId: string;
  variantName: string;
  weightInGrams: number;

  price: number;
  mrp: number;

  image: string;

  rating: number;
  reviewCount: number;

  badges: string[];
};

const Wishlist = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [removingId, setRemovingId] = useState<string | null>(null);

  //  FETCH WISHLIST

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
          {
            withCredentials: true,
          },
        );

        console.log("Wishlist API response:", response.data);

        if (!response.data?.success) {
          throw new Error(response.data?.message || "Failed to fetch wishlist");
        }

        const wishlistData = response.data?.data ?? [];

        const mappedItems: WishlistItem[] = wishlistData.map((item: any) => {
          const variant = item.productVariant;

          const product = variant?.product;

          return {
            id: item.id,

            productId: product?.id ?? "",

            name: product?.name ?? "Unknown Product",

            subtitle: product?.shortDescription ?? "",

            variantId: variant?.id ?? "",

            variantName: variant?.name ?? "",

            weightInGrams: Number(variant?.weightInGrams ?? 0),

            price: Number(variant?.price ?? 0),

            mrp: Number(variant?.mrp ?? 0),

            image: product?.imageUrls?.[0] ?? "/images/product-placeholder.png",

            rating: Number(product?.rating ?? 0),

            reviewCount: Number(product?.reviewCount ?? 0),

            badges: Array.isArray(product?.badges) ? product.badges : [],
          };
        });

        setWishlistItems(mappedItems);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Wishlist API error:",
            error.response?.data || error.message,
          );
        } else {
          console.error("Wishlist error:", error);
        }

        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  //  REMOVE FROM WISHLIST

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      setRemovingId(wishlistId);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${wishlistId}`,
        {
          withCredentials: true,
        },
      );

      setWishlistItems((current) =>
        current.filter((item) => item.id !== wishlistId),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Remove wishlist error:",
          error.response?.data || error.message,
        );
      } else {
        console.error("Remove wishlist error:", error);
      }
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/items`,
        {
          productVariantId: item.variantId,
          quantity: 1,
        },
        {
          withCredentials: true,
        },
      );
      if (response.data?.success) {
        toast.success("Item added to cart successfully!");
        try {
          window.dispatchEvent(new Event("cartUpdated"));
        } catch (e) {}
      }

      console.log("Add to cart API response:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Add to cart API error:",
          error.response?.data || error.message,
        );
        toast.error(
          error?.response?.data?.message || "Failed to add item to cart",
        );
      } else {
        console.error("Add to cart error:", error);
      }
    }
  };

  //  LOADING

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f4]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div>
            {/* Heading */}
            <Skeleton className="h-8 w-48 rounded-lg" />

            {/* Subtitle */}
            <Skeleton className="mt-3 h-4 w-72" />

            {/* Product Cards */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e1e7dd] bg-white p-4"
                >
                  {/* Product Image */}
                  <Skeleton className="aspect-square w-full rounded-xl" />

                  {/* Product Name */}
                  <Skeleton className="mt-4 h-5 w-3/4" />

                  {/* Product Description */}
                  <Skeleton className="mt-2 h-4 w-1/2" />

                  {/* Price / Button */}
                  <Skeleton className="mt-5 h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  //  EMPTY WISHLIST

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f9f4]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf4e9] text-primary">
              <FaHeart size={30} />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-primary">
              Your Wishlist is Empty
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Save your favorite ProteinBay products here and come back whenever
              you're ready.
            </p>

            <Link
              href="/categories"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-all hover:bg-[#245528] hover:shadow-lg"
            >
              Explore Products
              <FaShoppingBag size={13} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  //  MAIN

  return (
    <main className="min-h-screen bg-[#f7f9f4]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Header */}

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f1e4] text-primary">
              <FaHeart size={18} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                My Wishlist
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "product" : "products"} saved for
                later
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item) => {
            const discount =
              item.mrp > item.price
                ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                : 0;

            return (
              <article
                key={item.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("a") ||
                    target.closest("button") ||
                    target.closest("input")
                  ) {
                    return;
                  }

                  try {
                    router.push(`/products/${item.productId}`);
                  } catch (err) {}
                }}
                className="group overflow-hidden rounded-2xl border border-[#e1e7dd] bg-white shadow-[0_6px_25px_rgba(23,59,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#cbdac5] hover:shadow-[0_15px_35px_rgba(23,59,27,0.08)]"
              >
                {/* Image */}

                <div className="relative aspect-square overflow-hidden bg-[#f8f6f0]">
                  <Link href={`/products/${item.productId}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Discount */}

                  {discount > 0 && (
                    <span className="absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Remove */}

                  <Button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={removingId === item.id}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#8a938b] shadow-sm backdrop-blur-sm transition-all hover:bg-[#fff1f0] hover:text-red-500 disabled:opacity-50"
                    aria-label="Remove from wishlist"
                  >
                    <IoClose size={15} />
                  </Button>
                </div>

                {/* Details */}

                <div className="p-4">
                  <Link href={`/products/${item.productId}`}>
                    <h2 className="line-clamp-1 text-base font-bold text-[#26382b] transition-colors group-hover:text-primary">
                      {item.name}
                    </h2>
                  </Link>

                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>

                  {/* Variant */}

                  {item.variantName && (
                    <span className="mt-2 inline-flex rounded-md bg-[#f1f5ee] px-2 py-1 text-[10px] font-medium text-[#536456]">
                      {item.variantName}
                    </span>
                  )}

                  {/* Rating */}

                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-[#e7a92f]">
                      <FaStar size={11} />

                      <span className="text-xs font-semibold text-[#475349]">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      ({item.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Price */}

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-lg font-bold text-primary">
                      ₹{item.price}
                    </span>

                    {item.mrp > item.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.mrp}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}

                  <Button
                    className="w-full mt-4"
                    onClick={() => handleAddToCart(item)}
                  >
                    {" "}
                    {/* className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-white transition-all hover:bg-[#245528] hover:shadow-lg"> */}
                    <FaShoppingBag size={13} />
                    Add to Cart
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Wishlist;
