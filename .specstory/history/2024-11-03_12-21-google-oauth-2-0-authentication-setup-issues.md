## SpecStory

## Google OAuth 2.0 Authentication Setup Issues (11/3/2024, 12:21:53 PM)

_**User**_

I have trouble setting up authentication with Google. On the deployed page, when
clicking "Login with Google" (Login.tsx Ln:177), the response is: "Access
blocked: Authorization Error You can't sign in to this app because it doesn't
comply with Google's OAuth 2.0 policy for keeping apps secure. ... Error 400:
invalid_request"

In the setup form 'Google Cloud' > 'Google Auth Platform' I have inserted the
required details. I have filled in:

1. Authorized JavaScript origins The HTTP origins that host your web
   application. This value can't contain wildcards or paths. If you use a port
   other than 80, you must specify it. For example: https://example.com:8080 My
   entry: 'https://kunstraeuber2-0000-staging.fly.dev:8081' Note: I'm not sure
   about the port.
2. Authorized redirect URIs Users will be redirected to this path after they
   have authenticated with Google. The path will be appended with the
   authorization code for access, and must have a protocol. It can’t contain URL
   fragments, relative paths, or wildcards, and can’t be a public IP address. My
   entry: 'https://kunstraeuber2-0000-staging.fly.dev/auth/google/callback'.

I suspect the issue might be related to one or both of these entries.

---

_**Assistant**_

It looks like you're encountering an issue with the Google OAuth 2.0 setup,
specifically related to the configuration of your authorized JavaScript origins
and redirect URIs. Here are a few things to check and adjust:

### 1. Authorized JavaScript Origins

- **Current Entry**: `https://kunstraeuber2-0000-staging.fly.dev:8081`
- **Recommendation**: If your application is not actually running on port
  `8081`, you should remove the port from the entry. Typically, for production
  environments, you would use the default port `443` for HTTPS, which does not
  need to be specified. Therefore, your entry should be:
  ```
  https://kunstraeuber2-0000-staging.fly.dev
  ```

### 2. Authorized Redirect URIs

- **Current Entry**:
  `https://kunstraeuber2-0000-staging.fly.dev/auth/google/callback`
- **Recommendation**: This entry looks correct as long as it matches the
  redirect URI specified in your `GoogleProvider` class. Ensure that this URI is
  exactly the same in both your Google Cloud Console and your application code.

### 3. Additional Considerations

- **Check for Typos**: Ensure there are no typos in the URLs you have entered.
- **OAuth Consent Screen**: Make sure that your OAuth consent screen is properly
  configured and published. If it's in "Testing" mode, only users added to the
  test users list can authenticate.
- **Scopes**: Ensure that the scopes you are requesting (`openid`, `email`) are
  enabled in your Google Cloud project.
- **Client ID and Secret**: Double-check that the `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` environment variables are set correctly in your
  application.

### Summary

Update your authorized JavaScript origins to remove the port if it's not
necessary, and ensure that your redirect URI matches exactly what you have in
your application. After making these changes, try the authentication flow again.

If you continue to experience issues, consider checking the Google Cloud Console
for any error logs or additional information regarding the authorization error.

---

---
