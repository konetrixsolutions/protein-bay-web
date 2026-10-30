import axios from "axios";
import { toast } from "react-toastify";

const AUTH_SESSION_KEY = "proteinbay-authenticated";
const PENDING_AUTH_ACTION_KEY = "proteinbay-pending-auth-action";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type PendingAuthAction =
  | {
      kind: "cart";
      productVariantId: string;
      quantity: number;
      mode: "add" | "set";
      cartItemId?: string;
      returnTo: string;
    }
  | {
      kind: "wishlist";
      productVariantId: string;
      returnTo: string;
    }
  | {
      kind: "navigate";
      returnTo: "/cart" | "/wishlist";
    };

type ClientRouter = {
  push: (href: string) => void;
};

export const hasAuthSession = () =>
  typeof window !== "undefined" &&
  window.localStorage.getItem(AUTH_SESSION_KEY) === "true";

export const markAuthenticated = () => {
  window.localStorage.setItem(AUTH_SESSION_KEY, "true");
};

export const clearAuthSession = () => {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
};

export const checkAuthSession = async () => {
  try {
    await axios.get(`${API_URL}/auth/profile`, {
      withCredentials: true,
    });
    markAuthenticated();
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthSession();
      return false;
    }

    throw error;
  }
};

export const currentReturnPath = () =>
  `${window.location.pathname}${window.location.search}`;

export const requireAuthentication = async (
  router: ClientRouter,
  action: PendingAuthAction,
): Promise<boolean> => {
  try {
    if (await checkAuthSession()) {
      return true;
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
    toast.error("Unable to verify your login. Please try again.");
    return false;
  }

  window.sessionStorage.setItem(
    PENDING_AUTH_ACTION_KEY,
    JSON.stringify(action),
  );
  router.push("/auth/login");
  return false;
};

export const redirectToLogin = (
  router: ClientRouter,
  action: PendingAuthAction,
) => {
  clearAuthSession();
  window.sessionStorage.setItem(
    PENDING_AUTH_ACTION_KEY,
    JSON.stringify(action),
  );
  router.push("/auth/login");
};

export const consumePendingAuthAction = (): PendingAuthAction | null => {
  const serializedAction = window.sessionStorage.getItem(
    PENDING_AUTH_ACTION_KEY,
  );
  window.sessionStorage.removeItem(PENDING_AUTH_ACTION_KEY);

  if (!serializedAction) {
    return null;
  }

  const action: unknown = JSON.parse(serializedAction);
  if (!action || typeof action !== "object") {
    throw new Error("Saved login action is invalid.");
  }

  const pendingAction = action as Partial<PendingAuthAction>;
  if (
    pendingAction.kind === "cart" &&
    typeof pendingAction.productVariantId === "string" &&
    typeof pendingAction.quantity === "number" &&
    (pendingAction.mode === "add" || pendingAction.mode === "set") &&
    (pendingAction.cartItemId === undefined ||
      typeof pendingAction.cartItemId === "string") &&
    typeof pendingAction.returnTo === "string"
  ) {
    return pendingAction as PendingAuthAction;
  }

  if (
    pendingAction.kind === "wishlist" &&
    typeof pendingAction.productVariantId === "string" &&
    typeof pendingAction.returnTo === "string"
  ) {
    return pendingAction as PendingAuthAction;
  }

  if (
    pendingAction.kind === "navigate" &&
    (pendingAction.returnTo === "/cart" ||
      pendingAction.returnTo === "/wishlist")
  ) {
    return pendingAction as PendingAuthAction;
  }

  throw new Error("Saved login action is invalid.");
};

export const getSafeReturnPath = (path: string | undefined) => {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/cart";
  }

  const pathname = path.split(/[?#]/, 1)[0];
  return pathname === "/auth/login" ? "/cart" : path;
};
