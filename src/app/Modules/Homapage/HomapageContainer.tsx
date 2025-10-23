import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { verifyCurrentSessionOrCredentials } from '@/helpers/verifyCurrentSession';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Navbar from '@/app/components/Navbar';
import CustomForm from '@/app/components/CustomForm';
import { submitWebsiteUrl } from './services/homepageServices';

const HomapageContainer = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>({});

    useEffect(() => {
        verifyCurrentSessionOrCredentials()
        .then(loggedIn => {
            if(loggedIn){
                setLoading(false);
            } else {
                router.push("/login");
            }
        })
        .catch(e => {
            setLoading(false);
            console.log(e);
        })
    },[]);

    const analyzeUrl = (vals:any) => {
        submitWebsiteUrl(vals);
    }
    
    return (
        <>
            {
                loading 
                ? <div className="fixed inset-0 flex items-center justify-center">
                    <LoadingSpinner loadingMessage="Loading..." />
                </div>
                : <div>
                    <Navbar
                    current={'home'}
                    />

                    <div className='my-3'>
                        <CustomForm
                        fields={[
                        {
                            name: 'website_url',
                            type: 'email',
                            label: 'Website URL',
                            placeholder: 'https://www.business_url.com',
                            required: true,
                            initialValue: initialValues.website_url || null,
                        },
                        ]}
                        onSubmit={analyzeUrl}
                        submitLabel="Login"
                        cancelLabel="Cancel"
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default HomapageContainer