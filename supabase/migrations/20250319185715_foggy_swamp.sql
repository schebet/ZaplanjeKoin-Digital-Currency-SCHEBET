/*
  # Add wallet addresses table and policies

  1. New Tables
    - `wallet_addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `address` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `wallet_addresses` table
    - Add policy for authenticated users to read their own wallet address
*/

-- Create the wallet_addresses table if it doesn't exist
CREATE TABLE IF NOT EXISTS wallet_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  address text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_wallet UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own wallet address" ON wallet_addresses;
  
  CREATE POLICY "Users can read own wallet address"
    ON wallet_addresses
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Function to generate a unique wallet address
CREATE OR REPLACE FUNCTION generate_wallet_address()
RETURNS text AS $$
DECLARE
  new_address text;
  exists boolean;
BEGIN
  LOOP
    -- Generate a random address with zpk_ prefix
    new_address := 'zpk_' || encode(gen_random_bytes(16), 'hex');
    
    -- Check if address already exists
    SELECT EXISTS (
      SELECT 1 FROM wallet_addresses WHERE wallet_addresses.address = new_address
    ) INTO exists;
    
    -- Exit loop if address is unique
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN new_address;
END;
$$ LANGUAGE plpgsql VOLATILE;