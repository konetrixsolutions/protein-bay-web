"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRegUser, FaRegSave } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profileSchema,
  ProfileFormData,
} from "@/app/my-profile/Profile-schema";

const MyProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log("Submitted Data:", data);

      //  API Call
      // await updateProfile(data);

      alert("Profile Updated Successfully");

      reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="mx-4 mt-6 sm:mx-6 md:mx-10">
      <h1 className="text-2xl font-bold md:text-3xl">My Profile</h1>

      <p className="mt-1 text-xs font-medium text-muted-secondary md:text-sm">
        Update your personal information and address
      </p>

      <div className="mt-6 w-full rounded-lg border border-border bg-white/95 p-4 sm:p-6">
        <h2 className="mb-6 text-lg font-bold md:text-xl">
          Profile Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Name <span className="text-red-600">*</span>
            </label>

            <div className="relative">
              <FaRegUser
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                {...register("name")}
                placeholder="Enter your name"
                className={`h-12 rounded-md pl-11 ${
                  errors.name ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Mobile */}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Mobile Number <span className="text-red-600">*</span>
            </label>

            <div className="relative">
              <LuPhoneCall
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                {...register("mobile")}
                placeholder="Enter your mobile number"
                className={`h-12 rounded-md pl-11 ${
                  errors.mobile ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>

            {errors.mobile && (
              <p className="mt-1 text-xs text-red-500">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Address */}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Address <span className="text-red-600">*</span>
            </label>

            <div className="relative">
              <IoLocationOutline
                size={16}
                className="absolute left-4 top-4 text-muted-foreground"
              />

              <textarea
                {...register("address")}
                placeholder="Enter your address"
                className={`min-h-28 w-full resize-none rounded-md border bg-background pl-11 pr-4 pt-3 pb-3 text-sm outline-none transition-colors ${
                  errors.address
                    ? "border-red-500 focus:border-red-500"
                    : "border-input focus:border-primary"
                }`}
              />
            </div>

            {errors.address && (
              <p className="mt-1 text-xs text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-12 w-full">
            <FaRegSave className="mr-2" />

            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
