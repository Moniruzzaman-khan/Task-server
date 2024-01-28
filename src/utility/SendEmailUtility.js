var nodemailer = require('nodemailer');

const SendEmailUtility= async (EmailTo, EmailText, EmailSubject) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: "19monirkhan19@gmail.com",
            clientId: "217454359693-b16hihkibcc1q2i04gmj160qig9ia09i.apps.googleusercontent.com",
            clientSecret: "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",
            refreshToken: "1//04uqWQK-urXsgCgYIARAAGAQSNwF-L9IrezneXY5vnAkQ6feuUBEYH1VM-HoZP6LQ6UNohsWMQ9mbmdk4XjJ1OyYfbsgzqzXUyzA",
            accessToken: "ya29.a0AfB_byCaZM9m9XMBqGu8LwXsan_u2olLh8iMiUX9kI1jZai7dSFi1RwvCqaNOTotpFewc_JioMWuMfrAQOCLQ7mHntWeLzgo6I2_mIUV6j5FoXvl8ih9EFhfZMcb565C2ivz9FvP1XUKLAvRlqy06y_MsVXQoFfhukvxaCgYKAXsSARASFQHGX2Mi2K7p6xkCfScLO3tKwVBjFQ0171",
            expires: 1484314697598,
        },
    });


    let mailOptions = {
        from: 'Task Manager MERN <19monirkhan19@gmail.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    
   return  await transporter.sendMail(mailOptions)

}
module.exports=SendEmailUtility