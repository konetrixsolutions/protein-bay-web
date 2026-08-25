"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Search,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductVariant {
  id: string;
  name?: string;
  weightInGrams?: number;
  price?: number | string;
  mrp?: number | string;
  isDefault?: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrls?: string[];
  rating?: number | string;
  reviewCount?: number;
  badges?: string[];
  categoryId?: string;
  category?: Category;
  variants?: ProductVariant[];
  productVariants?: ProductVariant[];
}

interface HomeProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  mrp: number;
  variantId: string | null;
  badge?: string;
  categoryId?: string;
}

const getCollection = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === "object") {
    const data = value as {
      products?: unknown;
      data?: unknown;
      items?: unknown;
    };

    if (Array.isArray(data.products)) {
      return data.products as T[];
    }

    if (Array.isArray(data.data)) {
      return data.data as T[];
    }

    if (Array.isArray(data.items)) {
      return data.items as T[];
    }
  }

  return [];
};

const FALLBACK_IMAGES = ["/images/cookie.jpg"];

const HERO_SLIDES = [
  {
    image: "/images/cookie.jpg",
    title: "Fuel Your Strength Naturally",
    description: "Wholesome ingredients. Real nutrition. Visible results.",
  },
  {
    image: "/images/left_image.png",
    title: "Healthy Nutrition Made Simple",
    description:
      "Clean ingredients crafted for your everyday wellness journey.",
  },
  {
    image: "/images/hero-3.png",
    title: "Nutrition For Every Goal",
    description:
      "Power your fitness journey with delicious, goal-based nutrition.",
  },
];

const getImage = (images?: string[]) => {
  return FALLBACK_IMAGES[0];
  // const apiImage = images?.find(
  //   (image) => typeof image === "string" && image.trim().length > 0,
  // );

  // return apiImage ?? FALLBACK_IMAGES[0];
};

const normalizeProduct = (product: ApiProduct): HomeProduct | null => {
  const variants = product.variants?.length
    ? product.variants
    : product.productVariants?.length
      ? product.productVariants
      : [];

  const variant =
    variants.find((item) => item.isDefault) ?? variants[0] ?? null;

  const price = Number(variant?.price ?? 0);
  const mrp = Number(variant?.mrp ?? price);

  if (!product?.id || !product?.name) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description:
      product.shortDescription ||
      product.longDescription ||
      "Healthy nutrition made with quality ingredients.",
    image: getImage(product.imageUrls),
    rating: Number(product.rating ?? 0),
    reviewCount: Number(product.reviewCount ?? 0),
    price,
    mrp,
    variantId: variant?.id ?? null,
    badge: product.badges?.[0],
    categoryId: product.categoryId ?? product.category?.id,
  };
};

const ProductCard = ({
  product,
  wishlistIds,
  onWishlist,
  onAddToCart,
}: {
  product: HomeProduct;
  wishlistIds: Set<string>;
  onWishlist: (product: HomeProduct) => void;
  onAddToCart: (product: HomeProduct) => void;
}) => {
  const isWishlisted = wishlistIds.has(product.variantId ?? "");

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <article className="group min-w-[220px] overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-0">
      {/* Product Image */}

      <div className="relative aspect-square overflow-hidden bg-[#f7f4e9]">
        <Link
          href={`/products/${product.id}`}
          className="absolute inset-0 block"
          aria-label={`View ${product.name}`}
        >
          <div
            role="img"
            aria-label={product.name}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url("${product.image}")`,
            }}
          />
        </Link>

        {/* Badge */}

        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge || "BEST SELLER"}
          </span>
        </div>

        {/* Wishlist */}

        <button
          type="button"
          onClick={() => onWishlist(product)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 ${
            isWishlisted ? "text-primary" : "text-gray-700"
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Discount */}

        {discount > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}

      <div className="p-4">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-1 text-base font-bold text-foreground hover:text-primary"
        >
          {product.name}
        </Link>

        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Rating */}

        <div className="mt-3 flex items-center gap-1 text-sm">
          <span className="text-yellow-500">★</span>

          <span className="font-medium">
            {product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
          </span>

          <span className="text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            ₹{product.price}
          </span>

          {product.mrp > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* Buttons */}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={!product.variantId}
            onClick={() => onAddToCart(product)}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            disabled={!product.variantId}
            onClick={() => onAddToCart(product)}
            aria-label="Add to cart"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-primary transition-all duration-200 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
};

const ProductSection = ({
  title,
  products,
  wishlistIds,
  onWishlist,
  onAddToCart,
  showViewAll = true,
}: {
  title: string;
  products: HomeProduct[];
  wishlistIds: Set<string>;
  onWishlist: (product: HomeProduct) => void;
  onAddToCart: (product: HomeProduct) => void;
  showViewAll?: boolean;
}) => {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            {title}
            <Leaf size={20} className="text-primary" />
          </h2>

          <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
        </div>

        {showViewAll && (
          <a
            href="/categories"
            className="hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={`${product.id}-${product.variantId ?? "default"}`}
            product={product}
            wishlistIds={wishlistIds}
            onWishlist={onWishlist}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {showViewAll && (
        <a
          href="/categories"
          className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-primary sm:hidden"
        >
          View All
          <ArrowRight size={16} />
        </a>
      )}
    </section>
  );
};

const HomeSkeleton = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-12 rounded-xl bg-border" />

        <div className="mt-5 h-[260px] rounded-3xl bg-border sm:h-[390px]" />

        <div className="mt-14 h-8 w-48 rounded bg-border" />

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-white"
            >
              <div className="aspect-square bg-border" />

              <div className="space-y-3 p-4">
                <div className="h-5 rounded bg-border" />
                <div className="h-4 w-2/3 rounded bg-border" />
                <div className="h-10 rounded-xl bg-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default function Home() {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
      );

      const apiProducts = getCollection<ApiProduct>(response.data?.data);

      const mappedProducts = apiProducts
        .map(normalizeProduct)
        .filter((product): product is HomeProduct => product !== null);

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Products error:", error);
      toast.error("Unable to load products.");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      );

      setCategories(getCollection<Category>(response.data?.data));
    } catch (error) {
      console.error("Categories error:", error);
      toast.error("Unable to load categories.");
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
        {
          withCredentials: true,
        },
      );

      const wishlistData = getCollection<{
        productVariant?: ProductVariant;
        productVariantId?: string;
      }>(response.data?.data);

      const ids = new Set<string>(
        wishlistData
          .map((item) => item.productVariant?.id ?? item.productVariantId)
          .filter((id): id is string => Boolean(id)),
      );

      setWishlistIds(ids);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);

      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchWishlist(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [fetchCategories, fetchProducts, fetchWishlist]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return products;
    }

    const query = search.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }, [products, search]);

  const bestSellers = useMemo(() => {
    return [...filteredProducts]
      .sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }

        return b.reviewCount - a.reviewCount;
      })
      .slice(0, 8);
  }, [filteredProducts]);

  const newArrivals = useMemo(() => {
    return filteredProducts.slice(8, 12);
  }, [filteredProducts]);

  const upcomingProducts = useMemo(() => {
    return filteredProducts.slice(12, 16);
  }, [filteredProducts]);

  const handleWishlist = async (product: HomeProduct) => {
    if (!product.variantId) {
      toast.error("Product variant is unavailable.");
      return;
    }

    const alreadyWishlisted = wishlistIds.has(product.variantId);

    try {
      if (alreadyWishlisted) {
        toast.success("This product is already in your wishlist.");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
        {
          productVariantId: product.variantId,
        },
        {
          withCredentials: true,
        },
      );

      setWishlistIds((previous) => {
        const next = new Set(previous);
        next.add(product.variantId as string);
        return next;
      });

      toast.success("Added to wishlist.");
    } catch (error) {
      console.error("Wishlist error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Unable to update wishlist.",
        );
      } else {
        toast.error("Unable to update wishlist.");
      }
    }
  };

  const handleAddToCart = async (product: HomeProduct) => {
    if (!product.variantId) {
      toast.error("Product variant is unavailable.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/items`,
        {
          productVariantId: product.variantId,
          quantity: 1,
        },
        {
          withCredentials: true,
        },
      );

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success(`${product.name} added to cart.`);
    } catch (error) {
      console.error("Add to cart error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Unable to add product to cart.",
        );
      } else {
        toast.error("Unable to add product to cart.");
      }
    }
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  const hero = HERO_SLIDES[activeSlide];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* SEARCH */}

        <div className="mx-auto mt-4 flex max-w-3xl overflow-hidden rounded-xl border border-border bg-white shadow-sm focus-within:border-primary">
          <div className="flex flex-1 items-center">
            <Search size={19} className="ml-4 shrink-0 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for something..."
              className="h-12 w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          {/* <button
            type="button"
            className="m-1 flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Search size={17} />
            <span className="hidden sm:inline">Search</span>
          </button> */}
        </div>

        {/* HERO */}

        <section className="relative mt-5 overflow-hidden rounded-3xl bg-[#eef3df] shadow-sm">
          <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[420px]">
            {/* Background */}

            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{
                backgroundImage: `url("${hero.image}")`,
              }}
            />

            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-r from-[#edf4dc]/95 via-[#edf4dc]/70 to-transparent" />

            {/* Content */}

            <div className="relative z-10 flex min-h-[300px] max-w-xl flex-col justify-center px-7 py-10 sm:min-h-[380px] sm:px-12 lg:min-h-[420px] lg:px-16">
              <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles size={17} />
                ProteinBay Nutrition
              </span>

              <h1 className="max-w-xl text-3xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                {hero.description}
              </p>

              <a
                href="/categories"
                className="mt-7 flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-hover hover:shadow-lg"
              >
                Shop Now
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Previous */}

            <button
              type="button"
              onClick={previousSlide}
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next */}

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots */}

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === index ? "w-6 bg-primary" : "w-2 bg-primary/30"
                }`}
              />
            ))}
          </div>
        </section>

        {/* CATEGORY QUICK LINKS */}

        {categories.length > 0 && (
          <section className="mt-8">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/categories?categoryId=${category.id}`}
                  className="shrink-0 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary-light hover:text-primary"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* BEST SELLERS */}

        <ProductSection
          title="Best Sellers"
          products={bestSellers}
          wishlistIds={wishlistIds}
          onWishlist={handleWishlist}
          onAddToCart={handleAddToCart}
        />

        {/* NEW ARRIVALS */}

        <ProductSection
          title="New Arrivals"
          products={newArrivals}
          wishlistIds={wishlistIds}
          onWishlist={handleWishlist}
          onAddToCart={handleAddToCart}
        />

        {/* UPCOMING PRODUCTS */}

        {upcomingProducts.length > 0 && (
          <ProductSection
            title="Upcoming"
            products={upcomingProducts}
            wishlistIds={wishlistIds}
            onWishlist={handleWishlist}
            onAddToCart={handleAddToCart}
            showViewAll={false}
          />
        )}

        {/* WHY CHOOSE US */}

        <section className="mt-14 overflow-hidden rounded-3xl border border-border bg-[#f5f7eb]">
          <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {[
              {
                icon: Leaf,
                title: "Natural Ingredients",
                description: "Clean & Wholesome",
              },
              {
                icon: Sparkles,
                title: "No Preservatives",
                description: "100% Pure & Safe",
              },
              {
                icon: User,
                title: "Goal-Based Nutrition",
                description: "For Every Life Stage",
              },
              {
                icon: Leaf,
                title: "Millet Powered",
                description: "Ancient Grain Nutrition",
              },
              {
                icon: Heart,
                title: "Made in India",
                description: "Delivered With Love",
              },
              {
                icon: Sparkles,
                title: "Scientifically Curated",
                description: "Backed by Nutrition",
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center justify-center px-4 py-6 text-center transition-colors hover:bg-white"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold">{feature.title}</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
