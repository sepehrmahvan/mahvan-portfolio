"use client";

import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef, type ReactElement, type Ref } from "react";
import type { ModalAnimation } from "./modal-styles";

export const modalTransitionDuration = {
  enter: 380,
  exit: 260,
} as const;

const ModalSlideTransition = forwardRef(function ModalSlideTransition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return (
    <Slide
      ref={ref}
      {...props}
      direction="up"
      timeout={modalTransitionDuration}
      easing={{
        enter: "cubic-bezier(0.22, 1, 0.36, 1)",
        exit: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {props.children}
    </Slide>
  );
});

const ModalFadeTransition = forwardRef(function ModalFadeTransition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return (
    <Fade
      ref={ref}
      {...props}
      timeout={modalTransitionDuration}
      easing={{
        enter: "cubic-bezier(0.4, 0, 0.2, 1)",
        exit: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {props.children}
    </Fade>
  );
});

const ModalScaleTransition = forwardRef(function ModalScaleTransition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return (
    <Grow
      ref={ref}
      {...props}
      timeout={modalTransitionDuration}
      easing={{
        enter: "cubic-bezier(0.34, 1.25, 0.64, 1)",
        exit: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      style={{ transformOrigin: "center center" }}
    >
      {props.children}
    </Grow>
  );
});

ModalSlideTransition.displayName = "ModalSlideTransition";
ModalFadeTransition.displayName = "ModalFadeTransition";
ModalScaleTransition.displayName = "ModalScaleTransition";

export const modalTransitionMap = {
  scale: ModalScaleTransition,
  "slide-up": ModalSlideTransition,
  fade: ModalFadeTransition,
} as const;

export function getModalTransition(animation: ModalAnimation) {
  return modalTransitionMap[animation];
}
