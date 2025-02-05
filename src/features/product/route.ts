import { OpenAPIHono } from '@hono/zod-openapi';
import * as productService from './service';
import {
   createNewProductSchema,
   getProductsWithQuerySchema,
   updateNewProductSchema,
} from './schema';
import { parseBody } from 'hono/utils/body';
import { checkUserRoleAsAdmin } from '../../middlewares/check_user_role';

const API_TAG = ['Products'];

export const productRoute = new OpenAPIHono()
   .openapi(
      {
         method: 'get',
         path: '/',
         description: 'Get all products',
         request: {
            query: getProductsWithQuerySchema,
         },
         responses: {
            200: {
               description: 'Successfully get the data',
            },
            404: {
               description: 'User not found',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         const search = c.req.query('search');
         const sortBy = c.req.query('sortBy');
         const sortOrder = c.req.query('sortOrder') ? 'asc' : 'desc';

         const products = await productService.getProducts(
            search,
            sortBy,
            sortOrder
         );

         return c.json(
            {
               status: 'success',
               message: 'Successfully get the products',
               data: products,
            },
            200
         );
      }
   )
   .openapi(
      {
         method: 'get',
         path: '/{id}',
         description: 'Get product by id',
         responses: {
            200: {
               description: 'Successfully get the product by id',
            },
            404: {
               description: 'Product not found',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         const productId = Number(c.req.param('id'));
         try {
            const product = await productService.getProductById(productId);

            return c.json(
               {
                  status: 'success',
                  message: 'Successfully get the product',
                  data: product,
               },
               200
            );
         } catch (error: Error | any) {
            return c.json(
               {
                  message: 'Get product failed',
                  error: error.message,
               },
               400
            );
         }
      }
   )
   .openapi(
      {
         method: 'post',
         path: '/',
         description: 'Create new product',
         middleware: [checkUserRoleAsAdmin()],
         request: {
            body: {
               content: {
                  'application/json': {
                     schema: createNewProductSchema,
                  },
               },
            },
         },
         responses: {
            201: {
               description: 'Add new product successfully',
            },
            400: {
               description: 'Invalid input',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const body = c.req.valid('json');
            const product = await productService.createProduct(body);

            return c.json(
               {
                  status: 'success',
                  message: 'Product added',
                  data: product,
               },
               201
            );
         } catch (error: Error | any) {
            return c.json(
               {
                  message: 'Added product failed',
                  error: error.message,
               },
               400
            );
         }
      }
   )
   .openapi(
      {
         method: 'put',
         path: '/{id}',
         description: 'Update the product',
         middleware: [checkUserRoleAsAdmin()],
         responses: {
            201: {
               description: 'Update the product successfully',
            },
            400: {
               description: 'Invalid input',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const user = c.get('user') as { id: string };
            const productId = Number(c.req.param('id'));
            const body = await parseBody(c.req);
            const parsedBody = updateNewProductSchema.parse(body);

            const updatedProduct = await productService.updateProduct(
               Number(user.id),
               productId,
               parsedBody
            );

            return c.json(
               {
                  status: 'success',
                  message: 'Product updated',
                  data: updatedProduct,
               },
               201
            );
         } catch (error: Error | any) {
            return c.json(
               {
                  message: 'Added product failed',
                  error: error.message,
               },
               400
            );
         }
      }
   )
   .openapi(
      {
         method: 'delete',
         path: '/{id}',
         description: 'Delete the product',
         middleware: [checkUserRoleAsAdmin()],
         responses: {
            201: {
               description: 'Delete the product successfully',
            },
            400: {
               description: 'Invalid input',
            },
         },
         tags: API_TAG,
      },
      async (c) => {
         try {
            const productId = Number(c.req.param('id'));

            const updatedProduct = await productService.removeProduct(
               productId,
            );

            return c.json(
               {
                  status: 'success',
                  message: 'Product deleted',
                  data: updatedProduct,
               },
               200
            );
         } catch (error: Error | any) {
            return c.json(
               {
                  message: 'Delete product failed',
                  error: error.message,
               },
               400
            );
         }
      }
   );
