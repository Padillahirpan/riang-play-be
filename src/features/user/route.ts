import { OpenAPIHono } from '@hono/zod-openapi';
import * as userService from './service';
import { checkUserToken } from '../../middlewares/check_user_token';

const API_TAG = ['Users'];

export const userRoute = new OpenAPIHono()
   .openapi(
      {
         method: 'get',
         path: '/',
         description: 'Get all users',
         responses: {
            200: {
               description: 'Successfully get the users',
            },
            404: {
               description: 'User not found',
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
            200,
         );
      }
   );
