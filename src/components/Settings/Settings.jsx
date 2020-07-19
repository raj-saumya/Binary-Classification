import React from "react";
import { Dropdown } from "primereact/dropdown";
import Logistic from "./Logistic";
import anime from "animejs";

const animateCloseIcon = () => {
  anime({
    targets: ".close",
    rotate: [0, -90],
    duration: 800,
    easing: "linear",
    complete: () => {
      anime.remove(".close");
    }
  });
};

const Settings = props => {
  const modelTypes = ["Dummy", "Logistic"];

  const renderSettings = modelType => {
    switch (modelType) {
      case "K-Nearest":
        return "";
      case "Dummy":
        return "";
      case "Logistic":
        return <Logistic {...props}></Logistic>;
      case "ABC":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="slide-panel">
      <div>
        <div className="left">
          <h3 htmlFor="">Model Settings</h3>
        </div>
        <div
          className="right pointer"
          onClick={() => {
            animateCloseIcon();
            props.toggleShowSettings();
          }}
        >
          <div className="h-x2"></div>
          <img className="close" src="/assets/icon-close.svg" alt="" />
        </div>
        <div className="clear"></div>
      </div>
      <div className="h-x"></div>
      <Dropdown
        value={props.selectedModelType}
        options={modelTypes}
        onChange={d => props.setModelType(d.value)}
        placeholder="Select a Model"
        style={{ width: "104px" }}
      />
      <div className="h-x"></div>
      {renderSettings(props.selectedModelType)}
    </div>
  );
};

export default Settings;
