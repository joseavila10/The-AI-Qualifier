
import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, methodNotImplemented } from "@/helpers/http_responses";
import { authMiddleware } from "@/app/middlewares/auth_middleware";
import { createProspectQualification } from "@/app/services/prospectQualifications";

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
                methodNotImplemented(res);
                break;

                case 'POST':
                createProspectQualification(req, res);
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
