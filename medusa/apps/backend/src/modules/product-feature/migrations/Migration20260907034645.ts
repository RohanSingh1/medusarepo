import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260907034645 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_feature" ("id" text not null, "title" text not null, "description" text not null, "rank" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_feature_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_feature_deleted_at" ON "product_feature" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_feature" cascade;`);
  }

}
