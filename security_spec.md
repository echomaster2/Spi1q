# security_spec.md

## 1. Data Invariants
- A user can only access and modify their own data (based on `{userId}`).
- Core fields like `uid` and `email` become immutable after creation.
- `lessonId` in progress must match the document path ID.
- `createdAt` and `updatedAt` must be set via server time.
- Users cannot manually unlock achievements without satisfying logic (enforced in code, but rules should restrict bulk/shadow writes).

## 2. The Dirty Dozen Payloads (Red Team Tests)

1. **Identity Spoofing**: Attempt to create a user profile with a `uid` that doesn't match `request.auth.uid`.
   - Result: `PERMISSION_DENIED`
2. **Global Read Attempt**: Attempt to list all documents in `/users` collection.
   - Result: `PERMISSION_DENIED`
3. **Ghost Field Update**: Attempt to update a user document with an unpermitted field like `isVerifiedAdmin`.
   - Result: `PERMISSION_DENIED` (via `affectedKeys().hasOnly()`)
4. **Time Tampering**: Attempt to set `updatedAt` to a future date instead of `request.time`.
   - Result: `PERMISSION_DENIED`
5. **Cross-User Progress Write**: `userA` attempts to write progress at `/users/userB/progress/lesson1`.
   - Result: `PERMISSION_DENIED`
6. **Orphaned Achievement**: Attempt to create an achievement without a valid ID.
   - Result: `PERMISSION_DENIED` (via `isValidId()`)
7. **Score Inflation**: Attempt to set `score` in progress to `9999` (outside valid range 0-100).
   - Result: `PERMISSION_DENIED`
8. **Immutability Breach**: Attempt to change `uid` on an existing user document.
   - Result: `PERMISSION_DENIED`
9. **Invalid ID Injection**: Use a 1MB string or high-entropy junk string as a `lessonId`.
   - Result: `PERMISSION_DENIED` (via `isValidId()` size check)
10. **Shadow Quest Completion**: Attempt to set `completed: true` on a quest while `currentValue < targetValue`.
    - Result: `PERMISSION_DENIED` (via cross-field validation)
11. **PII Leakage List Query**: Attempt to run a collection group query on `progress` without owner filtering.
    - Result: `PERMISSION_DENIED`
12. **Status Shortcut**: Move a quest from `currentValue: 0` to `currentValue: 100` in a single update without meeting intermediate steps (Business logic check).

## 3. Test Runner (Draft Rules Verification)

The `firestore.rules` will target these specific failures.
