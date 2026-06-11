# Firebase Security Specification (TDD SPEC)

## 1. Data Invariants
- **Admins** are whitelisted in `/admins/{adminId}` or have `role == 'admin'` in `/users/{userId}`.
- **Products** are read-only to customers but writeable by authenticated admins.
- **Categories** are read-only to customers but writeable by authenticated admins.
- **Reviews** can only be created by signed-in users who verify their own `userId` matches the incoming payload, with a limit on review stars (e.g. 1 to 5).
- **Users** can only read or write their own user profile document.
- **Orders** must be owned by the user (the incoming `userId` matches `request.auth.uid`). Users can read and write their own orders (creating them or cancelling them). Admins can read, write, update and manage all orders.

## 2. The "Dirty Dozen" Rogue Payloads
Below are 12 payloads representing security exploits that must be blocked (`PERMISSION_DENIED`) by the Firestore security rules.

1. **Email Spoofing (Admin Bypass)**: Creating a profile document trying to elevate role to `admin` without authenticating as an admin.
2. **Ghost User Injection**: Writing to another user's profile metadata.
3. **Product Price Deflation**: A customer trying to update a product price from $199.99 to $1.99.
4. **Negative Stock Allocation**: A user editing stock levels of products directly.
5. **Orphaned Order Creation**: Creating an order without a matching `userId`, or setting `userId` to a another customer's ID.
6. **Order Theft**: Reading someone else's order document.
7. **Illegitimate Review Inject**: Submitting a review with `userId` of another person.
8. **Out-of-Bounds Rating Review**: Review rating set to `999` stars instead of 1-5.
9. **Spam ID Abuse**: Creating a product document with an ID of special characters and 2KB length.
10. **System-Generated Field Modification**: Trying to alter `createdAt` after creation on a product or order.
11. **Order Status Escalation**: A customer changing their order status directly to "delivered" to bypass payment or shipping processing.
12. **Blanket List Scraping**: Bypassing owner constraints to list all user orders in bulk.

## 3. Test Runner Design
A `firestore.rules.test.ts` file acts as a conceptual or local test suite verifying that each of the Dirty Dozen exploits receives a `PERMISSION_DENIED` status. Our finalized security rules in `firestore.rules` will explicitly block each attack.
