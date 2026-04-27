import { logger } from "./logger";

const API_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    logger.error("PAYSTACK_SECRET_KEY is not defined in environment variables");
    throw new Error("Paystack Secret Key missing");
  }
  return key;
}

export async function initializeTransaction(data: {
  email: string;
  amount: number;
  plan?: string;
  callback_url: string;
  metadata?: any;
}) {
  try {
    const response = await fetch(`${API_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100, // Paystack expects amount in kobo/cents
        currency: "KES",
        plan: data.plan,
        callback_url: data.callback_url,
        metadata: data.metadata,
      }),
    });

    const result = (await response.json()) as any;

    if (!result.status) {
      throw new Error(result.message || "Failed to initialize Paystack transaction");
    }

    return result.data;
  } catch (error) {
    logger.error({ error }, "Error initializing Paystack transaction");
    throw error;
  }
}

export async function verifyTransaction(reference: string) {
  try {
    const response = await fetch(`${API_URL}/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
    });

    const result = (await response.json()) as any;

    if (!result.status) {
      throw new Error(result.message || "Failed to verify Paystack transaction");
    }

    return result.data;
  } catch (error) {
    logger.error({ error, reference }, "Error verifying Paystack transaction");
    throw error;
  }
}
