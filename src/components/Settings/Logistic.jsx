import React from "react";
import { Slider } from "primereact/slider";
import { Dropdown } from "primereact/dropdown";

const Logistic = props => {
  const solverTypes = {
    lbfgs: ["l2", "none"],
    "newton-cg": ["l2", "none"],
    liblinear: ["l1", "l2"],
    sag: ["l2", "none"],
    saga: ["l1", "l2", "elasticnet", "none"]
  };

  return (
    <div>
      <label htmlFor="">Maximum Iteration</label>
      <div className="h-x"></div>
      <Slider
        value={props.maxIter}
        min={100}
        max={1000}
        step={100}
        onChange={d =>
          props.updateModelSettings(props.selectedModelType, "maxIter", d.value)
        }
      />
      <div className="h-x"></div>
      <span>{props.maxIter}</span>
      <div className="h-x"></div>
      <label htmlFor="">Solver</label>
      <div className="h-x"></div>
      <Dropdown
        value={props.solver}
        options={Object.keys(solverTypes)}
        onChange={d => {
          props.updateModelSettings(props.selectedModelType, "solver", d.value);
          props.updateModelSettings(
            props.selectedModelType,
            "penalty",
            solverTypes[d.value][0]
          );
        }}
        placeholder="Select a Solver"
        style={{ width: "104px" }}
      />
      <div className="h-x"></div>
      <label htmlFor="">Penalty(Regularization)</label>
      <div className="h-x"></div>
      <Dropdown
        value={props.penalty}
        options={solverTypes[props.solver]}
        onChange={d =>
          props.updateModelSettings(props.selectedModelType, "penalty", d.value)
        }
        placeholder="Select a Penalty"
        style={{ width: "104px" }}
      />
      <div className="h-x"></div>
      {props.penalty !== "none" && (
        <div>
          <label htmlFor="">Strength of Regularization </label>
          <div className="h-x"></div>
          <Slider
            value={props.c}
            min={0}
            max={7}
            step={1}
            onChange={d =>
              props.updateModelSettings(props.selectedModelType, "c", d.value)
            }
          />
          <div className="h-x"></div>
          <span>{Math.pow(10, props.c)}</span>
        </div>
      )}
      <div className="h-x"></div>
      {props.penalty === "elasticnet" && (
        <div>
          <label htmlFor="">l1 Ratio</label>
          <div className="h"></div>
          <Slider
            value={props.l1Ratio}
            min={0}
            max={10}
            onChange={d =>
              props.updateModelSettings(
                props.selectedModelType,
                "l1Ratio",
                d.value
              )
            }
          />
          <div className="h-x"></div>
          <span>{props.l1Ratio / 10}</span>
          <div className="h-x"></div>
        </div>
      )}
    </div>
  );
};

export default Logistic;
