import { ExpenseDateFilter } from "@lib/types/models";
import { invoke } from "@tauri-apps/api/core";

type InputData = ExpenseDateFilter;

export const callTauri = async (command: string, data?: InputData) => {
};
