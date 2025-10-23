import type { NextApiRequest, NextApiResponse } from "next";

export const methodNotImplemented = (res: NextApiResponse) => {
    return res.status(405).json({
        success: false,
        message: 'Method Not Implemented',
        errorCode: 'METHOD_NOT_IMPLEMENTED',
    });
};

export const methodNotAllowed = (res: NextApiResponse) => {
    return res.status(405).json({
        success: false,
        message: 'Method Not Allowed',
        errorCode: 'METHOD_NOT_ALLOWED',
    });
};
