import { filterOptions } from '@/config/index.js';
import React, { Fragment } from 'react'
import { Label } from '../ui/label.jsx';
import { Checkbox } from "../ui/checkbox.jsx";
import { Separator } from "../ui/separator.jsx";

// ! Important Component
const ProductFilter = ({ filters, handleFilter }) => {

    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {Object.keys(filterOptions).map((keyItem, index) => (
                        <div key={index} >
                            <h3 className="text-base font-bold">{keyItem}</h3>
                            <div className="grid gap-2 mt-2">
                                {filterOptions[keyItem].map((option, index) => (
                                    <Label className="flex font-medium items-center gap-2" key={index}>
                                        <Checkbox
                                            checked={
                                                filters &&
                                                Object.keys(filters).length > 0 &&
                                                filters[keyItem] &&
                                                filters[keyItem].indexOf(option.id) > -1
                                            }
                                            onCheckedChange={() => handleFilter(keyItem, option.id)}
                                        />
                                        {option.label}
                                    </Label>
                                ))}
                            </div>
                            <Separator />
                        </div>
                ))}
            </div>
        </div>
    );
}

export default ProductFilter