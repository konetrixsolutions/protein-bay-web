"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiZap,
} from "react-icons/fi";
import { FaLeaf, FaFlask, FaHeart, FaShieldAlt, FaStar } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductVariant {
  id: string;
  name: string;
  weightInGrams: number;
  price: number | string;
  mrp: number | string;
  isDefault?: boolean;
}

interface Product {
  id: string;
  categoryId?: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  ingredients?: string[] | null;
  nutritionFacts?: Record<string, unknown> | null;
  howToUse?: string[] | string | null;
  benefits?: string[] | null;
  tags?: string[] | null;
  imageUrls?: string[] | null;
  badges?: string[] | null;
  rating?: number | string;
  reviewCount?: number;
  variants?: ProductVariant[];
  productVariants?: ProductVariant[];
  category?: {
    id: string;
    name: string;
  };
}

interface RelatedProduct {
  id: string;
  categoryId?: string;
  name: string;
  shortDescription?: string;
  imageUrls?: string[] | null;
  rating?: number | string;
  reviewCount?: number;
  badges?: string[] | null;
  variants?: ProductVariant[];
  productVariants?: ProductVariant[];
}

const FALLBACK_IMAGE = "/images/cookie.jpg";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DUMMY_IMAGES = [
  "/images/cookie.jpg",
  "/images/fb.png",
  "/images/cookie.jpg",
  "/images/cookie.jpg",
];

const ProductView = () => {
  const params = useParams();
  const router = useRouter();

  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId") ?? undefined;

  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState("description");

  const [addingCart, setAddingCart] = useState(false);

  const [buyingNow, setBuyingNow] = useState(false);

  const [addingWishlist, setAddingWishlist] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const [isZoomed, setIsZoomed] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        /*
         * The products API is category-based:
         * GET /products?categoryId={categoryId}
         *
         * We first get the product list so we can locate the requested
         * product by its id. Once the product is found, the same response
         * is also used to build the "You May Also Like" section.
         *
         * If the category id is available in the URL, use it directly.
         * Otherwise, fall back to the normal /products request.
         */
        const productsResponse = await axios.get(`${API_URL}/products`, {
          params: categoryId ? { categoryId } : undefined,
          withCredentials: true,
        });

        const rawProducts = productsResponse.data?.data;

        const allProducts: Product[] = Array.isArray(rawProducts)
          ? rawProducts
          : Array.isArray(rawProducts?.products)
            ? rawProducts.products
            : Array.isArray(rawProducts?.data)
              ? rawProducts.data
              : [];

        const productData = allProducts.find(
          (item: Product) => item.id === productId,
        );

        if (!productData) {
          throw new Error("Product not found");
        }

        setProduct(productData);

        const variants =
          productData.variants ?? productData.productVariants ?? [];

        const defaultVariant =
          variants.find((variant: ProductVariant) => variant.isDefault) ??
          variants[0];

        if (defaultVariant) {
          setSelectedVariantId(defaultVariant.id);
        } else {
          setSelectedVariantId("");
        }

        const related = allProducts
          .filter(
            (item: Product) =>
              item.id !== productId &&
              item.categoryId === productData.categoryId,
          )
          .slice(0, 4) as RelatedProduct[];

        setRelatedProducts(related);
      } catch (error) {
        console.error("Product fetch error:", error);

        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ?? "Unable to load product details.",
          );
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Unable to load product details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const variants = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.variants ?? product.productVariants ?? [];
  }, [product]);

  const selectedVariant = useMemo(() => {
    return (
      variants.find((variant) => variant.id === selectedVariantId) ??
      variants.find((variant) => variant.isDefault) ??
      variants[0]
    );
  }, [variants, selectedVariantId]);

  const images = useMemo(() => {
    const validImages =
      product?.imageUrls?.filter(
        (image) => typeof image === "string" && image.trim(),
      ) ?? [];

    if (validImages.length === 0) {
      return DUMMY_IMAGES;
    }

    // If there are fewer than 4 real images, pad with dummy images
    const padded = [...validImages, ...DUMMY_IMAGES].slice(0, 4);
    return padded;
    // retrun validImages
  }, [product]);

  const currentPrice = Number(selectedVariant?.price ?? 0);

  const currentMrp = Number(selectedVariant?.mrp ?? currentPrice);

  const discount =
    currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : 0;

  const totalPrice = currentPrice * quantity;

  const rating = Number(product?.rating ?? 0);

  const reviewCount = Number(product?.reviewCount ?? 0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) {
      return;
    }

    const rect = imageContainerRef.current.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;

    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleQuantityDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast.error("Please select a product variant.");
      return;
    }

    try {
      setAddingCart(true);

      await axios.post(
        `${API_URL}/cart/items`,
        {
          productVariantId: selectedVariant.id,
          quantity,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("Product added to cart.");

      // Notify other parts of the app (Navbar) to refresh cart count
      try {
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {
        // no-op in non-browser environments
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.push("/auth/login");
          return;
        }

        toast.error(
          error.response?.data?.message ?? "Unable to add product to cart.",
        );
      } else {
        toast.error("Unable to add product to cart.");
      }
    } finally {
      setAddingCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) {
      toast.error("Please select a product variant.");
      return;
    }

    try {
      setBuyingNow(true);

      await axios.post(
        `${API_URL}/cart/items`,
        {
          productVariantId: selectedVariant.id,
          quantity,
        },
        {
          withCredentials: true,
        },
      );

      // Notify other parts of the app (Navbar) to refresh cart count
      try {
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {
        // no-op in non-browser environments
      }

      router.push("/cart");
    } catch (error) {
      console.error("Buy now error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.push("/auth/login");
          return;
        }

        toast.error(
          error.response?.data?.message ?? "Unable to proceed with purchase.",
        );
      } else {
        toast.error("Unable to proceed with purchase.");
      }
    } finally {
      setBuyingNow(false);
    }
  };

  const handleWishlist = async () => {
    if (!selectedVariant?.id) {
      toast.error("Please select a product variant.");
      return;
    }

    if (isWishlisted) {
      return;
    }

    try {
      setAddingWishlist(true);

      await axios.post(
        `${API_URL}/wishlist`,
        {
          productVariantId: selectedVariant.id,
        },
        {
          withCredentials: true,
        },
      );

      setIsWishlisted(true);

      toast.success("Added to wishlist.");
    } catch (error) {
      console.error("Wishlist error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.push("/auth/login");
          return;
        }

        toast.error(
          error.response?.data?.message ?? "Unable to add to wishlist.",
        );
      } else {
        toast.error("Unable to add to wishlist.");
      }
    } finally {
      setAddingWishlist(false);
    }
  };

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f9f4]">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">
              Product not found
            </h1>

            <Button
              onClick={() => router.back()}
              variant="primary"
              className="mt-5 "
            >
              Go Back
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f4]">
      <div className="mx-auto max-w-[1450px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Breadcrumb */}

        <div className="mb-5 flex  items-center gap-2 overflow-hidden text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="shrink-0 transition-colors hover:text-primary cursor-pointer"
          >
            Home
          </button>

          <FiChevronRight size={13} />

          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="shrink-0 transition-colors hover:text-primary cursor-pointer"
          >
            Categories
          </button>

          <FiChevronRight size={13} />

          <span className="shrink-0">
            {product.category?.name ?? "Product"}
          </span>

          <FiChevronRight size={13} />

          <span className="truncate font-medium text-primary">
            {product.name}
          </span>
        </div>

        {/* Main Product Section */}

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)] xl:gap-12">
          {/* Gallery */}

          <div className="min-w-0">
            <div className="grid gap-4 sm:grid-cols-[82px_minmax(0,1fr)]">
              {/* Thumbnails */}

              <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all sm:h-[76px] sm:w-[76px] ${
                      selectedImage === index
                        ? "border-primary shadow-[0_5px_20px_rgba(23,59,27,0.12)]"
                        : "border-[#dfe6da] hover:border-primary/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        const imageElement = event.currentTarget;

                        if (imageElement.dataset.fallback === "true") {
                          return;
                        }

                        imageElement.dataset.fallback = "true";
                        imageElement.src = FALLBACK_IMAGE;
                      }}
                    />

                    {selectedImage === index && (
                      <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Main Image */}

              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                className="group relative order-1 aspect-square overflow-hidden rounded-[28px] border border-[#e0e6dc] bg-[#f1e9dd] shadow-[0_15px_45px_rgba(23,59,27,0.07)] sm:order-2"
              >
                {/* Badge */}

                {product.badges?.[0] && (
                  <span className="absolute left-5 top-5 z-20 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    {product.badges[0].replace(/_/g, " ")}
                  </span>
                )}

                {/* Discount */}

                {discount > 0 && (
                  <span className="absolute bottom-5 left-5 z-20 rounded-full border border-[#dfe6da] bg-white/95 px-3 py-1.5 text-xs font-bold text-primary shadow-md">
                    {discount}% OFF
                  </span>
                )}

                {/* Wishlist */}

                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={addingWishlist || isWishlisted}
                  className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe6da] bg-white/95 text-primary shadow-md transition-all hover:scale-105 hover:border-primary hover:text-primary disabled:cursor-not-allowed"
                >
                  <FiHeart
                    size={20}
                    className={
                      isWishlisted
                        ? "fill-primary text-primary"
                        : addingWishlist
                          ? "animate-pulse"
                          : ""
                    }
                  />
                </button>

                {/* Zoom Image */}

                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-300 ease-out"
                  style={{
                    transform: isZoomed ? "scale(1.65)" : "scale(1)",
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                  onError={(event) => {
                    const imageElement = event.currentTarget;

                    if (imageElement.dataset.fallback === "true") {
                      return;
                    }

                    imageElement.dataset.fallback = "true";
                    imageElement.src = FALLBACK_IMAGE;
                  }}
                />

                {/* Desktop zoom hint */}

                <div className="pointer-events-none absolute bottom-4 right-4 hidden rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-[10px] font-medium text-[#657267] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 lg:block">
                  Move cursor to zoom
                </div>

                {/* Image Navigation */}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImage((current) =>
                          current === 0 ? images.length - 1 : current - 1,
                        )
                      }
                      className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dfe6da] bg-white/95 text-primary shadow-md transition-all hover:scale-105"
                    >
                      <FiChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImage((current) =>
                          current === images.length - 1 ? 0 : current + 1,
                        )
                      }
                      className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dfe6da] bg-white/95 text-primary shadow-md transition-all hover:scale-105"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}

          <div className="flex min-w-0 flex-col">
            <div>
              <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#101610] sm:text-4xl xl:text-[42px]">
                {product.name}
              </h1>

              {/* Rating */}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-[#e8ad1c]" size={15} />

                  <span className="font-bold text-primary">
                    {rating.toFixed(1)}
                  </span>

                  <span className="text-muted-foreground">
                    ({reviewCount} Reviews)
                  </span>
                </div>

                {selectedVariant?.name && (
                  <>
                    <span className="h-4 w-px bg-[#dfe6da]" />

                    <span className="text-muted-foreground">
                      {selectedVariant.name}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}

              {product.tags && product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[#d9e5d4] bg-[#f4f8f1] px-2.5 py-1 text-[11px] font-semibold text-[#315c37]"
                    >
                      {tag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold tracking-tight text-primary">
                  ₹{currentPrice}
                </span>

                {currentMrp > currentPrice && (
                  <span className="mb-1 text-base text-muted-foreground line-through">
                    ₹{currentMrp}
                  </span>
                )}

                {discount > 0 && (
                  <span className="mb-1 rounded-md bg-[#eaf5e6] px-2 py-1 text-xs font-bold text-primary">
                    Save {discount}%
                  </span>
                )}

                <span className="mb-1 text-xs text-muted-foreground">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Short Description */}

              {product.shortDescription && (
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Benefits */}

            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-primary">Benefits</h3>

                  {product.benefits.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("description")}
                      className="text-xs font-semibold text-primary"
                    >
                      See all
                    </button>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {product.benefits.slice(0, 6).map((benefit) => (
                    <div
                      key={benefit}
                      className="rounded-xl border border-[#dfe6da] bg-white p-3"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#edf4e9]">
                        <FiCheck size={14} className="text-primary" />
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-[#315238]">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}

            {variants.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-primary">
                    Select Size
                  </h3>

                  <span className="text-xs text-muted-foreground">
                    {variants.length} options
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    const active = variant.id === selectedVariant?.id;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariantId(variant.id);
                          setQuantity(1);
                        }}
                        className={`rounded-xl border px-4 py-2.5 text-left transition-all ${
                          active
                            ? "border-primary bg-[#edf4e9] text-primary shadow-sm"
                            : "border-[#dfe6da] bg-white text-[#315238] hover:border-primary/50"
                        }`}
                      >
                        <p className="text-xs font-bold">{variant.name}</p>

                        <p className="mt-0.5 text-[11px]">
                          ₹{Number(variant.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}

            <div className="mt-7 border-t border-[#e1e7dd] pt-6">
              <p className="mb-3 text-sm font-bold text-primary">Quantity</p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 w-full items-center justify-between rounded-xl border border-[#dfe6da] bg-white sm:w-[130px]">
                  <Button
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    variant="primary"
                    // className="flex h-full w-10 items-center justify-center text-primary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiMinus size={16} />
                  </Button>

                  <span className="text-sm font-bold text-primary">
                    {quantity}
                  </span>

                  <Button
                    onClick={handleQuantityIncrease}
                    variant="primary"
                    // className="flex h-full w-10 items-center justify-center text-primary transition-colors hover:text-primary"
                  >
                    <FiPlus size={16} />
                  </Button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={addingCart || buyingNow}
                  variant="primary"
                  className="flex h-12 sm:flex-1  items-center justify-center gap-2  px-5 text-sm font-bold  disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiShoppingCart size={18} />

                  {addingCart ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={addingCart || buyingNow}
                  variant="outline"
                  className="flex h-12 sm:flex-1 items-center justify-center gap-2  px-5 text-sm font-bold  disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiZap size={17} />

                  {buyingNow ? "Please wait..." : "Buy Now"}
                </Button>
              </div>

              {/* Price summary */}

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {quantity} × ₹{currentPrice}
                </span>

                <span className="font-bold text-primary">
                  Total ₹{totalPrice}
                </span>
              </div>
            </div>

            {/* Trust Features */}

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#dfe6da] bg-white p-3 sm:grid-cols-4">
              <TrustFeature
                icon={FaLeaf}
                title="Natural"
                subtitle="Ingredients"
              />

              <TrustFeature
                icon={FaFlask}
                title="No"
                subtitle="Preservatives"
              />

              <TrustFeature
                icon={FaShieldAlt}
                title="Made in"
                subtitle="India"
              />

              <TrustFeature
                icon={FaHeart}
                title="Healthy"
                subtitle="Nutrition"
              />
            </div>
          </div>
        </section>

        {/* Details */}

        <section className="mt-12 overflow-hidden rounded-3xl border border-[#dfe6da] bg-white shadow-[0_10px_35px_rgba(23,59,27,0.04)]">
          {/* Tabs */}

          <div className="overflow-x-auto border-b border-[#e5e9e1]">
            <div className="flex min-w-max">
              <ProductTab
                active={activeTab === "description"}
                onClick={() => setActiveTab("description")}
                icon={FaLeaf}
                label="Description"
              />

              <ProductTab
                active={activeTab === "ingredients"}
                onClick={() => setActiveTab("ingredients")}
                icon={FaFlask}
                label="Ingredients"
              />

              <ProductTab
                active={activeTab === "nutrition"}
                onClick={() => setActiveTab("nutrition")}
                icon={FaShieldAlt}
                label="Nutrition Facts"
              />

              <ProductTab
                active={activeTab === "how-to-use"}
                onClick={() => setActiveTab("how-to-use")}
                icon={FiZap}
                label="How To Use"
              />
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {activeTab === "description" && (
              <DescriptionContent product={product} />
            )}

            {activeTab === "ingredients" && (
              <IngredientsContent product={product} />
            )}

            {activeTab === "nutrition" && (
              <NutritionContent product={product} />
            )}

            {activeTab === "how-to-use" && (
              <HowToUseContent product={product} />
            )}
          </div>
        </section>

        {/* You May Also Like */}

        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  You May Also Like
                </p>

                <h2 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
                  More from ProteinBay
                </h2>
              </div>

              <button
                type="button"
                onClick={() => router.push("/categories")}
                className="hidden items-center gap-2 text-sm font-semibold text-primary sm:flex"
              >
                View all
                <FiArrowLeft className="rotate-180" size={16} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <RelatedProductCard
                  key={item.id}
                  product={item}
                  onClick={() =>
                    router.push(
                      `/products/${item.id}?categoryId=${item.categoryId ?? product.categoryId ?? ""}`,
                    )
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductView;

/* =========================================================
   TRUST FEATURE
========================================================= */

interface TrustFeatureProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

const TrustFeature = ({ icon: Icon, title, subtitle }: TrustFeatureProps) => {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-[#edf0eb] py-2 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf4e9]">
        <Icon size={14} className="text-primary" />
      </div>

      <div>
        <p className="text-[10px] font-bold text-primary">{title}</p>

        <p className="text-[9px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

/* =========================================================
   PRODUCT TAB
========================================================= */

interface ProductTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const ProductTab = ({
  active,
  onClick,
  icon: Icon,
  label,
}: ProductTabProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-4 text-xs font-semibold transition-colors sm:px-7 sm:text-sm ${
        active ? "text-primary" : "text-muted-foreground hover:text-primary"
      }`}
    >
      <Icon size={15} />
      {label}
      {active && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary sm:left-6 sm:right-6" />
      )}
    </button>
  );
};

/* =========================================================
   DESCRIPTION
========================================================= */

const DescriptionContent = ({ product }: { product: Product }) => {
  const benefits = product.benefits ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h3 className="text-lg font-bold text-primary">About this product</h3>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {product.longDescription ??
            product.shortDescription ??
            "A thoughtfully crafted nutrition product made with quality ingredients."}
        </p>

        {benefits.length > 0 && (
          <div className="mt-5 space-y-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 text-sm text-[#315238]"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#edf4e9]">
                  <FiCheck size={12} className="text-primary" />
                </div>

                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#dfe6da] bg-[#f7f9f4] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Perfect For
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <PerfectFor
            icon={FaHeart}
            label="Healthy"
            description="Daily nutrition"
          />

          <PerfectFor
            icon={FaLeaf}
            label="Natural"
            description="Clean ingredients"
          />

          <PerfectFor
            icon={FaShieldAlt}
            label="Active"
            description="Fitness lifestyle"
          />

          <PerfectFor
            icon={FaZapIcon}
            label="Everyday"
            description="Easy snacking"
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INGREDIENTS
========================================================= */

const IngredientsContent = ({ product }: { product: Product }) => {
  const ingredients = product.ingredients ?? [];

  return (
    <div>
      <h3 className="text-lg font-bold text-primary">Ingredients</h3>

      {ingredients.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Ingredient information will be available soon.
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient}
              className="flex items-center gap-2 rounded-xl border border-[#dfe6da] bg-[#f7f9f4] px-4 py-3"
            >
              <FaLeaf size={13} className="text-primary" />

              <span className="text-sm font-medium text-[#315238]">
                {ingredient}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   NUTRITION
========================================================= */

const NutritionContent = ({ product }: { product: Product }) => {
  const nutrition = product.nutritionFacts;

  if (!nutrition) {
    return (
      <div>
        <h3 className="text-lg font-bold text-primary">Nutrition Facts</h3>

        <p className="mt-4 text-sm text-muted-foreground">
          Nutrition information will be available soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-primary">Nutrition Facts</h3>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(nutrition).map(([key, value]) => (
          <div
            key={key}
            className="rounded-xl border border-[#dfe6da] bg-[#f7f9f4] p-4"
          >
            <p className="text-xs capitalize text-muted-foreground">
              {key.replace(/([A-Z])/g, " $1")}
            </p>

            <p className="mt-1 text-base font-bold text-primary">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   HOW TO USE
========================================================= */

const HowToUseContent = ({ product }: { product: Product }) => {
  const howToUse = product.howToUse;

  let instructions: string[] = [];

  if (Array.isArray(howToUse)) {
    instructions = howToUse;
  } else if (typeof howToUse === "string") {
    instructions = [howToUse];
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-primary">How To Use</h3>

      {instructions.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Usage instructions will be available soon.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {instructions.map((instruction, index) => (
            <div
              key={`${instruction}-${index}`}
              className="flex items-start gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf4e9] text-xs font-bold text-primary">
                {index + 1}
              </div>

              <p className="pt-1 text-sm leading-6 text-muted-foreground">
                {instruction}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   PERFECT FOR
========================================================= */

interface PerfectForProps {
  icon: React.ElementType;
  label: string;
  description: string;
}

const PerfectFor = ({ icon: Icon, label, description }: PerfectForProps) => {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#dfe6da] bg-white shadow-sm">
        <Icon size={18} className="text-primary" />
      </div>

      <p className="mt-2 text-xs font-bold text-primary">{label}</p>

      <p className="mt-1 text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
};

/* =========================================================
   RELATED PRODUCT
========================================================= */

interface RelatedProductCardProps {
  product: RelatedProduct;
  onClick: () => void;
}

const RelatedProductCard = ({ product, onClick }: RelatedProductCardProps) => {
  const variants = product.variants ?? product.productVariants ?? [];

  const variant = variants.find((item) => item.isDefault) ?? variants[0];

  const price = Number(variant?.price ?? 0);

  const mrp = Number(variant?.mrp ?? price);

  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const image =
    product.imageUrls?.[0] && !product.imageUrls[0].includes("test.com")
      ? product.imageUrls[0]
      : FALLBACK_IMAGE;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-[#dfe6da] bg-white text-left shadow-[0_5px_20px_rgba(23,59,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(23,59,27,0.09)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f1e9dd]">
        {discount > 0 && (
          <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm">
            {discount}% OFF
          </span>
        )}

        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            const imageElement = event.currentTarget;

            if (imageElement.dataset.fallback === "true") {
              return;
            }

            imageElement.dataset.fallback = "true";
            imageElement.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-bold text-primary">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-primary">₹{price}</span>

            {mrp > price && (
              <span className="ml-2 text-xs text-muted-foreground line-through">
                ₹{mrp}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#e8ad1c]">
            <FaStar />

            <span className="text-muted-foreground">
              {Number(product.rating ?? 0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

/* =========================================================
   SKELETON
========================================================= */

const ProductPageSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#f7f9f4]">
      <div className="mx-auto max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-72" />

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-[82px_1fr]">
            <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton
                  key={item}
                  className="h-20 w-20 shrink-0 rounded-xl"
                />
              ))}
            </div>

            <Skeleton className="aspect-square rounded-[28px] sm:order-2" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-4/5" />

            <Skeleton className="h-5 w-1/2" />

            <Skeleton className="h-8 w-32" />

            <Skeleton className="h-16 w-full" />

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-20 rounded-xl" />
              ))}
            </div>

            <Skeleton className="h-14 w-full rounded-xl" />

            <div className="flex gap-3">
              <Skeleton className="h-12 w-32 rounded-xl" />

              <Skeleton className="h-12 flex-1 rounded-xl" />

              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>

            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>

        <Skeleton className="mt-12 h-64 rounded-3xl" />

        <Skeleton className="mt-12 h-72 rounded-3xl" />
      </div>
    </main>
  );
};

/*
 * Small wrapper component so we can use the same Zap icon
 * through the PerfectFor component.
 */

const FaZapIcon = (props: React.ComponentProps<typeof FiZap>) => {
  return <FiZap {...props} />;
};
