# Customizing Firebase Email Templates for HomieNest

## Quick Steps (Firebase Console)

1. Go to [Firebase Console](https://console.firebase.google.com/) → Select `house-price-prediction-72b16`
2. **Authentication** → **Templates** tab
3. Edit each template with the settings below

---

## Password Reset Email

| Field | Value |
|-------|-------|
| **Sender name** | `HomieNest` |
| **Subject** | `Reset your HomieNest password` |
| **Reply-to** | Your email (e.g., `support@homienest.com`) |

**Message body** (paste this):
```
Hello,

We received a request to reset the password for your HomieNest account (%EMAIL%).

Click the link below to set a new password:
%LINK%

This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.

Best regards,
The HomieNest Team

---
HomieNest — Smart Real Estate Predictions
https://houseprice.vercel.app
```

---

## Email Verification

| Field | Value |
|-------|-------|
| **Sender name** | `HomieNest` |
| **Subject** | `Verify your HomieNest email` |

**Message body**:
```
Welcome to HomieNest!

Please verify your email address (%EMAIL%) by clicking the link below:
%LINK%

Once verified, you'll have full access to AI-powered property predictions and real estate insights.

Best regards,
The HomieNest Team

---
HomieNest — Smart Real Estate Predictions
https://houseprice.vercel.app
```

---

## Why Emails Go to Spam

Firebase uses shared `@firebaseapp.com` domain which email providers often flag. Solutions:

1. **Custom SMTP** (Recommended): Use services like SendGrid, Mailgun, or Postmark
2. **Custom Domain**: Set up in Firebase Templates → Custom Domain (requires domain ownership)
