'use client';

import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

type BaseProps = Omit<MuiTextFieldProps, 'name' | 'defaultValue' | 'value'>;

interface TextFieldProps<T extends FieldValues> extends BaseProps {
  name: FieldPath<T>;
  control: Control<T>;
  ltr?: boolean;
}

export function TextField<T extends FieldValues>({
  name,
  control,
  ltr = false,
  ...rest
}: TextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <MuiTextField
          {...field}
          {...rest}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? rest.helperText}
          fullWidth
          slotProps={{
            ...rest.slotProps,
            htmlInput: {
              ...((rest.slotProps as { htmlInput?: object } | undefined)
                ?.htmlInput ?? {}),
              dir: ltr ? 'ltr' : undefined,
            },
          }}
        />
      )}
    />
  );
}
