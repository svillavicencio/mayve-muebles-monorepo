import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  price: z.number(),
  leadTime: z.number().int().default(0),
  isCustomizable: z.boolean().default(false),
  listPrice: z.number().default(0),
  cashDiscountPrice: z.number().default(0),
  structure: z.string().optional(),
  finish: z.string().optional(),
  fabric: z.string().optional(),
  inStock: z.boolean().default(true),
  requiresAssembly: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  shippingWeight: z.number().optional(),
  categoryId: z.string(),
  images: z.array(z.string()),
  category: CategorySchema.optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const SiteConfigSchema = z.object({
  id: z.string().uuid(),
  whatsapp: z.string(),
  email: z.string(),
  cashDiscount: z.number().int().default(10),
  announcementBanner: z.string().nullable().optional(),
  instagramUrl: z.string().default(''),
  address: z.string().default(''),
  googleMapsUrl: z.string().default(''),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
