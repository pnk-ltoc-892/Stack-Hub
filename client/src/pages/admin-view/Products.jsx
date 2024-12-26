import CommonForm from '@/components/common/CommonForm.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx'
import React, { Fragment, useEffect, useState } from 'react'
import { addProductFormElements } from '../../config/index.js'
import ProductImageUpload from '@/components/admin-view/ProductImageUpload.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin/product-slice/index.js'
import { toast } from '@/hooks/use-toast.js'
import ProductTile from '@/components/admin-view/ProductTile.jsx'


const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
};

export const AdminProducts = () => {

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { productList } = useSelector(state => state.adminProducts);

    const dispatch = useDispatch();

    const onSubmit = (event) => {
        event.preventDefault();

        currentEditedId !== null
            ? dispatch(
                editProduct({
                    id: currentEditedId,
                    formData,
                })
            ).then((data) => {
                console.log(data, "edit");

                if (data?.payload?.success) {
                    // ! Also Just Update UI for Now,fetch on next page refresh
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                    toast({
                        title: "Product Edited Successfully",
                    })
                }
            })
            : dispatch(
                addNewProduct(
                    {
                        ...formData,
                        image: uploadedImageUrl
                    }
                ))
                .then((data) => {
                    // console.log("data", data);
                    if (data?.payload?.success) {
                        dispatch(fetchAllProducts());
                        setOpenCreateProductsDialog(false);
                        setImageFile(null);
                        setFormData(initialFormData);
                        setUploadedImageUrl("");
                        toast({
                            title: "Product Added Successfully",
                        })

                    }
                    // setOpenCreateProductsDialog(false);
                })
    }

    function handleDelete(getCurrentProductId) {
        
        dispatch(deleteProduct(getCurrentProductId)).then((data) => {
            console.log(data, "delete");
            
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
            }
            toast({
                title: "Product Deleted Successfully",
            })
        });
    }

    function isFormValid() {
        return Object.keys(formData)
            .filter((currentKey) => currentKey !== "averageReview")
            // .filter((currentKey) => currentKey !== "salePrice") Not Working
            .map( (key) => formData[key] !== "" )
            .every( (item) => item ); // Every item should be true
    }

    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [])




    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductsDialog(true)}>
                    Add New Product
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {productList && productList.length > 0
                    ? productList.map((productItem) => (
                        <ProductTile key={productItem._id}
                            setFormData={setFormData}
                            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                            setCurrentEditedId={setCurrentEditedId}
                            product={productItem}
                            handleDelete={handleDelete}
                        />
                    ))
                    : null}
            </div>
            <Sheet
                open={openCreateProductsDialog}
                // ! Importan Closing Tasks
                onOpenChange={() => {
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                }}
            >
                <SheetContent side="right" className="overflow-auto" >
                    <SheetHeader>
                        <SheetTitle>
                            {currentEditedId !== null ? "Edit Product" : "Add New Product"}
                        </SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        imageLoadingState={imageLoadingState}
                        setImageLoadingState={setImageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />
                    <div className="py-6">
                        <CommonForm
                            onSubmitHandler={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? "Edit" : "Add"}
                            formControls={addProductFormElements}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    )
}