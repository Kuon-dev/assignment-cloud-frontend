export interface ListingProps {
  id: string;
  user_id: number;
  title: string;
  coordinates: string;
  description: string;
  location: string;
  for_sale: boolean;
  room_info: string; // "bedrooms:bathrooms:car_park"
  price: string;
  status: "available" | "sold" | "rented" | "booked";
  property_type: "master room" | "single room" | "studio" | "condo" | "terrace";
  square_fit: number;
  move_in_dates: string;
  contract_duration: string;
  apartment_tags: string[];
  environment_tags: string[];
  admin_remark: string;
  draft_status: "accepted" | "rejected" | "pending" | "drafting";
  image_paths: string[];
  video_paths: string[];
  favourited: boolean; // user favourites

  // Additional fields for bedrooms, bathrooms, and car park
  bedrooms?: number;
  bathrooms?: number;
  car_park?: number;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type:
    | "number"
    | "text"
    | "checkbox"
    | "select"
    | "textarea"
    | "checkboxList"
    | "datePicker"
    | "raangedDatePicker"
    | "gallery";
  description?: string;
  placeholder?: string;
  options?: string[];
  className?: string;
  disabled?: boolean;
  group?: string; // Define groups of fields
}
