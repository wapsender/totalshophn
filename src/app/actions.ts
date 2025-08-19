'use server';

import { suggestServices } from '@/ai/flows/smart-service-suggestions';

export async function getSuggestions(cartItems: string[]): Promise<string[]> {
  if (cartItems.length === 0) {
    return [];
  }
  try {
    // The AI flow might be sensitive to duplicate items, so we pass a unique set
    const uniqueCartItems = [...new Set(cartItems)];
    const result = await suggestServices({ cartItems: uniqueCartItems });
    return result.suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    // Return an empty array or a fallback message in case of an error
    return [];
  }
}
