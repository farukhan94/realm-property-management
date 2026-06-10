export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  useMock: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false",
};
