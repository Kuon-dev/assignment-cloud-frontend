import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { accordionData, searchFilter } from "../model/constants";
import { ChevronsUpDown, Check } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "~/integrations/libs/shadcn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RangedSlider } from "@/components/ui/slider";
// import { $searchPrice, setSearchPrice } from "../model/store";
// import { useStore } from "@nanostores/react";

export const SearchFilterComponent: React.FC = () => {
  return (
    <div className="flex w-full">
      <DesktopFilter />
    </div>
  );
};

const DesktopFilter: React.FC = () => {
  return (
    <div className="w-full min-w-[320px] border-border rounded-lg border p-4 flex flex-col space-y-4 overflow-scroll max-h-[330px] xl:max-h-full">
      <Label>Search</Label>
      <Input />
      <Accordion type="multiple" className="block w-full flex-grow space-y-4">
        {accordionData.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className="border-0 pb-0"
          >
            <AccordionTrigger className="flex flex-grow w-full bg-zinc-50 px-2 rounded-lg">
              {item.display}
            </AccordionTrigger>
            <AccordionContent className="mt-4">{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button>Search</Button>
    </div>
  );
};

interface SearchFilterItem {
  key: string;
  label: string;
}

export function PropertyTypeSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? searchFilter.find((item) => item.key === value)?.label
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" side="bottom">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-64">
              {searchFilter.map((item: SearchFilterItem) => (
                <CommandItem
                  key={item.key}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.key ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SliderItem({ ...props }) {
  const [sliderValue, setSliderValue] = useState<number[]>([500, 5000]);
  return (
    <div className="flex flex-col">
      <Label>{sliderValue[0]}</Label>
      <RangedSlider
        defaultValue={sliderValue}
        max={100000}
        min={0}
        step={1}
        className={cn("")}
        {...props}
        onValueChange={(e) => setSliderValue(e)}
      />
      <Label>{sliderValue[1]}</Label>
    </div>
  );
}

export function SliderPrice({ ...props }) {
  // const [sliderValue, setSliderValue] = useState<number[]>([500, 50000]);
  const price = useStore($searchPrice);

  return (
    <div className="flex flex-col">
      <Label>{price[0]}</Label>
      <RangedSlider
        defaultValue={price}
        max={100000}
        min={0}
        step={1}
        className={cn("")}
        {...props}
        onValueChange={(e) => setSearchPrice(e)}
      />
      <Label>{price[1]}</Label>
    </div>
  );
}

export default SearchFilterComponent;
