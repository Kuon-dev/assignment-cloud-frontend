/** @jsxImportSource react */
import { cn } from "~/integrations/libs/shadcn";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Button } from "@/components/ui/button";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PropertyListingTabProps {
  desc: string;
  children: JSX.Element;
  className: string;
}

const PropertyListingTab: React.FC<PropertyListingTabProps | any> = ({
  children,
  desc,
  className,
}) => {
  return (
    <Tabs defaultValue="description" className={cn("w-full", className)}>
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <ScrollArea className="h-64 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Description:</h3>
          <p>{desc}</p>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="reviews">
        <ScrollArea className="h-96 border rounded-lg p-4 w-full">
          {children}
        </ScrollArea>
        <div className="flex flex-col">
          <Button className="mt-2">Leave a review</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PropertyListingTab;
