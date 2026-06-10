import { ApiError } from "@/lib/api/client";

export function notImplemented<T>(): Promise<T> {
  return Promise.reject(
    new ApiError(
      "HTTP adapter not implemented. Set NEXT_PUBLIC_USE_MOCK_API=true or connect external API.",
      501
    )
  );
}
