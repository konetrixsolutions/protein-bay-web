import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrowRight } from "lucide-react";
import { GiVineLeaf } from "react-icons/gi";
import { ImMobile2 } from "react-icons/im";
import { GrGift } from "react-icons/gr";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";

export default function Login() {
  return (
    <div className="relative min-h-screen flex">
      {/* Left Background */}
      <div className="relative hidden md:block w-[55%]">
        <Image
          src="/images/left_image.png"
          alt="ProteinBay"
          fill
          priority
          className="object-cover object-left md:block hidden"
        />
      </div>
      <div className="relative w-full md:w-[45%]">
        <Image
          src="/images/right_image.png"
          alt="Right Background"
          fill
          priority
          className="object-cover md:block hidden"
        />
        {/* Mobile Background */}
        <Image
          src="/images/login_bg_mobile.jpeg"
          alt="ProteinBay"
          fill
          priority
          className="block md:hidden "
        />
        {/* Overlay */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-10">
          {" "}
          <div className="w-full max-w-[470px] rounded-[28px] bg-white/95 shadow-2xl backdrop-blur-md  px-6 py-8 sm:px-8 sm:py-10">
            {" "}
            {/* Logo */}
            <div className="flex flex-col items-center">
              <h1 className="mb-1 flex items-center text-3xl font-semibold">
                <GiVineLeaf
                  className="mr-1 rotate-[225deg] text-primary"
                  size={28}
                />
                <span className="text-red-950">Pr</span>
                <span className="text-green-700">otei</span>
                <span className="text-red-950">n</span>
                <span className="text-green-700">Bay</span>
              </h1>

              <h2 className="flex flex-wrap items-center justify-center gap-1 text-center text-3xl font-bold leading-tight sm:text-4xl">
                <span className="text-black">Welcome</span>

                <span className="text-black">to</span>

                <span className="text-primary">Protein</span>

                <span className="text-red-950">Bay</span>

                <GiVineLeaf
                  className="rotate-[225deg] text-primary"
                  size={22}
                />
              </h2>

              <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">
                Start your healthy living journey today!
              </p>
            </div>
            {/* Form */}
            <div className="mt-4 space-y-3">
              {/* Mobile */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Mobile Number
                </label>

                <div className="relative">
                  <ImMobile2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />

                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-medium">
                    +91
                  </span>

                  <div className="absolute left-[74px] top-0 h-full w-px bg-border" />

                  <Input
                    placeholder="Enter your mobile number"
                    className="h-14 rounded-xl pl-24"
                  />
                </div>
              </div>

              {/* Referral */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Referral Code{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <GrGift
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />

                  <div className="absolute left-[56px] top-0 h-full w-px bg-border" />

                  <Input
                    placeholder="Have a referral code?"
                    className="h-14 rounded-xl pl-16"
                  />
                </div>
              </div>

              {/* Button */}
              <Button
                variant="primary"
                className="mt-2 h-14 w-full rounded-xl text-lg font-semibold"
              >
                <span className="flex-1 text-center">Get OTP</span>

                <ArrowRight className="h-5 w-5" />
              </Button>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-2">
                <AiTwotoneSafetyCertificate
                  className="mt-0.5 shrink-0 text-primary"
                  size={18}
                />

                <p className="text-xs leading-5 text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <span className="font-semibold text-primary">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-primary">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
