"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import { TbCategory } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { contactSchema, ContactFormData } from "./contact-schema";

const inquiryOptions = [
  "General Inquiry",
  "Order Support",
  "Product Information",
  "Bulk Orders",
  "Partnership",
  "Feedback",
];

const ContactForm = () => {
  const [messageLength, setMessageLength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      inquiryType: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log(data);

      // api call
      // await contactUs(data);

      alert("Message sent successfully!");

      reset();
      setMessageLength(0);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-xl text-primary font-bold">Send us a Message</h2>

      <p className="text-sm text-muted-foreground">
        Fill out the form below and we'll get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/*  Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Name<span className="text-destructive">*</span>{" "}
          </label>

          <div className="relative">
            <FaRegUser
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              {...register("fullName")}
              placeholder="Enter your full name"
              className={`h-12 pl-11 ${
                errors.fullName
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
            />
          </div>

          {errors.fullName && (
            <p className="mt-1 text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email + Phone */}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email <span className="text-destructive">*</span>{" "}
            </label>

            <div className="relative">
              <MdOutlineEmail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`h-12 pl-11 ${
                  errors.email
                    ? "border-destructive focus:border-destructive"
                    : ""
                }`}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Mobile Number
              <span className="text-destructive">*</span>{" "}
            </label>

            <div className="relative">
              <LuPhoneCall
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                {...register("phone")}
                placeholder="Enter your phone number"
                className={`h-12 pl-11 ${
                  errors.phone
                    ? "border-destructive focus:border-destructive   "
                    : ""
                }`}
              />
            </div>

            {errors.phone && (
              <p className="mt-1 text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Inquiry Type */}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Inquiry Type <span className="text-destructive">*</span>
          </label>

          <div className="relative">
            <TbCategory
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <select
              {...register("inquiryType")}
              defaultValue=""
              className={`h-12 w-full appearance-none rounded-md border bg-background pl-11 pr-12 text-sm outline-none transition-colors ${
                errors.inquiryType
                  ? "border-destructive focus:border-destructive"
                  : "border-input focus:border-primary"
              } ${
                watch("inquiryType")
                  ? "text-foreground"
                  : "text-muted-secondary"
              }`}
            >
              <option value="" disabled>
                Select inquiry type
              </option>

              {inquiryOptions.map((item) => (
                <option key={item} value={item} className="text-black">
                  {item}
                </option>
              ))}
            </select>

            <IoChevronDownOutline
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          {errors.inquiryType && (
            <p className="mt-1 text-xs text-destructive">
              {errors.inquiryType.message}
            </p>
          )}
        </div>

        {/* Message */}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Message<span className="text-destructive">*</span>{" "}
          </label>

          <div className="relative">
            <FiMessageSquare
              size={16}
              className="absolute left-4 top-4 text-muted-foreground"
            />

            <textarea
              {...register("message")}
              maxLength={500}
              placeholder="Tell us how we can help you..."
              onChange={(e) => setMessageLength(e.target.value.length)}
              className={`min-h-36 w-full resize-none rounded-md border bg-background pb-4 pl-11 pr-4 pt-3 text-sm outline-none transition-colors ${
                errors.message
                  ? "border-destructive focus:border-destructive"
                  : "border-input focus:border-primary"
              }`}
            />
          </div>

          <div className="mt-1 flex items-center justify-between">
            <div>
              {errors.message && (
                <p className="text-xs text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              {messageLength}/500
            </span>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-12 w-full">
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
