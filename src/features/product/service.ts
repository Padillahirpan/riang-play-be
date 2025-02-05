import { PrismaClient } from '@prisma/client';
import { NewProductType, UpdateProductType, UpdateRequest } from './schema';
import { encodeBase64 } from 'hono/utils/encode';
import { uploadImageByCloudinary } from '../../utils/upload_image';

const prisma = new PrismaClient();

export async function getProducts(
   search?: string,
   sortBy?: string,
   sortOrder: 'asc' | 'desc' = 'asc'
) {
   const products = await prisma.product.findMany({
      where: search
         ? {
              OR: [{ name: { contains: search, mode: 'insensitive' } }],
           }
         : {},
      orderBy: sortBy
         ? {
              [sortBy]: sortOrder,
           }
         : { id: 'asc' },
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

export async function createProduct(data: NewProductType) {
   const product = await prisma.product.create({
      data: {
         name: data.name,
         price: data.price,
         description: data.description,
         stock: data.stock,
         // imageUrl: data.imageUrl,
      },
   });

   return product;
}

export async function updateProduct(
   userId: number,
   productId: number,
   data: UpdateProductType
) {
   const imageBase64 =
      data.imageFile != null
         ? await data.imageFile
              .arrayBuffer()
              .then((buffer) => encodeBase64(buffer))
         : null;

   const imageResponse = imageBase64 ? await uploadImageByCloudinary(
      imageBase64,
      productId
   ) : null

   const updateRequest: UpdateRequest = {
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock,
      imageUrl: imageResponse?.url,
   }
   
   const updatedData = Object.fromEntries(
      Object.entries(updateRequest).filter(([_, value]) => value !== undefined && value !== null)
   );

   const updatedProduct = await prisma.product.updateMany({
      where: {
         id: productId,
      },
      data: updatedData,
   });

   return updatedProduct;
}

export async function removeProduct(
   productId: number,
) {
   const deletedProduct = await prisma.product.deleteMany({
      where: {
         id: productId
      },
   });

   return deletedProduct;
}
