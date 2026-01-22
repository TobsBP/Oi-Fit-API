import { supabase } from '@/lib/supabase';

export class ProductsRepository {
  async getAllProducts() {
    return await supabase.from('products').select('*');
  }

  async getProductById(id: string) {
    return await supabase.from('products').select('*').eq('id', id).single();
  }
}