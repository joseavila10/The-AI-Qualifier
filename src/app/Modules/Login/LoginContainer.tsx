import CustomForm from '@/app/components/CustomForm';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { handleLoginSubmit } from './Services/loginServices';
import { verifyCurrentSessionOrCredentials } from '@/helpers/verifyCurrentSession';

const LoginContainer = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>({});

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

  const loginSubmit = (vals: any) => {
    setInitialValues(vals);
    setLoading(true);
    
    handleLoginSubmit(vals)
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
        :
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 dark:from-blue-900 dark:via-blue-950 dark:to-black px-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-10">

                <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
                  Login
                </h1>
              </div>


              <CustomForm
                fields={[
                  {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    placeholder: 'name@example.com',
                    required: true,
                    validation: 'email',
                    initialValue: initialValues.email || null,
                  },
                  {
                    name: 'password',
                    type: 'password',
                    label: 'Password',
                    placeholder: '••••••••',
                    required: true,
                    initialValue: initialValues.password || null,
                  },
                  {
                    name: 'rememberme',
                    type: 'checkbox',
                    label: 'Keep me logged in',
                    initialValue: initialValues.rememberme || null,
                  },
                ]}
                onSubmit={loginSubmit}
                submitLabel="Login"
                cancelLabel="Cancel"
              />

              {/* Footer links */}
              <div className="mt-6 text-center text-sm text-blue-100">
                <p>
                  Don't have an account?{' '}
                  <span
                    onClick={() => router.push("/signup")}
                    className="font-semibold text-white hover:text-blue-200 transition"
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </div>
          </div>
      }
    </>
  );
};

export default LoginContainer;
