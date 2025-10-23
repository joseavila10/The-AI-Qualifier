import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import CustomForm from '@/app/components/CustomForm';
import { fetchService } from '@/helpers/fetch_services';
import { httpMethods } from '@/app/constants/http_methods';
import { urlRoutes } from '@/app/constants/url_routes';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getCookie, setCookie } from '@/helpers/cookies_handlers';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { verifyCurrentSessionOrCredentials } from '@/helpers/verifyCurrentSession';
import { handleSignupSubmit } from './Services/signupServices';

const SignupContainer = () => {
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: '',
    });

    useEffect(() => {
        setLoading(true);

        verifyCurrentSessionOrCredentials()
        .then(loggedIn => {
            if(loggedIn){
                router.push("/");
            } else {
                setLoading(false);
            }
        })
        .catch(e => {
            setLoading(false);
            console.log(e);
        })
    },[]);

    const signupSubmit = (vals: any) => {
        setInitialValues(vals);
        if(vals.password !== vals.confirmPassword){
            Notify.failure(`Passwords don't match`, {
                position: 'right-top',
            });
            return;
        }

        const data = {
            full_name: vals.full_name,
            email: vals.email,
            password: vals.password,
            language: 'eng',
        }

        setLoading(true);
        handleSignupSubmit(data)
        .then(res => {
            if(res.success){
                router.push("/");
            } else {
                setLoading(false);
            }
        })
        .catch(e => {
            setLoading(false);
        })
    };

    return (
        <>
        {loading
            ? <div className="fixed inset-0 flex items-center justify-center">
                <LoadingSpinner loadingMessage="Loading..." />
                </div>
            : <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 dark:from-blue-900 dark:via-blue-950 dark:to-black px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">

                        <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
                            Create your AI Qualifier account
                        </h1>
                    </div>

                    <CustomForm
                    fields={[
                        {
                            name: 'full_name',
                            type: 'text',
                            label: 'Email',
                            placeholder: 'Jhon Smith',
                            required: true,
                            initialValue: initialValues.full_name,
                        },
                        {
                            name: 'email',
                            type: 'email',
                            validation: 'email',
                            label: 'Email',
                            placeholder: 'name@example.com',
                            required: true,
                            initialValue: initialValues.email,
                        },
                        {
                            name: 'password',
                            type: 'password',
                            validation: 'password',
                            label: 'Password',
                            placeholder: '••••••••',
                            required: true,
                            initialValue: initialValues.password,
                        },
                        {
                            name: 'confirmPassword',
                            type: 'password',
                            validation: 'password',
                            label: 'Confirm Password',
                            placeholder: '••••••••',
                            required: true,
                            initialValue: initialValues.confirmPassword,
                        },
                        {
                            name: 'acceptTerms',
                            type: 'checkbox',
                            label: 'I agree to the The AI Qualifier terms & conditions',
                            required: true,
                            initialValue: initialValues.acceptTerms,
                        },
                    ]}
                    onSubmit={signupSubmit}
                    disableSubmitBtn={loading}
                    submitLabel="Sign Up"
                    cancelLabel="Cancel"
                    />

                    <div className="mt-6 text-center text-sm text-blue-100">
                    <p>
                        Already have an account?{' '}
                        <span
                        onClick={() => {router.push("/login")}}
                        className="font-semibold text-white hover:text-blue-200 transition"
                        >
                        Login
                        </span>
                    </p>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default SignupContainer;
