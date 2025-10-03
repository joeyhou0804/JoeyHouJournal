// Shared in-memory store for verification codes
// This is shared across all API routes in the same process
export const verificationCodes = new Map<string, { code: string; expiresAt: number }>()
