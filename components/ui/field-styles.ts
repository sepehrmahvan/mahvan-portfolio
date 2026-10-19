/** ابعاد مشترک با MuiOutlinedInput (size=medium) */
export const outlinedInputMetrics = {
  borderRadius: "12px",
  height: {
    medium: 56,
    small: 40,
  },
  paddingX: "14px",
  fontSize: "1rem",
  lineHeight: 1.4375,
} as const;

export const outlinedFieldSx = {
  borderRadius: "4px",
  backgroundColor: "background.paper",
  "& .MuiOutlinedInput-input, & .MuiSelect-select": {
    fontWeight: 600,
    color: "text.primary",
    textAlign: "start",
    paddingInlineStart: "14px",
    paddingInlineEnd: "14px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "text.disabled",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
  },
  "& .MuiFormLabel-asterisk": {
    color: "#ED2E2E",
  },
};

/** Red required asterisk for FormControl / InputLabel wrappers */
export const requiredAsteriskSx = {
  "& .MuiFormLabel-asterisk": {
    color: "#ED2E2E",
  },
} as const;

export function getLegendCollapseSx(labelShrink: boolean) {
  if (labelShrink) {
    return {
      "& .MuiOutlinedInput-notchedOutline legend > span": {
        paddingInline: "4px",
        marginInline: 0,
      },
    };
  }

  return {
    "& .MuiOutlinedInput-notchedOutline legend": {
      maxWidth: 0,
      width: 0,
    },
    "& .MuiOutlinedInput-notchedOutline legend > span": {
      paddingInline: 0,
    },
  };
}

export const selectIconSx = {
  "& .MuiSelect-icon": {
    display: "block !important",
    right: "auto !important",
    left: "auto !important",
    insetInlineEnd: "12px !important",
    insetInlineStart: "auto !important",
  },
};

export const selectMenuPaperSx = {
  mt: 1,
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 16px 40px rgba(0, 43, 71, 0.14)",
  "& .MuiMenuItem-root": {
    borderRadius: "8px",
    mx: 0.75,
    fontWeight: 500,
    color: "text.primary",
  },
  "& .MuiMenuItem-root.Mui-selected": {
    bgcolor: "rgba(4, 72, 245, 0.08)",
    color: "text.primary",
    fontWeight: 600,
    "&:hover": {
      bgcolor: "rgba(4, 72, 245, 0.12)",
    },
  },
};

export const autocompletePaperSx = {
  ...selectMenuPaperSx,
  "& .MuiAutocomplete-listbox": {
    py: 0.5,
  },
  "& .MuiAutocomplete-option": {
    borderRadius: "8px",
    mx: 0.75,
    my: 0.25,
    fontWeight: 500,
    color: "text.primary",
    "&[aria-selected='true']": {
      bgcolor: "rgba(4, 72, 245, 0.08)",
      color: "text.primary",
      fontWeight: 600,
    },
    "&[aria-selected='true'].Mui-focused": {
      bgcolor: "rgba(4, 72, 245, 0.14)",
      color: "text.primary",
    },
  },
};

export const autocompleteChipSx = {
  fontWeight: 600,
  bgcolor: "rgba(4, 72, 245, 0.08)",
  color: "text.primary",
  "& .MuiChip-deleteIcon": {
    color: "text.secondary",
    opacity: 0.85,
    "&:hover": {
      color: "text.primary",
      opacity: 1,
    },
  },
};

export function getAutocompleteEndAdornmentSx(direction: "rtl" | "ltr") {
  const isRTL = direction === "rtl";

  return {
    "& .MuiOutlinedInput-root": {
      position: "relative",
    },
    "& .MuiAutocomplete-endAdornment": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: isRTL ? "auto !important" : "12px !important",
      left: isRTL ? "12px !important" : "auto !important",
      margin: 0,
    },
    "& .MuiAutocomplete-popupIndicator": {
      color: "text.secondary",
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "text.secondary",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-input": {
      paddingRight: isRTL ? "14px !important" : "40px !important",
      paddingLeft: isRTL ? "40px !important" : "14px !important",
    },
  };
}
