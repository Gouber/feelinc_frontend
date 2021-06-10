import openSocket from 'socket.io-client';
import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
var dateFormat = require("dateformat");


let socket

export default function Demo(){

    const [startDate, setStartDate] = useState(new Date());
    const [text, setText] = useState("");
    const [data, setData] = useState("");

    //Must pass the second argument as an empty array to
    //prevent the function being called for every text update
    useEffect(() => {
        if(!socket){
            socket = openSocket('http://localhost:3001/',{transports: ['websocket']});
            console.log("Connected")
            socket.on("change",function(msg){
                console.log("Data state: ")
                console.log(data)
                //console.log(msg["fullDocument"])
            })
            socket.on("disconnect",function(){console.log("Disconnected socket")})
        }else{
           socket.disconnect()
            socket = openSocket('http://localhost:3001/',{transports: ['websocket']});
            console.log("Connected")
            socket.on("change",function(msg){
                console.log("Data state: ")
                console.log(data)
                //console.log(msg["fullDocument"])
            })
        }
    }, []);
    
    
    useEffect(() => {
        return function cleanup(){
            if(socket){
                console.log("Disconnected")
                socket.disconnect()
            }
        }
    }, [])



    return (
          <div>
            <label>From:</label><DatePicker dateFormat="yyyy/MM/dd" selected={startDate} onChange={(date) => setStartDate(date)} />
            <label>Ticker: </label><input type="text" name="name" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={() => handleClick(startDate, text, setData)}>Update</button>
          </div>
    )
}

function handleClick(startDate, ticker, setData){
   const tomorrow = new Date();
   tomorrow.setDate(tomorrow.getDate() + 1)
   var add = "";
   if(ticker){
       console.log(ticker)
       add = "&tag=" + ticker;
   }
   fetch("http://localhost:8000/agg?start=" + dateFormat(dateFormat(startDate,"yyyy-mm-dd"),"yyyy-mm-dd") + "&end=" + dateFormat(dateFormat(tomorrow,"yyyy-mm-dd"),"yyyy-mm-dd") + add, {
       method: "GET"
   }).then(response => response.json()).then(data => {
       setData(data)
   })
}