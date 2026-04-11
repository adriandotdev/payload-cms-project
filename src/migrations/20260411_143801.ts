import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sales_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"product_name" varchar NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"qty" numeric NOT NULL,
  	"subtotal" numeric NOT NULL
  );
  
  CREATE TABLE "sales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cashier_id" integer NOT NULL,
  	"total_amount" numeric NOT NULL,
  	"cash_tendered" numeric NOT NULL,
  	"change" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "color" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sales_id" integer;
  ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sales" ADD CONSTRAINT "sales_cashier_id_users_id_fk" FOREIGN KEY ("cashier_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sales_items_order_idx" ON "sales_items" USING btree ("_order");
  CREATE INDEX "sales_items_parent_id_idx" ON "sales_items" USING btree ("_parent_id");
  CREATE INDEX "sales_items_product_idx" ON "sales_items" USING btree ("product_id");
  CREATE INDEX "sales_cashier_idx" ON "sales" USING btree ("cashier_id");
  CREATE INDEX "sales_updated_at_idx" ON "sales" USING btree ("updated_at");
  CREATE INDEX "sales_created_at_idx" ON "sales" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sales_fk" FOREIGN KEY ("sales_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_sales_id_idx" ON "payload_locked_documents_rels" USING btree ("sales_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sales_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sales_items" CASCADE;
  DROP TABLE "sales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sales_fk";
  
  DROP INDEX "payload_locked_documents_rels_sales_id_idx";
  ALTER TABLE "categories" DROP COLUMN "color";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sales_id";`)
}
