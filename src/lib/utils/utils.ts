import { AppError } from "@lib/types/models";
import { invoke } from "@tauri-apps/api/core";
import { clsx, type ClassValue } from "clsx";
import { endOfMonth, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

interface Result<T> {
  result?: { data: T };
  error?: AppError;
}

export const getEndOfMonth = (startDate: string) => {
  return endOfMonth(parseISO(startDate));
};

export function checkAppError(e: any) {
  return e && typeof e === "object" && "kind" in e && "message" in e;
}

export async function invokeIpc<T>(command: string, params?: any): Promise<T> {
  try {
    let response;
    if (params) {
      response = await invoke<Result<T>>(command, {
        params,
      });
    } else {
      response = await invoke<Result<T>>(command);
    }

    // one of the AppErrors
    if (response.error) {
      console.error(`Command ${command} failed with error:`, response.error);
      throw response.error;
    }

    if (response.result && response.result.data !== undefined) {
      return response.result.data;
    }

    // we don't have an error but we also don't have a response
    console.error(
      `Command ${command} returned and unexpected response structure:`,
      response,
    );

    throw new Error(`Command ${command} return an invalid or empty response.`);
  } catch (e: any) {
    // the AppError
    if (checkAppError(e)) {
      throw e;
      // standard JS error
    } else if (e instanceof Error) {
      console.error(
        `IPC or processing Error for command ${command}:`,
        e.message,
      );
      // unknown error
    } else {
      console.error(`Unknown error during IPC call to ${command}:`, e);
      throw new Error(`An unknown error occured while calling ${command}.`);
    }
  }

  throw new Error(
    "invokeIpc failed to return or throw (this should never happen)",
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
