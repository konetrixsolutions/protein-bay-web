"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Check,
  ChevronRight,
  CircleUserRound,
  Edit3,
  Home,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Address = {
  id: string;
  label: string;
  recipientName: string;
  recipientMobile: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
};

type Profile = {
  id: string;
  name: string;
  mobile: string;
  role: string;
  referralCode: string | null;
  referredByUserId: string | null;
  referralDiscountUsed: boolean;
  addresses: Address[];
};

type AddressForm = Omit<Address, "id">;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const EMPTY_ADDRESS: AddressForm = {
  label: "Home",
  recipientName: "",
  recipientMobile: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  latitude: 0,
  longitude: 0,
  isDefault: false,
};

const getErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error)
    ? error.response?.data?.message || fallback
    : fallback;

const formatAddress = (address: Address) =>
  [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

const Field = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#718076]">
      {label} {required && <span className="text-[#d9673f]">*</span>}
    </span>
    {children}
  </label>
);

const MyProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [addressForm, setAddressForm] = useState<AddressForm>(EMPTY_ADDRESS);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [locating, setLocating] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/profile`, {
          withCredentials: true,
        });
        if (!response.data?.success)
          throw new Error(response.data?.message || "Unable to load profile.");
        setProfile(response.data.data);
      } catch (error) {
        setProfileError(getErrorMessage(error, "Unable to load your profile."));
        if (axios.isAxiosError(error) && error.response?.status === 401)
          window.location.href = "/auth/login";
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const initials = useMemo(() => {
    const name = profile?.name?.trim() || "Member";
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [profile?.name]);

  const openNewAddress = () => {
    setAddressForm({
      ...EMPTY_ADDRESS,
      recipientName: profile?.name || "",
      recipientMobile: profile?.mobile || "",
      isDefault: !profile?.addresses.length,
    });
    setEditingAddressId(null);
    setShowAddressForm(true);
  };

  const openEditAddress = (address: Address) => {
    setAddressForm({
      ...address,
      latitude: Number(address.latitude),
      longitude: Number(address.longitude),
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    if (!savingAddress) {
      setShowAddressForm(false);
      setEditingAddressId(null);
    }
  };

  const updateField = (field: keyof AddressForm, value: string | boolean) =>
    setAddressForm((current) => ({ ...current, [field]: value }));

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Your browser does not support location access. Enter coordinates another way or use a supported browser.",
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setAddressForm((current) => ({
          ...current,
          latitude: Number(coords.latitude.toFixed(6)),
          longitude: Number(coords.longitude.toFixed(6)),
        }));
        setLocating(false);
        toast.success("Location coordinates added.");
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            "Location permission was denied. Allow access in your browser settings and try again.",
          );
        } else if (error.code === error.TIMEOUT) {
          toast.error(
            "Location request timed out. Please click ‘Use current location’ again.",
          );
        } else {
          toast.error(
            "We could not find your location. Check your device settings and try again.",
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const validateAddress = () => {
    const requiredFields = [
      addressForm.label,
      addressForm.recipientName,
      addressForm.addressLine1,
      addressForm.city,
      addressForm.state,
    ];
    if (
      requiredFields.some((value) => !value.trim()) ||
      !/^\d{10}$/.test(addressForm.recipientMobile) ||
      !/^\d{6}$/.test(addressForm.pincode)
    ) {
      toast.error("Please complete all required address fields.");
      return false;
    }
    if (!addressForm.latitude || !addressForm.longitude) {
      toast.error(
        "Delivery location is required. Click ‘Use current location’ before saving.",
      );
      return false;
    }
    return true;
  };

  const saveAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAddress()) return;

    try {
      setSavingAddress(true);
      const payload = {
        ...addressForm,
        latitude: Number(addressForm.latitude),
        longitude: Number(addressForm.longitude),
      };
      const response = editingAddressId
        ? await axios.patch(`${API_URL}/address/${editingAddressId}`, payload, {
            withCredentials: true,
          })
        : await axios.post(`${API_URL}/address/`, payload, {
            withCredentials: true,
          });
      if (response.data?.success === false)
        throw new Error(response.data?.message || "Unable to save address.");

      const savedAddress = response.data?.data || {};
      setProfile((current) => {
        if (!current) return current;
        const savedId =
          savedAddress.id || editingAddressId || crypto.randomUUID();
        const addresses = editingAddressId
          ? current.addresses.map((address) =>
              address.id === editingAddressId
                ? { ...address, ...payload, ...savedAddress }
                : address,
            )
          : [
              ...current.addresses,
              { ...payload, ...savedAddress, id: savedId },
            ];
        return {
          ...current,
          addresses: addressForm.isDefault
            ? addresses.map((address) => ({
                ...address,
                isDefault: address.id === savedId,
              }))
            : addresses,
        };
      });
      toast.success(editingAddressId ? "Address updated." : "Address added.");
      closeAddressForm();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save address."));
    } finally {
      setSavingAddress(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!window.confirm("Delete this saved address?")) return;
    try {
      setDeletingAddressId(addressId);
      const response = await axios.delete(`${API_URL}/address/${addressId}`, {
        withCredentials: true,
      });
      if (response.data?.success === false)
        throw new Error(response.data?.message || "Unable to delete address.");
      setProfile((current) =>
        current
          ? {
              ...current,
              addresses: current.addresses.filter(
                (address) => address.id !== addressId,
              ),
            }
          : current,
      );
      toast.success("Address removed.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete address."));
    } finally {
      setDeletingAddressId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f7faf5] px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-44 rounded-[28px] bg-[#e5ede1]" />
          <div className="h-16 rounded-2xl bg-[#e5ede1]" />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="h-72 rounded-[24px] bg-[#e5ede1]" />
            <div className="h-72 rounded-[24px] bg-[#e5ede1]" />
          </div>
        </div>
      </main>
    );
  }

  if (profileError || !profile) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf5] px-4">
        <section className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f0e1] text-[#265d2d]">
            <CircleUserRound size={30} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[#172017]">
            Your profile is unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#718076]">
            {profileError || "Please sign in to view your account."}
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf5] px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex items-center gap-2 text-xs font-semibold text-[#829086]">
          <span>Account</span>
          <ChevronRight size={14} />
          <span className="text-[#265d2d]">My profile</span>
        </div>
        <section className="relative overflow-hidden rounded-[28px] bg-[#173b1b] px-6 py-8 text-white shadow-[0_20px_50px_rgba(23,59,27,0.14)] sm:px-10 sm:py-10">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border-[34px] border-white/5" />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f2a65a] text-2xl font-bold text-[#173b1b] shadow-lg sm:h-20 sm:w-20 sm:text-3xl">
                {initials}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8cdb5]">
                  Your ProteinBay account
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back, {profile.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#d2e0d0]">
                  <Phone size={15} /> +91 {profile.mobile}
                </p>
              </div>
            </div>
            {/* <div className="flex items-center gap-2 text-sm font-semibold text-[#d8e7d5]">
              <ShieldCheck size={18} /> {profile.role} account
            </div> */}
          </div>
        </section>
        <div className="mt-5 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[24px] border border-[#e2eade] bg-white p-6 shadow-[0_8px_30px_rgba(31,67,35,0.04)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#829086]">
                  Account details
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#172017]">
                  Personal information
                </h2>
              </div>
              <CircleUserRound className="text-[#6a9369]" size={24} />
            </div>
            <div className="mt-7 space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#829086]">
                  Full name
                </p>
                <p className="mt-1 font-semibold text-[#253529]">
                  {profile.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#829086]">
                  Mobile number
                </p>
                <p className="mt-1 font-semibold text-[#253529]">
                  +91 {profile.mobile}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#829086]">
                  Referral code
                </p>
                <p className="mt-1 font-semibold text-[#253529]">
                  {profile.referralCode || "No referral code yet"}
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-[#edf1eb] pt-5 text-xs leading-5 text-[#829086]">
              Your personal details are managed securely. Address information
              can be updated below.
            </div>
          </section>
          <section className="rounded-[24px] border border-[#e2eade] bg-white p-6 shadow-[0_8px_30px_rgba(31,67,35,0.04)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#829086]">
                  Delivery preferences
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#172017]">
                  Saved addresses
                </h2>
              </div>
              <Button size="sm" onClick={openNewAddress}>
                <Plus size={16} /> Add address
              </Button>
            </div>
            {profile.addresses.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-[#cbdac5] bg-[#f8fbf6] px-5 py-8 text-center">
                <MapPin className="mx-auto text-[#7ea17a]" size={28} />
                <h3 className="mt-3 font-bold text-[#253529]">
                  No saved addresses
                </h3>
                <p className="mt-1 text-sm text-[#829086]">
                  Add one now for a faster checkout.
                </p>
                <button
                  type="button"
                  onClick={openNewAddress}
                  className="mt-4 text-sm font-bold text-[#265d2d] hover:underline"
                >
                  Create your first address
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {profile.addresses.map((address) => (
                  <article
                    key={address.id}
                    className="group rounded-2xl border border-[#e5ece2] p-4 transition-colors hover:border-[#b9ceb3] hover:bg-[#fbfdf9]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf5e9] text-[#477648]">
                          <Home size={17} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-[#253529]">
                              {address.label}
                            </h3>
                            {address.isDefault && (
                              <span className="rounded-full bg-[#e7f3e3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#39713b]">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-semibold text-[#4e5d53]">
                            {address.recipientName} · {address.recipientMobile}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#829086]">
                            {formatAddress(address)}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => openEditAddress(address)}
                          aria-label={`Edit ${address.label} address`}
                          className="rounded-lg p-2 text-[#718076] hover:bg-[#edf5e9] hover:text-[#265d2d]"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAddress(address.id)}
                          disabled={deletingAddressId === address.id}
                          aria-label={`Delete ${address.label} address`}
                          className="rounded-lg p-2 text-[#a16d62] hover:bg-[#fff0ed] hover:text-[#bd4d3b]"
                        >
                          {deletingAddressId === address.id ? (
                            <Loader2 className="animate-spin" size={15} />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      {showAddressForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102612]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:rounded-[28px] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#829086]">
                  {editingAddressId ? "Edit address" : "New address"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#172017]">
                  Where should we deliver?
                </h2>
                <p className="mt-1 text-sm text-[#829086]">
                  Keep your delivery details ready for a smoother checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddressForm}
                aria-label="Close address form"
                className="rounded-full p-2 text-[#718076] hover:bg-[#f1f5ee]"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveAddress} className="mt-7 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Address label" required>
                  <select
                    value={addressForm.label}
                    onChange={(event) =>
                      updateField("label", event.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-primary"
                  >
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Recipient name" required>
                  <Input
                    value={addressForm.recipientName}
                    onChange={(event) =>
                      updateField("recipientName", event.target.value)
                    }
                    placeholder="Full name"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Recipient mobile" required>
                  <Input
                    value={addressForm.recipientMobile}
                    maxLength={10}
                    inputMode="numeric"
                    onChange={(event) =>
                      updateField(
                        "recipientMobile",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                    placeholder="10-digit mobile number"
                  />
                </Field>
                <Field label="Pincode" required>
                  <Input
                    value={addressForm.pincode}
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(event) =>
                      updateField(
                        "pincode",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                    placeholder="6-digit pincode"
                  />
                </Field>
              </div>
              <Field label="Address line 1" required>
                <Input
                  value={addressForm.addressLine1}
                  onChange={(event) =>
                    updateField("addressLine1", event.target.value)
                  }
                  placeholder="House no., building, street"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Address line 2">
                  <Input
                    value={addressForm.addressLine2}
                    onChange={(event) =>
                      updateField("addressLine2", event.target.value)
                    }
                    placeholder="Area, apartment (optional)"
                  />
                </Field>
                <Field label="Landmark">
                  <Input
                    value={addressForm.landmark}
                    onChange={(event) =>
                      updateField("landmark", event.target.value)
                    }
                    placeholder="Nearby landmark (optional)"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" required>
                  <Input
                    value={addressForm.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    placeholder="City"
                  />
                </Field>
                <Field label="State" required>
                  <Input
                    value={addressForm.state}
                    onChange={(event) =>
                      updateField("state", event.target.value)
                    }
                    placeholder="State"
                  />
                </Field>
              </div>
              <div className="rounded-2xl border border-[#dbe7d7] bg-[#f7fbf5] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold text-[#2c5730]">
                      <Navigation size={16} /> Delivery location
                    </p>
                    <p className="mt-1 text-xs text-[#829086]">
                      Required to help us deliver accurately.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locating}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#b9ceb3] bg-white px-3 text-xs font-bold text-[#2c5730] hover:bg-[#edf5e9]"
                  >
                    {locating ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <MapPin size={14} />
                    )}{" "}
                    {locating ? "Locating..." : "Use current location"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-[#829086]">
                  {addressForm.latitude && addressForm.longitude
                    ? `Coordinates captured: ${addressForm.latitude}, ${addressForm.longitude}`
                    : "No coordinates captured yet"}
                </p>
              </div>
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#394b3c]">
                <input
                  type="checkbox"
                  checked={Boolean(addressForm.isDefault)}
                  onChange={(event) =>
                    updateField("isDefault", event.target.checked)
                  }
                  className="h-4 w-4 accent-[#265d2d]"
                />{" "}
                Make this my default address
              </label>
              <div className="flex flex-col-reverse gap-3 border-t border-[#edf1eb] pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeAddressForm}
                  disabled={savingAddress}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingAddress}>
                  {savingAddress && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  {savingAddress ? (
                    "Saving address..."
                  ) : editingAddressId ? (
                    <>
                      <Check size={16} /> Update address
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Save address
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default MyProfile;
