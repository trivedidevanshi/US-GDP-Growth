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
            date: []
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
                        data: [...this.state.data, res.data[i].value / 100000000000],
                        date: [...this.state.date, res.data[i].date]

                    })
                }
                console.log("Values : ", this.state.data);
                console.log("Date : ", this.state.date);

                this.displayChart();
            })
            .catch(err => {
                console.log("Error in getting the data values.");
            });
    }
    displayChart() {

        const dataLen = this.state.data.length;
        const width = 800 / dataLen;
        const data = this.state.data;
        console.log("Data before using in chart: ", data);
        console.log("width", width);

        d3.select(this.node).select("svg").remove();
        const svg = d3.select(this.node).append('svg').attr("width", 900).attr("height", 300).attr("fill", "pink");

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * (width + 5))
            .attr("y", (d, i) => 300 - d)
            .attr("width", width)
            .attr("height", (d, i) => d)
            .attr("fill", "green")
    }

    render() {
        return (

            <div>
                <div className="page-header">
                    <h3 className="text-center">GDP growth of U.S.A for the past 60 years</h3>
                </div>
                <div className="container">
                    <div className="row">

                        <div className="col-sm-2">
                            <div className="selectionBar">
                                <h5>Enter the number of years(Window size) of data that you want</h5>
                                <h6>(Range 5-20):</h6>
                                <input onChange={this.dataSpan} type="number" name="departDate" placeholder="5" min="5" max="20" ></input>
                                <br></br><br></br>
                                <h6>Display previous years GDP.</h6><br></br>
                                <button onClick={this.clickNext} type="button">Next</button>
                            </div>
                        </div>

                        <div className="col-sm-10">
                            <div>
                                <div ref={(node) => this.node = node}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )

    }
}
export default Graph;