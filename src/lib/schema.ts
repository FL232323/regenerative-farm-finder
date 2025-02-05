import { mysqlTable, varchar, json, point, timestamp, decimal } from 'drizzle-orm/mysql-core';

export const farms = mysqlTable('farms', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  businessType: json('business_type').$type<string[]>().notNull(),
  location: point('location').notNull().srid(4326),
  address: json('address').$type<{
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }>(),
  description: varchar('description', { length: 1000 }),
  products: json('products').$type<Array<{
    category: string;
    items: Array<{
      name: string;
      availability: string;
    }>;
  }>>(),
  operatingHours: json('operating_hours').$type<Array<{
    day: string;
    open: string;
    close: string;
  }>>(),
  scheduledTimes: json('scheduled_times').$type<Array<{
    day: string;
    time: string;
    notes?: string;
  }>>(),
  shippingOptions: json('shipping_options').$type<{
    offersShipping: boolean;
    radius?: number;
    minimumOrder?: number;
    shippingNotes?: string;
  }>(),
  images: json('images').$type<Array<{
    url: string;
    caption: string;
  }>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
});