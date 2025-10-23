import type { NextApiRequest, NextApiResponse } from "next";

export const authVerification = async(req:NextApiRequest, res:NextApiResponse) => {
    if(!req.currentUser) throw Error('No current user found');

    return res.status(200).json({
      success: true,
      message: 'Auth successful',
      data: {
        id: req.currentUser.id,
        full_name: req.currentUser.full_name,
        email: req.currentUser.email,
      }
    });
}
