import { useEffect } from "react";

const ensureMetaTag = (name) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  return tag;
};

const ensureScriptTag = (id) => {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  return script;
};

export const useDocumentMeta = ({ title, description, schema }) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      const tag = ensureMetaTag("description");
      tag.setAttribute("content", description);
    }
    if (schema) {
      const script = ensureScriptTag("praktikax-schema");
      script.textContent = JSON.stringify(schema, null, 2);
    }
  }, [title, description, schema]);
};
