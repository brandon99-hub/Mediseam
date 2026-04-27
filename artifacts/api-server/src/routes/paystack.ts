import { Router } from "express";
import { initializeTransaction, verifyTransaction } from "../lib/paystack";
import { logger } from "../lib/logger";

const router = Router();

// Map our internal plan IDs to Paystack Plan Codes from .env
router.post("/paystack/initialize", async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ success: false, message: "Email and Plan are required" });
    }

    const PLAN_MAPPING: Record<string, string | undefined> = {
      starter: process.env.PAYSTACK_PLAN_STARTER,
      growth: process.env.PAYSTACK_PLAN_GROWTH,
      enterprise: process.env.PAYSTACK_PLAN_ENTERPRISE,
    };

    const PLAN_AMOUNTS: Record<string, number> = {
      starter: 30000,
      growth: 70000,
      enterprise: 150000,
    };

    const planCode = PLAN_MAPPING[plan];
    const amount = PLAN_AMOUNTS[plan];

    if (!planCode || !amount) {
      logger.warn({ plan, planCode, amount }, "Invalid Plan or missing configuration");
      return res.status(400).json({ success: false, message: "Invalid Plan or missing configuration" });
    }

    // The callback URL should point back to our frontend registration step
    const callback_url = `${req.get("origin") || "http://localhost:5000"}/pricing?step=register&email=${encodeURIComponent(email)}&plan=${plan}`;

    const data = await initializeTransaction({
      email,
      amount,
      plan: planCode,
      callback_url,
      metadata: {
        plan,
        custom_fields: [
          {
            display_name: "Plan Type",
            variable_name: "plan_type",
            value: plan,
          }
        ]
      }
    });

    return res.json({ 
      success: true, 
      data: {
        ...data,
        amount: amount * 100, // This is in cents/kobo
      }
    });
  } catch (error) {
    logger.error({ error }, "Error in /paystack/initialize");
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Webhook for Paystack to notify us of payment success
router.post("/paystack/webhook", async (req, res) => {
  // Note: In production, you MUST verify the signature header (x-paystack-signature)
  // using your Secret Key to ensure the request is actually from Paystack.
  
  const event = req.body;
  
  logger.info({ event: event.event }, "Received Paystack Webhook");

  if (event.event === "subscription.create" || event.event === "charge.success") {
    const { email } = event.data.customer;
    const planId = event.data.metadata?.planId;
    
    logger.info({ email, planId }, "Payment verified via webhook");
    
    // Here you would typically mark the email as "paid" in your database
    // to allow them to complete the registration.
  }

  return res.sendStatus(200);
});

export default router;
