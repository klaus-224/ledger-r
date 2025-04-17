import { invoke } from "@tauri-apps/api/core";

// TODO: not great usage of TS, improve in the future
export async function invokeIpc<T>(command: string, params: any): Promise<T> {
  try {
    const response: { result: any; error: String } = await invoke(command, {
      params,
    });

    if (response.error) {
      throw new Error(`Command error ${response.error}`);
    }

    return response.result.data;
  } catch (e) {
    console.log("Critical Error:", e);
    throw new Error(`Unknown error in command ${command}`);
  }
}
