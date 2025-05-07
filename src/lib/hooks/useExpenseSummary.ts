import { MonthSummary } from "@lib/types/models";
import { invokeIpc } from "@lib/utils/utils";
import { useEffect, useState } from "react";

// TODO: add loading and Error States
export const useExpenseSummary = () => {
  const [summary, setSummary] = useState<MonthSummary[]>([]);

  useEffect(() => {
    const getExpenseSummary = async () => {
      try {
        const monthSummary = await invokeIpc<MonthSummary[]>(
          "get_expense_summary",
        );
        setSummary(monthSummary);
      } catch (e: any) {
        console.log(e);
      }
    };

    getExpenseSummary();
  }, []);

  return {
    summary,
  };
};
