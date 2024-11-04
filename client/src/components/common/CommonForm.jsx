import React from 'react'
import { Label } from '../ui/label.jsx'
import { Input } from '../ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Button } from '../ui/button.jsx';

const CommonForm = ({formControls, formData, setFormData, onSubmitHandler, buttonText}) => {
    
    function renderInputsByComponentType(controllerItem){
        let element = null

        const value = formData[controllerItem.name] || ''

        switch (controllerItem.componentType) {
            case 'input':
                element =   <Input 
                                name={controllerItem.name}
                                placeholder={controllerItem.placeholder}
                                id={controllerItem.name}
                                type={controllerItem.type}
                                value={value}
                                onChange={event => setFormData({
                                    ...formData,
                                    [controllerItem.name]: event.target.value
                                })}
                            />
                break;
            
            case 'select':
                element =   <Select value={value}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        [controllerItem.name]: value
                                    })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={controllerItem.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        controllerItem.options && 
                                        controllerItem.options.length > 0
                                        ? controllerItem.options.map( optionItem => (<SelectItem key={optionItem.id} 
                                                    value={optionItem.id}
                                        >
                                            {optionItem.label}
                                        </SelectItem>))
                                        : null
                                    }
                                </SelectContent>
                            </Select>
                break;
            case 'textarea':
                element =   <Textarea 
                                name={controllerItem.name}
                                placeholder={controllerItem.placeholder}
                                id={controllerItem.name}
                                value={value}
                                
                                onChange={event => setFormData({
                                    ...formData,
                                    [controllerItem.name]: event.target.value
                                })}
                            />
                break;
        
            default:
                element =   <Input 
                                name={controllerItem.name}
                                placeholder={controllerItem.placeholder}
                                id={controllerItem.name}
                                type={controllerItem.type}
                                value={value}
                                onChange={event => setFormData({
                                    ...formData,
                                    [controllerItem.name]: event.target.value
                                })}
                            />
                break;
        }
        return element        
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <div className='flex flex-col gap-3'>
                {
                    formControls.map( (controllerItem) => (
                        <div key={controllerItem.name} 
                            className='grid w-full gap-1.5'
                        >
                            <Label className="mb-1">{controllerItem.label}</Label>
                            {
                                renderInputsByComponentType(controllerItem)
                            }
                        </div>
                    ) )
                }
            </div>
            <Button type='submit' className='mt-2 w-full'>{buttonText || 'Submit'}</Button>
        </form>
    )
}

export default CommonForm