import { z } from "zod";

export const listingSchemaFull = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  location: z.string().default(""),
  for_sale: z.boolean().default(false),
  coordinates: z.string().default(""),
  room_info: z
    .string()
    .regex(/^\d+:\d+:\d+$/, {
      message: "Format must be 'bedrooms:bathrooms:car_park'.",
    })
    .default("0:0:0"),
  price: z.number().default(0),
  status: z
    .enum(["available", "sold", "rented", "booked"])
    .default("available"),
  property_type: z
    .enum(["master room", "single room", "studio", "condo", "terrace"])
    .default("master room"),
  square_fit: z.number().default(0),
  move_in_dates: z.string().default(""),
  contract_duration: z.string().default(""),
  apartment_tags: z.array(z.string()).default([]),
  environment_tags: z.array(z.string()).default([]),
  admin_remark: z.string().default(""),
  draft_status: z
    .enum(["accepted", "rejected", "pending", "drafting"])
    .default("drafting"),
  bedrooms: z.number().default(0),
  bathrooms: z.number().default(0),
  car_park: z.number().default(0),
  // images: z.array(z.string()).min(1).max(10),
  // videos: z.array(z.string()).min(1).max(1),
});

export const listingSchemaTable = z.object({
  id: z.string(),
  title: z.string().default(""),
  description: z.string().default(""),
  location: z.string().default(""),
  forSale: z.boolean().default(false),
  room_info: z
    .string()
    .regex(/^\d+:\d+:\d+$/, {
      message: "Format must be 'bedrooms:bathrooms:car_park'.",
    })
    .default("0:0:0"),
  price: z.string().default(""),
  status: z
    .enum(["available", "sold", "rented", "booked"])
    .default("available"),
  property_type: z
    .enum(["master room", "single room", "studio", "condo", "terrace"])
    .default("master room"),
  square_fit: z.number().default(0),
  apartment_tags: z.array(z.string()).default([]),
  environment_tags: z.array(z.string()).default([]),
  draft_status: z
    .enum(["accepted", "rejected", "pending", "drafting"])
    .default("drafting"),
});
