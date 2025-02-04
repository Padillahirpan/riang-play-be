import { OpenAPIHono } from '@hono/zod-openapi';
import { checkUserToken } from '../../middlewares/check_user_token';
import * as cartService from './service';
import { cartItemSchema, itemIdSchema, updateCartItemSchema } from './schema';

const API_TAG = ['Cart'];

export const cartRoute = new OpenAPIHono()
   .openapi(
      {
         method: 'get',
         path: '/',
         description: "Get user's cart",
         security: [{ BearerAuth: [] }],
         middleware: [checkUserToken()],
         responses: {
            200: {
               description: 'Cart retrieved successfully',
            },
            404: {
               description: 'Failed get cart',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const user = c.get('user') as { id: string };
            const cart = await cartService.getCarts(Number(user.id));

            return c.json(
               {
                  status: 'success',
                  message: 'Successfully get the cart',
                  data: cart,
               },
               200
            );
         } catch (error: Error | any) {
            return c.json(
               { message: 'Failed get cart', error: error.message },
               404
            );
         }
      }
   )
   .openapi(
      {
         method: 'post',
         path: '/',
         description: 'Add an item to the cart',
         security: [{ BearerAuth: [] }],
         middleware: [checkUserToken()],
         request: {
            body: {
               content: {
                  'application/json': {
                     schema: cartItemSchema,
                  },
               },
            },
         },
         responses: {
            201: {
               description: 'Item added to cart successfully',
            },
            400: {
               description: 'Invalid input or item addition failed',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const user = c.get('user') as { id: string };
            const body = c.req.valid('json');
            const newItem = await cartService.addItem(
               Number(user.id),
               body.productId,
               body.quantity
            );

            return c.json(
               {
                  status: 'success',
                  message: 'Successfully added item to cart',
                  data: newItem,
               },
               201
            );
         } catch (error: Error | any) {
            return c.json(
               { message: error.message, error: error.message },
               400
            );
         }
      }
   )
   .openapi(
      {
         method: 'put',
         path: '/{itemId}',
         description: 'Update quantity of a cart item',
         security: [{ BearerAuth: [] }],
         middleware: [checkUserToken()],
         request: {
            params: itemIdSchema,
            body: {
               content: {
                  'application/json': {
                     schema: updateCartItemSchema,
                  },
               },
            },
         },
         responses: {
            200: {
               description: 'Cart item updated successfully',
            },
            404: {
               description: 'Cart item not found',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const itemId = Number(c.req.param('itemId'));
            if (!itemId) {
               return c.json({ message: 'itemId is required' }, 400);
            }
            const body = c.req.valid('json');
            const updatedItem = await cartService.updateCart(
               itemId,
               body.quantity
            );

            return c.json(
               {
                  status: 'success',
                  message: 'Cart item updated',
                  data: updatedItem,
               },
               200
            );
         } catch (error: Error | any) {
            return c.json(
               { message: error.message, error: error.message },
               400
            );
         }
      }
   )
   .openapi(
      {
         method: 'delete',
         path: '/{itemId}',
         description: 'Remove an item from the cart',
         request: {
            params: itemIdSchema,
         },
         security: [{ BearerAuth: [] }],
         middleware: [checkUserToken()],
         responses: {
            200: {
               description: 'Cart item removed successfully',
            },
            404: {
               description: 'Cart item not found',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const itemId = Number(c.req.param('itemId'));
            if (!itemId) {
               return c.json({ message: 'itemId is required' }, 400);
            }
            const response = await cartService.removeCartItem(itemId);

            return c.json(
               {
                  status: 'success',
                  message: 'Cart item removed successfully',
                  data: response,
               },
               200
            );
         } catch (error: Error | any) {
            return c.json(
               { message: 'Failed to remove cart item', error: error.message },
               404
            );
         }
      }
   );
