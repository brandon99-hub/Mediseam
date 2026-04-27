import { Router } from "express";
import { sendHospitalSignupNotification } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

router.post("/hospitals", async (req, res) => {
  try {
    const { hospitalName, fullName, email, plan } = req.body;
    
    if (!hospitalName || !fullName || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Note: Database logic will be handled later by the user.
    // For now, we just send the notification.
    await sendHospitalSignupNotification({ hospitalName, fullName, email, plan });
    
    return res.json({ success: true, message: "Hospital registered and notification sent" });
  } catch (error) {
    logger.error({ error }, "Error in /hospitals endpoint");
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
