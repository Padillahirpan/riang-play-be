import { z } from "zod";

export const loginSchema = z.object({
   email: z.string().openapi({ example: "test@mail.com" }),
   password: z.string().openapi({ example: "password123" }),
});