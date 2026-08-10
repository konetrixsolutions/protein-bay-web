import { featureStrip } from "./about-data";

const FeatureStrip = () => {
  return (
    <section className="mt-20 rounded-3xl bg-primary px-6 py-8 text-white">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featureStrip.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-primary">
                <Icon size={18} />
              </div>

              {/* Title */}

              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureStrip;
