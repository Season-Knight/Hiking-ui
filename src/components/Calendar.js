import React, { Component, useContext, useEffect } from "react";
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
import { CalendarContext } from './CalendarContext'
import Events from './Events'
import EditEvents from './EditEvent'

// create temp array of event dates
const tempEvents = [new Date(), new Date("4/18/2020")]

export default function Calendar() {

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // holds the array of events with start dates (not strings)
  const [events, setEvents] = React.useState(tempEvents)

  // const [newEvent, setNewEvent] = useContext(CalendarContext);

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

  const days = () => {
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

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const cells = () => {

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

            // commented out original code because it shouldn't need to use parse
            // onClick={() => onDateClick(parse(cloneDay))}
            // onClick={() => onDateClick(cloneDay)}

          >

            <EventModal day={day}></EventModal>
            
            {/* display the number of the day,  regular if not selected big if it is */}
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            {/* use filter for event for that date to display only events for that date*/}
            <Events day={day} events={events} refresh={refresh}></Events>
 

            
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

      // const showEvent = () =>{
      //   let rtnVal = null
      //   if (isSameDay(events.dateTime, props.day ) === true) {
      //       rtnVal = (       
      //       <EditEvents>
      //           {todaysEvents}<br></br>
      //       </EditEvents>
      //   )
      //   }
      //   return rtnVal
      // }
    }
    return <div className="body">{rows}</div>;

  }

  const onDateClick = day => {
    setSelectedDate(day)
  };

  // const displayEvent = () => {
  //   if (isSameDay(day, dbEvent.date) == true)
  //   return (dbEvent.map((day) => {
  //     return ({

  //       eventTitle: day.eventTitle,
  //       time: day.time,
        

  //     })
  //   })
  //   )
  // }

  const refresh = () => {

    fetch(`${uriBase}${api}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(httpResponse => {

        if (!httpResponse.ok) {
          throw new Error("can't get events from db")
        }

        return httpResponse.json()
      })
      .then(dbEvents => {

        // convert our date and time strings to a date
        // store the date in a new array

        const tmpEvents = dbEvents.map(dbEvent => {

          // first shallow copy the original object to a new object
          const tmpEvent = { ...dbEvent }
            console.log("tmpEvents", tmpEvent.date, tmpEvent.time)
          // remove the date and time strings from the copy
         

          // create the new date
          const tmpDate = parse(`${dbEvent.date} 00:01`, 'yyyy-MM-dd HH:mm', new Date())
            console.log("dbEvents",dbEvent.date, dbEvent.time)
          // set the datetime of the copy to the new date
          tmpEvent.dateTime = tmpDate
          
            //returns only as date was originaly formatted. 
          // return the new object to be put in our new array
          return tmpEvent
        })

        // set the state of events to our new array
        setEvents(tmpEvents)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="calendar">
      <div>{header()} </div>
      <div>{days()} </div>
      <div>{cells()}

      </div>
    </div>

  );
}


