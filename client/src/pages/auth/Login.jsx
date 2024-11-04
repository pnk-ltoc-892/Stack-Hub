import CommonForm from '@/components/common/CommonForm.jsx'
import { loginFormControls } from '@/config/index.js'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    function onSubmitHandler(){

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