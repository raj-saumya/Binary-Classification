import React from "react";

const StepCard = () => {
  const cardStyle = {
    // minHeight: "160px",
    marginBottom: "40px",
    maxWidth: "288px"
  };

  return (
    <div>
      <div className="card" style={cardStyle}>
        <label>
          Set two types of plots in the chart beside, and then train the model.
        </label>
      </div>
      <div className="card" style={cardStyle}>
        <label>
          After training the model set new points to predict the plotted point
          type.
        </label>
      </div>
    </div>
  );
};

export default StepCard;
