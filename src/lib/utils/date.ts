import dayjs from "dayjs";

export const getEndOfMonth = (startDate: string) => {
  const start = dayjs(startDate);
  const end = start.endOf("month");

  return end.format("YYYY-MM-DD");
};
