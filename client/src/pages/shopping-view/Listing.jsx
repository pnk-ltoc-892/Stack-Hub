import { ProductDetailsDialog } from '@/components/shopping-view/ProductDetailsDialog.jsx'
import ProductFilter from '@/components/shopping-view/ProductFilter.jsx'
import ProductTile from '@/components/shopping-view/ProductTile.jsx'
import { Button } from '@/components/ui/button.jsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuTrigger, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu.jsx'
import { sortOptions } from '@/config/index.js'
import { useToast } from '@/hooks/use-toast.js'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice/index.js'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/product-slice/index.js'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'


// ! Helper Function To Create Search Params
function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  // console.log(queryParams, "queryParams");
  return queryParams.join("&");
}


// ! How is the brand filter working

const ShoppingListing = () => {
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  // console.log(productList);
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.shopCart);

  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");


  function handleSort(value) {
    setSort(value);
  }

  // ! Most Important Function - To Handle Sorting
  // ! Explore What Is Happening Here !
  // ! Adding Or Removing Filters, From Filters State Object
  const handleFilter = (getSectionId, getCurrentOption) => {
    let copyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption]
      };
    }
    else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        copyFilters[getSectionId].push(getCurrentOption);
      }
      else {
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(copyFilters);
    // ! Storing Filters In Session Storage -> To Retain Filters On Page Reload
    sessionStorage.setItem('filters', JSON.stringify(copyFilters));
  }


  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }


  function handleAddtoCart(getProductId) {
    dispatch(
      addToCart({
          userId: user?.id, 
          productId: getProductId, 
          quantity: 1
        })
    ).then( (data) => {
      if(data?.payload?.success){
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product Added To Cart",
        })
      }
    })
  }


  useEffect(() => {
    // ! ByDefault Sorting Products By Price Low To High - On Each Reload - can store this in session also
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
  }, [categorySearchParam])


  // ! To Update URL Params On Filters Change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const searchParams = createSearchParamsHelper(filters);
      console.log(searchParams, "searchParams");
      setSearchParams(searchParams);
    }
  }, [filters])


  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails])


  // ! Finally Make a API Call To Fetch All Products - With Filter Parameters
  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }
  }, [dispatch, sort, filters])


  // * Work on indivual Product Dialog


  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 p-4 md:p-2">

      {/* // ! Left Side Filter Options */}
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>

            {/* // ! Dropdown Menu for Sorting */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* // ! Product Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
              <ProductTile
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
                key={productItem._id}
              />
            ))
            : null}

        </div>
      </div>

      {/* // ! Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  )
}

export default ShoppingListing