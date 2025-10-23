
import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, methodNotImplemented } from "@/helpers/http_responses";
import { authMiddleware } from "@/app/middlewares/auth_middleware";
import { UserTypesObj } from "@/app/constants/UserTypes";
import { authVerification } from "@/app/services/auth/auth";

type Data = {
    success: boolean;
    message: string;
};

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {
    authMiddleware(
        true,
        req,
        res,
        async () => {
            
            switch(req.method){
                case 'GET':
                    await authVerification(req, res);
                    break;

                case 'POST':
                    methodNotImplemented(res);
                    break;

                case 'PUT':
                    methodNotImplemented(res);
                    break;

                case 'DELETE':
                    methodNotImplemented(res);
                    break;
            
                default:
                    methodNotAllowed(res);
                    break;
            }
        }
    )
}
