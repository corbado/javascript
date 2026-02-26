# Observe SDK Integration into Complete React SDK — STATUS

All planned phases have been implemented. This document now reflects the final status.

## What was implemented

### Flow-level events (ProcessHandler)
- [x] `loginVisible` — fires when LoginInitBlock first becomes primary
- [x] `loginFinish` — fires in onProcessCompleted when authType === Login
- [x] `signupVisible` — fires when SignupInitBlock first becomes primary
- [x] `signupFinish` — fires in onProcessCompleted when authType === Signup
- [x] `loginReset` — fires when LoginInitBlock becomes primary again (after being away)

### Social login (LoginInitBlock + SignupInitBlock)
- [x] `socialLoginStart` — fires before startSocialVerification API call
- [x] `socialLoginFinish` — fires when finishSocialVerification succeeds
- [x] `socialLoginError` — fires when finishSocialVerification fails

### Identifier tracking (LoginInitBlock + SignupInitBlock + React components)
- [x] `provideIdentifierStartable` — created via tracker in LoginForm.tsx / SignupInit.tsx with DOM ref
- [x] `provideIdentifierSubmitted` — fires in start() / updateUserData() before API call
- [x] `provideIdentifierFinished` — fires on successful API response
- [x] `provideIdentifierError` — fires on failed API response
- [x] Input field instrumentation (auto-detect first character, paste, CUI via PatternDetector)

### Login methods decision (LoginInit + PasskeyError screens)
- [x] `loginMethodsDecisionOffered` — fires in LoginInit.tsx, PasskeyError.tsx, PasskeyErrorLight.tsx

### Email OTP (EmailVerifyBlock)
- [x] `emailOTPStartable` — fires when block is created with verificationMethod === 'email-otp'
- [x] `emailOTPSubmitted` — fires in validateCode() before API call
- [x] `emailOTPFinished` — fires on successful validation
- [x] `emailOTPError` — fires on failed validation
- [x] `emailOTPResent` — fires on successful resend

### Email Link (EmailVerifyBlock)
- [x] `emailLinkStartable` — fires when block is created with verificationMethod === 'email-link'
- [x] `emailLinkSubmitted` — fires in validateEmailLink() before API call
- [x] `emailLinkFinished` — fires on successful link validation
- [x] `emailLinkError` — fires on failed link validation

### web-core changes (B1 fix)
- [x] `loginWithPasskey()` — added `onCeremonyData` callback exposing assertionOptions + assertionResponse
- [x] `loginWithPasskeyChallenge()` — extended `onAuthenticatorCompleted` to pass assertionOptions + assertionResponse
- [x] `appendPasskey()` — added `onCeremonyData` callback exposing attestationOptions + attestationResponse

### Passkey login (PasskeyVerifyBlock + LoginInitBlock conditional UI)
- [x] `passkeyLoginStart` — fires via onCeremonyData callback with assertionOptions
- [x] `passkey.submitted` — fires with assertionResponse
- [x] `passkey.finished` — fires on successful login
- [x] `passkey.clientError` / `passkey.serverErrorUnknown` — fires on failure
- [x] Conditional UI tracking — `conditionalUIStartable`, `conditionalUISubmitted`, `conditionalUIFinished`, `conditionalUIClientError` in LoginInitBlock

### Passkey enrollment (PasskeyAppendBlock)
- [x] `passkeyEnrollmentStartable` — fires when block is initialized
- [x] `passkey_enrollment.started` — fires via onCeremonyData with attestationOptions
- [x] `passkey_enrollment.submitted` — fires with attestationResponse
- [x] `passkey_enrollment.finished` — fires on successful append
- [x] `passkey_enrollment.clientError` — fires on failure
- [x] `passkey_enrollment.skipped` — fires in skipPasskeyAppend()

---

## Architecture

- `ObserveTracker` interface defined in `src/contexts/ObserveContext.ts` (no hard dependency on @corbado/observe)
- Tracker passed via `CorbadoProvider` → `ObserveContext` → `FlowHandlerProvider` → `ProcessHandler` → Block classes
- Flow-level events fire from `ProcessHandler`
- Block-level events fire from Block class methods
- DOM-dependent events (provideIdentifierStartable) bridge via React components setting operations on blocks

## Remaining gaps (future work)

| Gap | Description |
|-----|-------------|
| Phone OTP events | No `phoneOTP*` events in observe SDK |
| Missing fields events | No tracking for the "complete your profile" step |
| Phone identifier instrumentation | `provideIdentifierStartable` assumes text input |
| Password events | No password login events tracked (not present in complete SDK) |
