import type { NextApiRequest, NextApiResponse } from "next";
import { checkPassword } from "@/helpers/bcrypt_functions";
import { generateToken } from "@/helpers/jwt_functions";
import { encrypt } from "@/helpers/crypto_functions";
import { supaBaseClient } from "@/config/supabase.config";
import { isEmailValid } from "@/helpers/validations";

type Body = {
    email: string;
    password: string;
};

export const loginProcess = async(req:NextApiRequest, res:NextApiResponse) => {
  try{
    const body:Body = req.body;

    const { email, password } = body;

    if(!email) return res.status(400).json({ success: false, message: 'Email must be provided' });
    if(!password) return res.status(400).json({ success: false, message: 'Password must be provided' });

    const validEmail = isEmailValid(email);
      if(!validEmail){
          return res.status(400).json({
              success: false,
              message: 'Invalid email format',
          }); 
      }

    const usersRes = await supaBaseClient
      .from("users")
      .select('id, email, password_hash')
      .eq('email', email);

    if(!usersRes || !usersRes.data){
      return res.status(400).json({
        success: false,
        message: 'Error on users select query',
      }); 
    }

    if(usersRes.data.length !== 1){
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      }); 
    }

    const userRecord = usersRes.data[0];

    const isPasswordValid = await checkPassword(password, userRecord.password_hash);

    if(!isPasswordValid){
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      }); 
    }

    const currentTime = new Date();

    const payload = {
      id: userRecord.id,
      loginTime: currentTime,
    };

    const payloadString = JSON.stringify(payload);

    const token = generateToken({
      data: encrypt(payloadString),
      generated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: 'Login Successful',
      data: { token },
    });
  } catch(e){
    console.error(e);
    return res.status(400).json({
        success: false,
        message: 'Unexpected Error',
    });
  }
}
