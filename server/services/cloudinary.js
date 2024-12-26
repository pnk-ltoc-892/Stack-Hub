import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


cloudinary.config({
    cloud_name: "learn-backend",
    api_key: "372929621231215",
    api_secret: "ncOhEMIlB4UAsiqAJYbWd6S2qoE"
});
fs

async function uploadOnCloudinary(localfilepath) {
    try {
        if (!localfilepath) return null;
        const uploadResponse = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        console.log("File Uploaded Succesfully On Cloudinary");

        fs.unlinkSync(localfilepath);

        return uploadResponse;
    } 
    catch (error) {
        fs.unlinkSync(localfilepath);
        console.log("Error While Uploading On Cloudinary: ", error);
        return null;
    }
}

export {
    uploadOnCloudinary
}