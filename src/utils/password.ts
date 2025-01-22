import { hash, argon2id, verify } from "argon2";


export const hashPassword = async(password: string) => {
   const hashedPassword = await hash(password, {type: argon2id});
   return hashedPassword;
}

export const verifyPassword = async(
   hashPassword: string,
   requestPassword: string
) => {
   const isPasswordMatch = await verify(requestPassword, hashPassword);
   console.log("this verify password:",isPasswordMatch);

   return isPasswordMatch;
}

