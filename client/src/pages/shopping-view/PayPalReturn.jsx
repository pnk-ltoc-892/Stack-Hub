import { Card, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { capturePayment } from '@/store/shop/order-slice/index.js';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';


const PayPalReturn = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    // ! Fetching the paymentId and PayerId from the URL, as it is supplied in params by default by 'paypal'
    // const params = new URLSearchParams(location.search);
    // const paymentId = params.get("paymentId");
    // const payerId = params.get("PayerID");
    const paymentId = "PAYID-LV7J7ZQ5JY12345";
    const payerId = "5ZQ5JY12345";

    useEffect(() => {
        if (paymentId && payerId) {
            // ! Retrieving the orderId from the sessionStorage
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

            dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
                if (data?.payload?.success) {
                    sessionStorage.removeItem("currentOrderId");
                    window.location.href = "/shop/payment-success";
                }
            });
        }
    }, [paymentId, payerId, dispatch]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Processing Payment...Please wait!</CardTitle>
            </CardHeader>
        </Card>
    )
}

export default PayPalReturn
