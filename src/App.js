import React, { Component } from "react";
import produce from "immer";
import StepCard from "./components/step-cards/StepCard";
import ScatterPlot from "./components/scatter-plot/ScatterPlot";
import Settings from "./components/Settings/Settings";
import { CSSTransition } from "react-transition-group";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      showSettings: false,
      selectedModelType: "Dummy",
      settingsOptions: {
        Logistic: {
          maxIter: 100,
          solver: "lbfgs",
          penalty: "l2",
          c: 0,
          l1Ratio: 3
        }
      },
      plotOptions: {
        plotType: 0,
        randomPlot: false,
        modelId: null
      }
    };
  }

  // Model Settings ------------
  toggleShowSettings = () => {
    this.setState(
      produce(draft => {
        draft.showSettings = !draft.showSettings;
      })
    );
  };
  setModelType = type => {
    this.setState(
      produce(draft => {
        draft.selectedModelType = type;
      })
    );
  };
  updateModelSettings = (modelType, key, value) => {
    this.setState(
      produce(draft => {
        draft.settingsOptions[modelType][key] = value;
      })
    );
  };
  // Model Settings End ------------

  // Plotting Options ------------
  updatePlotOptions = (key, value) => {
    this.setState(
      produce(draft => {
        draft.plotOptions[key] = value;
      })
    );
  };
  // Plotting Options End ------------

  render() {
    return (
      <div>
        <div className="blob" style={{ zIndex: 0 }}>
          <img src="/assets/blob.svg" alt="" />
        </div>
        <label className="app-title">Binary Classification</label>
        <CSSTransition
          in={this.state.showSettings}
          timeout={800}
          classNames="fade"
          unmountOnExit
        >
          <Settings
            toggleShowSettings={this.toggleShowSettings}
            setModelType={this.setModelType}
            updateModelSettings={this.updateModelSettings}
            selectedModelType={this.state.selectedModelType}
            {...this.state.settingsOptions[this.state.selectedModelType]}
          ></Settings>
        </CSSTransition>
        <div id="main" className="main" style={{ zIndex: 0 }}>
          <div className="container">
            <div className="step-card">
              <StepCard {...this.state.plotOptions}></StepCard>
            </div>
            <div className="scatter-plot">
              <ScatterPlot
                toggleShowSettings={this.toggleShowSettings}
                updatePlotOptions={this.updatePlotOptions}
                {...this.state.plotOptions}
                selectedModelType={this.state.selectedModelType}
                settingsOptions={
                  this.state.settingsOptions[this.state.selectedModelType]
                }
              ></ScatterPlot>
            </div>
            <div className="dotted-pattern">
              <img src="/assets/dotted-pattern.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
