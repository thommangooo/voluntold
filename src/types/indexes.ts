// src/types/index.ts
export interface Organization {
  tenant_id?: string
  tenant_name?: string
  requiresPassword: boolean
  isSuperAdmin?: boolean
  userId?: string  // Note: Correct spelling (userId, not userld)
  message?: string
}

export interface MemberOrganization extends Organization {
  tenant_slug: string
  member_name: string
  role: string
}