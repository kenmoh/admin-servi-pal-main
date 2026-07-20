# Dispute — Admin Messaging Implementation Plan

Goal
- Make the admin UI display and behave like the mobile messages/disputes screens, reusing existing Supabase RPCs where possible so the mobile implementation remains untouched.

Constraints
- DO NOT modify mobile code.
- Admin UI calls the backend via `process.env.API_URL` (Next.js API routes already proxy to backend). Keep that pattern.
- Ensure admin identity (actor_id) is tracked for read/resolve actions.

Mobile RPCs and helpers to reuse
- `get_dispute_details` (returns dispute metadata + messages)
- `get_dispute_messages` (paged messages)
- `send_dispute_message` (inserts message via RPC)
- `mark_dispute_read` / `get_dispute_unread_count`
- `uploadDisputeImage` (Supabase Storage)
- realtime channels: `dispute-{id}` (INSERT on `dispute_messages`), `dispute-updates-{id}` (UPDATE on `disputes`)

High-level approach
1. Backend should expose admin-facing endpoints that call the same Supabase RPCs but pass an explicit `caller_id` (admin actor) where required so actions are recorded as performed by the admin.
2. Keep existing Next.js API proxy routes for admin UI; they will forward requests to backend admin endpoints (already present at `${API_URL}/disputes...`).
3. The admin backend handlers (or service layer) should call the supabase RPCs used by mobile (no duplicate business logic). If an admin-specific RPC exists (e.g., `admin_get_dispute_detail`), map it to the same output shape the admin UI expects.
4. For realtime updates: prefer letting the admin UI subscribe to Supabase realtime channels directly (same channels mobile uses). If that is not possible in admin UI (CORS/auth constraints), implement a lightweight SSE/WebSocket proxy on the backend to forward Supabase realtime events to admin clients.

Detailed implementation steps
1. Inventory & mapping (quick scan) — 1–2 hours
   - Confirm exact RPC names, input/output shapes used by mobile (already located in mobile `api/dispute.ts`).
   - Confirm which RPCs require a `p_user_id` or `caller_id` to record actor. Note mobile RPCs often use `session.user.id`.

2. Backend service adapters — 3–5 hours
   - Implement admin-facing service functions in `app/services/dispute_mgt_admin.py` (or expand existing file) that call the same RPCs but accept `actor_id` and pass it into RPC calls where appropriate.
   - Minimal set to implement:
     - `admin_list_disputes(supabase, filters, caller_id, page, page_size)` -> call `admin_list_disputes` or `get_disputes` RPC with caller context
     - `get_dispute(supabase, dispute_id, caller_id)` -> call `get_dispute_details` RPC but pass `p_caller_id` so the DB can mark admin as read when appropriate
     - `add_dispute_message(supabase, dispute_id, actor_id, payload)` -> call same `send_dispute_message` rpc but actor_id passed explicitly
     - (Reuse) `update_dispute_status` already implemented — ensure it calls `get_dispute` with `caller_id` when returning updated record (already present)
   - Ensure returned shapes are compatible with admin frontend (JSON passthrough preferred).

3. Backend HTTP routes — 1–3 hours
   - Confirm backend exposes REST endpoints matching `${API_URL}/disputes` and `${API_URL}/disputes/{id}` (list, get, patch). If not present, add them.
   - Ensure these endpoints read Authorization header, validate admin JWT, extract admin `actor_id`, and forward it to the service adapters.
   - Preserve existing headers (`X-User-Role`) and return the same JSON shape the admin UI expects.

4. Realtime for admin UI — 2–6 hours (depends on chosen approach)
   Option A (recommended): allow the admin frontend to use Supabase client directly
     - Configure admin UI to initialize Supabase client with appropriate keys and subscribe to `dispute-{id}` / `dispute-updates-{id}` channels.
     - Advantage: zero backend work, same behavior as mobile.
   Option B: server-side proxy (if direct client access is not acceptable)
     - Create a lightweight SSE or WebSocket endpoint the admin UI connects to.
     - Backend subscribes to Supabase realtime and forwards events to connected admin clients, filtering by dispute IDs the admin requested.

5. Image uploads — 1–2 hours
   - Mobile uses `supabase.storage` directly. For admin UI, either:
     - Allow admin UI to upload directly to Supabase Storage (recommended), or
     - Provide a backend proxy that uploads to Supabase Storage on behalf of admin, returning the public URL.

6. Tests & QA — 2–4 hours
   - Manual tests: list disputes, open a dispute, send a message, upload image, mark read, resolve dispute — verify admin action is recorded in `resolved_by` / `resolved_at` and messages show in both admin and mobile.
   - Automated: add integration tests for the backend admin endpoints if repo has test infra.

Acceptance criteria
- Admin UI can list disputes and open message threads showing the same messages as mobile.
- Admin can send messages and upload images which appear for the mobile user in near-real-time.
- Read/unread counts behave consistently between admin and mobile; admin actions are attributed to the admin user in audit logs and `resolved_by` fields.
- No changes to mobile code.

Notes & risks
- Avoid duplicating business logic; prefer calling the same stored procedures/RPCs used by mobile.
- If Supabase Row-Level Security depends on `session.user.id`, ensure admin RPC calls either pass `caller_id` into RLS-aware RPCs or use a service role key in the backend with explicit `p_caller_id` parameters.
- Realtime proxying adds operational complexity; prefer direct client subscription if feasible.

Next immediate step for me
- Implement the minimal admin service adapters that call the same RPCs while accepting `actor_id`, then wire them to the existing backend HTTP routes used by the admin frontend.

<!-- on the terms-of-service page add a new section Commission with the following:
 - Delivery Commission: 12.5%
 - Laundry Commision: 0.8%
 - Food Commission: 0.8%
 - Marketplace Commisiion: 0.8%
 - Reservation Commission: NGN(use naira sign) 5000 -->

