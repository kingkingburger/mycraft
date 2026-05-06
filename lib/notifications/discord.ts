type DiscordPayload = {
  content?: string;
  embeds?: Array<Record<string, unknown>>;
};

export async function sendDiscord(payload: DiscordPayload) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("discord webhook failed", error);
  }
}
