'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitCardOrder(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const cardType = formData.get('cardType') as 'personal' | 'business';

  if (!fullName || !email || !cardType) {
    return { error: 'Missing required fields' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('card_orders')
    .insert([
      {
        full_name: fullName,
        email: email,
        phone: phone,
        card_type: cardType,
        status: 'pending'
      }
    ]);

  if (error) {
    console.error('Order Submission Error:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
