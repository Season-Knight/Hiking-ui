import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { uriBase, api } from '../const'
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import { LoginContext } from './LoginContext'

const StyledRating = withStyles({
  iconFilled: {
    color: '#f73322',
  },
  iconHover: {
    color: '#079938',
  },
})(Rating);

const customIcons = {
  1: {
    icon: <ChangeHistoryIcon />,
    label: 'Very Easy',
    fontSize: 10,
    color: '#079938'
  },
  2: {
    icon: <ChangeHistoryIcon />,
    label: 'Easy',
    fontSize: 12,
    color: '#079938',
  },
  3: {
    icon: <ChangeHistoryIcon />,
    label: 'Moderate',
    fontSize: 12,
    textColor: 'blue',
  },
  4: {
    icon: <ChangeHistoryIcon />,
    label: 'Moderatly Difficult',
    fontSize: 14,
    color: 'yellow',
  },
  5: {
    icon: <ChangeHistoryIcon />,
    label: 'Very Difficult',
    fontSize: 16,
    color: 'red'
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};





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

export default function AddHike(props) {

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [hikeDate, setHikeDate] = React.useState("");
  const [hikeName, setHikeName] = React.useState("");
  const [totalMiles, setTotalMiles] = React.useState("");
  const [elevationGain, setElevationGain] = React.useState("");
  const [peakElevation, setPeakElevation] = React.useState("");
  const [hikeRating, setHikeRating] = React.useState("");
  const [message, setMessage] = React.useState("");

  const { userId, setUserId, token } = useContext(LoginContext)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeHandler = (event) => {
    switch (event.target.name) {
      case 'hikeDate':
        setHikeDate(event.target.value)
        break
      case 'hikeName':
        setHikeName(event.target.value)
        break
      case 'totalMiles':
        setTotalMiles(event.target.value)
        break
      case 'elevationGain':
        setElevationGain(event.target.value)
        break
      case 'peakElevation':
        setPeakElevation(event.target.value)
        break
      case 'hikeRating':
        setHikeRating(event.target.value)
        break
      default:
    }
  }

  const onSaveHandler = (event) => {
    // event.preventDefault()
    console.log(hikeDate)
    console.log(new Date(hikeDate.replace(/-/g, '\/')))

    let newHike = {
      userId: userId,
      hikeDate: (new Date(hikeDate.replace(/-/g, '\/'))).toISOString(),
      hikeName: hikeName,
      totalMiles: totalMiles,
      elevationGain: elevationGain,
      peakElevation: peakElevation,
      hikeRating: hikeRating
    }
    // let formData = new FormData()
    // formData.append("userId", userId)
    // formData.append("hikeDate", (new Date(hikeDate.replace(/-/g, '\/'))).toISOString())
    // formData.append("hikeName", hikeName)
    // formData.append("totalMiles", totalMiles)
    // formData.append("elevationGain", elevationGain)
    // formData.append("peakElevation", peakElevation)
    // formData.append("hikeRating", hikeRating)

    fetch(`${uriBase}${api}/hikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newHike)
      // body: formData
    })
      .then(HttpRequest => {
        if (!HttpRequest.ok) {
          throw new Error("Add Hike Failed")
        }
        return HttpRequest.json()
      })
      .then(hike => {
        //ToDo Handle User
        setMessage("Hike Added!")
        props.refresh()
      })
      .catch(error => {
        console.log(error)
      })


  }

  const onCancelHandler = () => {

    setHikeDate("")
    setHikeName("")
    setTotalMiles("")
    setElevationGain("")
    setPeakElevation("")
    setHikeRating("")

    handleClose()

  };

  return (
    <div>
      <Tooltip title="Add new hike">

        <IconButton aria-label="Add new hike" onClick={handleOpen}>
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
          <h1>Enter your hike information here!</h1>
            <div>
              Hike Date<input type="date" onChange={onChangeHandler} name="hikeDate" value={hikeDate}></input><br></br>
              Trail Name<input type="text" onChange={onChangeHandler} name="hikeName" value={hikeName}></input><br></br>
              Total Miles<input type="number" onChange={onChangeHandler} name='totalMiles' value={totalMiles}></input><br></br>
              Elevation Gain<input type="number" onChange={onChangeHandler} name='elevationGain' value={elevationGain}></input><br></br>
              Peak Elevation<input type="number" onChange={onChangeHandler} name='peakElevation' value={peakElevation}></input><br></br>
            </div>
            <div>
              Hike Rating <Tooltip title="Very Easy" bgColor='blue'>
                <IconButton >
                  <ChangeHistoryIcon aria-label='Very Easy' style={{
                    color: 'blue',
                    fontSize: 18,
                    value: "Very Easy"
                  }}
                    onClick={() => setHikeRating("1-Very Easy")}
                  />

                </IconButton>
              </Tooltip>
              <Tooltip title="Easy">
                <IconButton>
                  <ChangeHistoryIcon aria-label='Easy' style={{
                    color: 'green',
                    fontSize: 22,
                    value: 2,
                  }}
                    onClick={() => setHikeRating("2-Easy")} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Moderate">
                <IconButton>
                  <ChangeHistoryIcon aria-label='Moderate' style={{
                    color: 'yellow',
                    fontSize: 26,
                    value: 3,
                  }}
                    onClick={() => setHikeRating("3-Moderate")} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Somewhat Difficult">
                <IconButton>
                  <ChangeHistoryIcon aria-label='Somewhat Difficult' style={{
                    color: 'orange',
                    fontSize: 30,
                    value: 4,
                  }}
                    onClick={() => setHikeRating("4-Somewhat Difficult")} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Difficult">
                <IconButton>
                  <ChangeHistoryIcon aria-label='Difficult' className="test" style={{
                    color: 'red',
                    fontSize: 34,
                    value: 5,
                  }}
                    onClick={() => setHikeRating("5-Difficult")} />
                </IconButton>
              </Tooltip>
              <br></br>
              Level={hikeRating}
            </div>

            <div>
              <button onClick={onSaveHandler}>Save</button><br></br>
              <button onClick={onCancelHandler}>Close</button>
              <h4>{message}</h4>
            </div>
        </div>
      </Modal>
    </div>
  );
}
