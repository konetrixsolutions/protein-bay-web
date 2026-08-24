import { FaRegClock } from "react-icons/fa";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

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
    <div className="rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] sm:p-6">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4e9] text-[#173b1b]">
          <FaRegClock size={18} />
        </div>

        <div>
          <h2 className="text-base font-bold text-[#173b1b]">Business Hours</h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            We're available during these hours
          </p>
        </div>
      </div>

      {/* Hours */}

      <div className="mt-5 space-y-1">
        {businessHours.map((item) => {
          const isClosed = item.time === "Closed";

          return (
            <div
              key={item.day}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-[#f7f9f4]"
            >
              <span className="text-sm font-medium text-[#405046]">
                {item.day}
              </span>

              {isClosed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff3f0] px-2.5 py-1 text-[11px] font-semibold text-[#c85b4a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c85b4a]" />
                  Closed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#526157]">
                  <IoCheckmarkCircleOutline
                    size={14}
                    className="text-[#4a8a4a]"
                  />
                  {item.time}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessHours;
