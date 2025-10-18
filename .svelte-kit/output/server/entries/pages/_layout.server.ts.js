const load = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();
  return {
    session: session ? {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: session.user
    } : null,
    user
  };
};
export {
  load
};
