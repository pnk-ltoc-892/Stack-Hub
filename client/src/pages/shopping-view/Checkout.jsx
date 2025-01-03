import CartItemsContent from '@/components/shopping-view/CartItemsContent.jsx'
import img from '../../assets/account.jpg'
import Address from '@/components/shopping-view/Address.jsx'
import { Button } from '@/components/ui/button.jsx'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@/hooks/use-toast.js'
import { createNewOrder } from '@/store/shop/order-slice/index.js'


const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =  
    (cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0);

  // const calculateAmount = () => 
  //   (cartItems && cartItems.items && cartItems.items.length > 0
  //     ? cartItems.items.reduce(
  //       (sum, currentItem) =>
  //         sum +
  //         (currentItem?.salePrice > 0
  //           ? currentItem?.salePrice
  //           : currentItem?.price) *
  //         currentItem?.quantity,
  //       0
  //     )
  //     : 0);
  // const [totalCartAmount, setTotalCartAmount] = useState(calculateAmount());

  function handleInitiatePaypalPayment() {
    console.log(cartItems, "cartItems");
    
    if (cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    // ! Creating a order
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      // console.log(data, "pankaj");
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      }
      else {
        setIsPaymentStart(false);
      }
    });
  }

  // ! Explore This - do i have better way to do this ?
  if (approvalURL) {
    window.location.href = approvalURL;
  }

  // useEffect(() => {
  //   setTotalCartAmount(calculateAmount());
  // }, [cartItems]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
              <CartItemsContent cartItem={item} key={item.productId}/>
            ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>

          <div className="mt-4 w-full">
            {/* // ! Disable Button While Loading Payement */}
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout;