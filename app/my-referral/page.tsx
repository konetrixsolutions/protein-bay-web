"use client";

import { useEffect, useState } from "react";
import {
  FaGift,
  FaCopy,
  FaInfoCircle,
  FaPaperPlane,
  FaLock,
  FaWallet,
  FaArrowLeft,
} from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { TiGift } from "react-icons/ti";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

type Referral = {
  id: string | number;
  name: string;
  mobile: string;
  bonus: number;
  redeemed: boolean;
  redeemedDate?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RedemptionHistory = {
  id: string;
  amount: number;
  paymentMethod: "UPI" | "BANK" | string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  createdAt?: string;
  updatedAt?: string;
  upiId?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
};

const MyReferrals = () => {
  const [showRedeem, setShowRedeem] = useState(false);
  const [accountType, setAccountType] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [redemptionHistory, setRedemptionHistory] = useState<
    RedemptionHistory[]
  >([]);

  const [referralCode, setReferralCode] = useState("");
  const [totalBonus, setTotalBonus] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [redeemedCount, setRedeemedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // SCROLL TO REDEEM SECTION

  useEffect(() => {
    if (showRedeem) {
      window.scrollBy({
        top: -window.innerHeight * 1,
        behavior: "smooth",
      });
    }
  }, [showRedeem]);

  /* FORMAT DATe */

  const formatDate = (date?: string) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchReferralDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/referrals`, {
        withCredentials: true,
      });
      const result = response.data;
      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to fetch referral dashboard",
        );
      }

      const data = result?.data ?? {};

      // Straightforward mapping for the expected API shape
      setReferralCode(String(data?.referralCode ?? ""));

      const activity = Array.isArray(data?.referralActivity)
        ? data.referralActivity
        : Array.isArray(data?.referralActivity ?? data?.activity)
          ? (data.referralActivity ?? data.activity)
          : [];

      const mappedReferrals: Referral[] = Array.isArray(activity)
        ? activity.map((item: any, index: number) => ({
            id: item?.id ?? index,
            name: item?.name ?? item?.user?.name ?? "User",
            mobile: item?.mobile ?? item?.user?.mobile ?? "",
            bonus: Number(item?.bonus ?? item?.amount ?? 0),
            redeemed: Boolean(item?.redeemed ?? item?.isRedeemed ?? false),
            redeemedDate:
              item?.redeemedDate || item?.redeemedAt
                ? formatDate(item?.redeemedDate ?? item?.redeemedAt)
                : undefined,
          }))
        : [];

      setReferrals(mappedReferrals);

      // Backend totals (preferred)
      if (data?.totalReferralBonus !== undefined) {
        setTotalBonus(Number(data.totalReferralBonus));
      } else {
        setTotalBonus(mappedReferrals.reduce((s, r) => s + r.bonus, 0));
      }

      if (data?.availableRedeemBonus !== undefined) {
        setAvailableBalance(Number(data.availableRedeemBonus));
      } else if (
        data?.totalAvailableMembers !== undefined &&
        data?.totalReferralMembers !== undefined
      ) {
        // fallback: calculate available from members if provided
        const availableMembers = Number(data.totalAvailableMembers || 0);
        const totalMembers = Number(data.totalReferralMembers || 0);
        // no direct monetary value; keep existing available calculation instead
        setAvailableBalance(
          mappedReferrals
            .filter((r) => !r.redeemed)
            .reduce((s, r) => s + r.bonus, 0),
        );
      } else {
        setAvailableBalance(
          mappedReferrals
            .filter((r) => !r.redeemed)
            .reduce((s, r) => s + r.bonus, 0),
        );
      }

      if (
        data?.totalReferralMembers !== undefined &&
        data?.totalAvailableMembers !== undefined
      ) {
        const redeemed =
          Number(data.totalReferralMembers) -
          Number(data.totalAvailableMembers);
        setRedeemedCount(Math.max(0, redeemed));
      } else {
        setRedeemedCount(mappedReferrals.filter((r) => r.redeemed).length);
      }
    } catch (error) {
      console.error("Referral dashboard error:", error);

      setError("Unable to load referral details.");

      setReferrals([]);
      setReferralCode("");
      setTotalBonus(0);
      setAvailableBalance(0);
      setRedeemedCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptionHistory = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/referrals/redemption-history`,
        {
          withCredentials: true,
        },
      );

      const result = response.data;

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to fetch redemption history",
        );
      }

      const historyData = Array.isArray(result?.data)
        ? result.data
        : (result?.data?.history ?? result?.data?.redemptions ?? []);

      setRedemptionHistory(
        Array.isArray(historyData)
          ? historyData.map((item: any) => ({
              id: item?.id ?? "",
              amount: Number(item?.amount ?? 0),
              paymentMethod: item?.paymentMethod ?? "",
              status: item?.status ?? "",
              createdAt: item?.createdAt,
              updatedAt: item?.updatedAt,
              upiId: item?.upiId,
              accountHolderName: item?.accountHolderName,
              accountNumber: item?.accountNumber,
              ifscCode: item?.ifscCode,
            }))
          : [],
      );
    } catch (error) {
      console.error("Redemption history error:", error);

      setRedemptionHistory([]);
    }
  };

  useEffect(() => {
    const loadReferralData = async () => {
      await Promise.all([fetchReferralDashboard(), fetchRedemptionHistory()]);
    };

    loadReferralData();
  }, []);

  const copyReferralCode = async () => {
    try {
      if (!referralCode) {
        return;
      }

      await navigator.clipboard.writeText(referralCode);
    } catch (error) {
      console.error("Unable to copy referral code", error);
    }
  };

  const handleRedeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError("");

    if (availableBalance <= 0) {
      setFormError("No referral balance is available for redemption.");
      return;
    }

    if (accountType === "upi" && !upiId.trim()) {
      setFormError("Please enter your UPI ID.");
      return;
    }

    if (accountType === "bank") {
      if (!accountHolderName.trim()) {
        setFormError("Please enter account holder name.");
        return;
      }

      if (!accountNumber.trim()) {
        setFormError("Please enter account number.");
        return;
      }

      if (!ifscCode.trim()) {
        setFormError("Please enter IFSC code.");
        return;
      }
    }

    const payload: {
      amount: number;
      paymentMethod: "UPI" | "BANK";
      upiId?: string;
      accountHolderName?: string;
      accountNumber?: string;
      ifscCode?: string;
    } =
      accountType === "upi"
        ? {
            amount: availableBalance,
            paymentMethod: "UPI",
            upiId: upiId.trim(),
          }
        : {
            amount: availableBalance,
            paymentMethod: "BANK",
            accountHolderName: accountHolderName.trim(),
            accountNumber: accountNumber.trim(),
            ifscCode: ifscCode.trim().toUpperCase(),
          };

    try {
      setRedeeming(true);
      const response = await axios.post(
        `${API_URL}/referrals/redemptions`,
        payload,
        {
          withCredentials: true,
        },
      );

      const result = response.data;
      if (!result?.success) {
        throw new Error(result?.message || "Failed to redeem referral bonus");
      }

      setUpiId("");
      setAccountHolderName("");
      setAccountNumber("");
      setIfscCode("");

      await Promise.all([fetchReferralDashboard(), fetchRedemptionHistory()]);
      setShowRedeem(false);
    } catch (error) {
      console.error("Referral redemption error:", error);

      if (axios.isAxiosError(error)) {
        setFormError(
          error.response?.data?.message ||
            "Unable to submit redemption request.",
        );
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : "Unable to submit redemption request.",
        );
      }
    } finally {
      setRedeeming(false);
    }
  };

  if (showRedeem) {
    return (
      <main className="min-h-screen bg-[#f7f9f4]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          {/* Back */}

          <Button
            onClick={() => setShowRedeem(false)}
            className="group inline-flex items-center gap-2 rounded-full border border-[#dce6d7] bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-[#173b1b] hover:text-white hover:shadow-md"
          >
            <FaArrowLeft
              size={13}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to Referrals
          </Button>

          {/* Header */}

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Referral Rewards
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#173b1b] md:text-4xl">
              Redeem Referral Bonus
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Choose where you'd like to receive your referral earnings.
            </p>
          </div>

          {/* Main Content */}

          <div className="mt-7 grid gap-6 lg:grid-cols-[0.8fr_1.4fr]">
            {/* BALANCE CARD */}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#173b1b] via-[#245528] to-[#356b36] p-6 text-white shadow-[0_20px_50px_rgba(23,59,27,0.15)]">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

              <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#c9d89e]/10 blur-2xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <LuCircleDollarSign size={24} />
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  Available to Redeem
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight">
                  ₹{availableBalance}
                </p>

                <p className="mt-2 text-sm text-white/65">
                  {Math.max(0, referrals.length - redeemedCount)} referral
                  {Math.max(0, referrals.length - redeemedCount) !== 1
                    ? "s"
                    : ""}{" "}
                  available
                </p>

                <div className="my-7 h-px bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Total earned</span>

                    <span className="text-sm font-semibold">₹{totalBonus}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">
                      Already redeemed
                    </span>

                    <span className="text-sm font-semibold">
                      ₹{Math.max(0, totalBonus - availableBalance)}
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <FaLock size={12} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">Secure payout</p>

                    <p className="mt-0.5 text-[10px] text-white/55">
                      Your payment details are handled securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYOUT FORM */}

            <div className="rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] sm:p-7">
              <div>
                <h2 className="text-xl font-bold text-[#173b1b]">
                  Payout Details
                </h2>

                <p className="mt-1.5 text-sm text-muted-foreground">
                  Enter your UPI ID or bank account details to receive your
                  bonus.
                </p>
              </div>

              {/* Account Type */}

              <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[#f3f6f1] p-1.5">
                <Button
                  type="button"
                  onClick={() => setAccountType("upi")}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    accountType === "bank"
                      ? "bg-white text-primary hover:text-white shadow-sm"
                      : "text-white "
                  }`}
                >
                  UPI ID
                </Button>

                <Button
                  type="button"
                  onClick={() => setAccountType("bank")}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    accountType === "upi"
                      ? "bg-white text-primary shadow-sm"
                      : "text-white "
                  }`}
                >
                  Bank Account
                </Button>
              </div>

              {/* Form */}

              <form onSubmit={handleRedeem} className="mt-6">
                {accountType === "upi" ? (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26382b]">
                      UPI ID <span className="text-destructive">*</span>
                    </label>

                    <input
                      type="text"
                      value={upiId}
                      onChange={(event) => setUpiId(event.target.value)}
                      placeholder="Enter your UPI ID"
                      className="h-12 w-full rounded-xl border border-[#dce4d8] bg-[#fbfcfa] px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-4 focus:ring-[#edf4e9]"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      Example: yourname@upi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Account Holder */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#26382b]">
                        Account Holder Name{" "}
                        <span className="text-destructive">*</span>
                      </label>

                      <input
                        type="text"
                        value={accountHolderName}
                        onChange={(event) =>
                          setAccountHolderName(event.target.value)
                        }
                        placeholder="Enter account holder name"
                        className="h-12 w-full rounded-xl border border-[#dce4d8] bg-[#fbfcfa] px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-4 focus:ring-[#edf4e9]"
                      />
                    </div>

                    {/* Account Number */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#26382b]">
                        Account Number{" "}
                        <span className="text-destructive">*</span>
                      </label>

                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(event) =>
                          setAccountNumber(event.target.value)
                        }
                        placeholder="Enter account number"
                        className="h-12 w-full rounded-xl border border-[#dce4d8] bg-[#fbfcfa] px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-4 focus:ring-[#edf4e9]"
                      />
                    </div>

                    {/* IFSC */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#26382b]">
                        IFSC Code <span className="text-destructive">*</span>
                      </label>

                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(event) =>
                          setIfscCode(event.target.value.toUpperCase())
                        }
                        placeholder="Enter IFSC code"
                        className="h-12 w-full rounded-xl border border-[#dce4d8] bg-[#fbfcfa] px-4 text-sm uppercase outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-4 focus:ring-[#edf4e9]"
                      />
                    </div>
                  </div>
                )}

                {/* Form Error */}

                {formError && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {formError}
                  </p>
                )}

                {/* Redeem Button */}

                <Button
                  type="submit"
                  disabled={availableBalance === 0 || redeeming}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {redeeming ? "Submitting..." : `Redeem ₹${availableBalance}`}

                  {!redeeming && <FaPaperPlane size={13} />}
                </Button>
              </form>

              {/* Security Information */}

              <div className="mt-5 flex gap-3 rounded-xl border border-[#dce6d7] bg-[#f3f7ef] p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <FaLock size={12} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#35513b]">
                    Secure & verified payout
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    We'll verify your payment details before processing the
                    referral bonus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f4]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <div>
            <Skeleton className="h-4 w-32 rounded" />

            <Skeleton className="mt-3 h-10 w-52 rounded-lg" />

            <Skeleton className="mt-8 h-48 rounded-2xl" />

            <Skeleton className="mt-6 h-72 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  // REFERRAL PAGE

  return (
    <main className="min-h-screen bg-[#f7f9f4]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Header */}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Rewards & Referrals
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              My Referrals
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Share ProteinBay with your friends and earn rewards when they
              place their first order.
            </p>
          </div>

          <div className="hidden rounded-full border border-[#dce6d7] bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm sm:block">
            🎁 Earn more with every referral
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Share Referral */}

        <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#dce6d7] bg-gradient-to-br from-primary via-[#245528] to-[#356b36] p-6 text-white shadow-[0_20px_50px_rgba(23,59,27,0.15)] sm:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#c9d89e]/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}

              <div className="max-w-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <FaGift size={22} />
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Get ₹100
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
                  Invite your friends to ProteinBay. When they place their first
                  order, you both receive a referral bonus.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/80">
                  <span className="rounded-full bg-white/10 px-3 py-1.5">
                    ✓ Easy to share
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1.5">
                    ✓ Instant tracking
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1.5">
                    ✓ Real rewards
                  </span>
                </div>
              </div>

              {/* Referral Code */}

              <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-white/60">
                  Your Referral Code
                </p>

                <Button
                  onClick={copyReferralCode}
                  disabled={!referralCode}
                  className="group flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border border-white/20 bg-white px-4 text-left transition-all hover:bg-[#f7f9f4]"
                >
                  <span className="text-lg font-bold tracking-[0.18em] text-primary">
                    {referralCode || "—"}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf4e9] text-primary transition-transform group-hover:scale-105">
                    <FaCopy size={14} />
                  </span>
                </Button>

                <p className="mt-3 text-center text-xs text-white/60">
                  Click the code to copy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Activity */}

        <section className="mt-6 rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-primary">
                Referral Activity
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Track your friends and referral rewards.
              </p>
            </div>

            <span className="rounded-full bg-[#edf4e9] px-3 py-1 text-xs font-semibold text-primary">
              {referrals.length}{" "}
              {referrals.length === 1 ? "Referral" : "Referrals"}
            </span>
          </div>

          {/* Desktop Table */}

          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-[#e1e7dd] bg-white shadow-[0_8px_30px_rgba(23,59,27,0.05)] md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f7f9f4] text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#657267]">
                  <th className="px-5 py-4">Referred Name</th>

                  <th className="px-5 py-4">Mobile Number</th>

                  <th className="px-5 py-4 text-center">Referral Bonus</th>

                  <th className="px-5 py-4 text-center">Bonus Status</th>
                </tr>
              </thead>

              <tbody>
                {referrals.map((referral) => (
                  <tr
                    key={referral.id}
                    className="border-t border-[#edf0eb] transition-colors duration-200 hover:bg-[#fafcf8]"
                  >
                    {/* Name */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf4e9] text-sm font-bold text-primary">
                          {referral.name.charAt(0)}
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-[#26382b]">
                            {referral.name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Referral #{referral.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Mobile */}

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {referral.mobile}
                    </td>

                    {/* Bonus */}

                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-bold text-primary">
                        ₹{referral.bonus}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4 text-center">
                      {referral.redeemed ? (
                        <div className="flex flex-col items-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f5e8] px-3 py-1.5 text-xs font-semibold text-[#28733a]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#3f9b52]" />
                            Redeemed
                          </span>

                          {referral.redeemedDate && (
                            <p className="mt-1.5 text-[10px] text-muted-foreground">
                              {referral.redeemedDate}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff5e8] px-3 py-1.5 text-xs font-semibold text-[#c47720]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#e49a3c]" />
                          Not Redeemed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {referrals.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-sm text-muted-foreground"
                    >
                      No referrals yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Referral Cards */}

          <div className="mt-5 space-y-3 md:hidden">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="rounded-2xl border border-[#e1e7dd] bg-white p-4 shadow-[0_6px_20px_rgba(23,59,27,0.04)] transition-all duration-200 hover:shadow-[0_10px_25px_rgba(23,59,27,0.07)]"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* User */}

                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf4e9] text-sm font-bold text-primary">
                      {referral.name.charAt(0)}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#26382b]">
                        {referral.name}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {referral.mobile}
                      </p>
                    </div>
                  </div>

                  {/* Bonus */}

                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-primary">
                      ₹{referral.bonus}
                    </p>

                    {referral.redeemed ? (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#28733a]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3f9b52]" />
                        Redeemed
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#c47720]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e49a3c]" />
                        Not Redeemed
                      </span>
                    )}
                  </div>
                </div>

                {/* Redeemed Date */}

                {referral.redeemed && referral.redeemedDate && (
                  <div className="mt-3 border-t border-[#edf0eb] pt-3">
                    <p className="text-[10px] text-muted-foreground">
                      Redeemed on{" "}
                      <span className="font-medium text-[#526157]">
                        {referral.redeemedDate}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}

            {referrals.length === 0 && (
              <div className="rounded-2xl border border-[#e1e7dd] bg-white p-8 text-center text-sm text-muted-foreground">
                No referrals yet.
              </div>
            )}
          </div>
        </section>

        {/* Redemption History */}

        {redemptionHistory.length > 0 && (
          <section className="mt-6 rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-primary">
                Redemption History
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Track your referral bonus redemption requests.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {redemptionHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#edf0eb] bg-[#fafcf8] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#26382b]">
                      ₹{item.amount}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.paymentMethod}

                      {item.createdAt && ` • ${formatDate(item.createdAt)}`}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                      item.status === "APPROVED"
                        ? "bg-[#e9f5e8] text-[#28733a]"
                        : item.status === "REJECTED"
                          ? "bg-red-50 text-red-600"
                          : "bg-[#fff5e8] text-[#c47720]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Referral Bonus Summary */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Total Referral Bonus */}

          <div className="group rounded-2xl border border-[#e1e7dd] bg-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(23,59,27,0.09)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Total Earned
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-primary">
                  ₹{totalBonus}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  From {referrals.length} referrals
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4e9] text-primary">
                <FaWallet size={18} />
              </div>
            </div>

            {/* Earnings Breakdown */}

            <div className="mt-5 grid grid-cols-2 divide-x border-t border-[#edf0eb] pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Redeemed
                </p>

                <p className="mt-1 text-sm font-bold text-[#28733a]">
                  ₹{Math.max(0, totalBonus - availableBalance)}
                </p>
              </div>

              <div className="pl-5">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Available
                </p>

                <p className="mt-1 text-sm font-bold text-primary">
                  ₹{availableBalance}
                </p>
              </div>
            </div>
          </div>

          {/* Available Redeem Balance */}

          <div className="group rounded-2xl border border-[#dce6d7] bg-gradient-to-br from-[#f7fbf4] to-white p-5 shadow-[0_8px_30px_rgba(23,59,27,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(23,59,27,0.09)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Available to Redeem
                  <FaInfoCircle size={9} />
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-primary">
                  ₹{availableBalance}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {Math.max(0, referrals.length - redeemedCount)} referrals
                  available
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e7f1df] text-primary">
                <LuCircleDollarSign size={21} />
              </div>
            </div>

            {/* Desktop Redeem Button */}

            <Button
              onClick={() => setShowRedeem(true)}
              disabled={availableBalance === 0}
              className="mt-5 hidden h-10 w-full items-center justify-center gap-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
            >
              Redeem Bonus
              <TiGift size={14} />
            </Button>
          </div>

          {/* Mobile Redeem Button */}

          <Button
            onClick={() => setShowRedeem(true)}
            disabled={availableBalance === 0}
            className="flex h-11 w-full items-center justify-center gap-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:hidden"
          >
            Redeem Bonus
            <TiGift size={14} />
          </Button>
        </section>

        {/* Information */}

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-[#dce6d7] bg-gradient-to-r from-[#f2f7ed] to-[#fafcf8] px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <FaInfoCircle size={14} />
          </div>

          <div>
            <p className="text-sm font-semibold text-primary">
              How referral rewards work
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Once your friend places their first order, your reward becomes
              available. Submit your UPI or bank details to redeem your balance.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyReferrals;
