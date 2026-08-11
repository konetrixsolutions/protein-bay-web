"use client";
import { FaRegUser } from "react-icons/fa";
import { PiShoppingCartBold } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navItems = [
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
    label: "Customer Support",
    path: "/customer-support",
  },
  {
    label: "My Referrals",
    path: "/my-referral",
  },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="flex h-16 w-full items-center justify-between bg-white px-4 md:px-8">
      {/* <p
        className="text-xl font-bold text-primary cursor-pointer"
        onClick={() => router.push("/")}
      >
        Protein Bay
      </p> */}

      <Link href="/" className="inline-block">
        <Image
          src="/images/logo.png"
          alt="ProteinBay"
          width={190}
          height={60}
          className="object-contain"
        />
      </Link>

      <div className="flex items-center gap-8 text-sm font-medium">
        {navItems.map((item) => {
          const active = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative cursor-pointer pb-2"
            >
              <span
                className={`transition-colors duration-200 ${
                  active
                    ? "font-semibold text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </span>

              {active && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-6 text-xl">
        <FaRegUser
          className="cursor-pointer hover:text-primary"
          onClick={() => router.push("/my-profile")}
        />

        <PiShoppingCartBold
          className="cursor-pointer hover:text-primary"
          onClick={() => router.push("/cart")}
        />
      </div>
    </nav>
  );
};

export default Navbar;
