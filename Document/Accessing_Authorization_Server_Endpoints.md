# Accessing Authorization Server (OAuth 2.0 + OIDC) Endpoints

This document provides a guide to accessing the OAuth 2.0 and OpenID Connect (OIDC) endpoints of the Authorization Server for the **staff-portal-client** application. It includes step-by-step instructions, endpoint details, and example requests to help developers and users authenticate and obtain tokens securely.

---

## Overview

The Authorization Server implements OAuth 2.0 with OIDC to provide secure authentication and authorization. The server supports the **Authorization Code Flow with Proof Key for Code Exchange (PKCE)**, which is suitable for both public and confidential clients. This flow ensures secure token exchange by using a code verifier and challenge.

Key endpoints:

- **Authorization Endpoint**: Initiates the authentication flow and returns an authorization code.
- **Token Endpoint**: Exchanges the authorization code for access and ID tokens.
- **UserInfo Endpoint** (optional): Retrieves user profile information (not covered in this guide).

---

## Prerequisites

Before accessing the endpoints, ensure the following:

- **Client ID**: `staff-portal-client` (pre-registered with the Authorization Server).
- **Client Secret**: `staff-portal-secret` (for confidential clients; not required for public clients with PKCE).
- **Redirect URI**: `http://localhost:8002/auth/callback` (must match the registered redirect URI).
- **Scopes**: `openid profile` (for OIDC and user profile data).
- **Code Verifier and Challenge**: Generated for PKCE to secure the authorization code exchange.

---

## Step-by-Step Guide

### Step 1: Generate Code Verifier and Code Challenge (PKCE)

PKCE enhances security by requiring a code verifier and its corresponding code challenge.

1. **Code Verifier**: A cryptographically random string (43–128 characters) used to verify the authorization code exchange.
   - Example: `nFgz5GnmxCjGFazHZr0pSvIObuuVkYCpToNjKNYMnz0`
2. **Code Challenge**: The SHA-256 hash of the code verifier, Base64 URL-encoded.

   - Example: `H9slZffC0R5jEaiN0WfemNG4dEd01SjglsEPteKKURk`
   - Calculation (pseudo-code):

     ```plaintext
     code_challenge = base64url(sha256(code_verifier))
     ```

   - Method: `S256` (SHA-256).

**Note**: Store the code verifier securely for use in the token request.

---

### Step 2: Request Authorization Code

Send the user to the **Authorization Endpoint** to initiate the authentication flow. The user will authenticate (e.g., via login page) and approve the requested scopes.

**Endpoint**: `http://localhost:8001/oauth2/v1/authorize`

**Method**: GET

**Parameters**:

- `response_type`: Must be `code` for Authorization Code Flow.
- `client_id`: `staff-portal-client`.
- `redirect_uri`: `http://localhost:8002/auth/callback` (must match registered URI).
- `scope`: `openid profile` (space-separated; `openid` enables OIDC).
- `state`: A unique value to prevent CSRF attacks (e.g., `xyz123`).
- `code_challenge`: The PKCE code challenge (e.g., `H9slZffC0R5jEaiN0WfemNG4dEd01SjglsEPteKKURk`).
- `code_challenge_method`: `S256`.

**Example Request**:

```plaintext
http://localhost:8001/oauth2/v1/authorize?response_type=code&client_id=staff-portal-client&redirect_uri=http://localhost:8002/auth/callback&scope=openid%20profile&state=xyz123&code_challenge=H9slZffC0R5jEaiN0WfemNG4dEd01SjglsEPteKKURk&code_challenge_method=S256
```

**Response**:

- On success, the server redirects to the `redirect_uri` with an authorization code and the `state` parameter.
- Example Redirect:

  ```plaintext
  http://localhost:8002/auth/callback?code=3GTLcOrSkiofO9zgFhcoITiVdmpkpwfmUcrZBS9IsiYRJzHNPi1HxGnnO0L29dCUANzHhIeUxC6drohkjjMxlhfk2rKDPnVl5FyQ4TzqM9P6jxIm-IsnwadcbahSO30d&state=xyz123
  ```

- **Error Case**: If the request is invalid (e.g., incorrect `client_id` or `redirect_uri`), the server redirects with an error:

  ```plaintext
  http://localhost:8002/auth/callback?error=invalid_request&state=xyz123
  ```

**Notes**:

- Verify the `state` parameter matches the sent value to prevent CSRF attacks.
- The authorization code is short-lived and single-use.

---

### Step 3: Exchange Authorization Code for Tokens

Use the **Token Endpoint** to exchange the authorization code for an access token and ID token.

**Endpoint**: `http://localhost:8001/oauth2/v1/token`

**Method**: POST

**Headers**:

- `Content-Type`: `application/x-www-form-urlencoded`
- `Authorization`: Basic Auth with `client_id:client_secret` (Base64-encoded).
  - Example: `staff-portal-client:staff-portal-secret` → Base64(`staff-portal-client:staff-portal-secret`).

**Body Parameters**:

- `grant_type`: `authorization_code`.
- `code`: The authorization code from Step 2.
- `redirect_uri`: `http://localhost:8002/auth/callback` (must match the earlier request).
- `code_verifier`: The PKCE code verifier (e.g., `nFgz5GnmxCjGFazHZr0pSvIObuuVkYCpToNjKNYMnz0`).

**Example Request (cURL) (paste this in the postman)**:

```bash
curl -X POST http://localhost:8001/oauth2/v1/token \
  -u staff-portal-client:staff-portal-secret \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=3GTLcOrSkiofO9zgFhcoITiVdmpkpwfmUcrZBS9IsiYRJzHNPi1HxGnnO0L29dCUANzHhIeUxC6drohkjjMxlhfk2rKDPnVl5FyQ4TzqM9P6jxIm-IsnwadcbahSO30d" \
  -d "redirect_uri=http://localhost:8002/auth/callback" \
  -d "code_verifier=nFgz5GnmxCjGFazHZr0pSvIObuuVkYCpToNjKNYMnz0"
```

**Response**:

- On success, the server returns a JSON response with tokens:

  ```json
  {
    "access_token": "<access-token>",
    "refresh_token": "<refresh-token>"
    "token_type": "Bearer",
    "expires_in": 3600,
    "id_token": "<id-token>",
    "scope": "openid profile"
  }
  ```

- **Error Case**: If the code is invalid or expired:

  ```json
  {
   "error": "invalid_grant",
   "error_description": "Invalid authorization code"
  }
  ```

**Notes**:

- The `access_token` is used to access protected resources.
- The `id_token` (OIDC) contains user identity information (e.g., `sub`, `name`).

---

## Troubleshooting

- **Invalid Client**: Ensure `client_id` and `client_secret` are correct and registered.
- **Redirect URI Mismatch**: Verify the `redirect_uri` matches the registered value exactly.
- **Invalid Code**: Authorization codes are single-use and expire quickly. Retry the authorization flow if the code is invalid.
- **PKCE Errors**: Ensure the `code_verifier` matches the `code_challenge` used in the authorization request.

---

## Additional Notes

- **Token Usage**: Use the `access_token` for API calls and the `id_token` for user identity verification..
