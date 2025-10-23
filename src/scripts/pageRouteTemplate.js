function createRouteTemplate(paramsArray) {
    const paramsDestructuringLine = paramsArray.length
        ? `const { ${paramsArray.join(', ')} } = req.query;\n`
        : '';

    const pageRouteTemplate = `
import type { NextApiRequest, NextApiResponse } from "next";
import { methodNotAllowed, methodNotImplemented } from "@/helpers/http_responses";
import { authMiddleware } from "@/app/middlewares/auth_middleware";

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
            ${paramsDestructuringLine.trimStart()}
            switch(req.method){
                case 'GET':
                methodNotImplemented(res);
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
`;
    
    return pageRouteTemplate;
}

module.exports = { createRouteTemplate };
