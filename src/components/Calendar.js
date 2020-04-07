import React from "react";
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import endOfWeek from "date-fns/endOfWeek";
import isSameMonth from "date-fns/isSameMonth";
import isSameDay from "date-fns/isSameDay";
import parse from "date-fns/parse";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths"
import '../components/assets/Calendar.css'
import { Link as RLink } from 'react-router-dom'
import { uriBase, api } from '../const'
import EventModal from './EventModal'



// const refresh = () => {

//   fetch(`${uriBase}${api}/events`, {
//       method: "GET",
//       headers: {
//           "Content-Type": "application/json"
//       }
//   })
//       .then(HttpResponse => {
//           if (!HttpResponse.ok) {
//               throw new Error("Bad Response")
//           }
//           return HttpResponse.json()
//       })
//       .then(response => {
//           console.log(response)
//           console.log(response.length)
                    
//           // console.log(events.length)

//       })
//       .catch(error => {
//           console.log(error)
//       })
// }
// React.useEffect(() => {
//   refresh()
// }, [])

//use effect hook call refresh()
  //set up events endpoint, readall

const Calendar = () =>{
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] =React.useState(new Date());
    

const header = () => {
        const dateFormat = "MMMM yyyy";
    
    return (
      <div className="header row flex-middle">
        <div className="column col-start">
          <div className="icon" onClick={prevMonth}>
            Prev
          </div>
        </div>
        <div className="column col-center">
          <span>
            {format(currentDate, dateFormat)}
          </span>
        </div>
        <div className="column col-end" onClick={nextMonth}>
          <div className="icon">Next</div>
        </div>
      </div>
    );
}

const days=()=> {
    const dateFormat = "EEEE";
  const days = [];
  let startDate = startOfWeek(currentDate, 0);
  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="column col-center" key={i}>
        {format(addDays(startDate, i), dateFormat)}
      </div>
    );
  }
  return <div className="days row">{days}</div>;
}
const nextMonth = () =>{
    setCurrentDate(addMonths(currentDate, 1))
}
const prevMonth = () =>{
    setCurrentDate(subMonths(currentDate, 1))
}

const cells= ()=> {
    const events = []
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
while (day <= endDate) {
  for (let i = 0; i < 7; i++) {
    formattedDate = format(day, dateFormat);
    const cloneDay = day;
    
    days.push(
      <div
        className={`column cell ${
          !isSameMonth(day, monthStart)
            ? "disabled"
            : isSameDay(day, selectedDate) ? "selected" : ""
        }`}
        key={day}
        
        // onClick={() => onDateClick()}
        //parse(cloneDay)
      >
        {console.log("DAY",day)}
        <EventModal day ={day}></EventModal>
        {/* use filter for event for that date to display only events for that date*/}
        <span className="number">{formattedDate}</span>
        <span className="bg">{formattedDate}</span>
        {/* <div id="events">
                {events.map(eventTitle)}
                </div> */}
                
      </div>
    );
    day = addDays(day, 1);
  }
  rows.push(
    <div className="row" key={day}>
      {days}<span></span>
    </div>
  );
  days = [];
}
return <div className="body">{rows}</div>;

}

// const onDateClick = day => {
//     setSelectedDate(day)
    
//       };



    return (
      <div className = "calendar">
        <div>{header()} </div>
        <div>{days()} </div>
        <div>{cells()}
          
        </div>
      </div>
     
    );
  }


export default Calendar;