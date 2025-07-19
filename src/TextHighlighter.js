import React, { useState, useRef } from "react";
import ToolBar from "./ToolBar";

const TextHighlighter = ({ initialText, toolBarStyles }) => {
  const [chunks, setChunks] = useState([{ text: initialText, color: null }]);
  const [selection, setSelection] = useState({ start: null, end: null });
  const editorRef = useRef(null);

  //used for the clearing complete styles
  const getPlainText = () => chunks.map((c) => c.text).join("");

  // on mouse up selects the specified txt range from full text
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editorRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;

    setSelection({ start, end });
  };

  // Highlight the specified chunk of text in each splitted chunk and merge if needed
  const handleHighlight = (color) => {
    if (
      selection.start === null ||
      selection.end === null ||
      selection.start === selection.end
    )
      return;

    const start = selection.start;
    const end = selection.end;

    let currentOffset = 0;
    const newChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkText = chunk.text;
      const chunkLength = chunkText.length;

      const chunkStart = currentOffset;
      const chunkEnd = currentOffset + chunkLength;

      if (end <= chunkStart || start >= chunkEnd) {
        newChunks.push({ ...chunk });
      } else {
        const selStartInChunk = Math.max(start - chunkStart, 0);
        const selEndInChunk = Math.min(end - chunkStart, chunkLength);

        const before = chunkText.slice(0, selStartInChunk);
        const selected = chunkText.slice(selStartInChunk, selEndInChunk);
        const after = chunkText.slice(selEndInChunk);

        if (before) newChunks.push({ text: before, color: chunk.color });
        if (selected) newChunks.push({ text: selected, color });
        if (after) newChunks.push({ text: after, color: chunk.color });
      }

      currentOffset += chunkLength;
    }

    setChunks(mergeAdjacentChunks(newChunks));
    setSelection({ start: null, end: null });
  };

  //merges if any Adjacent same color chunks to single one
  const mergeAdjacentChunks = (chunks) => {
    const merged = [];
    for (const chunk of chunks) {
      if (
        merged.length > 0 &&
        merged[merged.length - 1].color === chunk.color
      ) {
        merged[merged.length - 1].text += chunk.text;
      } else {
        merged.push({ ...chunk });
      }
    }
    return merged;
  };

  // clears all the text highlight and set to the initial state
  const clearHighlights = () => {
    const plainText = getPlainText();
    setChunks([{ text: plainText, color: null }]);
  };

  return (
    <div className="container">
      <h1>Color Editor</h1>

      <ToolBar
        toolBarStyles={toolBarStyles}
        handleHighlight={handleHighlight}
        clearHighlights={clearHighlights}
      />

      <div
        id="editor"
        ref={editorRef}
        contentEditable={true}
        className="editor"
        onMouseUp={handleMouseUp}
      >
        {chunks.map((chunk, i) => (
          <span
            key={i}
            style={{ backgroundColor: chunk.color || "transparent" }}
          >
            {chunk.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextHighlighter;
