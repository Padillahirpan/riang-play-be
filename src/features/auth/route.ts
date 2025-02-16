import { OpenAPIHono } from "@hono/zod-openapi";
import { loginSchema, registerSchema } from "./schema";
import * as authService from './service';
import { checkUserToken } from "../../middlewares/check_user_token";

const API_TAG = ['Auth'];

export const authRoute = new OpenAPIHono()
   .openapi(
      {
         method: 'post',
         path: '/register',
         description: 'Register new user',
         request: {
            body: {
               content: {
                  "application/json": {
                     schema: registerSchema,
                  },
               },
            },
         },
         responses: {
            201: {
               description: 'User registered successfully',
            },
            400: {
               description: 'Invalid input or registration failed',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const body = c.req.valid("json");
            const user = await authService.register(body);

            return c.json({ 
               status: 'success',
               message: "User registered", 
               data: user,
            }, 201);
        } catch (error: Error | any) {
            return c.json({ message: "Registration failed", error: error.message }, 400);
        }
      }
   )
   .openapi(
      {
         method: 'post',
         path: '/login',
         description: 'Login a user',
         request: {
            body: {
               content: {
                  "application/json": {
                     schema: loginSchema,
                  },
               },
            },
         },
         responses: {
            200: {
               description: 'Login successful',
            },
            401: {
               description: 'Invalid email or password',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const body = c.req.valid("json");
            const { token, user } = await authService.login(body);

            return c.json({
                  status: 'success',
                  message: "Login successful",
                  data: { token, user },
             }, 200);
        } catch (error: Error | any) {
            return c.json({ 
               message: "Login failed", 
               error: error.message 
            }, 400);
        }
      }
   )
   .openapi(
      {
         method: 'get',
         path: '/me',
         description: 'Get user profile',
         security: [{ BearerAuth: []}],
         middleware: [checkUserToken()],
         responses: {
            200: {
               description: 'Successfully get the user by id',
            },
            404: {
               description: 'User not found',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const user = c.get("user") as { id: number };

            const result = await authService.getUserById(user.id);

            return c.json(
               {
                  status: 'success',
                  message: 'Successfully get the user',
                  data: result,
               },
               200,
            );
         } catch (error: Error | any) {
            return c.json({ 
               message: "Get user failed", 
               error: error.message 
            }, 400);
         }
      }
   );