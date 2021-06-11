import openSocket from 'socket.io-client';
import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
var dateFormat = require("dateformat");

let socket




export default function Demo(){

    const [startDate, setStartDate] = useState(new Date());
    const [text, setText] = useState("");
    const [data, setData] = useState("");


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
            <button onClick={() => handleClick(startDate, text, setData, data)}>Update</button>
            <p>{JSON.stringify(data)}</p>
          </div>
    )
}

function handleOnChangeEmittedSocket(data, msg){
    let parsedData = JSON.parse(data)
    parsedData.forEach(function (item, index, theArray){
        let name = item["name"]
        if(name === dateFormat(new Date(),"yyyy-mm-dd")){
            console.log("--------------")
            let negCurrent = item["neg"]
            let posCurrent = item["pos"]
            let neutCurrent = item["neutr"]
            let fullDocument = msg["fullDocument"]
            console.log(item)
            let sentiment = fullDocument["sentiment_analysis"]
            let pos = sentiment[0]["score"]
            let neg = sentiment[1]["score"]
            let neut = sentiment[2]["score"]
            let maxScore = Math.max(pos,neg,neut)
            if(maxScore === pos){
                posCurrent += 1
            }else if(maxScore === neg){
                negCurrent += 1
            }else{
                neutCurrent += 1
            }
            //Update current item
            let obj = {"name": name, "pos": posCurrent, "neg": negCurrent, "neutr": neutCurrent}
            theArray[index] = obj
            console.log(theArray[index])
            console.log("--------------")
        }
    })
}

function handleClick(startDate, ticker, setData){
   const tomorrow = new Date();
   let currentData;
   tomorrow.setDate(tomorrow.getDate() + 1)
   var add = "";
   if(ticker){
       console.log(ticker)
       add = "&tag=" + ticker;
   }
   fetch("http://localhost:8000/agg?start=" + dateFormat(dateFormat(startDate,"yyyy-mm-dd"),"yyyy-mm-dd") + "&end=" + dateFormat(dateFormat(tomorrow,"yyyy-mm-dd"),"yyyy-mm-dd") + add, {
       method: "GET"
   }).then(response => response.json()).then(data => {
       setData(data.data)
       currentData = data.data
   })
    //Handle socket initiation/reinitiation
   if(socket){
       //must disconnect and reconnect
       socket.disconnect()
       socket = openSocket('http://localhost:3001/',{transports: ['websocket']});
       console.log("Connected")
       socket.on("change", (msg) => {handleOnChangeEmittedSocket(currentData,msg)})
       socket.on("disconnect",function(){
           console.log("Disconnected socket")
       })
   }else{
       //just connect
       socket = openSocket('http://localhost:3001/',{transports: ['websocket']});
       console.log("Connected")
       socket.on("change",(msg) => {handleOnChangeEmittedSocket(currentData,msg)})
       socket.on("disconnect",function(){
           console.log("Disconnected socket")
       })
   }
}