CREATE INDEX IF NOT EXISTS "events_created_at" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_created_at" ON "reports" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_created_at" ON "sessions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "navigation_created_at" ON "navigations" USING btree ("created_at");