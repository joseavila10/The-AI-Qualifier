import nodemailer from 'nodemailer';

interface sendEmailDTO {
    email: string;
    subject: string;
    htmlMessage: string;
}

export async function sendEmail({
    email,
    subject,
    htmlMessage,
}:sendEmailDTO ) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_SENDER_PASSWORD,
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: subject,
            html: htmlMessage,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.log('Error occurred:', error);
    }
}
