import Image from "next/image";
import { FaLeaf } from "react-icons/fa";

const StorySection = () => {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      {/* Left Content */}
      <div>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Our <span className="text-primary">Story</span>
          </h1>

          <FaLeaf className="text-primary" size={28} />
        </div>

        <div className="mt-5 h-1 w-16 rounded-full bg-primary" />

        <p className="mt-8 text-base leading-8 text-foreground">
          ProteinBay started with a simple mission to make healthy snacking
          easy, tasty and accessible for everyone.
        </p>

        <p className="mt-5 text-base leading-8 text-foreground">
          We create goal-based nutrition using natural ingredients, millets,
          seeds and superfoods to help people build healthier lifestyles without
          compromising on taste.
        </p>

        <p className="mt-5 text-base leading-8 text-foreground">
          Every product is thoughtfully crafted with clean ingredients, backed
          by nutrition science and designed to support your everyday wellness
          journey.
        </p>
      </div>

      {/* Right Image */}

      <div className="relative">
        <div className="absolute inset-0 -left-2 rounded-[190px_32px_32px_232px] bg-primary-hover" />

        <div className="relative overflow-hidden rounded-[190px_32px_32px_232px] shadow-2xl">
          <Image
            src="/images/about-story.png"
            alt="Our Story"
            width={700}
            height={550}
            className="w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default StorySection;
