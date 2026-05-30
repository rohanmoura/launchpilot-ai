type SupabaseLikeError = {
  message?: string;
  code?: string;
  status?: number;
};

export function getAuthErrorMessage(error: unknown) {
  const authError = error as SupabaseLikeError;

  if (authError.code === "over_email_send_rate_limit" || authError.status === 429) {
    return "Email rate limit reached. Wait a few minutes, then send the link again.";
  }

  if (authError.message) {
    return authError.message;
  }

  return "Could not send sign-in link.";
}
