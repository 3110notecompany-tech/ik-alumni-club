CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'canceled');--> statement-breakpoint
ALTER TABLE "member_plans" ADD COLUMN "stripe_price_id" varchar(255);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "payment_status" "payment_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "subscription_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "subscription_end_date" timestamp;