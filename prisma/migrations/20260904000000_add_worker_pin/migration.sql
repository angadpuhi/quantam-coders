-- Add self-service login PIN to Worker (hashed with bcrypt)
ALTER TABLE "Worker" ADD COLUMN "pin" TEXT;
