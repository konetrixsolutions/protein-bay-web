"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiChevronDown,
  FiChevronUp,
  FiHeart,
  FiSearch,
  FiShoppingCart,
  FiSliders,
  FiX,
} from "react-icons/fi";
import {
  FaLeaf,
  FaFlask,
  FaUsers,
  FaShieldAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
}

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
  name: string;
  shortDescription?: string;
  imageUrls?: string[];
  rating?: number | string;
  reviewCount?: number;
  badges?: string[];
  categoryId?: string;

  category?: {
    id: string;
    name: string;
  };

  variants?: ProductVariant[];
  productVariants?: ProductVariant[];
  productVariant?: ProductVariant;
}

interface ProductCard {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  categoryId?: string;
  variantId?: string;
  variantName?: string;
}

const FALLBACK_IMAGE = "/images/cookie.jpg";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductCard[]>([]);

  const [loading, setLoading] = useState(true);
  const [addingCartId, setAddingCartId] = useState<string | null>(null);
  const [addingWishlistId, setAddingWishlistId] = useState<string | null>(null);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const [sortBy, setSortBy] = useState("best-sellers");
  const [showProductFilter, setShowProductFilter] = useState(true);
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            withCredentials: true,
          }),

          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            withCredentials: true,
          }),
        ]);

        const categoryData = categoriesResponse.data?.data ?? [];
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const rawProductData = productsResponse.data?.data;
        const productData = Array.isArray(rawProductData)
          ? rawProductData
          : Array.isArray(rawProductData?.products)
            ? rawProductData.products
            : Array.isArray(rawProductData?.data)
              ? rawProductData.data
              : [];

        const normalizedProducts: ProductCard[] = productData.map(
          (product: Product) => {
            const variants = product.variants ?? product.productVariants ?? [];

            const variant =
              variants.find((item) => item.isDefault) ??
              variants[0] ??
              product.productVariant;

            const price = Number(variant?.price ?? 0);
            const mrp = Number(variant?.mrp ?? price);
            const apiImage = product.imageUrls?.[0];
            const image =
              apiImage && !apiImage.includes("test.com")
                ? apiImage
                : FALLBACK_IMAGE;

            return {
              id: product.id,
              name: product.name,

              description:
                product.shortDescription ??
                "Healthy nutrition for your everyday goals.",
              image,
              price,
              mrp,
              rating: Number(product.rating ?? 0),
              reviewCount: Number(product.reviewCount ?? 0),
              badge: product.badges?.[0],

              /*
               * Product filtering must use categoryId.
               * product.categoryId
               * category.id
               */

              categoryId: product.categoryId ?? product.category?.id,
              variantId: variant?.id,
              variantName: variant?.name,
            };
          },
        );

        setProducts(normalizedProducts);

        const productPrices = normalizedProducts
          .map((product) => product.price)
          .filter((price) => Number.isFinite(price) && price >= 0);

        const highestProductPrice =
          productPrices.length > 0
            ? Math.ceil(Math.max(...productPrices) / 100) * 100
            : 1000;

        setMaxPrice(highestProductPrice);
      } catch (error) {
        console.error("Categories/Product fetch error:", error);

        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ?? "Unable to load products.",
          );
        } else {
          toast.error("Unable to load products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const priceLimit = useMemo(() => {
    const prices = products
      .map((product) => product.price)
      .filter((price) => Number.isFinite(price) && price >= 0);

    if (prices.length === 0) {
      return 1000;
    }

    return Math.max(100, Math.ceil(Math.max(...prices) / 100) * 100);
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    /*
     * Counts are calculated from the complete product list.
     * Do not use filteredProducts here because the count would
      change whenever another filter is selected.
     */

    products.forEach((product) => {
      if (product.categoryId) {
        counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
      }
    });

    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue) ||
          product.description.toLowerCase().includes(searchValue),
      );
    }

    /*
     * CATEGORY FILTER
     * A product belongs to a category when:
     * product.categoryId === category.id
     * Multiple selected categories work as OR:
     * Bonda + Cookie
     * means:
     * show Bonda products OR Cookie products.
     */

    if (selectedCategories.length > 0) {
      result = result.filter(
        (product) =>
          product.categoryId !== undefined &&
          selectedCategories.includes(product.categoryId),
      );
    }

    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice,
    );

    switch (sortBy) {
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "new":
        result.reverse();
        break;

      case "best-sellers":
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [products, search, selectedCategories, minPrice, maxPrice, sortBy]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  useEffect(() => {
    // reset to first page whenever filters/search change
    setCurrentPage(1);
  }, [filteredProducts]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const getPageNumbers = () => {
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      // gap after first
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) {
      // gap before last
    }
    pages.push(totalPages);
    return pages;
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((current) => {
      if (current.includes(categoryId)) {
        return current.filter((id) => id !== categoryId);
      }
      return [...current, categoryId];
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(priceLimit);
  };

  const handleAddToCart = async (product: ProductCard) => {
    if (!product.variantId) {
      toast.error("This product is currently unavailable.");
      return;
    }

    try {
      setAddingCartId(product.id);

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

      toast.success(`${product.name} added to cart.`);
      try {
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {}
    } catch (error) {
      console.error("Add to cart error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Unable to add product to cart.",
        );
      } else {
        toast.error("Unable to add product to cart.");
      }
    } finally {
      setAddingCartId(null);
    }
  };

  const handleAddToWishlist = async (product: ProductCard) => {
    if (!product.variantId) {
      toast.error("This product is currently unavailable.");
      return;
    }

    if (addingWishlistId === product.id) {
      return;
    }

    if (wishlistIds.includes(product.variantId)) {
      return;
    }

    try {
      setAddingWishlistId(product.id);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
        {
          productVariantId: product.variantId,
        },
        {
          withCredentials: true,
        },
      );

      setWishlistIds((current) => {
        if (current.includes(product.variantId as string)) {
          return current;
        }

        return [...current, product.variantId as string];
      });

      toast.success(`${product.name} added to wishlist.`);
    } catch (error) {
      console.error("Add to wishlist error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Unable to add product to wishlist.",
        );
      } else {
        toast.error("Unable to add product to wishlist.");
      }
    } finally {
      setAddingWishlistId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f4]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <Skeleton className="h-12 rounded-xl" />

            <div className="mt-8 grid gap-6 lg:grid-cols-4">
              <Skeleton className="hidden h-[620px] rounded-2xl lg:block" />

              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#e1e7dd] bg-white p-3"
                  >
                    <Skeleton className="aspect-square rounded-xl" />

                    <Skeleton className="mt-4 h-5 rounded" />

                    <Skeleton className="mt-2 h-4 w-2/3 rounded" />

                    <Skeleton className="mt-5 h-10 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#f7f9f4]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* SEARCH */}

        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#657267]"
            />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for something..."
              className="h-11 w-full  pl-11 pr-4 text-sm transition-all "
            />
          </div>

          {/* <Button
            
            onClick={() => {
              setSearch(search);
            }}
            className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary-hover"
          >
            <FiSearch size={17} />

            <span className="hidden sm:block">Search</span>
          </Button> */}
        </div>

        {/* MOBILE FILTER BUTTON */}

        <Button
          onClick={() => setShowMobileFilters(true)}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2  text-sm font-semibold  lg:hidden"
        >
          <FiSliders size={17} />
          Filters
        </Button>

        <div className="mt-6 grid gap-7 lg:grid-cols-[265px_1fr]">
          {/* DESKTOP SIDEBAR */}

          <aside className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              categoryCounts={categoryCounts}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              showProductFilter={showProductFilter}
              setShowProductFilter={setShowProductFilter}
              showPriceFilter={showPriceFilter}
              setShowPriceFilter={setShowPriceFilter}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceLimit={priceLimit}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              clearFilters={clearFilters}
            />
          </aside>

          {/* 
              PRODUCTS
           */}

          <section>
            {/* Heading */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-[#101610] sm:text-3xl">
                    All Categories
                  </h1>

                  <FaLeaf className="text-primary" size={18} />
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Discover healthy products tailored to your goals.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="text-xs font-medium text-[#657267] sm:text-sm">
                  Showing{" "}
                  <span className="font-bold text-[#173b1b]">
                    {filteredProducts.length}
                  </span>{" "}
                  Products
                </p>

                {/* Sort */}

                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-[#657267] sm:block">
                    Sort By:
                  </span>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 min-w-[145px] appearance-none rounded-xl border border-[#dfe6da] bg-white px-3 pr-9 text-xs font-medium outline-none focus:border-primary"
                    >
                      <option value="best-sellers">Best Sellers</option>

                      <option value="price-high">Price: High to Low</option>

                      <option value="price-low">Price: Low to High</option>

                      <option value="new">New Arrivals</option>
                    </select>

                    <FiChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}

            {filteredProducts.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-[#dfe6da] bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf4e9]">
                  <FiSearch size={23} className="text-primary" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#173b1b]">
                  No products found
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing your search or filters.
                </p>

                <Button
                  onClick={() => {
                    setSearch("");
                    clearFilters();
                  }}
                  className="mt-5  px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCardView
                    key={product.id}
                    product={product}
                    adding={addingCartId === product.id}
                    wishlistAdding={addingWishlistId === product.id}
                    wishlisted={
                      !!product.variantId &&
                      wishlistIds.includes(product.variantId)
                    }
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 
          FEATURE STRIP
         */}
        {/* pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>

                {(() => {
                  const pages = getPageNumbers();
                  const nodes: React.ReactNode[] = [];

                  for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];

                    if (i > 0 && page - pages[i - 1] > 1) {
                      nodes.push(
                        <PaginationItem key={`e-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>,
                      );
                    }

                    nodes.push(
                      <PaginationItem key={`p-${page}`}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e: any) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {String(page)}
                        </PaginationLink>
                      </PaginationItem>,
                    );
                  }

                  return nodes;
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <div className="lg:block hidden">
          <FeatureStrip />
        </div>
      </div>

      {/* 
          MOBILE FILTER DRAWER
       */}

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setShowMobileFilters(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#f7f9f4] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#173b1b]">Filters</h2>

              <Button
                onClick={() => setShowMobileFilters(false)}
                variant="outline"
                className="flex h-9 w-9 items-center justify-center rounded-full "
              >
                <FiX size={18} />
              </Button>
            </div>

            <FilterSidebar
              categories={categories}
              categoryCounts={categoryCounts}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              showProductFilter={showProductFilter}
              setShowProductFilter={setShowProductFilter}
              showPriceFilter={showPriceFilter}
              setShowPriceFilter={setShowPriceFilter}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceLimit={priceLimit}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              clearFilters={clearFilters}
            />

            <Button
              onClick={() => setShowMobileFilters(false)}
              variant="primary"
              className="mt-5 h-12 w-full  text-sm font-semibold "
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Categories;

/*
 FILTER SIDEBAR
*/

interface FilterSidebarProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
  showProductFilter: boolean;
  setShowProductFilter: (value: boolean) => void;
  showPriceFilter: boolean;
  setShowPriceFilter: (value: boolean) => void;
  minPrice: number;
  maxPrice: number;
  priceLimit: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  clearFilters: () => void;
}

const FilterSidebar = ({
  categories,
  categoryCounts,
  selectedCategories,
  toggleCategory,
  showProductFilter,
  setShowProductFilter,
  showPriceFilter,
  setShowPriceFilter,
  minPrice,
  maxPrice,
  priceLimit,
  setMinPrice,
  setMaxPrice,
  clearFilters,
}: FilterSidebarProps) => {
  return (
    <div className="rounded-2xl border border-[#dfe6da] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.04)]">
      {/* Header */}

      <div className="flex items-center gap-3 border-b border-[#e5e9e1] pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf4e9]">
          <FiSliders size={17} className="text-primary" />
        </div>

        <h2 className="font-bold text-[#173b1b]">Filters</h2>
      </div>

      {/* Product Type */}

      <div className="mt-5">
        <Button
          onClick={() => setShowProductFilter(!showProductFilter)}
          variant="primary"
          className="flex w-full items-center justify-between text-sm font-bold "
        >
          Product Type
          {showProductFilter ? (
            <FiChevronUp size={17} />
          ) : (
            <FiChevronDown size={17} />
          )}
        </Button>

        {showProductFilter && (
          <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
            {categories.map((category) => {
              const checked = selectedCategories.includes(category.id);

              return (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(category.id)}
                    className="h-4 w-4 rounded border-[#bfc9ba] accent-[#173b1b]"
                  />

                  <span className="flex-1">{category.name}</span>

                  <span className="text-xs text-muted-foreground">
                    ({categoryCounts[category.id] ?? 0})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider */}

      <div className="my-5 border-t border-[#e5e9e1]" />

      {/* Price */}

      <div>
        <Button
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          variant="primary"
          className="flex w-full items-center justify-between text-sm font-bold"
        >
          Price Range
          {showPriceFilter ? (
            <FiChevronUp size={17} />
          ) : (
            <FiChevronDown size={17} />
          )}
        </Button>

        {showPriceFilter && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>₹{minPrice}</span>

              <span>₹{maxPrice}</span>
            </div>

            <div className="mt-4 space-y-3">
              <input
                type="range"
                min={0}
                max={priceLimit}
                step={10}
                value={Math.min(minPrice, priceLimit)}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value <= maxPrice) {
                    setMinPrice(value);
                  }
                }}
                className="w-full accent-[#173b1b]"
              />

              <input
                type="range"
                min={0}
                max={priceLimit}
                step={10}
                value={Math.min(maxPrice, priceLimit)}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value >= minPrice) {
                    setMaxPrice(value);
                  }
                }}
                className="w-full accent-[#173b1b]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}

      <div className="mt-6 space-y-2.5">
        <Button
          onClick={clearFilters}
          variant="outline"
          className="h-10 w-full  text-sm font-semibold text-primary transition-all "
        >
          Clear All
        </Button>

        {/* <Button
          
          className="h-10 w-full rounded-xl  lg:block hidden bg-primary text-sm font-semibold text-white transition-all hover:bg-primary-hover"
        >
          Apply Filters
        </Button> */}
      </div>

      {/* Trust card */}

      <div className="mt-5 rounded-xl bg-[#f7f9f4] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f2e4]">
            <FaLeaf className="text-primary" size={19} />
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            All our products are made with{" "}
            <span className="font-bold text-primary">natural ingredients</span>{" "}
            and no preservatives.
          </p>
        </div>
      </div>
    </div>
  );
};

/*
 PRODUCT CARD
*/

interface ProductCardViewProps {
  product: ProductCard;
  adding: boolean;
  wishlistAdding: boolean;
  wishlisted: boolean;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
}

const ProductCardView = ({
  product,
  adding,
  wishlistAdding,
  wishlisted,
  onAddToCart,
  onAddToWishlist,
}: ProductCardViewProps) => {
  const router = useRouter();
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div
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
          const categoryQuery = product.categoryId
            ? `?categoryId=${product.categoryId}`
            : "";

          router.push(`/products/${product.id}${categoryQuery}`);
        } catch (err) {}
      }}
      className="group overflow-hidden rounded-2xl border border-[#dfe6da] bg-white shadow-[0_5px_20px_rgba(23,59,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#cdd8c8] hover:shadow-[0_15px_35px_rgba(23,59,27,0.09)]"
    >
      {/* Image */}

      <div className="relative aspect-square overflow-hidden bg-[#f6f0e7]">
        {/* Badge */}

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
            {String(product.badge).replace(/_/g, " ")}
          </span>
        )}

        {/* Discount */}

        {discount > 0 && (
          <span className="absolute bottom-2.5 left-2.5 z-10 rounded-md bg-white/95 px-2 py-1 text-[9px] font-bold text-primary shadow-sm">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist */}

        <Button
          aria-label={wishlisted ? "Added to wishlist" : "Add to wishlist"}
          onClick={onAddToWishlist}
          disabled={wishlistAdding || wishlisted}
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#dfe6da] bg-white/95 text-[#657267] shadow-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiHeart
            size={17}
            className={
              wishlisted
                ? "fill-primary text-primary"
                : wishlistAdding
                  ? "animate-pulse text-primary"
                  : ""
            }
          />
        </Button>

        {/* Product Image */}

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={(e) => {
            const img = e.currentTarget;

            if (img.dataset.fallback === "true") {
              return;
            }

            img.dataset.fallback = "true";
            img.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Content */}

      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-[#172017] sm:text-[15px]">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {product.description}
        </p>

        {/* Rating */}

        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-[11px] text-[#e6aa21]">
            {"★★★★★".split("").map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </div>

          <span className="text-[10px] text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-[#173b1b]">
            ₹{product.price}
          </span>

          {product.mrp > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* Buttons */}

        <div className="mt-3 flex gap-2">
          <Button
            onClick={onAddToCart}
            disabled={adding}
            variant="primary"
            className="flex h-9 flex-1 items-center justify-center gap-1.5 px-2 text-xs font-semibold  transition-all  disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            {adding ? (
              "Adding..."
            ) : (
              <>
                <span>Add to Cart</span>
              </>
            )}
          </Button>

          <Button
            onClick={onAddToCart}
            disabled={adding}
            aria-label="Add to cart"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#dfe6da] bg-white text-primary transition-all hover:border-primary hover:bg-[#edf4e9] disabled:opacity-60"
          >
            <FiShoppingCart size={17} />
          </Button>
        </div>
      </div>
    </div>
  );
};

/*
 FEATURE STRIP
*/

const FeatureStrip = () => {
  const features = [
    {
      icon: FaLeaf,
      title: "Natural Ingredients",
      description: "Clean & Wholesome",
    },
    {
      icon: FaFlask,
      title: "No Preservatives",
      description: "100% Pure & Safe",
    },
    {
      icon: FaUsers,
      title: "Goal-Based Nutrition",
      description: "For Every Life Stage",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Made in India",
      description: "Delivered with Love",
    },
    {
      icon: FaShieldAlt,
      title: "Trusted by Thousands",
      description: "Happy & Healthy Customers",
    },
  ];

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#dfe6da] bg-white">
      <div className="grid divide-y divide-[#dfe6da] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="flex items-center gap-4 px-5 py-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf4e9]">
                <Icon size={19} className="text-primary" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#173b1b]">
                  {feature.title}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
