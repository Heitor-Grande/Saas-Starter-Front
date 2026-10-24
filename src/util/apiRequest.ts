type ApiMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
type ApiParams = Record<string, string | number | boolean | null | undefined>;

interface ApiRequestOptions {
  path: string;
  method: ApiMethod;
  params?: ApiParams;
  headers?: HeadersInit;
  body?: BodyInit | Record<string, unknown>;
}

if(!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_API_URL deve ser definida no arquivo .env");
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function isJsonBody(body: ApiRequestOptions["body"]): body is Record<string, unknown> {
  return body !== null && typeof body === "object" && !(body instanceof Blob) &&
    !(body instanceof FormData) && !(body instanceof URLSearchParams) && !(body instanceof ArrayBuffer);
}

/** Executa requisicoes HTTP padronizadas e devolve a resposta para tratamento na pagina. */
export async function apiRequest({
  path,
  method,
  params,
  headers,
  body
}: ApiRequestOptions): Promise<Response> {
  const url = new URL(path, apiUrl);
  const requestHeaders = new Headers(headers);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const requestBody = isJsonBody(body) ? JSON.stringify(body) : body;

  if (isJsonBody(body) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  return fetch(url, { method, headers: requestHeaders, body: requestBody });
}
