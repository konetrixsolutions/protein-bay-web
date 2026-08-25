"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  FaBars,
  FaTimes,
  FaRegHeart,
  FaHeart,
  FaRegUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { PiShoppingCartBold } from "react-icons/pi";
import { FiHeadphones } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { getCartCount } from "@/lib/cartApi";

type MenuItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{
    size?: number | string;
    className?: string;
  }>;
};

const mainNavItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Categories",
    path: "/categories",
  },
  {
    label: "About Us",
    path: "/about-us",
  },
  {
    label: "Contact Us",
    path: "/contact-us",
  },
  {
    label: "My Orders",
    path: "/my-orders",
  },
];

const menuItems: MenuItem[] = [
  {
    label: "My Referrals",
    path: "/my-referral",
    icon: FaHeart,
  },
  {
    label: "Customer Support",
    path: "/customer-support",
    icon: FiHeadphones,
  },
  {
    label: "My Profile",
    path: "/my-profile",
    icon: FaRegUser,
  },
];

const Navbar = () => {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);

  const menuRef = useRef<HTMLDivElement>(null);

  /* Close menu when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  /* Close menu after navigation */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Load cart count  */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const count = await getCartCount();
        if (mounted) setCartCount(count);
      } catch (err) {}
    };

    load();

    const handler = () => {
      load();
    };

    window.addEventListener("cartUpdated", handler);

    return () => {
      mounted = false;
      window.removeEventListener("cartUpdated", handler);
    };
  }, []);

  const router = useRouter();

  if (pathname === "/auth/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setMenuOpen(false);

    try {
      // notify other parts of the app (cart count, profile state)
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {}

    router.push("/categories");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e7ece4] bg-[#fcfdf9]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">
        {/* LOGO */}
        <Link href="/" className="group shrink-0">
          <Image
            src="/images/logo.png"
            alt="ProteinBay"
            width={190}
            height={62}
            priority
            className="h-auto w-[148px] object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:w-[170px]"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-1 rounded-full border border-[#e3e9df] bg-white/80 p-1.5 shadow-[0_5px_20px_rgba(23,59,27,0.035)]">
            {mainNavItems.map((item) => {
              const active = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative rounded-full px-5 py-2.5 text-[13px] transition-all duration-300 ${
                    active
                      ? "bg-[#f0f5ec] font-semibold text-[#173b1b]"
                      : "font-medium text-[#56645b] hover:bg-[#f7f9f4] hover:text-[#173b1b]"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#3f7d3f]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT ACTIONS */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist - desktop + mobile */}

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e1e8de] bg-white text-[#29402e] shadow-[0_3px_12px_rgba(23,59,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cbdac5] hover:bg-[#f3f7ef] hover:text-[#173b1b] hover:shadow-[0_7px_20px_rgba(23,59,27,0.08)]"
          >
            <FaRegHeart
              size={18}
              className="transition-transform duration-300 group-hover:scale-105"
            />

            {/*
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#173b1b] px-1 text-[9px] font-bold text-white">
              2
            </span>
            */}
          </Link>

          {/* Cart */}

          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e1e8de] bg-white text-[#29402e] shadow-[0_3px_12px_rgba(23,59,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cbdac5] hover:bg-[#f3f7ef] hover:text-[#173b1b] hover:shadow-[0_7px_20px_rgba(23,59,27,0.08)]"
          >
            <PiShoppingCartBold
              size={21}
              className="transition-transform duration-300 group-hover:scale-105"
            />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#173b1b] px-1 text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MENU */}

          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((previous) => !previous)}
              className={`group flex h-11 items-center gap-2 rounded-full border px-3.5 transition-all duration-300 ${
                menuOpen
                  ? "border-[#173b1b] bg-[#173b1b] text-white shadow-[0_8px_22px_rgba(23,59,27,0.18)]"
                  : "border-[#e1e8de] bg-white text-[#29402e] shadow-[0_3px_12px_rgba(23,59,27,0.035)] hover:-translate-y-0.5 hover:border-[#cbdac5] hover:bg-[#f3f7ef] hover:text-[#173b1b] hover:shadow-[0_7px_20px_rgba(23,59,27,0.08)]"
              }`}
            >
              {menuOpen ? <FaTimes size={16} /> : <FaBars size={17} />}

              {/* MENU text only on desktop */}
              <span className="hidden text-[11px] font-bold uppercase tracking-[0.14em] lg:block">
                Menu
              </span>
            </button>

            {/* DESKTOP DROPDOWN */}

            {menuOpen && (
              <div className="absolute right-0 top-[58px] hidden w-[310px] overflow-hidden rounded-[22px] border border-[#dfe7da] bg-white shadow-[0_28px_70px_rgba(23,59,27,0.16)] lg:block">
                {" "}
                {/* Header */}
                <div className="relative overflow-hidden bg-[#173b1b] px-5 py-5 text-white">
                  <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                      <FaRegUser size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">My Account</p>

                      <p className="mt-1 text-[11px] text-white/60">
                        Manage your ProteinBay account
                      </p>
                    </div>
                  </div>
                </div>
                {/* Items */}
                <div className="p-2.5">
                  <p className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b968d]">
                    Account & Support
                  </p>

                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                          active
                            ? "bg-[#edf4e9] text-[#173b1b]"
                            : "text-[#4e5d53] hover:bg-[#f7f9f4] hover:text-[#173b1b]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            active
                              ? "bg-white text-[#173b1b] shadow-sm"
                              : "bg-[#f1f5ee] text-[#59675d] group-hover:bg-white group-hover:text-[#173b1b]"
                          }`}
                        >
                          <Icon size={16} />
                        </span>

                        <span className="flex-1 text-[13px] font-medium">
                          {item.label}
                        </span>

                        <IoChevronForward
                          size={13}
                          className="text-[#a2aca4] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#173b1b]"
                        />
                      </Link>
                    );
                  })}
                  <div className="mt-2 border-t border-[#edf0eb] pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-red-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-destructive group-hover:bg-red-100">
                        <FaSignOutAlt size={16} />
                      </span>

                      <span className="flex-1 text-sm font-medium text-destructive">
                        Logout
                      </span>

                      <IoChevronForward
                        size={14}
                        className="text-red-300 transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE MENU */}

            {menuOpen && (
              <div className="fixed left-3 right-3 top-[86px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-[22px] border border-[#dfe7da] bg-white shadow-[0_28px_70px_rgba(23,59,27,0.16)] lg:hidden">
                {" "}
                {/* Header */}
                <div className="relative overflow-hidden bg-[#173b1b] px-5 py-6 text-white">
                  <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                  <div className="relative">
                    <p className="text-lg font-semibold tracking-tight">
                      Welcome to ProteinBay
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/60">
                      Explore our products and manage your account.
                    </p>
                  </div>
                </div>
                {/* Explore */}
                <div className="border-b border-[#edf0eb] p-3">
                  <p className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b968d]">
                    Explore
                  </p>

                  {mainNavItems.map((item) => {
                    const active = pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                          active
                            ? "bg-[#edf4e9] text-[#173b1b]"
                            : "text-[#4e5d53] hover:bg-[#f7f9f4] hover:text-[#173b1b]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                            active
                              ? "bg-white text-[#173b1b] shadow-sm"
                              : "bg-[#f1f5ee] text-[#718076]"
                          }`}
                        >
                          {item.label.charAt(0)}
                        </span>

                        <span className="flex-1 text-sm font-medium">
                          {item.label}
                        </span>

                        <IoChevronForward
                          size={14}
                          className="text-[#a1aca3] transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    );
                  })}
                </div>
                {/* Account */}
                <div className="p-3">
                  <p className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b968d]">
                    My Account
                  </p>

                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                          active
                            ? "bg-[#edf4e9] text-[#173b1b]"
                            : "text-[#4e5d53] hover:bg-[#f7f9f4] hover:text-[#173b1b]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            active
                              ? "bg-white text-[#173b1b] shadow-sm"
                              : "bg-[#f1f5ee] text-[#59675d] group-hover:bg-white group-hover:text-[#173b1b]"
                          }`}
                        >
                          <Icon size={16} />
                        </span>

                        <span className="flex-1 text-sm font-medium">
                          {item.label}
                        </span>

                        <IoChevronForward
                          size={14}
                          className="text-[#a1aca3] transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    );
                  })}
                  <div className="mt-2 border-t border-[#edf0eb] pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-red-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-destructive group-hover:bg-red-100">
                        <FaSignOutAlt size={16} />
                      </span>

                      <span className="flex-1 text-sm font-medium text-destructive">
                        Logout
                      </span>

                      <IoChevronForward
                        size={14}
                        className="text-red-300 transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
