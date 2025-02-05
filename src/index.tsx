import { OpenAPIHono } from '@hono/zod-openapi';
import { userRoute } from './features/user/route';
import { authRoute } from './features/auth/route';
import { productRoute } from './features/product/route';
import { cartRoute } from './features/cart/route';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { v2 as cloudinary } from 'cloudinary';

const app = new OpenAPIHono();
app.use('/api/*', cors());
app.use(async (_c, next) => {
   cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
   });
   await next();
});
app.route('api/auth', authRoute);
app.route('api/users', userRoute);
app.route('api/products', productRoute);
app.route('api/cart', cartRoute);
app.doc31('/docs', {
   openapi: '3.0.0',
   info: {
      version: '1.0.0',
      title: 'Riang-Play Rest API',
      description: 'Riang-Play rest API provides access to simple e-commerce.',
   },
})
   .get('/ui', swaggerUI({ url: '/docs' }))
   .get('/', (c) => {
      return c.html(
         <html lang="en">
            <head>
               <meta charset="UTF-8" />
               <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0"
               />
               <title>Welcome to Riang-Play REST API</title>
               <meta name="description" content="Web API about movies" />
               <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
               <div>
                  {' '}
                  <h1>Welcome to Riang-Play REST API</h1>{' '}
               </div>
            </body>
         </html>
      );
   });
export default app;
