import React from "react";

const ToggleSwitch = ({ plotType, updatePlotOptions }) => {
  const switchWrapper = {
    background: "#1B2D2A",
    borderRadius: "10px",
    width: "fit-content",
    padding: "6px"
  };

  const switchSelf = {
    background: "#1B2D2A",
    color: "#DFE9D7",
    padding: "6px",
    borderRadius: "8px",
    fontWeight: "bold",
    textAlign: "center"
  };

  const selectedSwitch = {
    background: "#DFE9D7",
    color: "#1B2D2A"
  };

  return (
    <div style={switchWrapper}>
      <div
        style={plotType ? { ...switchSelf, ...selectedSwitch } : switchSelf}
        onClick={() => updatePlotOptions("plotType", 1)}
      >
        <label className="pointer" htmlFor="">
          X
        </label>
      </div>
      <div
        style={!plotType ? { ...switchSelf, ...selectedSwitch } : switchSelf}
        onClick={() => updatePlotOptions("plotType", 0)}
      >
        <label className="pointer" htmlFor="">
          O
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
