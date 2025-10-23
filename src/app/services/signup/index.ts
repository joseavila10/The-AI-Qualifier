
import type { NextApiRequest, NextApiResponse } from "next";
import { isEmailValid, isPasswordValid } from "@/helpers/validations";
import { hashPassword } from "@/helpers/bcrypt_functions";
import { supaBaseClient } from "@/config/supabase.config";

type Body = {
    full_name: string;
    email: string;
    password: string;
};

export const signupService = async(req:NextApiRequest, res:NextApiResponse) => {
    try{
        const body:Body = req.body;
        const { full_name, email, password } = body;

        if(!full_name) return res.status(400).json({ success: false, message: 'Full name must be provided' });
        if(!email) return res.status(400).json({ success: false, message: 'Email must be provided' });
        if(!password) return res.status(400).json({ success: false, message: 'Password must be provided' });

        const validEmail = isEmailValid(email);
        if(!validEmail){
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            }); 
        }

        const passValid = isPasswordValid(password);
        if(!passValid){
            return res.status(400).json({
                success: false,
                message: 'Weak password',
            }); 
        }

        const usersRes = await supaBaseClient
        .from("users")
        .select("id")
        .eq('email', email);

        if(!usersRes?.data){
            return res.status(400).json({
                success: false,
                message: 'Error on users select query',
            }); 
        }

        if(usersRes.data.length >= 1){
            return res.status(400).json({
                success: false,
                message: 'Email is already registered',
            }); 
        }

        const password_hash = await hashPassword(password);

        const newUserData = {
            full_name,
            email,
            password_hash,
        }

        const createUserRes:any = await supaBaseClient
        .from("users")
        .insert([
            newUserData
        ])
        .select(); 

        if(!createUserRes?.data){
            return res.status(400).json({
                success: false,
                message: 'Error saving user',
            }); 
        }

        const returnData = {
            id: createUserRes.data[0].id,
            full_name: createUserRes.data[0].full_name,
            email: createUserRes.data[0].email,
        }

        return res.status(201).json({
            success: true,
            message: 'Signup successfuly',
            data: returnData,
        });
    } catch(e){
        console.error(e);
        return res.status(400).json({
            success: false,
            message: 'Unexpected Error',
        });
    }

};
