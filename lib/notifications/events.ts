import { sendDiscord } from "@/lib/notifications/discord";

const sentAt = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 60 * 1000;

export async function notifyApiError(route: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const key = `${route}:${message}`;
  const now = Date.now();
  const previous = sentAt.get(key) ?? 0;

  if (now - previous < RATE_LIMIT_MS) return;
  sentAt.set(key, now);

  await sendDiscord({
    content: `mycraft API error: ${route}`,
    embeds: [
      {
        title: route,
        description: message.slice(0, 1_000),
        color: 15_442_270,
      },
    ],
  });
}
