import React from 'react';
import { useRouter } from 'next/router';
import SingleCompanyContainer from '@/app/Modules/Companies/singleCompanyContainer';

const SingleCompany = () => {
    const router = useRouter();
    const { companyId } = router.query; 

  return (
    <SingleCompanyContainer
    companyId={companyId}
    />
  )
}

export default SingleCompany;