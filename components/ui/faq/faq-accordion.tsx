"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

export type FaqAccordionItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqAccordionProps = {
  items: FaqAccordionItem[];
  defaultExpandedId?: string;
  className?: string;
};

export function FaqAccordion({
  items,
  defaultExpandedId,
  className = "",
}: FaqAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | false>(
    defaultExpandedId ?? false,
  );

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`.trim()}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <Accordion
            key={item.id}
            disableGutters
            elevation={0}
            expanded={isExpanded}
            onChange={(_event, expanded) => {
              setExpandedId(expanded ? item.id : false);
            }}
            sx={{
              borderRadius: "1rem !important",
              border: "1px solid",
              borderColor: isExpanded
                ? "rgba(4, 72, 245, 0.35)"
                : "rgba(0, 43, 71, 0.12)",
              backgroundColor: isExpanded
                ? "rgba(4, 72, 245, 0.04)"
                : "common.white",
              color: "text.primary",
              boxShadow: "none",
              overflow: "hidden",
              transition: "background-color 200ms ease, border-color 200ms ease",
              "&::before": { display: "none" },
              "&.Mui-expanded": {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <HiChevronDown
                  aria-hidden
                  className={`size-5 ${isExpanded ? "text-primary-main" : "text-platform-gray"}`}
                />
              }
              aria-controls={`faq-panel-${item.id}-content`}
              id={`faq-panel-${item.id}-header`}
              sx={{
                minHeight: 64,
                px: { xs: 2, sm: 2.5 },
                py: 0.5,
                "& .MuiAccordionSummary-content": {
                  my: 1.5,
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  color: "inherit",
                },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.6,
                  color: "inherit",
                }}
              >
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: { xs: 2, sm: 2.5 },
                pt: 0,
                pb: { xs: 2, sm: 2.5 },
                borderTop: "1px solid",
                borderColor: isExpanded
                  ? "rgba(4, 72, 245, 0.12)"
                  : "transparent",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.85,
                  color: "text.secondary",
                }}
              >
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
