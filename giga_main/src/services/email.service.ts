import nodemailer from 'nodemailer';

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL as string || 'ubeussharexy@gmail.com'

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: superAdminEmail, 
    pass: '@#password123' 
  }
});

const sendVerifyAccountEmail = async (to: any, token: any) => {
    const mailOptions = {
        from: superAdminEmail, 
        to: to, 
        subject: 'Email Verification',
        text: `Here you go ${token} for verification`
      };
      
    transporter.sendMail(mailOptions, function(error: any, info: any ){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
};

const sendTokenToResetPassword = async (to: any, token: any) => {
    const mailOptions = {
        from: superAdminEmail,
        to: to,
        subject: 'Password Reset',
        text: `Here you go ${token} for password reset`
    };

    transporter.sendMail(mailOptions, function(error: any, info: any){
        if (error) {
            console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
};

const sendChangeKeyToken = async (to: any, token: any) => {
    const mailOptions = {
        from: superAdminEmail,
        to: to,
        subject: 'Change Key',
        text: `Here you go ${token} for change key`
    };

    transporter.sendMail(mailOptions, function(error: any, info: any){
        if (error) {
            console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
};

const sendSubAdminInvite = async (to: any, values: any) => {
    const mailOptions = {
        from: superAdminEmail,
        to: to,
        subject: 'Sub Admin Invite',
        text: `Hi ${values.name}, you have been invited to be a sub admin for ${values.companyName}. Please click on the link below to accept the invite. ${values.link}
              these are your login credentials: email: ${values.email} password: ${values.password}
              please change your password after logging in.
              Thank you.
              other details are: 
              change key: ${values.changeKey}(cannot be changed please keep it safe)
              role: ${values.role}
              work email: ${values.workEmail}
              these are the company details:
              company name: ${values.companyName}
              company address: ${values.companyAddress}
              company phone: ${values.companyPhone}
              company email: ${values.companyEmail}
              company website: ${values.companyWebsite}
              ` 
    };

    transporter.sendMail(mailOptions, function(error: any, info: any){
        if (error) {
            console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
};






// const sendOtherStuffEmail = async (to:any, token:any) => {
//     const mailOptions = {
//         from: 'your-email@gmail.com', 
//         to: 'recipient-email@example.com', 
//         subject: 'Hello from Node.js',
//         text: 'This is a test email sent from a Node.js app using Nodemailer.'
//       };

//     transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
//     });
// };

export default {
    sendVerifyAccountEmail,
    sendTokenToResetPassword,
    sendChangeKeyToken
}


