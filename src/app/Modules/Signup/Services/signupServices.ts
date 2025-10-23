import { fetchService } from "@/helpers/fetch_services";
import { httpMethods } from '@/app/constants/http_methods';
import { urlRoutes } from '@/app/constants/url_routes';
import { getCookie, setCookie, eraseCookie } from '@/helpers/cookies_handlers';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

interface signupValuesDTO {
    email: string;
    password: string;
}

interface returnDataDTO {
    success: boolean;
    message: string;
    error?: any;
}

export const handleSignupSubmit = async(
    values: signupValuesDTO
): Promise<returnDataDTO> => {
    let returnData: returnDataDTO = {
        success: false,
        message: 'Unexpected Error',
    }

    try{
        const signupRes = await fetchService({
            method: httpMethods.post,
            url: urlRoutes.auth.signup,
            data: values,
        });

        if(signupRes.data.success){
            setCookie('Bearer', signupRes.data.data.token, 0.0833333);
            Notify.success(signupRes.data.message, {
                position: 'right-top',
            });
        } else {
            Notify.failure(signupRes.data.message || 'An error has occured', {
                position: 'right-top',
            });
        }

        returnData.success = signupRes.data.success;
        returnData.message = signupRes.data.message;

        return returnData;
    } catch (e:any){
        returnData.success = false;
        returnData.error = e;

        Notify.failure(e.data.message || returnData.message, {
            position: 'right-top',
        });

        return returnData;
    }
}
