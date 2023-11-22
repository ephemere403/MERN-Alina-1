import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import fs from "fs";

const readHtmlContent = (filePath, replacements) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, {encoding: 'utf-8'}, (error, html) => {
            if (error) {
                reject(error);
            } else {
                const template = Handlebars.compile(html);
                const replacedHtml = template(replacements);
                resolve(replacedHtml);
            }
        });
    });
};

const transporter = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 2525,
    auth: {
        user: process.env.EMAIL_USERNAME, // в .env ввести почту и пароль на SMTP2GO
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("smtp is ready");
    }
});

export const sendEmail = async (to, subject, template_name, replacements) => {
    try {
        const filePath = new URL(`./mailTemplates/${template_name}.html`, import.meta.url);
        let htmlContent = await readHtmlContent(filePath, {subject, ...replacements});

        const mailOptions = {
            from: process.env.EMAIL_FROM, // это не юзернейм логина а адрес который будет высвечиваться на почте
            to: to,
            subject: subject,
            html: htmlContent
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)

    }
}