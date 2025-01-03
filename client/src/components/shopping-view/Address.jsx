import { useEffect, useState } from "react";
import CommonForm from "../common/CommonForm.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewAddress,
    deleteAddress,
    editAddress,
    fetchAllAddresses,
} from "@/store/shop/address-slice/index.js";
import AddressCard from "./AddressCard.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { addressFormControls } from "@/config/index.js";
import { Toast } from "../ui/toast.jsx";


const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { addressList } = useSelector((state) => state.shopAddress);
    const { toast } = useToast();


    function handleManageAddress(event) {
        event.preventDefault();
        console.log("formData", formData);
        

        if (addressList.length >= 4 && currentEditedId === null) {
            setFormData(initialAddressFormData);
            toast({
                title: "You can add max 4 addresses",
                variant: "destructive",
            });
            return;
        }

        currentEditedId !== null
            ? dispatch(
                editAddress({
                    userId: user?.id,
                    addressId: currentEditedId,
                    formData,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address updated successfully",
                    });
                }
            })
            : dispatch(
                addNewAddress({
                    ...formData,
                    userId: user?.id,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address added successfully",
                    });
                }
            });
    }
    

    function handleDeleteAddress(getCurrentAddress) {
        dispatch(
            deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title: "Address deleted successfully",
                });
            } 
        });
    }

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes,
        });
    }

    function isFormValid() {
        return Object.keys(formData)
            .map((key) => formData[key].trim() !== "")
            .every((item) => item);
    }

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch]);


    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
                {addressList && addressList.length > 0
                    ? addressList.map((singleAddressItem,index) => (
                        <AddressCard key={index}
                            selectedId={selectedId}
                            handleDeleteAddress={handleDeleteAddress}
                            addressInfo={singleAddressItem}
                            handleEditAddress={handleEditAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                        />
                    ))
                    : null}
            </div>
            <CardHeader>
                <CardTitle>
                    {currentEditedId !== null ? "Edit Address" : "Add New Address"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? "Edit" : "Add"}
                    onSubmitHandler={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    );
}

export default Address;
