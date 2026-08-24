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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";

import { signupSchema, SignupFormData } from "./signup-schema";

interface SignupProps {
  onBackToLogin: () => void;
}

export default function Signup({ onBackToLogin }: SignupProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [referralCode, setReferralCode] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });

  // SIGNUP

  const handleSignup = async (data: SignupFormData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          name: data.name.trim(),
          mobile: data.mobile,
          password: data.password,
          role: "CUSTOMER",
        },
        {
          withCredentials: true,
        },
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Signup failed. Please try again.",
        );
      }
      toast.success(response.data?.message || "Account created successfully!");
      onBackToLogin();
    } catch (error) {
      console.error("Signup error:", error);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData?.message) {
          toast.error(responseData.message);
          return;
        }

        if (
          Array.isArray(responseData?.errors) &&
          responseData.errors.length > 0
        ) {
          const backendError = responseData.errors[0];

          toast.error(backendError?.message || "Invalid signup details.");

          return;
        }

        if (error.response?.status === 409) {
          toast.error("An account with this mobile number already exists.");
          return;
        }

        if (error.response?.status === 400) {
          toast.error("Invalid signup details. Please check your information.");
          return;
        }

        if (error.response?.status && error.response.status >= 500) {
          toast.error(
            "Something went wrong on the server. Please try again later.",
          );
          return;
        }

        if (!error.response) {
          toast.error(
            "Unable to connect to the server. Please check your internet connection.",
          );
          return;
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.",
      );
    }
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

            <form
              onSubmit={handleSubmit(handleSignup)}
              className="mt-6 space-y-4"
            >
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
                    {...register("name")}
                    placeholder="Enter your full name"
                    className="h-13 rounded-xl pl-11"
                    maxLength={50}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
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
                    {...register("mobile")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setValue("mobile", value, {
                        shouldValidate: true,
                      });
                    }}
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="Enter your mobile number"
                    className="h-13 rounded-xl pl-24"
                  />
                </div>

                {errors.mobile && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-13 rounded-xl pr-12"
                    maxLength={64}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {errors.password ? (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[10px] text-muted-foreground">
                    Minimum 6 characters with uppercase, lowercase, number and
                    special character.
                  </p>
                )}
              </div>

              {/* Confirm Password */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Confirm Password
                </label>

                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="h-13 rounded-xl pr-12"
                    maxLength={64}
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

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
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
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="mt-2 h-14 w-full rounded-xl text-lg font-semibold"
              >
                <span className="flex-1 text-center">
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>

                {!isSubmitting && <ArrowRight className="h-5 w-5" />}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
