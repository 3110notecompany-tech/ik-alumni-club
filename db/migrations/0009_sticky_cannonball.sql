ALTER TABLE "blogs" ADD COLUMN "is_member_only" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "informations" ADD COLUMN "is_member_only" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletters" ADD COLUMN "is_member_only" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "is_member_only" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "is_member_only" boolean DEFAULT false NOT NULL;