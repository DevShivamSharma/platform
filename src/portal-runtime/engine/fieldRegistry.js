import {
  CheckboxField,
  CurrencyField,
  DateField,
  EmailField,
  FileField,
  ImageField,
  MultiSelectField,
  NumberField,
  PasswordField,
  RadioField,
  SelectField,
  TagsField,
  TextareaField,
  TextField,
  ToggleField,
} from "../components/fields/EssentialFields";

export const fieldRegistry = {
  text: {
    label: "Text",
    component: TextField,
    defaultValue: "",
  },
  email: {
    label: "Email",
    component: EmailField,
    defaultValue: "",
  },
  password: {
    label: "Password",
    component: PasswordField,
    defaultValue: "",
  },
  textarea: {
    label: "Textarea",
    component: TextareaField,
    defaultValue: "",
  },
  number: {
    label: "Number",
    component: NumberField,
    defaultValue: "",
  },
  currency: {
    label: "Currency",
    component: CurrencyField,
    defaultValue: "",
  },
  select: {
    label: "Select",
    component: SelectField,
    defaultValue: "",
  },
  "multi-select": {
    label: "Multi-select",
    component: MultiSelectField,
    defaultValue: [],
  },
  checkbox: {
    label: "Checkbox",
    component: CheckboxField,
    defaultValue: false,
  },
  toggle: {
    label: "Toggle",
    component: ToggleField,
    defaultValue: false,
  },
  radio: {
    label: "Radio",
    component: RadioField,
    defaultValue: "",
  },
  date: {
    label: "Date",
    component: DateField,
    defaultValue: "",
  },
  file: {
    label: "File",
    component: FileField,
    defaultValue: "",
  },
  image: {
    label: "Image",
    component: ImageField,
    defaultValue: "",
  },
  tags: {
    label: "Tags",
    component: TagsField,
    defaultValue: [],
  },
};

export function getFieldDefinition(type) {
  return fieldRegistry[type] || fieldRegistry.text;
}

export const fieldTypeOptions = Object.entries(fieldRegistry).map(
  ([value, field]) => ({
    value,
    label: field.label,
  })
);
