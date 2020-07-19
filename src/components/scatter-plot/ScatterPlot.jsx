import React, { useState, useEffect } from "react";
import axios from "axios";
import anime from "animejs";
import ToggleSwitch from "./ToggleSwitch";
import Chart from "./Chart";

const startTrainingAnimation = () => {
  anime.remove("svg #path");
  anime({
    targets: "svg #path",
    strokeDashoffset: {
      value: -1000,
      duration: 3000,
      easing: "linear"
    },
    strokeDasharray: {
      value: [500, document.querySelector("svg #path").getTotalLength()],
      duration: 0,
      easing: "linear"
    },
    loop: true
  });
};

const stopTrainingAnimation = () => {
  anime.remove("svg #path");
  anime({
    targets: "svg #path",
    strokeDasharray: {
      value: 0,
      duration: 0,
      easing: "linear"
    }
  });
};

const animateRefreshIcon = () => {
  anime({
    targets: ".refresh",
    rotate: [0, 360],
    duration: 500,
    easing: "linear",
    complete: () => {
      anime.remove(".refresh");
    }
  });
};

const animateSettingsIcon = () => {
  anime({
    targets: ".settings",
    rotate: [0, 180],
    duration: 800,
    easing: "linear",
    complete: () => {
      anime.remove(".settings");
    }
  });
};

const ScatterPlot = props => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const chart = React.createRef();

  useEffect(() => {
    setHeight(document.getElementById("main").offsetHeight / 1.4);
    setWidth(document.getElementById("chart-section").offsetWidth);
  }, []);

  const trainModel = () => {
    if (props.modelId) {
      return;
    }
    stopTrainingAnimation();
    startTrainingAnimation();
    props.updatePlotOptions("randomPlot", true);
    props.updatePlotOptions("modelId", -1);
    chart.current.maskPlottedPoints();
    axios
      .post("http://192.168.0.114:8000/train", {
        plotPoints: chart.current.getCoordinates(),
        modelType: props.selectedModelType.toLocaleLowerCase(),
        modelArgs: { ...props.settingsOptions }
      })
      .then(resp => {
        setTimeout(() => {
          props.updatePlotOptions("modelId", resp.data.modelId);
          stopTrainingAnimation();
        }, 1000);
      });
  };

  const resetSettings = () => {
    stopTrainingAnimation();
    animateRefreshIcon();
    props.updatePlotOptions("randomPlot", false);
    props.updatePlotOptions("plotType", 0);
    props.updatePlotOptions("modelId", null);
    chart.current.resetChart();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "56px", display: "flex" }}>
        <div id="chart-section" style={{ width: "100%" }}>
          <Chart
            ref={chart}
            chartId={"training"}
            plotType={props.plotType}
            randomPlot={props.randomPlot}
            modelId={props.modelId}
            height={height}
            width={width}
          ></Chart>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <ToggleSwitch
            plotType={props.plotType}
            updatePlotOptions={props.updatePlotOptions}
          ></ToggleSwitch>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ position: "relative", paddingRight: "40px" }}>
          <button
            id="trainBtn"
            className="card"
            style={{ padding: " 10px 50px", minWidth: "184px" }}
            onClick={trainModel}
          >
            {!props.modelId
              ? "Train Model"
              : props.modelId === -1
              ? "Training"
              : "Trained"}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "-10px"
              }}
            >
              <svg width="203px" height="62px" viewBox="0 0 203 62">
                <path
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="bevel"
                  stroke="#1B2D2A"
                  d="M11,1 L192.393473,1 C197.91632,1 202.393473,5.4771525 202.393473,11 L202.393473,50.5681007 C202.393473,56.0909482 197.91632,60.5681007 192.393473,60.5681007 L11,60.5681007 C5.4771525,60.5681007 1,56.0909482 1,50.5681007 L1,11 C1,5.4771525 5.4771525,1 11,1 Z"
                  id="path"
                ></path>
              </svg>
            </div>
          </button>
        </div>
        <div style={{ paddingRight: "40px" }}>
          <button
            onClick={() => {
              animateSettingsIcon();
              props.toggleShowSettings();
            }}
          >
            <img className="settings" src="/assets/icon-setting.svg" alt="" />
          </button>
        </div>
        <div>
          <button onClick={resetSettings}>
            <img className="refresh" src="/assets/icon-refresh.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScatterPlot;
