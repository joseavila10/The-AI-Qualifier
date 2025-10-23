
import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, methodNotImplemented } from "@/helpers/http_responses";
import { authMiddleware } from "@/app/middlewares/auth_middleware";
import { signupService } from "@/app/services/signup";

type Data = {
    success: boolean;
    message: string;
};

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {
    authMiddleware(
        false,
        req,
        res,
        async () => {
            
            switch(req.method){
                case 'GET':
                methodNotImplemented(res);
                break;

                case 'POST':
                signupService(req, res);
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
