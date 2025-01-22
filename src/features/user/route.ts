import { OpenAPIHono } from '@hono/zod-openapi';
import * as userService from './service';

const API_TAG = ['Users'];

export const userRoute = new OpenAPIHono()
   .openapi(
      {
         method: 'get',
         path: '/',
         description: 'Get all users',
         responses: {
            200: {
               description: 'Artist get all users',
            },
            404: {
               description: 'No users found',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         const users = await userService.getUsers();

         return c.json(
            {
               status: 'success',
               message: 'Successfully get the users',
               data: users,
            },
            200
         );
      }
   )
   .openapi(
      {
         method: 'get',
         path: '/{id}',
         description: 'Get user by id',
         responses: {
            200: {
               description: 'Successfully get the user by id',
            },
            404: {
               description: 'No users found',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         const userId = Number(c.req.param('id'));
         const user = await userService.getUserById(userId);

         return c.json(
            {
               status: 'success',
               message: 'Successfully get the user',
               data: user,
            },
            200
         );
      }
   );
