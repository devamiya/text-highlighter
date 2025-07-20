const ToolBar = ({ toolBarStyles, handleHighlight, clearHighlights }) => {
  const { colors, fonts } = toolBarStyles;
  return (
    <div className="toolbar">
      {colors?.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => handleHighlight(color)}
          className="color-btn"
        >
          {color.toUpperCase()}
        </button>
      ))}
      {/* {
                fonts.map((font)=> (
                    <button
                        key={font}
                        style={{ backgroundColor: color }}
                        onClick={() => handleStyle(font)}
                        // className="color-btn"
                    >
                        {font.toUpperCase()}
                    </button>
                ))
            } */}
      {/* <button onClick={clearHighlights} className="color-btn"> */}
      {/* CLEAR
      </button> */}
    </div>
  );
};

export default ToolBar;
