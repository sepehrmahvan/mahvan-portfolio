"use client";

import Image from "next/image";
import Link from "next/link";
import { ContentContainer } from "@/components/layouts/content-container";
import {
  FaqAccordion,
  type FaqAccordionItem,
} from "./faq-accordion";

export type FaqSectionProps = {
  id?: string;
  ariaLabel: string;
  title: string;
  subtitle?: string;
  viewAllLabel: string;
  viewAllHref?: string;
  items: FaqAccordionItem[];
  defaultExpandedId?: string;
  className?: string;
};

export function FaqSection({
  id,
  ariaLabel,
  title,
  subtitle,
  viewAllLabel,
  viewAllHref = "/faq",
  items,
  defaultExpandedId,
  className = "",
}: FaqSectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`bg-platform-white py-14 sm:py-20 ${className}`.trim()}
    >
      <ContentContainer>
        <div data-reveal>
          <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-8 text-center sm:px-6 sm:py-10">
            <Image
              src="/assets/images/lighter-vector.png"
              alt=""
              fill
              className="pointer-events-none object-contain opacity-[0.16] invert"
              sizes="(max-width: 768px) 100vw, 48rem"
              aria-hidden
            />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-platform-black sm:text-3xl md:text-4xl">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-4 text-sm leading-7 text-platform-gray sm:text-base sm:leading-8">
                  {subtitle}
                </p>
              ) : null}
              <Link
                href={viewAllHref}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-main px-6 py-2.5 text-sm font-semibold text-platform-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/50"
              >
                {viewAllLabel}
              </Link>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-10 w-full sm:mt-12">
          <FaqAccordion items={items} defaultExpandedId={defaultExpandedId} />
        </div>
      </ContentContainer>
    </section>
  );
}
