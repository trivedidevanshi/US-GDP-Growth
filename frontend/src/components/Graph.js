import React, {Component} from 'react';
import './graph.css';

class Graph extends Component {
    componentDidMount(){
        this.drawChart();
    }
    drawChart(){
        console.log("Hi");
    }
    render(){
        return( 
            
            <div> 
                <div class="page-header">
                    <h3 class="text-center">GDP growth of U.S.A for the past 60 years</h3>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-sm-8">GRAPH DISPLAY</div>
                        <div class="col-sm-4">
                            <div class="selectionBar">
                            <input onChange={this.dataSpan} type="number" name="departDate" ></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}
export default Graph;