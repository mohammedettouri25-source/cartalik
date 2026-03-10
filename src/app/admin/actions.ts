'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function markOrderProcessed(orderId: string) {
  const supabase = await createClient();
  
  // Verify authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  // Update order
  const { error } = await supabase
    .from('card_orders')
    .update({ status: 'processed' })
    .eq('id', orderId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function createAccountFromOrder(formData: FormData) {
  const supabase = await createClient();
  
  // Verify authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  const orderId = formData.get('order_id') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!orderId || !email || !password) {
    throw new Error('Missing required fields');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is perfectly required in .env.local to create accounts programmatically!');
  }

  // Use the admin API with the Service Role Key to bypass RLS and avoid logging out the admin
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Get the order details for full name metadata
  const { data: order } = await supabase.from('card_orders').select('full_name').eq('id', orderId).single();

  // Create the user in Auth
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm the email so they can log in instantly
    user_metadata: {
      full_name: order?.full_name || 'Cartalik User',
    }
  });

  if (createError) {
    throw new Error(createError.message);
  }

  // Update order status to processed
  await supabase
    .from('card_orders')
    .update({ status: 'processed' })
    .eq('id', orderId);

  revalidatePath('/admin');
}

export async function deleteOrder(orderId: string) {
  const supabase = await createClient();
  
  // Verify authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  // Delete order
  const { error } = await supabase
    .from('card_orders')
    .delete()
    .eq('id', orderId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

export async function deleteUserAdmin(userId: string) {
  const supabase = await createClient();
  
  // Verify authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Delete from Auth (this triggers profile deletion due to CASCADE)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/users');
}

export async function updateProfileAdmin(userId: string, updates: any) {
  const supabase = await createClient();
  
  // Verify authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Perform update using service role to bypass RLS
  const { error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/users', 'layout');
  revalidatePath('/dashboard', 'layout');
}

export async function createManualUser(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Verify authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authorized' };

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;
    const cardType = formData.get('card_type') as string;
    const isActive = formData.get('is_active') === 'on';

    console.log('Admin: Attempting to create manual user:', { email, fullName, cardType, isActive });

    if (!email || !password || !fullName || !cardType) {
      return { success: false, error: 'Missing required fields' };
    }


    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error('SERVER ERROR: SUPABASE_SERVICE_ROLE_KEY is missing!');
      return { success: false, error: 'Server configuration error' };
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Create the user in Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (createError) {
      console.error('Supabase Auth Error:', createError.message);
      return { success: false, error: createError.message };
    }

    const userId = newUser.user.id;
    console.log('User created successfully in Auth:', userId);

    // 2. Wait for profile trigger
    let profileFound = false;
    for (let i = 0; i < 5; i++) {
      const { data: checkProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkProfile) {
        profileFound = true;
        break;
      }
      await new Promise(r => setTimeout(r, 500));
    }

    if (profileFound) {
      await supabaseAdmin
        .from('profiles')
        .update({ 
          card_type: cardType,
          is_active: isActive
        })
        .eq('id', userId);
    } else {
      console.warn('Profile row delayed or missing for user:', userId);
    }

    revalidatePath('/admin');
    revalidatePath('/admin/users');
    
    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in createManualUser:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deactivateProfile(profileId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ is_active: false })
    .eq('id', profileId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/users', 'layout');
  revalidatePath('/dashboard', 'layout');
}

export async function renewSubscriptionAdmin(profileId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Calculate new end date (+6 months / ~180 days)
  const newEndDate = new Date();
  newEndDate.setMonth(newEndDate.getMonth() + 6);

  // 2. Reactivate the profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ is_active: true })
    .eq('id', profileId);

  if (profileError) throw new Error(profileError.message);

  // 3. Update the subscription
  const { data: updatedSub, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .update({ 
      status: 'active',
      current_period_end: newEndDate.toISOString()
    })
    .eq('profile_id', profileId)
    .select();

  if (subError) {
    throw new Error(subError.message);
  }

  // If the update affected 0 rows, that means there was no subscription. We must insert it.
  if (!updatedSub || updatedSub.length === 0) {
    // If no subscription existed, try inserting instead
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        profile_id: profileId,
        status: 'active',
        current_period_end: newEndDate.toISOString()
      })
      .select();
      
    if (insertError) {
      return { success: false, error: insertError.message, updated: false, inserted: false };
    }
  }

  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/users', 'layout');
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/', 'layout');
  return { success: true, updated: updatedSub?.length > 0, inserted: !updatedSub || updatedSub.length === 0 };
}

export async function repairAllSubscriptions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authorized');

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Get all profiles
  const { data: profiles } = await supabaseAdmin.from('profiles').select('id');
  if (!profiles) return { success: false, error: 'No profiles found' };

  // 2. Fix each profile (+6 months active)
  const newEndDate = new Date();
  newEndDate.setMonth(newEndDate.getMonth() + 6);

  for (const p of profiles) {
    // Ensure profile is active
    await supabaseAdmin.from('profiles').update({ is_active: true }).eq('id', p.id);
    
    // Check for existing sub
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('profile_id', p.id)
      .single();

    if (sub) {
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'active', current_period_end: newEndDate.toISOString() })
        .eq('profile_id', p.id);
    } else {
      await supabaseAdmin
        .from('subscriptions')
        .insert({ 
          profile_id: p.id, 
          status: 'active', 
          current_period_end: newEndDate.toISOString() 
        });
    }
  }

  revalidatePath('/admin', 'layout');
  revalidatePath('/dashboard', 'layout');
  return { success: true };
}


