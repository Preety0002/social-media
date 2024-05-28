const nodemailer = require("nodemailer");

const sendmail = async (res, user,url) => {
    try {

        const url = `http://localhost:3000/forget-password/${user._id}`
        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: "prityarju0002@gmail.com",
                pass: "tswnmqlancnhrorw",
            },
        });

        const mailoptions = {
            from: "<Social Media Private Limited>",
            to: user.email,
            subject: "User Reset Password",
            text: "",
            html: `<a href=${url}>Reset Password Link</a>`,
        };

        transport.sendMail(mailoptions, async (err, info) => {
            if (err) res.send(err);
            console.log(info);

            user.resetPasswordToken = 1;
            await user.save();

            res.send(
                `<h1>Check Inbox/Spam</h1>`
            );
        });
    } catch (error) {
        res.send(error);
    }
};

module.exports = sendmail;