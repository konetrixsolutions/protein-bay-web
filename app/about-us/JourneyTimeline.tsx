import { journey } from "./about-data";

const JourneyTimeline = () => {
  return (
    <section className="mt-20">
      {/* Heading */}

      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Our <span className="text-primary">Journey</span>
        </h2>

        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />

        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          From an idea to a trusted nutrition brand, here's our journey.
        </p>
      </div>

      {/* Desktop Timeline */}

      <div className="relative mt-16 hidden lg:block">
        {/* Line */}

        <div className="absolute left-0 right-0 top-8 h-[3px] bg-primary/20">
          <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary" />
          <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary" />
        </div>

        <div className="grid grid-cols-4 gap-8">
          {journey.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="relative text-center">
                {/* Icon */}

                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-primary-light shadow-md">
                  <Icon size={28} className="text-primary" />
                </div>

                {/* Year */}

                <p className="mt-5 text-lg font-bold text-primary">
                  {item.year}
                </p>

                {/* Title */}

                <h3 className="mt-2 font-semibold">{item.title}</h3>

                {/* Description */}

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Timeline */}

      <div className="relative mt-12 lg:hidden">
        {/* Vertical Line */}

        <div className="absolute left-7 top-0 h-full w-[2px] bg-primary/20" />

        <div className="space-y-10">
          {journey.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="relative flex gap-5">
                {/* Icon */}

                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light shadow">
                  <Icon size={22} className="text-primary" />
                </div>

                {/* Content */}

                <div>
                  <p className="text-sm font-bold text-primary">{item.year}</p>

                  <h3 className="mt-1 font-semibold">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
