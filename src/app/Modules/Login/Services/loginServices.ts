import { fetchService } from '@/helpers/fetch_services';
import { httpMethods } from '@/app/constants/http_methods';
import { urlRoutes } from '@/app/constants/url_routes';
import { getCookie, setCookie, eraseCookie } from '@/helpers/cookies_handlers';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

interface submitLoginValues {
    email: string;
    password: string;
    rememberme: null | boolean;
}

interface returnDataDTO {
    success: boolean;
    message: string;
    error?: any;
}

export const handleLoginSubmit = async(
    values: submitLoginValues
): Promise<returnDataDTO> => {
    let returnData: returnDataDTO = {
        success: false,
        message: 'Unexpected Error',
    }

    try{
        const loginRes = await fetchService({
            method: httpMethods.post,
            url: urlRoutes.auth.login,
            data: values,
        });

        if(loginRes.data.success){
            setCookie('Bearer', loginRes.data.data.token, 0.0833333);
            Notify.success(loginRes.data.message, {
                position: 'right-top',
            });
        } else {
            Notify.failure(loginRes.data.message || 'An error has occured', {
                position: 'right-top',
            });
        }

        returnData.success = loginRes.data.success;
        returnData.message = loginRes.data.message;

        return returnData;
    } catch(e:any){
        returnData.success = false;
        returnData.error = e;

        Notify.failure(e.data.message || returnData.message, {
            position: 'right-top',
        });

        return returnData;
    }
}
