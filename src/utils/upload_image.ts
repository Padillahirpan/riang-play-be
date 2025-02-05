import { v2 as cloudinary } from 'cloudinary';

export const uploadImageByCloudinary = async (
   imageBase64: string,
   imageId: number
) => {
   const uploadResult = await cloudinary.uploader
       .upload(
           `data:image/png;base64,${imageBase64}`, {
               public_id: `${imageId}`,
           }
       )
       .catch((error) => {
           console.log(error);
           throw new Error('Image failed to upload');
       });
       
   return uploadResult;
}