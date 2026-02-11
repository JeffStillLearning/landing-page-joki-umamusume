import { pgTable, text, boolean, uuid, integer, timestamp } from "drizzle-orm/pg-core";

export const pricingPackages = pgTable("pricing_packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  features: text("features").array(),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  trainerId: text("trainer_id"),
  rating: integer("rating").default(5),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports for use across the app
export type PricingPackage = typeof pricingPackages.$inferSelect;
export type NewPricingPackage = typeof pricingPackages.$inferInsert;

export type GameEvent = typeof gameEvents.$inferSelect;
export type NewGameEvent = typeof gameEvents.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
