CREATE TABLE "newsletters" (
	"id" text PRIMARY KEY NOT NULL,
	"issue_number" integer NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"thumbnail_url" text,
	"pdf_url" text,
	"author_id" text,
	"author_name" text,
	"category" text,
	"view_count" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletters_issue_number_unique" UNIQUE("issue_number")
);
--> statement-breakpoint
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;