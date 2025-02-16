import { OpenAPIHono } from '@hono/zod-openapi';
import { userRoute } from './features/user/route';
import { authRoute } from './features/auth/route';
import productRoute from './features/product/route';
import { cartRoute } from './features/cart/route';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { WelcomePage } from './welcome';

const app = new OpenAPIHono();
app.use('/api/*', cors());
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
               <WelcomePage />
            </body>
         </html>
      );
   });
export default app;
