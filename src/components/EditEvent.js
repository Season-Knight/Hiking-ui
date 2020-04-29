import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { uriBase, api } from '../const'
import EditIcon from '@material-ui/icons/Edit';
import objectId from 'bson-objectid'
import Events from './Events'
import Button from '@material-ui/core/Button';


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 500,
        backgroundColor: 'black',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function EditEvent(props) {
   
    const classes = useStyles();
    // console.log(props.hike)
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [date,setDate] = React.useState(props.event.date)
    const [time, setTime] = React.useState(props.event.time);
    const [eventTitle, setEventTitle] = React.useState(props.event.eventTitle);
    const [location, setLocation] = React.useState(props.event.location);
    const [description, setDescription] = React.useState(props.event.description);
   
    const [message, setMessage] = React.useState("");    

    const onChangeHandler = (event) => {
        switch (event.target.name) {
            case 'date':
                setDate(event.target.value)
                break
            case 'time':
                setTime(event.target.value)
                break    
            case 'eventTitle':
                setEventTitle(event.target.value)  
                break  
            case 'location':
                setLocation(event.target.value)   
                break
            case 'description':
                setDescription(event.target.value)
                break
            
                default: 
        }
    }
    
  

    const onSaveHandler = () => {
       
        let update = {}      
            // we are editing, patching

            if (props.event.date !== date || props.event.date === undefined) {
                update.date = date
            }
            if (props.event.time !== time || props.event.time === undefined) {
                update.time = time
            }
            if (props.event.eventTitle !== eventTitle || props.event.eventTitle === undefined) {
                update.eventTitle = eventTitle
            }
            if (props.event.location !== location || props.event.location === undefined) {
                update.location = location
            }
            if (props.event.description !== description || props.event.description === undefined) {
                update.description = description
            }   

        
        //make sure we do not update a blank object
        if (Object.entries(update).length > 0) {
            //patch or put
            fetch(`${uriBase}${api}/events/${props.event._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(update)
            })
                .then(HttpResponse => {
                    if (!HttpResponse.ok) {
                        throw new Error(`Coudn't Patch`)
                    }
                    return HttpResponse.json()
                })
                .then(event => {
                    handleClose()
                    props.refresh()

                })
                .catch(error => {
                    console.log(error)
                })
        }
    }


    const handleOpen = () => {
        setOpen(true);
       

    };

    const handleClose = () => {
        setOpen(false);
        
    };

    const onDeleteClickHandler = (event) => {
        const id = event._id
        fetch(`${uriBase}${api}/events/${props.event._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(HttpResponse => {
                if (!HttpResponse.ok) {
                    throw new Error("Delete Failed")
                }
                return HttpResponse.json()
            })
            .then(response => {
                console.log('deleted')
                // props.refresh()
            })
            .catch(error => {
                console.log(error)
            })
    }

    

    return (
        <div>
            
                <Button variant="outlined" size="small" color="primary" onClick={handleOpen}>{`${props.event.time} ${props.event.eventTitle}`}</Button>
           
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <h1>Edit your event</h1>
                    <div>
                    Date<input type="date" onChange={onChangeHandler} name="date" value={date}></input><br></br>
                    Time<input type="time" onChange={onChangeHandler} name="time" value={time}></input><br></br>
                    Title<input type="text" onChange={onChangeHandler} name="eventTitle" value={eventTitle}></input><br></br>
                    Location<input type="text" onChange={onChangeHandler} name='location' value={location}></input><br></br>
                    Description<input type="text" onChange={onChangeHandler} name='description' value={description}></input><br></br>

                    </div>

                    <div >
                        <br></br>
                        <Button variant="outlined" size="small" color="secondary" onClick={onSaveHandler}>Update Event</Button><br></br>
                        <Button variant="outlined" size="small"color="primary" onClick={onDeleteClickHandler}>Delete Event</Button><br></br>
                        <Button variant="outlined" size="small" color="secondary" onClick={handleClose}>Close</Button>
                        <h4>{message}</h4>
                    </div>


                    
                </div>
            </Modal>
        </div>
    );
}
