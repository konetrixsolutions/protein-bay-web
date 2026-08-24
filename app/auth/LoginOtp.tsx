// "use client";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import { useState } from "react";
// import { AiTwotoneSafetyCertificate } from "react-icons/ai";
// import { GiVineLeaf } from "react-icons/gi";
// import OtpInput from "react-otp-input";

// const LoginOtp = () => {
//   const [otp, setOtp] = useState("");

//   return (
//     <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-10">
//       {" "}
//       <div className="w-full max-w-[470px] rounded-[28px] bg-white/95 shadow-2xl backdrop-blur-md  px-6 py-8 sm:px-8 sm:py-10">
//         {" "}
//         {/* Logo */}
//         <div className="flex flex-col items-center">
//           <h1 className="mb-1 flex items-center text-3xl font-semibold">
//             <GiVineLeaf
//               className="mr-1 rotate-[225deg] text-primary"
//               size={28}
//             />
//             <span className="text-red-950">Pr</span>
//             <span className="text-green-700">otei</span>
//             <span className="text-red-950">n</span>
//             <span className="text-green-700">Bay</span>
//           </h1>

//           <p className="flex flex-wrap items-center justify-center gap-1 text-center text-2xl mt-4 font-bold leading-tight ">
//             Verify Mobile Number
//           </p>

//           <p className="my-2 text-center text-sm text-muted-foreground sm:text-base">
//             Otp sent to 1111111111
//           </p>
//         </div>
//         {/* Form */}
//         <div className="mt-4 space-y-3">
//           <OtpInput
//             value={otp}
//             onChange={setOtp}
//             numInputs={6}
//             inputType="tel"
//             shouldAutoFocus
//             containerStyle="flex gap-3 justify-center"
//             renderInput={(props) => (
//               <input
//                 {...props}
//                 className="
//         w-10! h-10
//         rounded-sm
//         border border-gray-300
//         text-center
//         text-lg
//         font-medium
//         outline-none
//         transition-all
//         focus:border-primary-hover
//         focus:ring-1
//         focus:ring-ring
//       "
//               />
//             )}
//           />
//           {/* Button */}
//           <Button
//             variant="primary"
//             className="mt-4 h-14 w-full rounded-xl text-lg font-semibold"
//           >
//             <span className="flex-1 text-center">Verify & Continue</span>

//             <ArrowRight className="h-5 w-5" />
//           </Button>

//           {/* Terms */}
//           <div className="flex items-start gap-2 pt-2">
//             <AiTwotoneSafetyCertificate
//               className="mt-0.5 shrink-0 text-primary"
//               size={18}
//             />

//             <p className="text-xs leading-5 text-muted-foreground">
//               By continuing, you agree to our{" "}
//               <span className="font-semibold text-primary">
//                 Terms & Conditions
//               </span>{" "}
//               and{" "}
//               <span className="font-semibold text-primary">Privacy Policy</span>
//               .
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginOtp;
"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { GiVineLeaf } from "react-icons/gi";
import { ImMobile2 } from "react-icons/im";
import { GrGift } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignupProps {
  onBackToLogin: () => void;
}

export default function Signup({ onBackToLogin }: SignupProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");

  const [mobile, setMobile] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [referralCode, setReferralCode] = useState("");

  const handleSignup = () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (mobile.length !== 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    //  signup API

    console.log({
      name,
      mobile,
      password,
      referralCode,
    });
  };

  return (
    <div className="relative flex min-h-screen">
      {/* LEFT BACKGROUND */}

      <div className="relative hidden w-[55%] md:block">
        <Image
          src="/images/left_image.png"
          alt="ProteinBay"
          fill
          priority
          className="object-cover object-left"
        />
      </div>

      {/* RIGHT SIDE */}

      <div className="relative w-full md:w-[45%]">
        {/* Desktop Background */}

        <Image
          src="/images/right_image.png"
          alt="ProteinBay"
          fill
          priority
          className="hidden object-cover md:block"
        />

        {/* Mobile Background */}

        <Image
          src="/images/login_bg_mobile.jpeg"
          alt="ProteinBay"
          fill
          priority
          className="block object-cover md:hidden"
        />

        {/* SIGNUP CONTENT */}

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-[470px] rounded-[28px] bg-white/95 px-6 py-7 shadow-2xl backdrop-blur-md sm:px-8 sm:py-9">
            {/* BACK TO LOGIN */}

            <button
              type="button"
              onClick={onBackToLogin}
              className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={17} />
              Back to Login
            </button>

            {/* LOGO / HEADING */}

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

              <h2 className="mt-3 flex items-center gap-1 text-center text-3xl font-bold leading-tight">
                <span className="text-black">Create</span>

                <span className="text-primary">Account</span>

                <GiVineLeaf
                  className="rotate-[225deg] text-primary"
                  size={22}
                />
              </h2>

              <p className="mt-2 text-center text-sm text-muted-foreground">
                Start your healthy living journey with ProteinBay.
              </p>
            </div>

            {/* FORM */}

            <div className="mt-6 space-y-4">
              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>

                <div className="relative">
                  <FaRegUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />

                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-13 rounded-xl pl-11"
                  />
                </div>
              </div>

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
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="Enter your mobile number"
                    className="h-13 rounded-xl pl-24"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="h-13 rounded-xl pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Confirm Password
                </label>

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="h-13 rounded-xl pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
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
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Have a referral code?"
                    className="h-13 rounded-xl pl-16"
                  />
                </div>
              </div>

              {/* Signup Button */}

              <Button
                onClick={handleSignup}
                variant="primary"
                className="mt-2 h-14 w-full rounded-xl text-lg font-semibold"
              >
                <span className="flex-1 text-center">Create Account</span>

                <ArrowRight className="h-5 w-5" />
              </Button>

              {/* Login */}

              <div className="flex items-center justify-center gap-1 pt-1 text-sm">
                <span className="text-muted-foreground">
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="font-semibold text-primary transition-colors hover:underline"
                >
                  Login
                </button>
              </div>

              {/* Terms */}

              <div className="flex items-start gap-2 pt-1">
                <AiTwotoneSafetyCertificate
                  className="mt-0.5 shrink-0 text-primary"
                  size={18}
                />

                <p className="text-xs leading-5 text-muted-foreground">
                  By creating an account, you agree to our{" "}
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
