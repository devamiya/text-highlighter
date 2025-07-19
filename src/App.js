import TextHighlighter from "./TextHighlighter";
import "./styles.css";

export default function App() {
  const colors = ["yellow", "lightgreen", "lightblue", "pink", "aqua"];
  const fonts = ["italic"];
  const toolBarStyles = {
    colors,
    fonts,
  };
  const initialText =
    "Select some text here and highlight it with a background color.";

  return (
    <div className="App">
      <TextHighlighter
        initialText={initialText}
        toolBarStyles={toolBarStyles}
      />
    </div>
  );
}
