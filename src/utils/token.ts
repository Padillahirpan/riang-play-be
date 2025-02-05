import * as jwt from "jsonwebtoken";
import { tokenSecretKey } from "./config";

const getSecretKey = async() => {
   const secretKey = process.env.TOKEN_SECRET_KEY || 'secret-key';
   return secretKey;
}

export const generateToken = async(userId: number) => {
   const secretKey = await getSecretKey();

   const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: '24h' });
   process.env.TOKEN_SECRET_KEY
   return token;
}

export const verifyToken = async(token: string) => {
   const secretKey = await getSecretKey();

   try {
      const isTokenValid = jwt.verify(token, secretKey);
      return isTokenValid;
   } catch (error) {
      return null;
   }
}

export const decodeTokenWithId = async (token: string) => {
   try {
      const isTokenValid = await verifyToken(token);
      if (!isTokenValid) {
         return null;
      }
      const decode = jwt.decode(token) as { userId: number };
      
      return decode.userId;
   } catch (error) {
      return null;
   }

 };
