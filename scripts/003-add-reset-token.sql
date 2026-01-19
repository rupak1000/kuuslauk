-- Add reset token columns to admin_users table
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;

-- Create index for faster token lookup
CREATE INDEX IF NOT EXISTS idx_admin_users_reset_token ON admin_users(reset_token);
