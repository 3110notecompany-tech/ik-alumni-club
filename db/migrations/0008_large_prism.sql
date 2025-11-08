CREATE TYPE "public"."members_status" AS ENUM('pending_profile', 'active', 'inactive');--> statement-breakpoint
CREATE TABLE "member_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_code" varchar(50) NOT NULL,
	"plan_name" varchar(100) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"hierarchy_level" integer NOT NULL,
	"is_business_plan" boolean DEFAULT false,
	"features" jsonb,
	"color" varchar(20),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "member_plans_plan_code_unique" UNIQUE("plan_code")
);
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "last_name" varchar(100);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "first_name" varchar(100);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "last_name_kana" varchar(100);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "first_name_kana" varchar(100);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "postal_code" varchar(8);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "prefecture" varchar(50);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "building" varchar(255);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "phone_number" varchar(20);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "plan_id" integer;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "status" "members_status" DEFAULT 'pending_profile';--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "profile_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_plan_id_member_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."member_plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_email_unique" UNIQUE("email");