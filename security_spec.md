# Grama Sahayya AI - Firestore Security Specification

## 1. Data Invariants

1. **PII Isolation & Least Privilege**:
   - Citizen personal identifiable information (emails, phone numbers) must reside strictly in `/users/{userId}/private/info` and only be readable/writable by `isOwner(userId)` or verified admin.
   - Public scheme records in `/schemes/{schemeId}` are read-only for public/authenticated users, and write-restricted strictly to verified admin accounts.
   - Public service records in `/publicServices/{serviceId}` are publicly readable, but writeable only by verified administrators.

2. **Application State Integrity**:
   - Citizens can update self-reported application statuses (e.g. `interested`, `eligibility_assessed`, `documents_preparing`, `ready_to_submit`, `reported_submitted`).
   - Official verified outcomes (`submission_verified`, `approved_verified`, `rejected_verified`) cannot be self-asserted by citizens; only verified admins or backend server functions can assign these states.
   - Any terminal or verified outcome status modification is locked from citizen tampering.

3. **Identity & Relational Integrity**:
   - In all citizen collections (`/users/{userId}`, `/conversations/{conversationId}`, `/assistanceSessions/{sessionId}`, `/savedSchemes/{savedId}`), `request.auth.uid` must equal `incoming().userId`.
   - Impersonation or modifying `userId` / `createdAt` after creation is strictly forbidden.
   - Document ID validation (`isValidId`) prevents ID poisoning or Denial-of-Wallet attacks.
   - System metrics (`/systemMetrics/{metricId}`) are publicly readable for transparency, but writeable only by backend / admin.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1: Unauthenticated Profile Creation**
   - Attempt: `POST /users/spoofed_uid` with no auth header.
   - Target: `users`
   - Expected Result: `PERMISSION_DENIED`

2. **Payload 2: Foreign UID Profile Hijacking**
   - Attempt: User with auth UID `citizen_123` attempts to write `users/citizen_999`.
   - Target: `users`
   - Expected Result: `PERMISSION_DENIED`

3. **Payload 3: Self-Assigned Super Admin Privilege**
   - Attempt: Normal citizen writing `admins/citizen_123` with `{ role: "super_admin" }`.
   - Target: `admins`
   - Expected Result: `PERMISSION_DENIED`

4. **Payload 4: Public Scheme Defacement**
   - Attempt: Authenticated citizen attempting to update `/schemes/pm-kisan` to change eligibility or bank account info.
   - Target: `schemes`
   - Expected Result: `PERMISSION_DENIED`

5. **Payload 5: Fabricated Official Approval Status**
   - Attempt: Citizen updating their `assistanceSessions/{sessionId}` to status `approved_verified` without admin verification.
   - Target: `assistanceSessions`
   - Expected Result: `PERMISSION_DENIED`

6. **Payload 6: PII Snooping on Another Citizen**
   - Attempt: Citizen `user_A` querying `GET /users/user_B/private/info`.
   - Target: `users/private`
   - Expected Result: `PERMISSION_DENIED`

7. **Payload 7: Unrestricted Blanket Conversation Scraping**
   - Attempt: Querying `GET /conversations` without filter `where('userId', '==', auth.uid)`.
   - Target: `conversations`
   - Expected Result: `PERMISSION_DENIED`

8. **Payload 8: Denial-of-Wallet Oversized Payload**
   - Attempt: Writing a chat message in `conversations/{id}/messages/{msgId}` with a 2MB spam payload.
   - Target: `messages`
   - Expected Result: `PERMISSION_DENIED`

9. **Payload 9: Stolen Bookmark Insertion**
   - Attempt: Inserting `savedSchemes/save_abc` with `userId: "victim_uid"`.
   - Target: `savedSchemes`
   - Expected Result: `PERMISSION_DENIED`

10. **Payload 10: Immutable Field Mutation**
    - Attempt: Updating `assistanceSessions/{sessionId}` to alter original `createdAt` or original `userId`.
    - Target: `assistanceSessions`
    - Expected Result: `PERMISSION_DENIED`

11. **Payload 11: System Metric Inflation Attack**
    - Attempt: Citizen writing `systemMetrics/summary` with `{ totalCitizensAssisted: 99999999 }`.
    - Target: `systemMetrics`
    - Expected Result: `PERMISSION_DENIED`

12. **Payload 12: Ghost Field Injection (Shadow Update)**
    - Attempt: Updating profile with shadow field `{ isGovernmentOfficial: true }`.
    - Target: `users`
    - Expected Result: `PERMISSION_DENIED`
