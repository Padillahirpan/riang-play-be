import { z } from 'zod';

export type NewProductType = {
   name: string;
   price: number;
   stock: number;
   description?: string;
   imageUrl?: File;
};

export type UpdateProductType = {
   name?: string;
   price?: number;
   stock?: number;
   description?: string;
   imageFile?: File;
};

export type UpdateRequest = {
   name?: string;
   price?: number;
   stock?: number;
   description?: string;
   imageUrl?: string;
}

export const createNewProductSchema = z.object({
   name: z.string().min(4).max(100).openapi({ example: 'Baju Tidur' }),
   price: z.coerce.number().openapi({ example: 80000 }),
   stock: z.coerce.number().min(8).openapi({ example: 30 }),
   description: z
      .string()
      .min(8)
      .optional()
      .openapi({ example: 'Baju ini cocok dipakan untuk tidur' }),
   imageFile: z.string().min(8).optional().openapi({ example: 'https' }),
});

export const getProductsWithQuerySchema = z.object({
   search: z.string().optional(),
   sortBy: z.enum(['price', 'updatedAt']).optional(),
   sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const updateNewProductSchema = z.object({
   name: z.string().max(100).optional().openapi({ example: 'Baju Tidur' }),
   price: z.coerce.number().optional().openapi({ example: 80000 }),
   stock: z.coerce.number().optional().openapi({ example: 30 }),
   description: z
      .string()
      .min(8)
      .optional()
      .openapi({ example: 'Baju ini cocok dipakan untuk tidur' }),
   imageFile: z.instanceof(File).optional(),
});
