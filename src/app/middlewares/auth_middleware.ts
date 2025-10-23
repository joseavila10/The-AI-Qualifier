import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from '@/helpers/crypto_functions';
import jwt from 'jsonwebtoken';
import { supaBaseClient } from "@/config/supabase.config";

export async function authMiddleware(
    validateRoute: boolean,
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) {
    const allowedPlatforms = [
        'web',
    ];
    
    const platformHeader = req.headers['x-platform'];
    const platform = Array.isArray(platformHeader) ? platformHeader[0] : platformHeader;

    if(!platform || !allowedPlatforms.includes(platform)){
        res.status(500).json({ error: 'Failed to verify request' }); 
    }

    req.platform = platform;

    if(validateRoute){
        if(req.headers.authorization){
            try{
                const tokenSecretKey = process.env.JWT_SECRET_KEY;
                if(tokenSecretKey === undefined) throw Error('No JWT Secret Key on env var found');

                const authHeaderValue = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
                if (!authHeaderValue || !authHeaderValue.startsWith('Bearer ')) throw Error('Invalid Authorization header');

                const bearerTokenValue = authHeaderValue.split('Bearer ')[1];

                const verifiedToken:any = jwt.verify(bearerTokenValue, tokenSecretKey);

                const dataStr = decrypt(verifiedToken.data);

                const jsonData = JSON.parse(dataStr);

                const usersRes = await supaBaseClient
                    .from("users")
                    .select('id, full_name, email, created_at')
                    .eq('id', jsonData.id);

                const user = usersRes.data?.[0];

                if (!user) {
                    throw new Error("No user found");
                }

                req.currentUser = {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    created_at: user.created_at,
                };

                next();
            } catch(error:any){
                console.error('Error in middleware:', error);
                res.status(400).json({ error: error.message }); 
            }
        } else {
            res.status(400).json({ error: 'No Authorization header found' }); 
        }
    } else {
        next();
    }

}