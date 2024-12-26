import { Label } from "../ui/label";
import React, { useEffect, useRef } from 'react'
import { Input } from '../ui/input.jsx';
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton.jsx";
import { Button } from "../ui/button.jsx";
import axios from "axios";


const ProductImageUpload = ({
    imageFile,
    setImageFile,
    imageLoadingState,
    uploadedImageUrl,
    setUploadedImageUrl,
    setImageLoadingState,
    isEditMode,
    isCustomStyling = false,
}) => {

    const inputRef = useRef(null);

    const handleImageFileChange = (e) => {
        // console.log(event.target.files, "event.target.files");
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setImageFile(selectedFile);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }
    function handleDrop(event) {
        event.preventDefault();
        // ! Impotant Event
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    }
    function handleRemoveImage() {
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function uploadImageToCloudinary() {
        setImageLoadingState(true);
        const data = new FormData();
        data.append("imageFile", imageFile);

        const response = await axios.post(
            "http://localhost:5000/api/v1/admin/products/upload-image",
            data
        );
        console.log("response", response);

        if (response?.data?.success) {
            setUploadedImageUrl(response.data.result.secure_url);
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);


    return (
        <div
            className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
        >
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`${isEditMode ? "opacity-60" : ""
                    } border-2 border-dashed rounded-lg p-4`}
            >
                <Input
                    ref={inputRef}
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageFileChange}

                    // ! Not Allowing Image Upload In Edit Mode
                    disabled={isEditMode}
                />
                {
                    !imageFile ? (
                        // ! To Get Image If Not Uploaded
                        <Label
                            htmlFor="image-upload"
                            className={
                                `${isEditMode ? "cursor-not-allowed" : ""}
                                flex flex-col items-center justify-center h-32 cursor-pointer`
                            }
                        >
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                            <span>Drag & drop or click to upload image</span>
                        </Label>
                    )
                        :
                        imageLoadingState ? (
                            <Skeleton className="h-12 bg-gray-200" />
                        ) :
                            (   // ! To Show Image Name If Uploaded - Replace With Actual Image
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FileIcon className="w-8 text-primary mr-2 h-8" />
                                    </div>
                                    <p className="text-sm font-medium">{imageFile.name}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-foreground"
                                        onClick={handleRemoveImage}
                                    >
                                        <XIcon className="w-4 h-4" />
                                        <span className="sr-only">Remove File</span>
                                    </Button>
                                    {/* {
                                        uploadedImageUrl && (
                                            <img
                                                src={uploadedImageUrl}
                                                alt="Uploaded"
                                                className="w-10 h-10 rounded-lg"
                                            />
                                        )
                                    } */}
                                </div>
                            )}
            </div>
        </div>
    )
}

export default ProductImageUpload