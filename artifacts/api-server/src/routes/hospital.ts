import { Router } from "express";
import { sendHospitalSignupNotification } from "../lib/email";
import { logger } from "../lib/logger";
import { db, hospitals, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "../lib/paystack";

const router = Router();

router.post("/hospitals", async (req, res) => {
  try {
    const { 
      hospitalName, 
      fullName, 
      email, 
      plan, 
      username, 
      password, 
      department, 
      licenseNumber,
      trxref 
    } = req.body;
    
    if (!hospitalName || !fullName || !email || !username || !password || !trxref) {
      return res.status(400).json({ success: false, message: "Missing required fields or payment reference" });
    }

    // 1. Verify Payment Security
    const payment = await verifyTransaction(trxref);
    if (!payment || payment.status !== "success") {
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed. Please ensure your payment was successful." 
      });
    }

    // Ensure the email matches the payment email to prevent email spoofing
    if (payment.customer.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment email mismatch. Please use the email linked to your payment." 
      });
    }

    // 1b. Final Email Uniqueness Check
    const normalizedEmail = email.toLowerCase().trim();
    const existingUserEmail = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });
    const existingHospitalEmail = await db.query.hospitals.findFirst({
      where: eq(hospitals.contactEmail, normalizedEmail),
    });

    if (existingUserEmail || existingHospitalEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "This email is already registered to a hospital account." 
      });
    }

    // 2. Check for payment reuse (Replay Attack Prevention)
    const existingPayment = await db.query.hospitals.findFirst({
      where: eq(hospitals.paymentReference, trxref),
    });

    if (existingPayment) {
      return res.status(400).json({ 
        success: false, 
        message: "This payment reference has already been used for registration." 
      });
    }

    // 3. Check for username uniqueness
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Username is already taken. Please choose another." 
      });
    }

    // 4. Create hospital and admin user in a transaction
    await db.transaction(async (tx) => {
      const [hospital] = await tx
        .insert(hospitals)
        .values({
          name: hospitalName,
          plan: plan || "starter",
          address: "TBD",
          contactEmail: email,
          licenseNumber: licenseNumber || null,
          paymentReference: trxref,
        })
        .returning();

      await tx.insert(users).values({
        hospitalId: hospital.id,
        username,
        password,
        fullName,
        email,
        department: department || "Administration",
        role: "admin",
      });
    });

    // 4. Send notification (async)
    sendHospitalSignupNotification({ hospitalName, fullName, email, plan }).catch((err) => {
      logger.error({ err }, "Failed to send notification email");
    });
    
    return res.json({ success: true, message: "Hospital and administrator account created successfully" });
  } catch (error) {
    logger.error({ error }, "Error in /hospitals endpoint");
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
