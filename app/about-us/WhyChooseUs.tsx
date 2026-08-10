import { whyChooseUs } from "./about-data";

const WhyChooseUs = () => {
  return (
    <section className="mt-20">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Why Choose <span className="text-primary">ProteinBay?</span>
        </h2>

        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />

        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Every ProteinBay product is created with quality, transparency and
          your health goals in mind.
        </p>
      </div>

      {/* Cards */}

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {whyChooseUs.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                group
                rounded-xl
                border
                border-border
                bg-white
                p-6
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-primary
                hover:shadow-xl
              "
            >
              {/* Icon */}

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-primary-light
                  transition-all
                  duration-300
                  group-hover:bg-primary
                "
              >
                <Icon
                  size={28}
                  className="
                    text-primary
                    transition-colors
                    duration-300
                    group-hover:text-white
                  "
                />
              </div>

              {/* Title */}

              <h3 className="mt-5 text-sm font-semibold leading-6">
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;
