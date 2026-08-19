import Image from "next/image";

const socialLinks = [
  {
    name: "Facebook",
    image: "/images/fb.png",
    href: "#",
  },
  {
    name: "Instagram",
    image: "/images/instagram.png",
    href: "#",
  },
  {
    name: "WhatsApp",
    image: "/images/whatsapp.png",
    href: "#",
  },
];

const FollowUs = () => {
  return (
    <div className="rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3f7d3f]">
        Stay Connected
      </p>

      <h2 className="mt-1 text-xl font-bold tracking-tight text-[#173b1b]">
        Follow Us
      </h2>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Stay connected with us for new products, updates and offers.
      </p>

      {/* Social Buttons */}

      <div className="mt-5 flex gap-3">
        {socialLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            aria-label={item.name}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-xl border border-[#e1e7dd] bg-[#f7f9f4] transition-all duration-300 hover:-translate-y-1 hover:border-[#cbdac5] hover:bg-white hover:shadow-[0_7px_18px_rgba(23,59,27,0.09)]"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={24}
              height={24}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default FollowUs;
