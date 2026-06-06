import { API_BASE } from "../portal-runtime/lib/dataClient";

function parseSseChunk(buffer, onEvent) {
  const events = buffer.split(/\n\n/);
  const remainder = events.pop() || "";

  for (const event of events) {
    const dataLines = event
      .split(/\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart());
    if (!dataLines.length) continue;
    onEvent(JSON.parse(dataLines.join("\n")));
  }

  return remainder;
}

export async function provisionPortal(payload, onProgress) {
  const response = await fetch(`${API_BASE}/api/portal/provision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Provisioning failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalEvent = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    buffer = parseSseChunk(buffer, (event) => {
      onProgress?.(event);
      if (event.status === "complete") {
        finalEvent = event;
      }
      if (event.status === "error") {
        throw new Error(event.error || event.message || "Provisioning failed.");
      }
    });
  }

  if (buffer.trim()) {
    parseSseChunk(`${buffer}\n\n`, (event) => {
      onProgress?.(event);
      if (event.status === "complete") finalEvent = event;
    });
  }

  if (!finalEvent?.data) {
    throw new Error("Provisioning ended without a completion event.");
  }

  return finalEvent.data;
}
