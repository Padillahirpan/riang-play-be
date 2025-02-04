import { createMiddleware } from 'hono/factory';
import { decodeTokenWithId } from '../utils/token';
import { PrismaClient } from '@prisma/client';

export const checkUserToken = () => {
   const prisma = new PrismaClient();

   return createMiddleware(async (context, next) => {
      const authHeader = context.req.header('Authorization')

      if (!authHeader) {
         return context.json(
            {
               status: 'error',
               message: 'Unauthorized. Token is required',
            },
            401
         );
      }

      const token = authHeader.split(" ")[1]
        if (!token) {
            return context.json(
                {
                    status: "error",
                    message: "Unauthorized. Token is required",
                },
                401
            )
        }


      const userId = await decodeTokenWithId(token);

      if (!userId) {
         return context.json(
            {
               status: 'error',
               message: "Unauthorized. The token is not valid",
            },
            401
         );
      }

      const user = await prisma.user.findUnique({
         where: { id: userId },
      });

      if (!user) {
         return context.json(
            {
               status: 'error',
               message: 'Unauthorized. User not found',
            },
            401
         );
      }

      context.set('user', user);

      await next();
   });
};
