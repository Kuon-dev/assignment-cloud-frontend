import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  control,
  label,
  error,
  disabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-1">
          <label
            className={cn(
              "block text-sm font-medium text-gray-700",
              error && "text-red-900",
            )}
          >
            {label}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
                disabled={disabled}
              >
                <CalendarDays className="w-5" />
                <span className="ml-3">
                  {field.value
                    ? format(new Date(field.value), "PPP")
                    : "Select date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date ? date.toISOString() : undefined);
                }}
              />
            </PopoverContent>
          </Popover>
          {error && (
            <p className="mt-2 text-sm text-red-800">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};
