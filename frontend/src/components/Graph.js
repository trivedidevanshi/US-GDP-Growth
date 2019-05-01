import React, { Component } from 'react';
import axios from 'axios';
import './graph.css';
import * as d3 from "d3";

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: 0,
            windowSizeValue: 5,
            data: [],
            date: [],
            datalength: 0
        }
        this.dataSpan = this.dataSpan.bind(this);
        this.clickNext = this.clickNext.bind(this);
        this.node = null;
    }

    componentDidMount() {
        this.drawChart();
    }

    dataSpan = (e) => {
        this.setState({
            windowSizeValue: e.target.value
        }, this.drawChart)
    }
    clickNext = (e) => {
        console.log("Inside next click");
        let inc_value = this.state.startValue;
        inc_value++;
        this.setState({
            startValue: inc_value
        }, this.drawChart)
    }

    drawChart() {
        this.setState({
            date: [],
            data: []
        })

        axios.defaults.withCredentials = true;
        console.log("Inside Draw Chart", this.state.windowSizeValue);
        const data = {
            start: this.state.startValue,
            windowSize: this.state.windowSizeValue
        }
        axios.get(`http://localhost:3001/api/graph`, { params: data })
            .then(res => {
                console.log("The response data length is : ", res.data.length);
                for (let i = 0; i < res.data.length; i++) {
                    this.setState({
                        data: [...this.state.data, (res.data[i].value / 100000000000).toFixed(2)],
                        date: [...this.state.date, parseInt(res.data[i].date)]

                    })
                }
                this.setState({
                    datalength: this.state.date.length
                })

                this.displayChart();
            })
            .catch(err => {
                console.log("Error in getting the data values.");
            });
    }
    displayChart() {

        let dataLen = this.state.data.length;
        let width = 800 / dataLen;
        let data = this.state.data;
        let dates = this.state.date;
        console.log("Data before using in chart: ", data);
        console.log("Date before using in chart: ", dates);
        console.log("width", width);

        d3.select(this.node).select("svg").remove();

        let svg = d3.select(this.node).append('svg')
            .attr("width", 900)
            .attr("height", 300)
            .attr("fill", "pink");

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * (width + 5))
            .attr("y", (d, i) => 300 - d)
            .attr("width", width)
            .attr("height", (d, i) => d)
            .attr("fill", "green");

        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * (width + 5))
            .attr("y", (d, i) => 300 - d - 5)
            .attr("fill", "black");

    }


    render() {
        return (

            <div>
                <div className="page-header">
                    <h3 className="text-center">GDP growth of U.S.A for the past 60 years</h3>
                </div>
                <div className="container">
                    <div className="row">

                        <div className="col-sm-2" style={{ "border-right": "2px solid grey" }}>
                            <div className="selectionBar">
                                <h5>Enter the number of years(Window size) of data that you want</h5>
                                <h6>(Range 5-20):</h6>
                                <input onChange={this.dataSpan} type="number" name="departDate" placeholder="5" min="5" max="20" ></input>
                                <br></br><br></br>
                                <h6>Display previous years GDP.</h6>
                                <button onClick={this.clickNext} className="btn btn-success" type="button">Next</button>
                            </div>
                        </div>

                        <div className="col-sm-10">
                            <div>
                                <h3>Years</h3>
                                <h3>{this.state.date[0]} - {this.state.date[this.state.date.length - 1]}</h3>
                                <div ref={(node) => this.node = node}></div><br></br>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        )

    }
}
export default Graph;