export async function sendDocMessage(
  message: string,
  file: File | null,
): Promise<string> {
  const formData = new FormData();

  formData.append("message", message);

  if (file) formData.append("file", file);

  const res = await fetch("/api/v1/docs-assistant", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Request failed");

  const data = await res.json();
  return data.reply;
}
