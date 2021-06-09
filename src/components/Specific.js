import React from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

var dateFormat = require("dateformat");


export default function Specific(){
    const [startDateOne, setStartDateOne] = useState(new Date());
    const [startDateTwo, setStartDateTwo] = useState(new Date());
    const [data,setData] = useState("");
    const [secondData, setSecondData] = useState("");
    const [thirdData, setThirdData] = useState("");
    const [text, setText] = useState("");

  return (
      <div>
            <label>From:</label><DatePicker dateFormat="yyyy/MM/dd" selected={startDateOne} onChange={(date) => setStartDateOne(date)} />
            <label>To:</label><DatePicker dateFormat="yyyy/MM/dd" selected={startDateTwo} onChange={(date) => setStartDateTwo(date)} />
            <label>Stock ticker:</label><input type="text" name="name" value={text} onChange={e => setText(e.target.value)} />
            <br/><br/>
          <button onClick={handleClick(startDateOne, startDateTwo, setData, text, setSecondData, setThirdData)}>Query</button>
              <br/><br/><label>First Metric</label><BarChart
                  width={500}
                  height={300}
                  data={data}
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
                  data={secondData}
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
                  data={thirdData}
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

const handleClick = (d1,d2, setData,tag, setSecondData, setThirdData) =>  () => {
   var add = "";
   if(tag){
       add = "&tag=" + tag;
   }
   fetch("http://localhost:8000/agg?start=" + dateFormat(d1,"yyyy-mm-dd") + "&end=" + dateFormat(d2,"yyyy-mm-dd") + add, {
       method: "GET"
   }).then(response => response.json()).then(data => {
       setSecondData(JSON.parse(data.second_data))
       setData(JSON.parse(data.data))
       setThirdData(JSON.parse(data.third_data))
       console.log(JSON.parse(data.second_data))
       console.log(JSON.parse(data.data))
       console.log(JSON.parse(data.third_data))
   })
}
