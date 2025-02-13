import { PrismaClient } from "@prisma/client";
import { loginSchema, validateLogin } from "./schema";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../utils/password";
import { generateToken } from "../../utils/token";

const prisma = new PrismaClient();

export async function register(
   { name, email, password }: { name: string, email: string, password: string }
) {

   const existingUser = await isUserExists(email, name);
   if(existingUser) {
      throw new Error('User already exists');
   }

   const hashedPassword = await hashPassword(password); // hash the password here

   const user = await prisma.user.create({
      data: {
         name: name,
         email: email,
         password: hashedPassword,
      },
      select: {id: true, name: true, email: true},
   });

   return user;
}

async function isUserExists(email: string, name: string) {
   const user = await prisma.user.findFirst({
      where: {
         OR: [
            { email },
            { name }
         ],
      },
   });

   return user;
}



export async function login(
   data: Partial<z.infer<typeof loginSchema>>
) {
   const { email, password } = validateLogin(data);
   
   const user = await prisma.user.findFirst({
      where: {
         email: email,
      },
   });

   if(!user) {
      throw new Error('User not found');
   }

   const isMatch = await verifyPassword(password, user?.password)

   if(!isMatch) {
      throw new Error('Invalid password');
   }
   
   const token = await generateToken(user.id);

   return { 
      token,
      user: { id: user.id, name: user.name, email: user.email }
   };

}

export async function getUserById(id: number) {
   const user = await prisma.user.findUnique({
       where: {
          id: id,
       },
   });
 
   return user;
}

