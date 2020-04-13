import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { uriBase, api } from '../const'
import { setDate } from 'date-fns';

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

export default function SimpleModal(props) {

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(props.day)
  const [time, setTime] = React.useState("");
  const [eventTitle, setEventTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("")
  const [events, setEvents] = React.useState({ events: [] });

  const [message, setMessage] = React.useState("");


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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

  const onSaveHandler = (event) => {
    event.preventDefault()


    let formData = new FormData()
    formData.append("date", date)
    formData.append("time", time)
    formData.append("eventTitle", eventTitle)
    formData.append("location", location)
    formData.append("description", description)


    fetch(`${uriBase}${api}/events`, {
      method: "POST",
      body: formData
    })
      .then(HttpRequest => {
        if (!HttpRequest.ok) {
          throw new Error("Add Event Failed")
        }
        return HttpRequest.json()
      })
      .then(event => {
        //ToDo Handle User
        setMessage("Event Added!")

      })
      .catch(error => {
        console.log(error)
      })

    setMessage("Event Added!")
  }

  const onCancelHandler = () => {

    setDate("")
    setTime("")
    setEventTitle("")
    setLocation("")
    setDescription("")

  };



  return (
    <div>
      <Tooltip title="Add new event">

        <IconButton aria-label="Add new event" onClick={handleOpen}>
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}

      >
        <div style={modalStyle} className={classes.paper}>
          <h1>Enter your event information here!</h1>
          <form>
            <div>
              Date<input type="date" onChange={onChangeHandler} name="date" value={date}></input><br></br>
              Time<input type="time" onChange={onChangeHandler} name="time" value={time}></input><br></br>
              Title<input type="text" onChange={onChangeHandler} name="eventTitle" value={eventTitle}></input><br></br>
              Location<input type="text" onChange={onChangeHandler} name='location' value={location}></input><br></br>
              Description<input type="text" onChange={onChangeHandler} name='description' value={description}></input><br></br>

            </div>

            <div>
              <button onClick={onSaveHandler}>Save</button><br></br>
              <button onClick={onCancelHandler}>Close</button>
              <h4>{message}</h4>
            </div>
          </form>

          <SimpleModal />
        </div>
      </Modal>
    </div>
  );
}