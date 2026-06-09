// Robust JSON fetch for API calls with esoteric error messages
export async function safeFetchJSON(url: string, options: RequestInit, fallbackError: string): Promise<any> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (networkErr) {
    throw new Error("La senda astral de internet está bloqueada. Verifica tu conexión.");
  }

  let text = "";
  try {
    text = await response.text();
  } catch (readErr) {
    throw new Error(`Error del servidor (${response.status}): Las musas oscurecieron los pergaminos.`);
  }

  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch (parseErr) {
    if (!response.ok) {
      throw new Error(`El Oráculo está en silencio (${response.status}). Intenta más tarde.`);
    }
    throw new Error(fallbackError);
  }

  if (!response.ok) {
    throw new Error(data.error || fallbackError);
  }

  return data;
}
