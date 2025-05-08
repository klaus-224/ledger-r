import { invoke } from "@tauri-apps/api/core";
import { clsx, type ClassValue } from "clsx";
import { endOfMonth, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export const getEndOfMonth = (startDate: string) => {
  return endOfMonth(parseISO(startDate));
};

// TODO: not great usage of TS, improve in the future
export async function invokeIpc<T>(command: string, params?: any): Promise<T> {
  try {
    let response: { result: any; error: String };

    if (params) {
      response = await invoke(command, {
        params,
      });
    } else {
      response = await invoke(command);
    }

    if (response.error) {
      throw new Error(`Command error ${response.error}`);
    }

    return response.result.data;
  } catch (e) {
    console.log("Critical Error:", JSON.stringify(e));
    throw new Error(`Unknown error in command ${command}`);
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
