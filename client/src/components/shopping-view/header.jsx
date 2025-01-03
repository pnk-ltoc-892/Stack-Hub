import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SheetContent, SheetTrigger } from '../ui/sheet.jsx'
import { Button } from '../ui/button.jsx'
import { Sheet } from '../ui/sheet.jsx'
import { Label } from '../ui/label'
import { shoppingViewHeaderMenuItems } from '@/config/index.js'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu.jsx'
import { Avatar, AvatarFallback } from '../ui/avatar.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { logOutUser } from '@/store/auth-slice/index.js'
import { toast } from '@/hooks/use-toast.js'
import { fetchCartItems } from '@/store/shop/cart-slice/index.js'
import { CartWrapper } from './CartWrapper.jsx'
import { useEffect } from 'react'



function MenuItems() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams(); // ! URLSearchParams


    const handleNavigate = (menuItem) => {
        // console.log(searchParams);        
        sessionStorage.removeItem("filters");
        const currentFilter = 
            menuItem.id !== 'home' && 
            menuItem.id !== 'search' && 
            menuItem.id !== 'products'
            ? {
                category: [menuItem.id] // ! Created category Object
                } 
            : null
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        
        // ! If the current location is listing page, then update the URLSearchParams - Manually as it needs reloading otherwise
        if(location.pathname.includes('listing') && currentFilter !== null) {
            setSearchParams(
                new URLSearchParams(`?category=${menuItem.id}`)
            )
        }
        else navigate(menuItem.path);
    }

    return (
        // ! How Simple CSS to handles in main screen & sheet Component
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {shoppingViewHeaderMenuItems.map((menuItem) => (
                <Label
                    onClick={() => handleNavigate(menuItem)}
                    className="text-sm font-medium cursor-pointer"
                    key={menuItem.id}
                >
                    {menuItem.label}
                </Label>
            ))}
        </nav>
    )
}



function HeaderRightContent() {
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);

    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logOutUser(user?._id))
            .then(() => {
                toast({
                    title: "Logged out successfully",
                })
            })
    }

    // ! Fetch Cart Items - On Component Remount
    useEffect(() => {
        dispatch(fetchCartItems(user?.id));
    }, [dispatch]);


    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">

            {/* // ! Cart Sheet */}
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>

                {/* // Cart Trigger */}
                <Button
                    onClick={() => setOpenCartSheet(true)}
                    variant="outline"
                    size="icon"
                    className="relative"
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute top-[-10px] right-[-10px] font-bold bg-slate-900 rounded-full p-[1px] text-sm">
                        {cartItems?.items?.length || 0}
                    </span>
                    <span className="sr-only">User cart</span>
                </Button>
                <CartWrapper
                    setOpenCartSheet={setOpenCartSheet}
                    cartItems={
                        cartItems && cartItems.items && cartItems.items.length > 0
                            ? cartItems.items
                            : []
                    }
                />
            </Sheet>

            {/* // ! User Avatar */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg-black">
                        <AvatarFallback className="bg-black text-white font-extrabold">
                            {/* {user?.username[0].toUpperCase() || "P"} */}
                            "P"
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className="w-56">
                    <DropdownMenuLabel>Logged in as {user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

}



function ShoppingHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/shop/home" className="flex items-center gap-2">
                    <HousePlug className="h-6 w-6" />
                    <span className="font-bold">Ecommerce</span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <MenuItems />
                        <HeaderRightContent />
                    </SheetContent>
                </Sheet>
                <div className="hidden lg:block">
                    <MenuItems />
                </div>
                <div className="hidden lg:block">
                    <HeaderRightContent />
                </div>
            </div>
        </header>
    )
}

export default ShoppingHeader