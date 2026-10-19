"use client";

import type { SelectChangeEvent } from "@mui/material/Select";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import { CheckboxField, type CheckboxFieldProps } from "./checkbox";
import { AutocompleteField, type AutocompleteFieldProps } from "./autocomplete";
import {
  defaultPhoneFieldValue,
  PhoneField,
  type PhoneFieldProps,
  type PhoneFieldValue,
} from "./phone-field";
import { RadioGroupField, type RadioGroupFieldProps } from "./radio-group";
import { SelectField, type SelectFieldSingleProps } from "./select";
import { SwitchField, type SwitchFieldProps } from "./switch";
import { TextField, type TextFieldProps } from "./text-field";

type FormFieldRules<TFieldValues extends FieldValues> = Omit<
  RegisterOptions<TFieldValues, FieldPath<TFieldValues>>,
  "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
>;

export type FormTextFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: FormFieldRules<TFieldValues>;
} & Omit<
  TextFieldProps,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "error"
>;

export function FormTextField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...props
}: FormTextFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          name={name}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export type FormSelectFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: FormFieldRules<TFieldValues>;
} & Omit<
  SelectFieldSingleProps,
  "name" | "value" | "onChange" | "onBlur" | "inputRef" | "error" | "multiple"
>;

export function FormSelectField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...props
}: FormSelectFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <SelectField
          {...props}
          multiple={false}
          name={name}
          value={typeof field.value === "string" ? field.value : ""}
          onChange={(event: SelectChangeEvent<string>) => {
            field.onChange(event.target.value);
          }}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export type FormCheckboxFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: FormFieldRules<TFieldValues>;
} & Omit<
  CheckboxFieldProps,
  "name" | "checked" | "onChange" | "onBlur" | "error"
>;

export function FormCheckboxField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...props
}: FormCheckboxFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <CheckboxField
          {...props}
          name={name}
          checked={Boolean(field.value)}
          onChange={(_, checked) => field.onChange(checked)}
          onBlur={field.onBlur}
          ref={field.ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export type FormRadioGroupFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: FormFieldRules<TFieldValues>;
} & Omit<
  RadioGroupFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "error"
>;

export function FormRadioGroupField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...props
}: FormRadioGroupFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <RadioGroupField
          {...props}
          name={name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export type FormSwitchFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: FormFieldRules<TFieldValues>;
} & Omit<
  SwitchFieldProps,
  "name" | "checked" | "onChange" | "onBlur" | "error"
>;

export function FormSwitchField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...props
}: FormSwitchFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <SwitchField
          {...props}
          name={name}
          checked={Boolean(field.value)}
          onChange={(_, checked) => field.onChange(checked)}
          onBlur={field.onBlur}
          ref={field.ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export type FormAutocompleteFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: FormFieldRules<TFieldValues>;
} & Omit<
  AutocompleteFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "inputRef" | "error"
>;

export function FormAutocompleteField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  multiple = false,
  ...props
}: FormAutocompleteFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <AutocompleteField
          {...props}
          multiple={multiple}
          name={name}
          value={field.value ?? (multiple ? [] : "")}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export type FormPhoneFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: FormFieldRules<TFieldValues>;
} & Omit<
  PhoneFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "inputRef" | "error"
>;

export function FormPhoneField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  ...props
}: FormPhoneFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <PhoneField
          {...props}
          name={name}
          value={(field.value as PhoneFieldValue | undefined) ?? defaultPhoneFieldValue}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}
