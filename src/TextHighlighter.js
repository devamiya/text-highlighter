import React, { useRef } from "react";
import "./styles.css";
import ToolBar from "./ToolBar";



const TextHighlighter = ({initialText, toolBarStyles}) => {

  const editorRef = useRef(null);

  const highlightSelection = (color) => {

    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const nodes = getTextNodesInRange(range);
    selection.removeAllRanges();

    nodes.forEach((node, index) => {
      const parent = node.parentNode;
      if (parent.tagName === "SPAN" && parent.parentNode === editorRef.current) {
        const textNode = document.createTextNode(parent.textContent);
        parent.replaceWith(textNode);
      }
    });

    nodes.forEach((node, index) => {
      const parentSpan = node.parentNode
      const isFirst = index === 0;
      const isLast = index === nodes.length - 1;

      const startOffset = isFirst ? range.startOffset : 0;
      const endOffset = isLast ? range.endOffset : node.textContent.length;

      const fullText = node.textContent;
      const before = fullText.slice(0, startOffset);
      const selected = fullText.slice(startOffset, endOffset);
      const after = fullText.slice(endOffset);

      const fragment = document.createDocumentFragment();

      if (before) {
        const beforeSpan = document.createElement("span");
        beforeSpan.textContent = before;
        if (parentSpan.tagName === "SPAN" && parentSpan.style.backgroundColor) {
          beforeSpan.style.backgroundColor = parentSpan.style.backgroundColor;
        }
        fragment.appendChild(beforeSpan);
      }

      const span = document.createElement("span");
      span.textContent = selected;
      span.style.backgroundColor = color;
      fragment.appendChild(span);

      if (after) {
        const afterSpan = document.createElement("span");
        afterSpan.textContent = after;
        if (parentSpan.tagName === "SPAN" && parentSpan.style.backgroundColor) {
          afterSpan.style.backgroundColor = parentSpan.style.backgroundColor;
        }
        fragment.appendChild(afterSpan);
      }
      if(parentSpan.tagName=="SPAN"){
        parentSpan.replaceWith(fragment);
      }else{
        node.replaceWith(fragment)
      }
    });
    
  };

  const getTextNodesInRange = (range) => {
    const nodes = [];
       const root = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentNode
      : range.commonAncestorContainer;

      
    const treeWalker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const nodeRange = document.createRange();
          nodeRange.selectNodeContents(node);
          return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
            range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      }
    );

    while (treeWalker.nextNode()) {
      const currentNode = treeWalker.currentNode;
      // Ensure it's under container directly or its child
      if (editorRef.current.contains(currentNode)) {
        nodes.push(currentNode);
      }
    }

    return nodes;
  };



  return (
    <div className="container">
      <h1>Color Editor</h1>

      {/* <div className="toolbar">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => highlightSelection(color)}
            className="color-btn"
          >
            {color.toUpperCase()}
          </button>
        ))}
      </div> */}
      <ToolBar toolBarStyles={toolBarStyles} handleHighlight={highlightSelection} />

      <div
        id="editor"
        ref={editorRef}
        contentEditable
        className="editor"
        suppressContentEditableWarning
      >
        <p>{initialText}</p>
      </div>
    </div>
  );
};

export default TextHighlighter;



