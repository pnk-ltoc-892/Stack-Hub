import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { Badge } from '../ui/badge.jsx';
import { Dialog } from '../ui/dialog.jsx';
import { Button } from '../ui/button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import OrderDetails from './OrderDetails.jsx';
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice/index.js';


const Orders = () => {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

    const dispatch = useDispatch();

    // ! Common Pattern: When we want to fetch indivual details of a particular order/Entity
    // ! Instead of opening the dialog, we directly fetch particular details, 
    // ! and when request resolves and we have data, useEffect takes care of opening the dialog
    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetails(getId));
    }


    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id));
    }, [dispatch]);

    // ! When we have orderDetails, we open the dialog
    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails])


    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0
                            ? orderList.map((orderItem) => (
                                <TableRow>
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${orderItem?.orderStatus === "confirmed"
                                                ? "bg-green-500"
                                                : orderItem?.orderStatus === "rejected"
                                                    ? "bg-red-600"
                                                    : "bg-black"
                                                }`}
                                        >
                                            {orderItem?.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Dialog
                                            open={openDetailsDialog}
                                            // ! Fire a callback when dialog closes
                                            onOpenChange={() => { // ! Basically when this closes
                                                setOpenDetailsDialog(false);
                                                dispatch(resetOrderDetails()); // ! We reset the orderDetails
                                            }}
                                        >
                                            <Button
                                                onClick={() =>
                                                    handleFetchOrderDetails(orderItem?._id)
                                                }
                                            >
                                                View Details
                                            </Button>
                                            <OrderDetails orderDetails={orderDetails} />
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                            : null}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default Orders;
