import { Card, CardContent, CardHeader } from "@components/ui/card";

interface Props {
  month: string;
  totalExpenses: number;
  onClick: () => void;
}

const SummaryCard = ({ month, totalExpenses, onClick }: Props) => {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:border-primary">
      <CardHeader className="text-md font-medium mb-2 text-muted-foreground">
        {month}
      </CardHeader>
      <CardContent className="text-lg text-foreground ">
        $ {totalExpenses}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
