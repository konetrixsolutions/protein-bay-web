import { MdOutlineEmail, MdLocationOn } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";

const ContactInfo = () => {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <h2 className="text-xl font-bold text-primary">Get in Touch</h2>

      <div className="mt-4 space-y-4">
        {/* Email */}

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
            <MdOutlineEmail size={20} className="text-primary" />
          </div>

          <div>
            <p className="font-semibold text-sm">Email</p>

            <p className=" text-sm text-muted-foreground">
              support@proteinbay.com
            </p>
          </div>
        </div>

        {/* Phone */}

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
            <LuPhoneCall size={18} className="text-primary" />
          </div>

          <div>
            <p className="font-semibold text-sm">Phone</p>

            <p className=" text-sm text-muted-foreground">+91 xxxxxxxxxx</p>
          </div>
        </div>

        {/* Address */}

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
            <MdLocationOn size={20} className="text-primary" />
          </div>

          <div>
            <p className="font-semibold text-sm">Address</p>

            <p className=" text-sm  text-muted-foreground">
              Protein Bay Headquarters
              <br />
              Bangalore, Karnataka, India - 560037
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
