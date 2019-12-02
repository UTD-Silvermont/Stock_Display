import React from 'react';
import ReactDOM from 'react-dom';
import {Card} from 'antd'

import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'

import axios from 'axios'

import qs from 'querystring'

class LineA extends React.Component {
    constructor(props){
        super(props);
        this.state = {xAxis: [], data: [], symbol: this.props.symbol, fun: this.props.fun};
    }

    componentDidMount(){
        var data = {
            'interval': '5',
            'symbol': this.props.symbol
        };
        var content = qs.stringify(data);
        axios.get('http://localhost:8081/stock/v1/'+ this.props.fun + '?' + content)
            .then(response => {
                return response.data;
            })
            .then(obj => {
                console.log(JSON.stringify(obj)); 
                var xAxis = this.state.xAxis.slice();
                var data = this.state.xAxis.slice();
                for(var t in obj.history)
                {
                    xAxis.push(t);
                    data.push(obj.history[t].close);
                }
                this.setState({xAxis: xAxis, data: data, symbol: this.props.symbol, fun: this.props.fun});
                console.log(xAxis);
                console.log(data);
            })
    }

    getOption = ()=>{
        let option = {
            title: {  
                text: this.props.symbol,
                x: 'center',
                textStyle: { 
                    color: '#ccc'
                }
            },
            tooltip:{ 
                trigger: 'axis'
            },
            xAxis: { 
                data: this.state.xAxis, //x value
                show: false
            },
            yAxis: {
                type: 'value',
                min: 'dataMin',
                axisLabel: {formatter:'${value}'}
            },
            series : [
                {
                    name:'Price', 
                    type:'line', 
                    data: this.state.data //y value
                }
            ]
        }
        return option;
    }

    render() {
        return (
            <Card.Grid className="line_a">
                <ReactEcharts option={this.getOption()} theme="ThemeStyle" />
            </Card.Grid>
        )
    }
}

ReactDOM.render(<LineA fun='past-5-years' symbol="AAPL"/>, document.getElementById('root'));
