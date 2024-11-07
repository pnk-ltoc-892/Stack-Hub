import CommonForm from '@/components/common/CommonForm.jsx'
import { loginFormControls } from '@/config/index.js'
import { useToast } from '@/hooks/use-toast.js'
import { loginUser } from '@/store/auth-slice/index.js'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const dispatch = useDispatch()
    const { toast } = useToast()

    async function onSubmitHandler(event){
        event.preventDefault()
        // const response = await dispatch(loginUser(formData))
        // console.log(response);
                
        dispatch(loginUser(formData)).then( (data) => {
            // console.log(data);
            if(data?.payload?.success){
                toast({
                    title: data?.payload?.message
                })
                // navigate('/auth/login')
            }
            else{
                toast({
                    title: data?.payload?.message,
                    variant: 'destructive'
                })
            }// Navigation ?? see it ki based on role, how it will change
        } )
    }

    return (
        <div className='mx-auto w-full max-w-md space-y-6'>
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Sign in to your account
                    </h1>
                    <p className="mt-2">
                        Don`t have an account ?
                        <Link
                            className="font-medium ml-2 text-primary hover:underline"
                            to="/auth/register"
                        >
                            SignUp
                        </Link>
                    </p>
                </div>
                <CommonForm 
                    formControls={loginFormControls}
                    buttonText={'Sign In'}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmitHandler={onSubmitHandler}
                />
        </div>
    )
}

export default Login