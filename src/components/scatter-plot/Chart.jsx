import React, { Component } from "react";
import * as d3 from "d3";
import axios from "axios";

class Chart extends Component {
  constructor() {
    super();
    this.state = {
      chartContainerID: "",
      height: 0,
      width: 0,
      gridStyle: {
        verticalGrid: "#1B2D2A",
        horizontalGrid: "#1B2D2A"
      },
      squareCount: 0,
      circleCount: 0,
      randomCount: 0
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        chartContainerID: this.props.chartId,
        height: this.props.height,
        width: this.props.width
      });
      this.initGraph(this.state);
    }, 1);
  }

  render() {
    return <div id={this.props.chartId}></div>;
  }

  resetChart = () => {
    this.setState({
      squareCount: 0,
      circleCount: 0,
      randomCount: 0
    });
    this.initGraph(this.state);
  };

  clearSVG = chartContainerID => {
    d3.selectAll(`#${chartContainerID} svg`).remove();
    d3.selectAll("#tooltip").remove();
  };

  generateSVG = (chartContainerID, height, width, margin) => {
    return d3
      .select(`#${chartContainerID}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr(
        "transform",
        "translate(" + (margin.left + 32) + "," + margin.top / 10 + ")"
      );
  };

  getXScale = (width, xDomain) => {
    return d3
      .scaleLinear()
      .range([0, width])
      .domain([0, xDomain]);
  };

  getXAxis = (svg, height, xScale, ticks, tickSize, tickPadding) => {
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(ticks)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    return svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  };

  getYScale = (height, yDomain) => {
    return d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, yDomain]);
  };

  getYAxis = (svg, width, yScale, ticks, tickSize, tickPadding) => {
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(ticks)
      .tickPadding(tickPadding)
      .tickSize(tickSize);

    return svg
      .append("g")
      .attr("transform", "translate(0," + 0 + ")")
      .call(yAxis);
  };

  axisStyling = (axis, color, xTranslate, yTranslate) => {
    axis
      .selectAll(".tick text")
      .attr("fill", "#1B2D2A")
      .attr("font-size", 12)
      .attr("font-family", "Roboto");

    axis
      .selectAll(".tick line")
      .attr("stroke", color)
      .attr("stroke-dasharray", "8,4")
      .attr("opacity", 0.4)
      .attr("transform", `translate(${xTranslate},${yTranslate})`);

    axis.call(g =>
      g
        .select(".domain")
        .attr("stroke", color)
        .attr("opacity", 0.4)
    );
  };

  maskPlottedPoints = () => {
    d3.selectAll("rect[id^='sqr']")._groups[0].forEach(d => {
      d3.select(d).attr("opacity", 0.3);
    });
    d3.selectAll("circle[id^='circle']")._groups[0].forEach(d => {
      d3.select(d).attr("opacity", 0.3);
    });
  };

  generatePulseEffect(selection) {
    selection
      .style("stroke-opacity", 0.6)
      .style("stroke-width", 4)
      .transition()
      .duration(300)
      .style("stroke-opacity", 0.4)
      .style("stroke-width", 8)
      .transition()
      .duration(300)
      .style("stroke-opacity", 0.6)
      .style("stroke-width", 4)
      .duration(300)
      .style("stroke-opacity", 0.8)
      .style("stroke-width", 2)
      .on("end", () => {
        this.generatePulseEffect(selection);
      });
  }

  generateCirclePlot = (svg, x, y) => {
    const circle = svg
      .append("circle")
      .attr("id", () => {
        const count = this.state.circleCount;
        this.setState({ circleCount: this.state.circleCount + 1 });
        return `circle${count}`;
      })
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 4)
      .attr("fill", "#0A210F")
      .style("stroke", "#0A210F")
      .style("stroke-opacity", 0.8)
      .style("stroke-width", 2);
    this.generatePulseEffect(circle);
  };

  generateSquarePlot = (svg, x, y) => {
    const square = svg
      .append("rect")
      .attr("id", () => {
        const count = this.state.squareCount;
        this.setState({ squareCount: this.state.squareCount + 1 });
        return `sqr${count}`;
      })
      .attr("width", 8)
      .attr("height", 8)
      .attr("x", x)
      .attr("y", y)
      .attr("fill", "#BC4B51")
      .attr("transform", "translate(-4,-4)")
      .style("stroke", "#BC4B51")
      .style("stroke-opacity", 0.8)
      .style("stroke-width", 2);
    this.generatePulseEffect(square);
  };

  predictRandomPlotType = (id, svg, x, y) => {
    axios
      .post("http://192.168.0.114:8000/test", {
        plotId: id,
        modelId: this.props.modelId,
        x: this.x.invert(x),
        y: this.x.invert(y)
      })
      .then(resp => {
        svg.select(`#${resp.data.plotId}`).remove();
        resp.data.label
          ? this.generateCirclePlot(svg, x, y)
          : this.generateSquarePlot(svg, x, y);
      });
  };

  generateRandomPlot = (svg, x, y) => {
    const count = this.state.randomCount;
    this.setState({ randomCount: this.state.randomCount + 1 });
    svg
      .append("foreignObject")
      .attr("id", `random${count}`)
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", x)
      .attr("y", y)
      .append("xhtml:div")
      .html(
        `<img src="/assets/random-plot.svg" alt="" style="height: 20px;width: auto;" />`
      );

    this.predictRandomPlotType(`random${count}`, svg, x, y);
  };

  getMaxYDomain = () => {
    return 1000;
  };

  getCoordinates = () => {
    const sqrCoords = [];
    d3.selectAll("rect[id^='sqr']")._groups[0].forEach(d => {
      sqrCoords.push([
        this.x.invert(+d3.select(d).attr("x")),
        this.y.invert(+d3.select(d).attr("y"))
      ]);
    });
    const circleCoords = [];
    d3.selectAll("circle[id^='circle']")._groups[0].forEach(d => {
      circleCoords.push([
        this.x.invert(+d3.select(d).attr("cx")),
        this.y.invert(+d3.select(d).attr("cy"))
      ]);
    });
    return [sqrCoords, circleCoords];
  };

  initGraph = chartConfig => {
    this.clearSVG(chartConfig.chartContainerID);

    const gridStyle = chartConfig.gridStyle;
    const maxY = this.getMaxYDomain();
    const totalValues = 10;
    const length = Math.ceil(maxY.toString().length * 8);

    const margin = {
      left: length,
      top: 40
    };

    // creating svg container
    const svg = this.generateSVG(
      chartConfig.chartContainerID,
      chartConfig.height,
      chartConfig.width,
      margin
    );

    const width = chartConfig.width - margin.left - 48;
    const height = chartConfig.height - margin.top;

    // initialising scale
    const x = this.getXScale(width, 1000);
    this.x = x;
    const gX = this.getXAxis(svg, height, x, totalValues + 1, -height - 8, 16);
    this.axisStyling(gX, gridStyle.verticalGrid, 0, 8);

    const y = this.getYScale(height, maxY);
    this.y = y;
    const gY = this.getYAxis(svg, width, y, null, -width - 8, 16);
    this.axisStyling(gY, gridStyle.horizontalGrid, -8, 0);

    const dots = svg.append("g");

    // pointer-layer
    const clickLayer = svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "transparent")
      .attr("cursor", "pointer")
      .on("click", () => {
        const [x, y] = d3.mouse(clickLayer._groups[0][0]);
        this.props.randomPlot
          ? this.generateRandomPlot(dots, x, y)
          : this.props.plotType
          ? this.generateSquarePlot(dots, x, y)
          : this.generateCirclePlot(dots, x, y);
      });
  };
}

export default Chart;
