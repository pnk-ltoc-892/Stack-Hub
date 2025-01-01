import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDetails from "@/components/admin-view/OrderDetails.jsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Dialog } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { resetOrderDetails } from "@/store/admin/order-slice/index.js";



function AdminOrders() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
    const dispatch = useDispatch();

    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetailsForAdmin(getId));
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    // console.log(orderDetails, "orderList");

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails]);

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
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
                                                // ! important - bit of a hack to close the dialog, and do clean up
                                                onOpenChange={() => {
                                                    setOpenDetailsDialog(false);
                                                    dispatch(resetOrderDetails());
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
        </div>
    );
}

export default AdminOrders;
