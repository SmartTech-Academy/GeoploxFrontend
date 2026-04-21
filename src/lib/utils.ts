import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatPrice = (price: number, currency: string = "NGN") => {
  // Validate currency code - if not provided or invalid, use NGN as default
  const validCurrency =
    currency && typeof currency === "string" && currency.length === 3
      ? currency.toUpperCase()
      : "NGN";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 0,
    }).format(price);
  } catch {
    // If currency is still invalid, fallback to NGN
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  }
};

export const formatNumberWithCommas = (value: string) => {
  if (!value) return "";
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parseNumber = (value: string) => {
  if (!value) return "";
  return value.replace(/,/g, "");
};
export const NIGERIAN_PHONE_REGEX = /^(070|080|081|090|091)\d{8}$/;

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function stripHtml(html: string): string {
  if (!html) return "";
  // DOMParser preserves spacing better than regex for real HTML content.
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  }
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptFromHtml(html: string, maxLen: number = 180): string {
  const text = stripHtml(html);
  if (text.length <= maxLen) return text;
  const clipped = text.slice(0, maxLen);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 50 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
}

export const sendTelegramError = async (message: string) => {
  try {
    await fetch(
      `https://api.telegram.org/bot8348304825:AAHjRil9RrAhavwbvst23BC5BkDQ53Leq40/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: "5252343028",
          text: message,
          parse_mode: "HTML",
        }),
      },
    );
  } catch (err) {
    console.error("Telegram notification failed", err);
  }
};
