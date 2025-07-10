// src/app/api/admin-signin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

interface AdminOrganization {
  tenant_id: string
  tenant_name: string
  tenant_slug: string
  role: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, selectedTenantId } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Step 1: Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password
    })

    if (authError || !authData.user) {
      console.error('Authentication failed:', authError)
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Step 2: Get user's admin profiles (tenant_admin or super_admin roles)
    const { data: adminProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        tenant_id,
        role,
        first_name,
        last_name,
        tenants!inner (
          id,
          name,
          slug
        )
      `)
      .eq('id', authData.user.id)
      .in('role', ['tenant_admin', 'super_admin'])

    if (profileError) {
      console.error('Profile query error:', profileError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      // User authenticated but has no admin roles
      await supabase.auth.signOut() // Clean up the session
      return NextResponse.json({ 
        error: 'Access denied. You do not have administrator privileges.' 
      }, { status: 403 })
    }

    // Step 3: Handle organization selection for multi-tenant admins
    const organizations: AdminOrganization[] = adminProfiles.map(profile => ({
      tenant_id: profile.tenant_id,
      tenant_name: (profile.tenants as any).name,
      tenant_slug: (profile.tenants as any).slug,
      role: profile.role
    }))

    // Check for super_admin role (has access to all organizations)
    const isSuperAdmin = adminProfiles.some(profile => profile.role === 'super_admin')

    if (isSuperAdmin && !selectedTenantId) {
      // Super admin needs to select organization
      const { data: allTenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError)
        return NextResponse.json({ error: 'Error loading organizations' }, { status: 500 })
      }

      return NextResponse.json({
        requiresOrgSelection: true,
        userType: 'super_admin',
        organizations: allTenants?.map(tenant => ({
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          tenant_slug: tenant.slug,
          role: 'super_admin'
        })) || []
      })
    }

    if (!selectedTenantId) {
      // Regular admin - check if they have multiple organizations
      if (organizations.length > 1) {
        return NextResponse.json({
          requiresOrgSelection: true,
          userType: 'tenant_admin',
          organizations: organizations.map(org => ({
            tenant_id: org.tenant_id,
            tenant_name: org.tenant_name,
            tenant_slug: org.tenant_slug,
            role: org.role
          }))
        })
      }
      
      // Single organization - use it automatically
      const selectedOrg = organizations[0]
      return NextResponse.json({
        success: true,
        redirectTo: '/tenant',
        organizationName: selectedOrg.tenant_name,
        userRole: selectedOrg.role
      })
    }

    // Step 4: Validate selected organization
    let selectedOrg: AdminOrganization | undefined

    if (isSuperAdmin) {
      // Super admin can access any organization
      const { data: selectedTenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, slug')
        .eq('id', selectedTenantId)
        .single()

      if (tenantError || !selectedTenant) {
        return NextResponse.json({ error: 'Invalid organization selection' }, { status: 400 })
      }

      selectedOrg = {
        tenant_id: selectedTenant.id,
        tenant_name: selectedTenant.name,
        tenant_slug: selectedTenant.slug,
        role: 'super_admin'
      }
    } else {
      // Regular admin - verify they have access to selected organization
      selectedOrg = organizations.find(org => org.tenant_id === selectedTenantId)
      if (!selectedOrg) {
        return NextResponse.json({ error: 'You do not have access to the selected organization' }, { status: 403 })
      }
    }

    // Step 5: Set organization context in session (optional - you may want to store this differently)
    // For now, we'll just return success and let the frontend handle routing

    return NextResponse.json({
      success: true,
      redirectTo: '/tenant',
      organizationName: selectedOrg.tenant_name,
      userRole: selectedOrg.role,
      tenantId: selectedOrg.tenant_id
    })

  } catch (error) {
    console.error('Admin signin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}