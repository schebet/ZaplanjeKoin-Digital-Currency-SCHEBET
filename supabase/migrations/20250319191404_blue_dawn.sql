/*
  # Add insert policy for wallet addresses

  1. Security Changes
    - Add policy to allow authenticated users to insert their own wallet address
    - Users can only insert a wallet address for their own user_id
*/

-- Add insert policy for wallet addresses
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert own wallet address" ON wallet_addresses;
  
  CREATE POLICY "Users can insert own wallet address"
    ON wallet_addresses
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;