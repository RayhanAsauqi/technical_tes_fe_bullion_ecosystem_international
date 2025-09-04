export type ApiError = {
  err_code?: string;
  err_message?: string;
  err_message_en?: string;
};

export function parseApiError(error: any): string {
  if (error && typeof error === "object") {
    const apiErr = error as ApiError;
    if (apiErr.err_message) return apiErr.err_message;
    if (apiErr.err_message_en) return apiErr.err_message_en;
  }

  if (error instanceof Error) return error.message;

  return "Terjadi kesalahan server";
}
