/** @jsxImportSource react */
import {
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FormFieldProps } from "../model/types";

type FieldComponentProps = {
  field: FormFieldProps;
  innerField?: any;
  form?: any;
};

export const SelectField: React.FC<FieldComponentProps> = ({
  field,
  innerField,
}) => (
  <Select
    onValueChange={innerField.onChange}
    defaultValue={innerField.value}
    disabled={field.disabled}
  >
    <FormControl>
      <SelectTrigger>
        <SelectValue placeholder={`Select a ${field.name}`} />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      {field.options?.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const TextareaField: React.FC<FieldComponentProps> = ({
  field,
  innerField,
}) => (
  <Textarea placeholder={field.placeholder} className="h-48" {...innerField} />
);

export const CheckboxField: React.FC<FieldComponentProps> = ({
  field,
  form,
}) => (
  <FormItem className="flex flex-wrap flex-row px-3">
    <div className="my-4"></div>
    {field.options?.map((item) => (
      <FormField
        key={item}
        control={form.control}
        name={field.name as any}
        render={({ field }) => (
          <FormItem
            key={item}
            className="flex flex-row items-start space-x-3 space-y-0 px-2 basis-1/2"
          >
            <FormControl>
              <Checkbox
                checked={field.value?.includes(item)}
                onCheckedChange={(checked) => {
                  return checked
                    ? field.onChange([...field.value, item])
                    : field.onChange(
                        field.value?.filter(
                          (value: string | number) => value !== item
                        )
                      );
                }}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">{item}</FormLabel>
          </FormItem>
        )}
      />
    ))}
    <FormMessage />
  </FormItem>
);

export const InputField: React.FC<FieldComponentProps> = ({
  field,
  innerField,
}) => (
  <Input type={field.type} placeholder={field.placeholder} {...innerField} />
);
