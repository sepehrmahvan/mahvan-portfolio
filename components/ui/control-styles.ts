export const controlLabelSx = {
  margin: 0,
  gap: "8px",
  alignItems: "flex-start",
  "& .MuiFormControlLabel-label": {
    fontWeight: 600,
    color: "text.primary",
    fontSize: "0.9375rem",
    lineHeight: 1.5,
  },
};

export const checkboxSx = {
  padding: "6px",
  color: "divider",
  "&:hover": {
    backgroundColor: "rgba(0, 43, 71, 0.04)",
  },
  "&.Mui-checked": {
    color: "primary.main",
  },
  "&.Mui-disabled": {
    color: "action.disabled",
  },
};

export const radioSx = {
  padding: "6px",
  color: "divider",
  "&:hover": {
    backgroundColor: "rgba(0, 43, 71, 0.04)",
  },
  "&.Mui-checked": {
    color: "primary.main",
  },
  "&.Mui-disabled": {
    color: "action.disabled",
  },
};

export const switchSx = {
  width: 44,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: "3px",
    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "common.white",
      "& + .MuiSwitch-track": {
        backgroundColor: "primary.main",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 20,
    height: 20,
    boxShadow: "0 1px 4px rgba(0, 43, 71, 0.2)",
  },
  "& .MuiSwitch-track": {
    borderRadius: "13px",
    backgroundColor: "divider",
    opacity: 1,
  },
};

export const fieldsetLabelSx = {
  fontWeight: 700,
  color: "text.primary",
  fontSize: "0.9375rem",
  mb: 0.5,
  "&.Mui-focused": {
    color: "text.primary",
  },
  "& .MuiFormLabel-asterisk": {
    color: "#ED2E2E",
  },
};

export const starRatingSx = {
  pointerEvents: "none",
  "& .MuiRating-iconFilled": {
    color: "#F4B740",
  },
  "& .MuiRating-iconEmpty": {
    color: "divider",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

export const paginationSx = {
  "& .MuiPagination-ul": {
    gap: "6px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  "& .MuiPaginationItem-root": {
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "text.secondary",
    borderColor: "divider",
    minWidth: 36,
    height: 36,
    borderRadius: "10px",
    transition:
      "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(0, 43, 71, 0.04)",
      borderColor: "text.disabled",
      color: "text.primary",
    },
    "&.Mui-selected": {
      backgroundColor: "primary.main",
      color: "common.white",
      borderColor: "primary.main",
      "&:hover": {
        backgroundColor: "primary.dark",
      },
    },
    "&.Mui-disabled": {
      opacity: 0.45,
    },
  },
};
