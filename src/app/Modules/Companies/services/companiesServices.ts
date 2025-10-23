import { fetchService } from '@/helpers/fetch_services';
import { httpMethods } from '@/app/constants/http_methods';
import { urlRoutes } from '@/app/constants/url_routes';
import { getCookie, setCookie, eraseCookie } from '@/helpers/cookies_handlers';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { isUrlValid } from '@/helpers/validations';

interface returnDataDTO {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

export const getUserCompanies = async(): Promise<returnDataDTO> => {
    const bearer = getCookie('Bearer');
    const headers = {
        Authorization: `Bearer ${bearer}`,
    }
    const companiesRes = await fetchService({
        method: httpMethods.get,
        url: urlRoutes.auth.companies,
        headers,
    });

    if(!companiesRes.data){
        Notify.failure(companiesRes.error || 'Unexpected Error', {
            position: 'right-top',
        });
    }

    return companiesRes.data
}

export const getSingleCompany = async(companyId:string): Promise<returnDataDTO> => {
    const bearer = getCookie('Bearer');
    const headers = {
        Authorization: `Bearer ${bearer}`,
    }
    const companyRes = await fetchService({
        method: httpMethods.get,
        url: urlRoutes.company(companyId),
        headers,
    });

    if(!companyRes.data){
        Notify.failure(companyRes.error || 'Unexpected Error', {
            position: 'right-top',
        });
    }

    return companyRes.data
}

export const getProspectsQualifications = async(companyId:string): Promise<returnDataDTO> => {
    const bearer = getCookie('Bearer');
    const headers = {
        Authorization: `Bearer ${bearer}`,
    }
    const prospectQualificationsRes = await fetchService({
        method: httpMethods.get,
        url: urlRoutes.allProspectQualifications(companyId),
        headers,
    });

    if(!prospectQualificationsRes.data){
        Notify.failure(prospectQualificationsRes.error || 'Unexpected Error', {
            position: 'right-top',
        });
    }

    return prospectQualificationsRes.data
}

export const generateProspectQualification = async(
    url: string, 
    company_id: string
): Promise<any> => {
  const bearer = getCookie('Bearer');
  const headers = { Authorization: `Bearer ${bearer}` };
  
  if (!isUrlValid(url)) {
    Notify.failure('Please, type only valid URLs', { position: 'right-top' });
    return null;
  }

  const data = { url, company_id };

  const newProspectFetch = await fetchService({
    method: httpMethods.post,
    url: urlRoutes.prospectQualifications,
    headers,
    data,
  });

  if (!newProspectFetch.data.success) {
    Notify.failure(newProspectFetch.data.message || 'Unexpected Error', {
      position: 'right-top',
    });
    return null;
  }

  return newProspectFetch.data.data; // the newly created prospect
};