import { Router } from "express";
import { db, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/users/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ available: false });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    return res.json({ available: !existingUser });
  } catch (error) {
    logger.error({ error }, "Error checking username");
    return res.status(500).json({ available: false });
  }
});

router.get("/users/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ available: false });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check in users table
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingUser) {
      return res.json({ available: false });
    }

    // Also check in hospitals contact_email to be thorough
    const { hospitals } = await import("@workspace/db");
    const existingHospital = await db.query.hospitals.findFirst({
      where: eq(hospitals.contactEmail, normalizedEmail),
    });

    return res.json({ available: !existingHospital });
  } catch (error) {
    logger.error({ error }, "Error checking email availability");
    return res.status(500).json({ available: false });
  }
});

export default router;
