import ProductFilter from '@/components/shopping-view/ProductFilter.jsx'
import ProductTile from '@/components/shopping-view/ProductTile.jsx'
import { Button } from '@/components/ui/button.jsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuTrigger, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu.jsx'
import { sortOptions } from '@/config/index.js'
import { fetchAllFilteredProducts } from '@/store/shop/product-slice/index.js'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const ShoppingListing = () => {
  const { productList } = useSelector((state) => state.shopProducts);
  console.log(productList);
  
  const dispatch = useDispatch()

  const [filters, setFilters] = useState({});
  const handleFilter = () => {

  }
  const [sort, setSort] = useState(null);
  const handleSort = () => {}

  useEffect(() => {
    dispatch(fetchAllFilteredProducts())
    // console.log('fetching products', productList);
    
  }, [])
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
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
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
                // handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                // handleAddtoCart={handleAddtoCart}
              />
            ))
            : null}
            
        </div>
      </div>
      
      {/* // ! Product Details Dialog */}
      {/* <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      /> */}
    </div>
  )
}

export default ShoppingListing