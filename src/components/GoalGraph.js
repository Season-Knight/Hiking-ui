import React, {Component} from 'react';
import * as d3 from "d3";
import { Link as RLink } from 'react-router-dom'
import { uriBase, api } from '../const'
import ReactDOM from 'react-dom'


class GoalGraph extends Component {
   
  componentDidMount() {
    this.renderMultiChart();
  }
  render() {
    return (
      <div className="GoalGraph">
        <div id="chart" />
      </div>
    );
  }
  renderMultiChart() {
    var data = [
      {
        name: "Hikes",
        values: [
          { date: "2000", miles: "6", elevationGain: "1000" },
          { date: "2001", miles: "5" ,elevationGain: "2000"},
          { date: "2002", miles: "10",elevationGain: "4000" },
          { date: "2003", miles: "3" ,elevationGain: "8000"},
          { date: "2004", miles: "5.5",elevationGain: "10500" },
          { date: "2005", miles: "4",elevationGain: "13800" },
          { date: "2006", miles: "5" ,elevationGain: "18200"},
          { date: "2007", miles: "11.5",elevationGain: "24100" },
          { date: "2008", miles: "15" ,elevationGain: "30000"},
          { date: "2009", miles: "4" ,elevationGain: "32500"}
        ]
      }
      
    ];

    var width = 600;
    var height = 500;
    var margin = 50;
    var duration = 250;

    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    var circleOpacity = "0.85";
    var circleOpacityOnLineHover = "0.25";
    var circleRadius = 5;
    var circleRadiusHover = 8;

    /* Format Data */
    var parseDate = d3.timeParse("%Y");
    data.forEach(function(d) {
      d.values.forEach(function(d) {
        d.date = parseDate(d.date);
        d.miles = +d.miles;
        d.elevationGain = +d.elevationGain
      });
    });

    /* Scale */
    var xScale = d3
      .scaleLinear()
      .domain(d3.extent(data[0].values, d => d.miles))
      .range([0, width - margin]);

    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data[0].values, d => d.elevationGain)])
      .range([height - margin, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin + "px")
      .attr("height", height + margin + "px")
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

    /* Add line into SVG */
    var line = d3
      .line()
      .x(d => xScale(d.miles))
      .y(d => yScale(d.elevationGain));

    let lines = svg.append("g").attr("class", "lines");

    lines
      .selectAll(".line-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "line-group")
      .on("mouseover", function(d, i) {
        svg
          .append("text")
          .attr("class", "title-text")
          .style("fill", color(i))
          .text(d.name)
          .attr("text-anchor", "middle")
          .attr("x", (width - margin) / 2)
          .attr("y", 2);
      })
      .on("mouseout", function(d) {
        svg.select(".title-text").remove();
      })
      
      .append("path")
      .attr("class", "line")
      
    //   .attr("d", d => line(d.values))
      .style("stroke", (d, i) => color(i))
      .style("opacity", lineOpacity)
      .on("mouseover", function(d) {
        d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
        d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
        d3.select(this)
          .style("opacity", lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
      .on("mouseout", function(d) {
        d3.selectAll(".line").style("opacity", lineOpacity);
        d3.selectAll(".circle").style("opacity", circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });

    /* Add circles in the line */
    lines
      .selectAll("circle-group")
      .data(data)
      .enter()
      .append("g")
    //   .style("fill", (d, i) => color(i))
      .selectAll("circle")
      .data(d => d.values)
      .enter()
      .append("g")
      .attr("class", "circle")
      .on("mouseover", function(d) {
        d3.select(this)
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.date}`)
          .attr("x", d => xScale(d.miles) + 5)
          .attr("y", d => yScale(d.elevationGain) - 10);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .transition()
          .duration(duration)
          .selectAll(".text")
          .remove();
      })
      .append("circle")
      .attr("cx", d => xScale(d.miles))
      .attr("cy", d => yScale(d.elevationGain))
      .attr("r", circleRadius)
      .style("opacity", circleOpacity)
      .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadius);
      });

    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Total values");
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<GoalGraph />, rootElement);


    export default GoalGraph

