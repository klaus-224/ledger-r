import { invoke } from "@tauri-apps/api/core";

// TODO: not great usage of TS, improve in the future
export async function invokeIpc(
  command: string,
  params: any,
): Promise<{ error: string; result: any }> {
  try {
    const response: any = await invoke(command, {
      params,
    });
    return { ...response };
  } catch (e) {
    console.log("Critical Error");
    return { result: null, error: "critical error" };
  }
}
