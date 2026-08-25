"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "About Us", href: "/about-us" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact-us" },
];

const helpLinks = [
  { name: "Shipping & Delivery", href: "/shipping-delivery" },
  { name: "Returns & Refunds", href: "/returns-refunds" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "FAQs", href: "/faqs" },
];

const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/auth/login") {
    return null;
  }
  return (
    <footer className="mt-16 bg-[#f7f8f1] text-[#173b1b]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand Section */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="ProteinBay"
                width={190}
                height={60}
                className="object-contain"
              />
            </Link>

            <p className="mt-6 max-w-sm text-[15px] leading-7 text-[#66736a]">
              Healthy snacking made simple, delicious and accessible for every
              health goal. Crafted with natural ingredients to fuel your
              everyday strength.
            </p>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dce4d8] bg-white text-[#173b1b] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#173b1b] hover:text-white"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dce4d8] bg-white text-[#173b1b] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#173b1b] hover:text-white"
              >
                <FaFacebook size={17} />
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dce4d8] bg-white text-[#173b1b] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#173b1b] hover:text-white"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-[#173b1b]">
              Quick Links
            </h3>

            <div className="space-y-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center text-[15px] text-[#66736a] transition-colors duration-200 hover:text-[#173b1b]"
                >
                  <span className="mr-2 h-px w-0 bg-[#173b1b] transition-all duration-200 group-hover:w-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-[#173b1b]">
              Help & Support
            </h3>

            <div className="space-y-4">
              {helpLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center text-[15px] text-[#66736a] transition-colors duration-200 hover:text-[#173b1b]"
                >
                  <span className="mr-2 h-px w-0 bg-[#173b1b] transition-all duration-200 group-hover:w-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-[#173b1b]">
              Get in Touch
            </h3>

            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:+91xxxxxxxxxx"
                className="group flex items-center gap-4 rounded-xl border border-[#e1e7dd] bg-white px-4 py-3 transition-all duration-300 hover:border-[#173b1b] hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf4e9] text-[#173b1b]">
                  <MdPhone size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#89958b]">
                    Call Us
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#34453a]">
                    +91 xxxxxxxxx
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:contact@proteinbay.in"
                className="group flex items-center gap-4 rounded-xl border border-[#e1e7dd] bg-white px-4 py-3 transition-all duration-300 hover:border-[#173b1b] hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf4e9] text-[#173b1b]">
                  <MdEmail size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#89958b]">
                    Email Us
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#34453a]">
                    contact@proteinbay.in
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 rounded-xl border border-[#e1e7dd] bg-white px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf4e9] text-[#173b1b]">
                  <MdLocationOn size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#89958b]">
                    Location
                  </p>

                  <p className="mt-0.5 text-sm font-medium leading-5 text-[#34453a]">
                    Bengaluru, Karnataka
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bottom Section */}
      <div className="border-t border-[#dfe6da] bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 py-5 text-sm">
            {/* Powered By */}
            <p className="text-center text-[#c9d6c8]">
              Powered by{" "}
              <a
                href="https://konetrixsolutions.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white transition-colors hover:text-[#c9d89e]"
              >
                Konetrix Solutions
              </a>
            </p>

            {/* Copyright */}
            <p className="text-center text-[#9fb2a0]">
              © {new Date().getFullYear()} ProteinBay. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
