const nodemailer = require('nodemailer');
const env = process.env;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.EMAIL_LOGIN,
        pass: env.EMAIL_PASSWORD
    }
});



const sendMail = job => {
    const mailOptions = {
        from: env.EMAIL_LOGIN,
        to: env.TO_EMAIL,
        subject: `[React] ${job.title}`,
        html: `<div>
        <h2>${job.title}</h2>
        <p>${job.description}</p>
        <p><b>Skills:</b> ${job.skills.join(', ')}</p>
        <p><b>Paid Info:</b> ${job.paidInfo}</p>
        <p><b>Total spent:</b> ${job.spent} <b>Location:</b> ${job.location}</p>
        <p><a href='${job.link}' target='_blank'>Link to job</a></p>
        </div>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        
    });
}

module.exports = {
    sendMail
}