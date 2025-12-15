import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Get current user profile
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, company_id, role, email, full_name')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      ...profile,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}



