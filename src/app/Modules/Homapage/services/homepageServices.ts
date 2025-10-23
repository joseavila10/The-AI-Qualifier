import { fetchService } from '@/helpers/fetch_services';
import { httpMethods } from '@/app/constants/http_methods';
import { urlRoutes } from '@/app/constants/url_routes';
import { getCookie, setCookie, eraseCookie } from '@/helpers/cookies_handlers';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { isUrlValid } from '@/helpers/validations';

interface companieValues {
    website_url: string;
}

interface returnDataDTO {
    success: boolean;
    message: string;
    error?: any;
}

export const submitWebsiteUrl = async(
    values: companieValues
): Promise<returnDataDTO> => {
    let returnData: returnDataDTO = {
        success: false,
        message: 'Unexpected Error',
    }

    const validUrl = isUrlValid(values.website_url);
    if(!validUrl){
        Notify.failure('Website URL is not valid', {
            position: 'right-top',
        });
        returnData.message = 'Invalid URL';
        return returnData
    }

    const bearer = getCookie('Bearer');
    const headers = {
        Authorization: `Bearer ${bearer}`,
    }
    const companiesRes = await fetchService({
        method: httpMethods.post,
        url: urlRoutes.auth.companies,
        headers,
        data: values,
    });

    return returnData
}