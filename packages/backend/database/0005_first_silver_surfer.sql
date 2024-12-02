DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('open', 'closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "settings_keys" ADD VALUE 'email_bug_report';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(6) NOT NULL,
	"description" varchar(700) NOT NULL,
	"session_id" integer NOT NULL,
	"status" "status" DEFAULT 'open' NOT NULL,
	"user" json NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "reports_code_unique" UNIQUE("code")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reports_code" ON "reports" USING btree ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_session_id" ON "reports" USING btree ("session_id");