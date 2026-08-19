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
import { IoSend } from "react-icons/io5";

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

  const inquiryType = watch("inquiryType");

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log(data);

      // API call
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
    <div className="rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_10px_35px_rgba(23,59,27,0.06)] sm:p-7">
      {/* HEADER */}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3f7d3f]">
          Get Support
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#173b1b]">
          Send us a Message
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          Fill out the form below and our team will get back to you within 24
          hours.
        </p>
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
        {/* NAME */}

        <div>
          <label className="mb-2 block text-xs font-semibold text-[#35453a]">
            Full Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <FaRegUser
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b968d]"
            />

            <Input
              {...register("fullName")}
              placeholder="Enter your full name"
              className={`h-12 rounded-xl border-[#dfe7da] bg-[#fbfcfa] pl-11 text-sm shadow-none transition-all placeholder:text-[#a2aba4] focus:bg-white focus:ring-4 focus:ring-[#edf4e9] ${
                errors.fullName
                  ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                  : "focus:border-[#6b9566]"
              }`}
            />
          </div>

          {errors.fullName && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* EMAIL + PHONE */}

        <div className="grid gap-5 md:grid-cols-2">
          {/* Email */}

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#35453a]">
              Email <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <MdOutlineEmail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b968d]"
              />

              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`h-12 rounded-xl border-[#dfe7da] bg-[#fbfcfa] pl-11 text-sm shadow-none transition-all placeholder:text-[#a2aba4] focus:bg-white focus:ring-4 focus:ring-[#edf4e9] ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                    : "focus:border-[#6b9566]"
                }`}
              />
            </div>

            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#35453a]">
              Mobile Number <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <LuPhoneCall
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b968d]"
              />

              <Input
                {...register("phone")}
                placeholder="Enter your phone number"
                className={`h-12 rounded-xl border-[#dfe7da] bg-[#fbfcfa] pl-11 text-sm shadow-none transition-all placeholder:text-[#a2aba4] focus:bg-white focus:ring-4 focus:ring-[#edf4e9] ${
                  errors.phone
                    ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                    : "focus:border-[#6b9566]"
                }`}
              />
            </div>

            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* INQUIRY TYPE */}

        <div>
          <label className="mb-2 block text-xs font-semibold text-[#35453a]">
            Inquiry Type <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <TbCategory
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b968d]"
            />

            <select
              {...register("inquiryType")}
              defaultValue=""
              className={`h-12 w-full appearance-none rounded-xl border bg-[#fbfcfa] pl-11 pr-12 text-sm outline-none transition-all ${
                errors.inquiryType
                  ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                  : "border-[#dfe7da] focus:border-[#6b9566] focus:bg-white focus:ring-4 focus:ring-[#edf4e9]"
              } ${inquiryType ? "text-[#35453a]" : "text-[#a2aba4]"}`}
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
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8b968d]"
            />
          </div>

          {errors.inquiryType && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.inquiryType.message}
            </p>
          )}
        </div>

        {/* MESSAGE */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-[#35453a]">
              Message <span className="text-red-500">*</span>
            </label>

            <span className="text-[11px] text-[#9aa49c]">
              {messageLength}/500
            </span>
          </div>

          <div className="relative">
            <FiMessageSquare
              size={16}
              className="pointer-events-none absolute left-4 top-4 text-[#8b968d]"
            />

            <textarea
              {...register("message")}
              maxLength={500}
              placeholder="Tell us how we can help you..."
              onChange={(event) => {
                setMessageLength(event.target.value.length);
              }}
              className={`min-h-36 w-full resize-none rounded-xl border bg-[#fbfcfa] pb-4 pl-11 pr-4 pt-3 text-sm outline-none transition-all placeholder:text-[#a2aba4] ${
                errors.message
                  ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                  : "border-[#dfe7da] focus:border-[#6b9566] focus:bg-white focus:ring-4 focus:ring-[#edf4e9]"
              }`}
            />
          </div>

          {errors.message && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* SUBMIT */}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-[#173b1b] text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#245528] hover:shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Send Message
              <IoSend size={14} className="ml-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
