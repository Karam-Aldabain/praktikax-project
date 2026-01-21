import React, { useEffect, useRef } from "react";

export default function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  const exec = (command) => {
    document.execCommand(command, false, null);
    handleInput();
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar">
        <button type="button" onClick={() => exec("bold")}>
          Bold
        </button>
        <button type="button" onClick={() => exec("italic")}>
          Italic
        </button>
        <button type="button" onClick={() => exec("insertUnorderedList")}>
          Bullets
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")}>
          Numbered
        </button>
      </div>
      <div
        className="rich-editor__area"
        ref={ref}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </div>
  );
}
