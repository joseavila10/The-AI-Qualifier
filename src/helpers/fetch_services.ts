import axios from "axios";
import { httpMethods } from "@/app/constants/http_methods";
import { urlRoutes } from "@/app/constants/url_routes";

type HttpMethod = typeof httpMethods[keyof typeof httpMethods];

interface FetchParams {
  url: string;
  method: HttpMethod;
  headers?: any;
  data?: any;
}

const getAllUrls = (routes: any): string[] => {
  const urls: string[] = [];
  Object.values(routes).forEach((val) => {
    if (typeof val === "string") urls.push(val);
    else if (typeof val === "object") urls.push(...getAllUrls(val));
  });
  return urls;
};

const allUrls = getAllUrls(urlRoutes);

export const fetchService = async ({
  url,
  method,
  headers,
  data,
  
}: FetchParams): Promise<any> => {
    if (!Object.values(httpMethods).includes(method)) {
        throw new Error(`Invalid method "${method}". Must be one of: ${Object.values(httpMethods).join(', ')}`);
    }

  try {
    const axiosParams: FetchParams = {
        url,
        method,
        headers: {
            "x-platform": "web",
            ...headers,
        },
    };

    if (method !== 'GET' && data) axiosParams.data = data;

    const response = await axios(axiosParams);
    return response;
  } catch (e: any) {
    return e.response || { error: e.message };
  }
};