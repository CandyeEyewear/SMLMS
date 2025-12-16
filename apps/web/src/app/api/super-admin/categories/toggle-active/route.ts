import { createClient } from '@/lib/supabase/server';
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
    const { categoryId } = body;

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Get current state
    const { data: category } = await supabase
      .from('categories' as never)
      .select('is_active')
      .eq('id' as never, categoryId as never)
      .single();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Toggle the active state
    const { error: updateError } = await supabase
      .from('categories' as never)
      .update({
        is_active: !(category as { is_active: boolean }).is_active,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id' as never, categoryId as never);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      is_active: !(category as { is_active: boolean }).is_active,
    });
  } catch (error) {
    console.error('Error toggling category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}
