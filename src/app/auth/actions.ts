'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (authData.user) {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single();

    if (profile?.is_admin) {
      revalidatePath('/admin', 'layout');
      return redirect('/admin');
    }
  }

  return redirect('/dashboard');
}

export async function submitCardOrder(formData: FormData) {
  const supabase = await createClient()

  const data = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    card_type: formData.get('card_type') as string,
  }

  // Insert into card_orders table
  const { error } = await supabase
    .from('card_orders')
    .insert([data])

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  // Redirect back with a success parameter
  redirect('/signup?success=true')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
