import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  title,
  helperText,
  value,
  loading,
  icon,
}: {
  title: string;
  value: string;
  helperText: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-2` flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="pt-1 text-xs text-muted-foreground">{helperText}</p>
      </CardContent>
    </Card>
  );
}

export default StatCard;
