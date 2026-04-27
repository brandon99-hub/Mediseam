import nodemailer from "nodemailer";
import { logger } from "./logger";

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    logger.error("Email credentials missing in environment variables");
    throw new Error("Email configuration error");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  organisation?: string;
  type: string;
  message: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "info@mediseam.com",
    subject: `New Contact Form Submission: ${data.type} - ${data.name}`,
    text: `
      Name: ${data.name}
      Email: ${data.email}
      Organisation: ${data.organisation || "N/A"}
      Type: ${data.type}
      
      Message:
      ${data.message}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Organisation:</strong> ${data.organisation || "N/A"}</p>
      <p><strong>Type:</strong> ${data.type}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    await getTransporter().sendMail(mailOptions);
    logger.info({ email: data.email }, "Contact email sent successfully");
  } catch (error) {
    logger.error({ error, email: data.email }, "Error sending contact email");
    throw error;
  }
}

export async function sendHospitalSignupNotification(data: {
  hospitalName: string;
  fullName: string;
  email: string;
  plan?: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "info@mediseam.com",
    subject: `New Hospital Registration: ${data.hospitalName}`,
    text: `
      A new hospital has registered on MediSeam.
      
      Hospital Name: ${data.hospitalName}
      Admin Name: ${data.fullName}
      Admin Email: ${data.email}
      Selected Plan: ${data.plan || "N/A"}
    `,
    html: `
      <h2>New Hospital Registration</h2>
      <p>A new hospital has registered on MediSeam.</p>
      <ul>
        <li><strong>Hospital Name:</strong> ${data.hospitalName}</li>
        <li><strong>Admin Name:</strong> ${data.fullName}</li>
        <li><strong>Admin Email:</strong> ${data.email}</li>
        <li><strong>Selected Plan:</strong> ${data.plan || "N/A"}</li>
      </ul>
    `,
  };

  try {
    await getTransporter().sendMail(mailOptions);
    logger.info({ hospital: data.hospitalName }, "Hospital signup notification sent");
  } catch (error) {
    logger.error({ error, hospital: data.hospitalName }, "Error sending hospital signup notification");
    throw error;
  }
}
