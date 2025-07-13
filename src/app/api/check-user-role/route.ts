// File: src/app/api/check-user-role/route.ts
// Version: v1 - Role detection API for single sign-in flow

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AccessOption {
  id: string; // 'super_admin' or tenant_id
  name: string; // Display name
  accessType: 'super_admin' | 'tenant_admin' | 'member';
  tenantId?: string; // Only for tenant-specific access
  organizationName?: string; // Only for tenant-specific access
}

interface UserRoleInfo {
  hasAdminAccess: boolean;
  hasMemberAccess: boolean;
  accessOptions: AccessOption[];
  totalOptions: number;
}

interface UserProfileWithTenant {
  tenant_id: string;
  role: string;
  tenants: any; // Use any to handle both array and object cases
}

export async function POST(request: NextRequest) {
  console.log('🔍 check-user-role API called');
  
  try {
    console.log('📧 Parsing request body...');
    const { email } = await request.json();
    console.log('📧 Email received:', email);

    if (!email || typeof email !== 'string') {
      console.log('❌ Invalid email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log('📧 Normalized email:', normalizedEmail);

    console.log('🔍 Creating Supabase client...');
    
    // Add environment variable check
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('🔍 First, check if user exists at all...');
    // First, check if user exists and get their role
    const { data: basicUserProfiles, error: basicError } = await supabase
      .from('user_profiles')
      .select('email, role, tenant_id')
      .eq('email', normalizedEmail);

    if (basicError) {
      console.error('❌ Error in basic user check:', basicError);
      return NextResponse.json(
        { error: 'Failed to check user information' },
        { status: 500 }
      );
    }

    if (!basicUserProfiles || basicUserProfiles.length === 0) {
      console.log('👤 No user found with this email');
      return NextResponse.json({
        hasAdminAccess: false,
        hasMemberAccess: false,
        accessOptions: [],
        totalOptions: 0
      });
    }

    console.log('👤 Basic user profiles found:', basicUserProfiles);

    // Build comprehensive access options list
    const accessOptions: AccessOption[] = [];
    let hasAdminAccess = false;
    let hasMemberAccess = false;

    // Check if any profile is super_admin
    const isSuperAdmin = basicUserProfiles.some(profile => profile.role === 'super_admin');
    
    if (isSuperAdmin) {
      console.log('👑 Adding super admin option');
      accessOptions.push({
        id: 'super_admin',
        name: 'Super Admin Dashboard',
        accessType: 'super_admin'
      });
      hasAdminAccess = true;
      hasMemberAccess = true; // Super admin can access everything
    }

    // Get tenant-specific relationships for this user
    console.log('🔍 Fetching tenant-specific relationships...');
    const { data: tenantProfiles, error: tenantError } = await supabase
      .from('user_profiles')
      .select(`
        tenant_id,
        role,
        tenants!inner (
          id,
          name,
          slug
        )
      `)
      .eq('email', normalizedEmail)
      .not('tenant_id', 'is', null); // Exclude null tenant_id (super admin records)

    if (tenantError) {
      console.error('❌ Error fetching tenant relationships:', tenantError);
      return NextResponse.json(
        { error: 'Failed to check tenant relationships' },
        { status: 500 }
      );
    }

    console.log('🏢 Tenant relationships found:', tenantProfiles);

    // Process tenant-specific access
    if (tenantProfiles && tenantProfiles.length > 0) {
      const typedProfiles = tenantProfiles as unknown as UserProfileWithTenant[];

      typedProfiles.forEach((profile) => {
        let tenant = null;

        // Handle both array and object cases for tenants
        if (Array.isArray(profile.tenants)) {
          if (profile.tenants.length > 0) {
            tenant = profile.tenants[0];
          }
        } else if (profile.tenants && typeof profile.tenants === 'object' && profile.tenants.id) {
          tenant = profile.tenants;
        }

        if (tenant && tenant.id && tenant.name) {
          const accessType = profile.role === 'tenant_admin' ? 'tenant_admin' : 'member';
          const displayName = profile.role === 'tenant_admin' 
            ? `${tenant.name} (Admin)` 
            : `${tenant.name} (Member)`;

          accessOptions.push({
            id: `${accessType}_${tenant.id}`,
            name: displayName,
            accessType: accessType as 'tenant_admin' | 'member',
            tenantId: tenant.id,
            organizationName: tenant.name
          });

          if (profile.role === 'tenant_admin') {
            hasAdminAccess = true;
          }
          hasMemberAccess = true;

          console.log(`🏢 Added ${accessType} access for ${tenant.name}`);
        }
      });
    }

    const response: UserRoleInfo = {
      hasAdminAccess,
      hasMemberAccess,
      accessOptions,
      totalOptions: accessOptions.length
    };

    console.log('✅ Returning comprehensive access options:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Unexpected error in check-user-role API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}