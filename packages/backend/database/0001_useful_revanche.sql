DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'guest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_accounts" ADD COLUMN "role" "role" DEFAULT 'guest' NOT NULL;