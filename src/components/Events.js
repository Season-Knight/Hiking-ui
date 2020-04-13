import React, { useState } from "react";
import format from "date-fns/format";
import parse from "date-fns/parse";
import isSameDay from "date-fns/isSameDay";
import EditEvent from "./EditEvent"
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

// const useStyles = makeStyles(theme => ({
//     root: {
//         width: '100%',
//         maxWidth: 360,
//         backgroundColor: theme.palette.background.paper,
//     },
// }));


export default function Events(props) {

    // const classes = useStyles();

    const todaysEvents = props.events.filter((event) => {

        // compare the date portion of the date/time object to see
        // if this event is for this day
        // day is passed in and an array of all events
        // is passed in
        //isSameDay requires 2 arguments, dates dateLeft and dateRight, returns boolean
        if(isSameDay(event.dateTime, props.day) === true)

        return(event.time, event.eventTitle)
            
    })


    //formating time Hour= h for 1-12, am/pm = A
    return (
        todaysEvents.length > 0 ? (
        <div >
            <List>
                {
                    todaysEvents.map(event => {

                        return (
                            <div>
                                <ListItem>
                                    {/* <button 
                                // selected={selectedIndex === 0}
                                // onClick={event => handleListItemClick(event, 0)}
                                ></buttton> */}
                                    {/* <ListItemText primary={format(event.dateTime, "h m")} /> */}
                                <EditEvent event = {event} refresh = {props.refresh}></EditEvent>
                                </ListItem>
                                <br></br>
                                <br></br>
                                {/* <Divider /> */}
                            </div>
                        )
                    })
                }
            </List>
        </div>
        ) : (
            null
        )
    );
}




