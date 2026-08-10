"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import { GiVineLeaf } from "react-icons/gi";
import OtpInput from "react-otp-input";

const LoginOtp = () => {
  const [otp, setOtp] = useState("");

  return (
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

          <p className="flex flex-wrap items-center justify-center gap-1 text-center text-2xl mt-4 font-bold leading-tight ">
            Verify Mobile Number
          </p>

          <p className="my-2 text-center text-sm text-muted-foreground sm:text-base">
            Otp sent to 1111111111
          </p>
        </div>
        {/* Form */}
        <div className="mt-4 space-y-3">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputType="tel"
            shouldAutoFocus
            containerStyle="flex gap-3 justify-center"
            renderInput={(props) => (
              <input
                {...props}
                className="
        w-10! h-10
        rounded-sm
        border border-gray-300
        text-center
        text-lg
        font-medium
        outline-none
        transition-all
        focus:border-primary-hover
        focus:ring-1
        focus:ring-ring
      "
              />
            )}
          />
          {/* Button */}
          <Button
            variant="primary"
            className="mt-4 h-14 w-full rounded-xl text-lg font-semibold"
          >
            <span className="flex-1 text-center">Verify & Continue</span>

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
              <span className="font-semibold text-primary">Privacy Policy</span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOtp;
