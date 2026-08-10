import { FaRegClock } from "react-icons/fa";

const businessHours = [
  {
    day: "Monday - Friday",
    time: "9:00 AM - 7:00 PM",
  },
  {
    day: "Saturday",
    time: "10:00 AM - 5:00 PM",
  },
  {
    day: "Sunday",
    time: "Closed",
  },
];

const BusinessHours = () => {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
          <FaRegClock className="text-primary" size={18} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary">Business Hours</h2>

          <p className="text-sm text-muted-foreground">
            We're available during these hours
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {businessHours.map((item) => (
          <div
            key={item.day}
            className="flex items-center justify-between border-b border-border pb-3 last:border-none last:pb-0"
          >
            <span className="text-sm font-medium">{item.day}</span>

            <span
              className={`text-sm ${
                item.time === "Closed"
                  ? "font-medium text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
