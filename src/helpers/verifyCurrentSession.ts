import { fetchService } from '@/helpers/fetch_services';
import { httpMethods } from '@/app/constants/http_methods';
import { urlRoutes } from '@/app/constants/url_routes';
import { getCookie, setCookie, eraseCookie } from '@/helpers/cookies_handlers';

export const verifyCurrentSessionOrCredentials = async(): Promise<boolean> => {
    const currentBearer = getCookie('Bearer');

    if(!currentBearer) return false;
    
    const authRes = await fetchService({
        method: httpMethods.get,
        url: urlRoutes.auth.auth,
        headers: { authorization: `Bearer ${currentBearer}`},
    });

    if(authRes.data && authRes.data.success && authRes.data.data.id){
        return true;
    } else {
        eraseCookie('Bearer')
        return false;
    }
}
