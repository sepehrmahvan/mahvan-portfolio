export type ModalAnimation = "scale" | "slide-up" | "fade";

export const modalPaperSx = {
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 24px 64px rgba(0, 43, 71, 0.2)",
  overflow: "hidden",
  backgroundImage: "none",
};

export const modalBackdropSx = {
  backgroundColor: "rgba(0, 43, 71, 0.42)",
  backdropFilter: "blur(6px)",
};
