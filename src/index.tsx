import { OpenAPIHono } from '@hono/zod-openapi';
import { userRoute } from './features/user/route';
import { authRoute } from './features/auth/route';
import { productRoute } from './features/product/route';
import { cartRoute } from './features/cart/route';

const app = new OpenAPIHono();

app.route('api/auth', authRoute);
app.route('api/users', userRoute);
app.route('api/products', productRoute);
app.route('api/cart', cartRoute);
app.get('/', (c) => {
   return c.html(
      <html lang="en">
         <head>
            <meta charset="UTF-8" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1.0"
            />
            <title>Welcome to MusicHits2000 REST API</title>
            <meta name="description" content="Web API about movies" />
            <script src="https://cdn.tailwindcss.com"></script>
         </head>
         <body>
            <div>
               {' '}
               <h1>Welcome to REST API</h1>{' '}
            </div>
         </body>
      </html>
   );
});
export default app;
