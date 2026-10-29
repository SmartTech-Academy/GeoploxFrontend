/**
 * Extracts a user-facing message from an Axios/API error, distinguishing between the cases
 * that otherwise all collapse into the same generic "something went wrong" text:
 *
 * - The backend returned a specific error (`response.data.message`, e.g. "Image size exceeds
 *   15mb...", "The file you are trying to upload is too large...") -- use it verbatim.
 * - The request reached the server but got no usable message -- report the HTTP status so
 *   it's at least actionable/reportable.
 * - The request never got a response at all (offline, DNS failure, CORS block, timeout,
 *   aborted) -- these look identical to "the server returned nothing" from `response?.data`
 *   alone, so they need their own branch instead of falling into a generic catch-all.
 */
export function getErrorMessage(error: any, fallback = "Something went wrong. Please try again."): string {
  const data = error?.response?.data;
  if (data?.message) return data.message;

  // Laravel validation errors occasionally arrive without a top-level `message` (older
  // endpoints, or a response shape that predates the custom message handling) -- fall back to
  // the first field-specific error before giving up and showing something generic.
  if (data?.errors && typeof data.errors === "object") {
    const firstField = Object.values(data.errors)[0];
    const firstMessage = Array.isArray(firstField) ? firstField[0] : firstField;
    if (typeof firstMessage === "string") return firstMessage;
  }

  if (error?.response?.status) {
    return `Request failed (error ${error.response.status}). Please try again.`;
  }

  if (error?.code === "ECONNABORTED" || /timeout/i.test(error?.message ?? "")) {
    return "The request timed out. Please check your connection and try again.";
  }

  if (error?.message === "Network Error" || !navigator.onLine) {
    return "Unable to reach the server. Please check your internet connection and try again.";
  }

  return fallback;
}
