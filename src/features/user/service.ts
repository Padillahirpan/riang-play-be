import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../utils/token";

const prisma = new PrismaClient();

export async function getUsers() {
  const response = await prisma.user.findMany({
   select: {id: true, name: true, email: true},
  });

  return response;
}

export async function getUserById(id: number) {
   const user = await prisma.user.findUnique({
       where: {
          id: id,
       },
   });
 
   return user;
}

export async function getUserDetailAuth(id: number, token: string) {
   const isTokenValid = await verifyToken(token);

   if (!isTokenValid) {
      throw new Error('Token is not valid');
   }

   const user = await prisma.user.findMany({
      where: {
         id: id,
      },
  });

  return user;

}