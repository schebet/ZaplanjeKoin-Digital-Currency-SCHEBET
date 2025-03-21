/*
  # Add statistics table

  1. New Tables
    - `statistics`
      - `id` (uuid, primary key)
      - `total_users` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `statistics` table
    - Add policy for public read access
    - Add trigger to update total users count
*/

-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_users integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Insert initial row
INSERT INTO statistics (id, total_users)
SELECT gen_random_uuid(), (SELECT count(*) FROM auth.users)
WHERE NOT EXISTS (SELECT 1 FROM statistics);

-- Enable RLS
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Add public read policy
CREATE POLICY "Allow public read access"
  ON statistics
  FOR SELECT
  TO public
  USING (true);

-- Create function to update total users
CREATE OR REPLACE FUNCTION update_total_users()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE statistics
  SET total_users = (SELECT count(*) FROM auth.users),
      updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users
CREATE TRIGGER update_total_users_trigger
AFTER INSERT OR DELETE ON auth.users
FOR EACH STATEMENT
EXECUTE FUNCTION update_total_users();