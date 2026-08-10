import Image from "next/image";
const socialLinks = [
  {
    name: "Facebook",
    image: "./images/fb.png",
    href: "#",
  },
  {
    name: "Instagram",
    image: "./images/instagram.png",
    href: "#",
  },
  //   {
  //     name: "LinkedIn",
  //     image: FaLinkedinIn,
  //     href: "#",
  //   },
  {
    name: "Whatsapp",
    image: "./images/whatsapp.png",
    href: "#",
  },
];

const FollowUs = () => {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-xl text-primary font-bold">Follow Us</h2>

      <p className=" text-sm leading-6 text-muted-foreground">
        Stay connected with us for the latest products.
      </p>

      <div className="mt-3 grid grid-cols-4 gap-4">
        {socialLinks.map((item) => {
          return (
            <a
              key={item.name}
              href={item.href}
              aria-label={item.name}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-border
                bg-background
                text-muted-foreground
                transition-all
                duration-200
                hover:border-primary
                hover:bg-primary-light
                hover:text-primary
              "
            >
              <img
                src={item.image}
                alt={item.name}
                className="object-contain w-8 h-8"
              />{" "}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default FollowUs;
