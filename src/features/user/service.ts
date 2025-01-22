import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUsers() {
  const response = await prisma.user.findMany();

  return response;
}

export async function getUserById(id: number) {
   const user = await prisma.user.findMany({
       where: {
          id: id,
       },
   });
 
   return user;
 }