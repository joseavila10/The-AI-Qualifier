import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { verifyCurrentSessionOrCredentials } from '@/helpers/verifyCurrentSession';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Navbar from '@/app/components/Navbar';
import CompanyIcp from './components/CompanyIcp';

const SingleCompanyContainer = (props:any) => {
    console.log(props.companyId);

    const router = useRouter();
        
        const [loading, setLoading] = useState(true);
    
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

    return (
        <>
            {
                loading 
                ? <div className="fixed inset-0 flex items-center justify-center">
                    <LoadingSpinner loadingMessage="Loading..." />
                </div>
                : <div>
                    <Navbar
                    current={'companies'}
                    />

                    <div className='m-3'>
                        <CompanyIcp
                        companyId={props.companyId}
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default SingleCompanyContainer