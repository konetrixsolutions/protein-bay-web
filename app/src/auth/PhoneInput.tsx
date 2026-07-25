"use client";

import { Input } from "@/components/ui/input";
import { ImMobile2 } from "react-icons/im";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">
        Mobile Number
      </label>

      <div className="relative">
        {/* Icon */}
        <ImMobile2
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        {/* Country Code */}
        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">
          +91
        </span>

        {/* Divider */}
        <div className="absolute left-[74px] top-2 bottom-2 w-px bg-gray-300" />

        <Input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter your mobile number"
          className="
            h-12
            rounded-xl
            border-gray-300
            pl-24
            text-sm
            placeholder:text-gray-400
            focus-visible:ring-primary
            focus-visible:ring-2
          "
        />
      </div>
    </div>
  );
}
