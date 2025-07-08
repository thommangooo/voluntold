# Voluntold Project Summary

## What We've Built
A **complete multi-tenant volunteer management system** with the following features:

### Core System
- **Multi-tenant architecture** - Multiple organizations can use the same system
- **User authentication** with Supabase Auth
- **Role-based access** (super_admin, tenant_admin, member)
- **Project-based organization** of volunteer opportunities

### Email Broadcasting System
- **Professional email templates** grouped by project
- **Personalized signup links** for each member/opportunity combination
- **Rate-limited sending** (1200ms delays for Resend)
- **Verified domain support** (user purchased domain and set up Resend)
- **Database token tracking** for signup verification

### Volunteer Signup System
- **Beautiful landing pages** from email links
- **Calendar integration** (Google, Apple, Outlook, ICS download)
- **Duplicate signup prevention**
- **Success confirmation** with calendar options

### Admin Dashboard
- **Project management** (create, view, edit opportunities)
- **Member management** (add, edit, delete with phone/position/address fields)
- **Real-time signup tracking** (shows who signed up for each opportunity)
- **Manual signup addition** (for existing members or non-members)
- **Collapsible forms** for cleaner UI

### Database Schema
```
tenants (organizations)
├── projects
│   └── opportunities (volunteer shifts)
│       └── signups (confirmed volunteers)
├── user_profiles (members with extended fields)
├── signup_tokens (for email verification)
└── email_broadcasts (tracking)
```

## Current Issue & Next Step
**Problem**: In the feature branch (`feature/member-improvements`), the dashboard won't load tenant data, showing a 400 error on the Supabase query. The main branch works fine.

**Root Cause**: The `loadTenantData` function in the new dashboard code has a malformed query trying to join `user_profiles` and `tenants` tables.

**Immediate Fix Needed**: Replace the `loadTenantData` function in `src/app/tenant/page.tsx` with the simpler version that uses separate queries instead of a join.

## Git Status
- **Main branch**: Working production version
- **Feature branch**: `feature/member-improvements` with new member fields and dashboard improvements
- **Uncommitted changes**: Already committed to feature branch

## Environment
- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Database**: Supabase with PostgreSQL
- **Email**: Resend with verified custom domain
- **Hosting**: Vercel
- **Development**: GitHub Codespaces

## Recent Additions (in feature branch)
- Extended member profiles (phone, position, address)
- Collapsible forms on dashboard
- Edit/delete member functionality with modals
- Simplified member table display
- Tenant name in dashboard header

## Next Session Goals
1. **Fix the dashboard loading issue** (replace loadTenantData function)
2. **Add project statistics** (filled vs unfilled opportunities)
3. **Add project completion feature** (mark as done, hide from dashboard)
4. **Test all features** on feature branch
5. **Merge to main** when stable
6. **Deploy to production**

**Files to focus on**: `src/app/tenant/page.tsx` (dashboard) and any project detail page improvements.