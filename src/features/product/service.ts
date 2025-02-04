import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../utils/token";
import { NewProductType } from "./schema";

const prisma = new PrismaClient();

export async function getProducts(
   search?: string,
   sortBy?: string,
   sortOrder: 'asc' | 'desc' = 'asc'
) {

  const products = await prisma.product.findMany({
   where: search ? {
      OR: [
         { name: { contains: search, mode: 'insensitive' } },
      ],
   }: {},
   orderBy: sortBy ? {
      [sortBy]: sortOrder,
   }: { id: 'asc' },
  });

  return products;
}

export async function getProductById(id: number) {
   const user = await prisma.product.findUnique({
       where: {
          id: id,
       },
   });
 
   return user;
}

export async function createProduct(
   data: NewProductType
) {
   const product = await prisma.product.create({
      data: {
         name: data.name,
         price: data.price,
         description: data.description,
         stock: data.stock,
         imageUrl: data.imageUrl,
      },
   });

   return product;
}