import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.client_reference_id || session.metadata?.userId;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("No user ID found in checkout session");
    return;
  }

  try {
    // サブスクリプション情報を取得
    const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);

    // Response型からデータを取得
    const subscriptionData = 'data' in subscriptionResponse
      ? subscriptionResponse.data
      : subscriptionResponse;

    await db
      .update(members)
      .set({
        paymentStatus: "completed",
        stripeSubscriptionId: subscriptionId,
        subscriptionStartDate: new Date((subscriptionData as any).current_period_start * 1000),
        subscriptionEndDate: new Date((subscriptionData as any).current_period_end * 1000),
      })
      .where(eq(members.userId, userId));

    console.log(`Payment completed for user: ${userId}`);
  } catch (error) {
    console.error("Error updating member after checkout:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  try {
    await db
      .update(members)
      .set({
        paymentStatus: "canceled",
        subscriptionEndDate: new Date(),
      })
      .where(eq(members.stripeSubscriptionId, subscriptionId));

    console.log(`Subscription canceled: ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
    throw error;
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // invoiceからsubscription IDを取得（文字列またはオブジェクトの可能性がある）
  const subscriptionId = typeof (invoice as any).subscription === 'string'
    ? (invoice as any).subscription
    : (invoice as any).subscription?.id;

  if (!subscriptionId) {
    console.error("No subscription ID found in failed invoice");
    return;
  }

  try {
    await db
      .update(members)
      .set({
        paymentStatus: "failed",
      })
      .where(eq(members.stripeSubscriptionId, subscriptionId));

    console.log(`Payment failed for subscription: ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}
