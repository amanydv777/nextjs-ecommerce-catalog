export function validateApiKey(apiKey: string | null): boolean {
  const validApiKey = process.env.ADMIN_API_KEY || 'your-secret-api-key-here';
  return apiKey === validApiKey;
}
