import { Router } from "express";
import { sendContactEmail } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, organisation, type, message } = req.body;
    
    if (!name || !email || !type || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    await sendContactEmail({ name, email, organisation, type, message });
    
    return res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    logger.error({ error }, "Error in /contact endpoint");
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
