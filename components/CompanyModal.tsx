"use client";

import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useEffect } from "react";
import type { CompanyCard } from "@/components/CompaniesSection";

type CompanyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: CompanyCard | null;
};

export default function CompanyModal({ open, onOpenChange, company }: CompanyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onOpenChange]);

  if (!open || !company) return null;

  return (
    <div className="company-modal-overlay" role="dialog" aria-modal="true" aria-label={`Detalhes ${company.name}`} onClick={() => onOpenChange(false)}>
      <motion.div
        className="company-modal-card"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="company-modal-close" onClick={() => onOpenChange(false)} aria-label="Fechar modal">
          <X size={16} />
        </button>

        <div className="company-modal-header">
          <div className="company-modal-header-top">
            <div className="company-modal-step-pill">{company.step}</div>
            <span className="company-modal-badge">{company.tag}</span>
          </div>
          <h3 className="company-modal-title">{company.name}</h3>
          <p className="company-modal-headline">{company.headline}</p>
        </div>

        <div className="company-modal-content">
          <p className="company-modal-description">{company.description}</p>

          <div className="company-modal-differentials">
            <h4 className="company-modal-differentials-title">Diferenciais</h4>
            <div className="company-modal-differentials-list">
              {company.differentials.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.25 }}
                  className="company-modal-differential-item"
                >
                  <div className="company-modal-differential-dot" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <a href={company.url} target="_blank" rel="noopener noreferrer" className="company-modal-link">
            Acessar {company.urlLabel}
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
