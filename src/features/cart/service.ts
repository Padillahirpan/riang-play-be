import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
   
export async function existingCart(userId: number) {
   const existingCart = await prisma.cart.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      select: {
         id: true,
         cartItems: {
            include: {
               product: true,
            },
            orderBy: { createdAt: "asc" },
         },
      }
   });

   if (!existingCart) {
       const newCart = await prisma.cart.create({
           data: { userId: userId },
           include: { cartItems: { include: { product: true } } },
       })
       return newCart
   }

   const itemsWithTotalPrice = existingCart.cartItems.map((item) => ({
       ...item,
       totalPrice: item.quantity * item.product.price,
   }))

   const totalAmount = itemsWithTotalPrice.reduce((sum, item) => sum + item.totalPrice, 0)

   return {
       ...existingCart,
       items: itemsWithTotalPrice,
       totalAmount,
   }
}


export async function getCarts(
   userId: number
) {
   const cart = await existingCart(userId);

   const itemsWithTotalPrice = cart.cartItems.map((item) => ({
      ...item,
      totalPrice: item.quantity * item.product.price,
  }));

  const totalPrice = itemsWithTotalPrice.reduce((sum, item) => sum + item.totalPrice, 0);
  
   return {
      totalAmount: totalPrice,
      items: itemsWithTotalPrice,
   };
}


   export async function addItem(userId: number, productId: number, quantity: number) {
       const cart = await existingCart(userId)

       const product = await prisma.product.findUnique({
           where: { id: productId },
       })

       if (!product) {
           throw new Error(`Product with ID ${productId} does not exist.`)
       }

       if (product.stock < quantity) {
           throw new Error(`Not enough stock for product ${product.name}. Available stock: ${product.stock}`)
       }

       const existingItem = await prisma.cartItem.findFirst({
           where: {
               cartId: cart.id,
               productId: productId,
           },
       })

       if (existingItem) {
           if (existingItem.quantity + quantity > product.stock) {
               throw new Error(
                   `Not enough stock for product ${product.name}. Available stock: ${product.stock}`
               )
           }

           const updatedItem = await prisma.cartItem.update({
               where: { id: existingItem.id },
               data: {
                   quantity: {
                       increment: quantity,
                   },
               },
           })
           return updatedItem
       } else {
           const newItem = await prisma.cartItem.create({
               data: {
                   productId: productId,
                   quantity: quantity,
                   cartId: cart.id,
               },
           })
           return newItem
       }
   }

   export async function updateCart(itemId: number, quantity: number) {
       const existingItem = await prisma.cartItem.findUnique({
           where: { id: itemId },
           include: { product: true },
       })

       if (!existingItem) {
           throw new Error(`Cart item with ID ${itemId} does not exist.`)
       }

       if (!existingItem.product) {
           throw new Error(`Product associated with cart item ${itemId} does not exist.`)
       }

       if (quantity > existingItem.product.stock) {
           throw new Error(
               `Not enough stock for product ${existingItem.product.name}. Available stock: ${existingItem.product.stock}`
           )
       }

       const updatedItem = await prisma.cartItem.update({
           where: { id: itemId },
           data: { quantity: quantity },
       })

       return updatedItem
   }

   export async function removeCartItem(itemId: number) {
       const existingItem = await prisma.cartItem.findUnique({
           where: { id: itemId },
       })

       if (!existingItem) {
           throw new Error(`Cart item with ID ${itemId} does not exist.`)
       }

       await prisma.cartItem.delete({
           where: { id: itemId },
       })

       return { message: `Success remove item.` }
   }