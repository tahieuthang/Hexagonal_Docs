import axios, { type AxiosInstance } from "axios";

export class HttpClientAdapter {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async callRPC<T>(method: string, params: any): Promise<T> {
    try {
      const response = await this.client.post("/jsonrpc", {
        jsonrpc: "2.0",
        method: "call",
        params,
        id: new Date().getTime(),
      });
      if (response.data.error) {
        console.error(`[HTTP] RPC Error:`, response.data.error);
        throw new Error(response.data.error.data?.message || response.data.error.message || "Unknown RPC error");
      }

      return response.data.result;
    } catch (err) {
      console.error(`[HTTP] RPC Call failed:`, err);
      throw err;
    }
  }
}