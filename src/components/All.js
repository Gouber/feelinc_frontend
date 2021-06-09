import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";


export default function All(){
    const [startDate, setStartDate] = useState(new Date());
    const [data, setData] = useState(10);

      return (
          <div>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            <button onClick={() => setData(data + 1)}>Update</button>
              <p>{data}</p>
          </div>
      )
}