import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SuccessContent } from "@/components/SuccessContent";

export const metadata: Metadata = {
  title: "Commande Confirmée — L'GURD",
  description: "Votre essence est en route"
};

async function getOrderBySessionId(sessionId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        stripeCheckoutSessionId: sessionId
      },
      select: {
        id: true,
        totalCents: true,
        currency: true
      }
    });
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const order =
    params.session_id
      ? await getOrderBySessionId(params.session_id)
      : null;

  return <SuccessContent orderId={order?.id} sessionId={params.session_id} />;
}
