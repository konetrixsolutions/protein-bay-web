"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const quickLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "About Us",
    href: "/about-us",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Contact Us",
    href: "/contact-us",
  },
];
//need to update proper route
const helpLinks = [
  {
    name: "Shipping & Delivery",
    href: "/shipping-delivery",
  },
  {
    name: "Returns & Refunds",
    href: "/returns-refunds",
  },
  {
    name: "Terms & Conditions",
    href: "/terms-and-conditions",
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    name: "FAQs",
    href: "/faqs",
  },
];

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <Image
              src="/images.png" //need to update
              alt="ProteinBay"
              width={190}
              height={60}
              className="object-contain"
            />

            <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
              Healthy snacking made simple, delicious and accessible for every
              health goal.
            </p>

            <div className="mt-6 flex items-center gap-5">
              {/* need to update links */}
              <a href="#" className="transition hover:text-primary">
                <FaInstagram size={20} />
              </a>

              <a href="#" className="transition hover:text-primary">
                <FaFacebook size={20} />
              </a>

              <a href="#" className="transition hover:text-primary">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>

            <div className="space-y-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-sm text-muted-foreground transition hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}

          <div>
            <h3 className="mb-5 text-lg font-semibold">Help</h3>

            <div className="space-y-3">
              {helpLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-sm text-muted-foreground transition hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}

          <div>
            <h3 className="mb-5 text-lg font-semibold">Get in Touch</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MdPhone className="mt-1 text-primary" size={18} />

                <p className="text-sm text-muted-foreground">+91 xxxxxxxxx</p>
              </div>

              <div className="flex items-start gap-3">
                <MdEmail className="mt-1 text-primary" size={18} />

                <p className="text-sm text-muted-foreground">
                  contact@proteinbay.in
                </p>
              </div>

              <div className="flex items-start gap-3">
                <MdLocationOn className="mt-1 text-primary" size={18} />

                <p className="text-sm leading-6 text-muted-foreground">
                  ProteinBay
                  <br />
                  Benguluru, Karnataka, India
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="mb-2 text-center text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://konetrixsolutions.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary transition-colors hover:underline"
            >
              Konetrix Solutions
            </a>
          </p>

          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProteinBay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
