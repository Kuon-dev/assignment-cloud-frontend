import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@remix-run/react";

interface CardProps extends React.ComponentProps<typeof Card> {
  amenities: string[];
}

export default function PropertyCardTags({
  amenities,
  className,
  ...props
}: CardProps) {
  const nav = useNavigate();
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardContent className="mt-5">
        <Button className="w-full" onClick={() => nav("/form")}>
          Submit Rental Application
        </Button>
        <CardTitle className="my-5 text-lg">What's the amenities</CardTitle>
        <div className="grid gap-2">
          {amenities.map((tags, index: number) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="">
                <p className="text-sm font-medium leading-none">{tags}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
