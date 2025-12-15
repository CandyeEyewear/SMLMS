import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user is a super admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, slug, icon } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL' },
        { status: 500 }
      );
    }

    // Use service role for admin writes (bypasses RLS). Route is still protected by user role checks above.
    const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check if slug already exists
    const { data: existingCategory, error: existingError } = await admin
      .from('categories' as never)
      .select('id')
      .eq('slug' as never, slug as never)
      .single();

    // PostgREST returns "no rows" as an error for `.single()`; treat it as "not found".
    const existingErrorCode = (existingError as { code?: string } | null)?.code;
    const isNotFound = existingErrorCode === 'PGRST116';
    if (existingError && !isNotFound) {
      console.error('Error checking existing category slug:', existingError);
      return NextResponse.json(
        { error: 'Failed to validate slug uniqueness', details: existingError.message },
        { status: 500 }
      );
    }

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the category
    const { data: category, error: createError } = await admin
      .from('categories' as never)
      .insert({
        name,
        description,
        slug,
        icon,
      } as never)
      .select()
      .single();

    if (createError) {
      console.error('Supabase error creating category:', createError);
      return NextResponse.json(
        { error: 'Failed to create category', details: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
