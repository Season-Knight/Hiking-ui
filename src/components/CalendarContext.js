import React, { useState, useEffect } from 'react'
import { uriBase, api } from '../const';

///context wil have a provider and consumer
const CalendarContext = React.createContext()

const CalendarProvider = (props) => {

    const [newEvent, setNewEvent] = useState([])


    const getEvents = () => {
        return fetch(`${uriBase}${api}/events`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(HttpResponse => {
                if (!HttpResponse.ok) {
                    throw new Error("unable to get events")
                }
                return HttpResponse.json()
            })
            .then(result => {
                setNewEvent(result)

            })
            .catch(error => {
                console.log(error)
                setNewEvent({})
            })
    }
    useEffect(() => {
        if (newEvent.lenght === 0) {
            getEvents()
                .then(result => {
                    setNewEvent(result)
                })
        }
    }, [newEvent.length])


    return (
        <CalendarContext.Provider value={{ newEvent, setNewEvent }}>
            {props.children}
        </CalendarContext.Provider>
    )
}

const CalendarConsumer = CalendarContext.Consumer
export { CalendarContext, CalendarConsumer, CalendarProvider }