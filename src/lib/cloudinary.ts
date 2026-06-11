import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
  // Ensure CLOUDINARY_URL is set in .env
});

export default cloudinary;
