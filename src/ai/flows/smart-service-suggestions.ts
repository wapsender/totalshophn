// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides smart service suggestions based on items in the cart.
 *
 * - suggestServices - A function that suggests related services based on cart content.
 * - SuggestServicesInput - The input type for the suggestServices function.
 * - SuggestServicesOutput - The return type for the suggestServices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestServicesInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('The list of items currently in the shopping cart.'),
});
export type SuggestServicesInput = z.infer<typeof SuggestServicesInputSchema>;

const SuggestServicesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested services based on the cart items.'),
});
export type SuggestServicesOutput = z.infer<typeof SuggestServicesOutputSchema>;

export async function suggestServices(input: SuggestServicesInput): Promise<SuggestServicesOutput> {
  return suggestServicesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestServicesPrompt',
  input: {schema: SuggestServicesInputSchema},
  output: {schema: SuggestServicesOutputSchema},
  prompt: `You are an e-commerce expert, skilled at suggesting related services to customers.

  Based on the items in the cart, suggest other services that the user might be interested in.
  The response should be a list of suggested services.

  Cart Items: {{cartItems}}`,
});

const suggestServicesFlow = ai.defineFlow(
  {
    name: 'suggestServicesFlow',
    inputSchema: SuggestServicesInputSchema,
    outputSchema: SuggestServicesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
