import { Button } from '@/components/ui/button.jsx';
import { Card, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import React from 'react'
import { useNavigate } from 'react-router-dom';


const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <Card className="p-10">
            <CardHeader className="p-0">
                <CardTitle className="text-4xl">Payment is successfull!</CardTitle>
            </CardHeader>
            <Button className="mt-5" onClick={() => navigate("/shop/account")}>
                View Orders
            </Button>
        </Card>
    );
}

export default PaymentSuccess