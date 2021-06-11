import React from 'react';
import DatePicker from "react-datepicker";
import openSocket from "socket.io-client";
import {Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
var dateFormat = require("dateformat");

export default class DemoComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            text: "",
            data: "",
            socket: null,
            secondData: "",
            thirdData: ""
        }
    }

    handleSocketChange(msg){
        //This call probably gets the updated state because there exists no
        //guarantee when the state is actually updated
        let sentiment = msg["fullDocument"]["sentiment_analysis"]
        let posCount = sentiment[0]["score"]
        let negCount = sentiment[1]["score"]
        let neuCount = sentiment[2]["score"]

        let maxScore = Math.max(posCount,negCount,neuCount);

        let b = false;
        let newState
        this.state.data.forEach(function(item, index, theArray){
            if(!b){
                let name = item["name"]
                let pos = item["pos"]
                let neg = item["neg"]
                let neutr = item["neutr"]
                if(name === dateFormat(new Date(),"yyyy-mm-dd")){
                    b = true
                    let obj = {"name": name, "pos": pos, "neg":neg, "neutr": neutr}
                    if(maxScore === posCount){
                        obj["pos"] += 1
                    }else if(maxScore === negCount){
                        obj["neg"] += 1
                    }else{
                        obj["neutr"] += 1
                    }
                    theArray[index] = obj
                    newState = theArray
                }
            }
        })
        if(b){
            //Need to set to empty array to trigger the re-render on the chart side
            //Known bug from the library
            this.setState({
                ...this.state,
                data: []
            },() => {
                this.setState({
                    ...this.state,
                    data: newState
                })
            })
        }else{
            let localData = this.state.data
            let obj = {"name": dateFormat(new Date(),"yyyy-mm-dd"), "pos":0, "neg":0, "neutr":0}
            if(maxScore === posCount){
                obj["pos"] = 1
            }else if(maxScore === negCount){
                obj["neg"] = 1
            }else{
                obj["neutr"] = 1
            }
            localData.push(obj)
            //Need to set to empty array to trigger the re-render on the chart side
            //Known bug from the library
            this.setState({
                ...this.state,
                data: []
            }, () => {
                this.setState({
                    ...this.state,
                    data: localData
                })
            })
        }
    }

    componentWillUnmount(){
        if(this.state.socket){
            this.state.socket.disconnect()
            console.log("Disconnected")
        }
    }

    setUpSocket(){
        if(this.state.socket !== null){
           this.state.socket.disconnect()
           let currentSocket = openSocket('http://localhost:3001/',{transports: ['websocket']});
           console.log("Connected")
           currentSocket.on("change", (msg) => {this.handleSocketChange(msg)})
           this.setState({
               ...this.state,
               socket: currentSocket
           })
        }else{
           let currentSocket = openSocket('http://localhost:3001/',{transports: ['websocket']});
           console.log("Connected")
           currentSocket.on("change", (msg) => {this.handleSocketChange(msg)})
           this.setState({
               ...this.state,
               socket: currentSocket
           })
        }
    }

    handleClick(){
       const tomorrow = new Date();
       let currentData;
       tomorrow.setDate(tomorrow.getDate() + 1)
       var add = "";
       let ticker = this.state.text
       if(ticker){
           add = "&tag=" + ticker;
       }
       fetch("http://localhost:8000/agg?start=" + dateFormat(dateFormat(this.state.startDate,"yyyy-mm-dd"),"yyyy-mm-dd") + "&end=" + dateFormat(dateFormat(tomorrow,"yyyy-mm-dd"),"yyyy-mm-dd") + add, {
           method: "GET"
       }).then(response => response.json()).then(data => {
           let parsed = JSON.parse(data.data)
           console.log(parsed)

           let secondData = []
           let thirdData = []

           parsed.forEach(function(item){
               let name = item["name"]
               let neg = item["neg"]
               let pos = item["pos"]
               let neutr = item["neutr"]
               let score = pos - neg
               let obj = {"name": name, "val": score}
               secondData.push(obj)
               let adjusted_score = score * (neg + pos + neutr)
               let second_obj = {"name": name, "val": adjusted_score}
               thirdData.push(second_obj)
           })

           this.setState({
               ...this.state,
               data: parsed,
               secondData: secondData,
               thirdData: thirdData
           },this.setUpSocket)
       })
    }

    render(){
       return(
          <div>
              <h1>This is the class based component</h1>
            <label>From:</label><DatePicker dateFormat="yyyy/MM/dd" selected={this.state.startDate} onChange={(date) => this.setState({
              ...this.state,
              startDate: date
          })} />
            <label>Ticker: </label><input type="text" name="name" value={this.state.text} onChange={e => this.setState({
              ...this.state,
              text: e.target.value
          })} />
            <button onClick={() => this.handleClick()}>Update</button>
            <p>{JSON.stringify(this.state.data)}</p>
              <br/><br/><label>First Metric</label><BarChart
                  width={500}
                  height={300}
                  data={this.state.data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar dataKey="neg" stackId="a" fill="#FF0000" />
                  <Bar dataKey="pos" stackId="a" fill="#00FF00" />
              </BarChart>
               <label>Second Metric</label>
              <LineChart
                  width={500}
                  height={300}
                  data={this.state.secondData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="val" stroke="#82ca9d" />
              </LineChart>
              <label>Third Metric</label>
                        <LineChart
                  width={500}
                  height={300}
                  data={this.state.thirdData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="val" stroke="#82ca9d" />
              </LineChart>
          </div>

       )
    }
}