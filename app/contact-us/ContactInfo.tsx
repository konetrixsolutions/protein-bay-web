import { MdOutlineEmail, MdLocationOn } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { IoChevronForward } from "react-icons/io5";

const contactItems = [
  {
    label: "Email",
    value: "support@proteinbay.com",
    icon: MdOutlineEmail,
  },
  {
    label: "Phone",
    value: "+91 xxxxxxxxxx",
    icon: LuPhoneCall,
  },
  {
    label: "Address",
    value: (
      <>
        Protein Bay Headquarters
        <br />
        Bangalore, Karnataka, India - 560037
      </>
    ),
    icon: MdLocationOn,
  },
];

const ContactInfo = () => {
  return (
    <div className="rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] sm:p-6">
      {/* Header */}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3f7d3f]">
          Contact
        </p>

        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#173b1b]">
          Get in Touch
        </h2>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          We're here to help with any questions you may have.
        </p>
      </div>

      {/* Contact Items */}

      <div className="mt-5 space-y-2">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="group flex items-start gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#f7f9f4]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4e9] text-[#173b1b] transition-all duration-200 group-hover:bg-[#173b1b] group-hover:text-white">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>

                <p className="mt-1 text-sm font-medium leading-5 text-[#405046]">
                  {item.value}
                </p>
              </div>

              <IoChevronForward
                size={14}
                className="mt-3 text-[#b2bbb4] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactInfo;
