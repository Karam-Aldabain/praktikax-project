import React, { useEffect, useMemo, useState } from "react";
import ProgramPageLayout from "./components/ProgramPageLayout";
import { getProgramPage } from "./data/programPages";
import { api } from "./api";

export default function ProgramPage({ pageKey }) {
  const fallback = useMemo(() => getProgramPage(pageKey), [pageKey]);
  const [page, setPage] = useState(fallback);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getPage(fallback.path.replace("/", ""));
        const remote = res.page || {};
        const sections = parseSections(remote.sections_json);
        const questions = findSectionFields(sections, "form_questions");
        const dynamicHighlights = findSection(sections, "highlights");
        const dynamicStats = findSection(sections, "stats");
        const dynamicCarousel = findSection(sections, "carousel");
        const dynamicRichText = findSection(sections, "rich_text");
        const form = fallback.form
          ? {
              ...fallback.form,
              fields: questions.length > 0 ? mergeFields(fallback.form.fields, questions) : fallback.form.fields,
            }
          : fallback.form;
        setPage({
          ...fallback,
          slug: remote.slug || fallback.path.replace("/", ""),
          hero: {
            ...fallback.hero,
            title: remote.hero_title || fallback.hero?.title,
            subtitle: remote.hero_subtitle || fallback.hero?.subtitle,
            background: remote.hero_background || fallback.hero?.background,
          },
          highlights:
            dynamicHighlights?.is_active === false ? [] : dynamicHighlights?.items || fallback.highlights,
          stats: dynamicStats?.is_active === false ? [] : dynamicStats?.items || fallback.stats,
          carousel:
            dynamicCarousel?.is_active === false
              ? null
              : dynamicCarousel
              ? { title: dynamicCarousel.title || fallback.carousel?.title, items: dynamicCarousel.items || [] }
              : fallback.carousel,
          richText: dynamicRichText?.is_active === false ? "" : dynamicRichText?.html || "",
          meta: {
            ...fallback.meta,
            title: remote.meta_title || fallback.meta?.title,
            description: remote.meta_description || fallback.meta?.description,
            schemaType: remote.schema_type || fallback.meta?.schemaType,
          },
          sections,
          form,
        });
      } catch (err) {
        setPage(fallback);
      }
    };
    load();
  }, [fallback]);

  if (!page) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="alert alert-warning">Page not found.</div>
        </div>
      </div>
    );
  }

  return <ProgramPageLayout page={page} slug={page.slug || fallback.path.replace("/", "")} />;
}

const parseSections = (raw) => {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const findSectionFields = (sections, type) => {
  const section = sections.find((item) => item.type === type);
  if (!section || !Array.isArray(section.fields)) return [];
  return section.fields;
};

const findSection = (sections, type) => sections.find((item) => item.type === type);

const mergeFields = (baseFields = [], extraFields = []) => {
  const existing = new Set(baseFields.map((field) => field.name));
  const withNames = extraFields.map((field, index) => ({
    ...field,
    name: field.name || `custom_${index + 1}`,
  }));
  return [...baseFields, ...withNames.filter((field) => !existing.has(field.name))];
};
