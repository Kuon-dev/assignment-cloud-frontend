import { cn } from "~/integrations/libs/shadcn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";

interface CardProps extends React.ComponentProps<typeof Card> {
  envTags: string[];
  aprtTags?: string[];
}

export function PropertyCardTags({
  envTags,
  aprtTags,
  className,
  ...props
}: CardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardContent className="mt-5">
        <Button className="w-full" onClick={() => console.log("test")}>
          Book a viewing
        </Button>
        <CardTitle className="my-5 text-lg">What's in the area</CardTitle>
        <div className="grid gap-2">
          {envTags.map((tags, index: number) => (
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
        {aprtTags && (
          <CardTitle className="my-5 text-lg">
            What's in the apartment?
          </CardTitle>
        )}
        <div className="grid gap-2">
          {aprtTags &&
            aprtTags.map((tags, index: number) => (
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
