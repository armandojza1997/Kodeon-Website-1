import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID
  email: text('email').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  categoryKey: text('category_key').notNull(),
  description: text('description').notNull(),
  fullCaseStudy: text('full_case_study'),
  image: text('image').notNull(),
  demoUrl: text('demo_url'),
  metrics: text('metrics').array(),
  techStack: text('tech_stack').array(),
  architectureNotes: text('architecture_notes'),
  order: integer('order').default(0),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  priceRange: text('price_range'),
  duration: text('duration'),
  features: text('features').array(),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull(),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  // Potential future relations
}));
