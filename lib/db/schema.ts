import { pgTable, text, boolean, uuid, integer, timestamp, date } from "drizzle-orm/pg-core";

export const pricingPackages = pgTable("pricing_packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  typesOfServices: text("types_of_services").default(""),
  features: text("features").array().default([]), // Using text array for features
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const gameEvents = pgTable("game_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  eventType: text("event_type"),
  price: text("price"),
  priceLabel: text("price_label"),
  status: text("status").default("active"),
  cloudinaryId: text("cloudinary_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  trainerId: text("trainer_id"),
  rating: integer("rating").default(5),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 1. Tabel Orders
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: text("order_id").notNull(), // ORD-XXXX
  customerName: text("customer_name").notNull(),
  customerContact: text("customer_contact").notNull(), // WhatsApp or Discord
  status: text("status").notNull().default("menunggu_konfirmasi"),
  totalPrice: integer("total_price").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 2. Tabel Order Items
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  packageName: text("package_name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 3. Tabel Order Progress
export const orderProgress = pgTable("order_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  isDone: boolean("is_done").default(false),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Type exports for use across the app
export type PricingPackage = typeof pricingPackages.$inferSelect;
export type NewPricingPackage = typeof pricingPackages.$inferInsert;

export type GameEvent = typeof gameEvents.$inferSelect;
export type NewGameEvent = typeof gameEvents.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type OrderProgress = typeof orderProgress.$inferSelect;
export type NewOrderProgress = typeof orderProgress.$inferInsert;
