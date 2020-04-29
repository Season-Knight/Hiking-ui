import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { uriBase, api } from '../const'
import EditIcon from '@material-ui/icons/Edit';
import objectId from 'bson-objectid'
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory'



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

export default function EditModal(props) {
   
    const classes = useStyles();
    // console.log(props.hike)
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
        
    const [hikeDate, setHikeDate] = React.useState(props.hike.hikeDate);
    const [hikeName, setHikeName] = React.useState(props.hike.hikeName);
    const [totalMiles, setTotalMiles] = React.useState(props.hike.totalMiles);
    const [elevationGain, setElevationGain] = React.useState(props.hike.elevationGain);
    const [peakElevation, setPeakElevation] = React.useState(props.hike.peakElevation);
    const [hikeRating, setHikeRating] = React.useState(props.hike.hikeRating);
    const [message, setMessage] = React.useState("");    

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
                default: 
        }
    }
    
  

    const onSaveHandler = () => {
        // const id = dbHikes[index]._id
        let update = {}
        
       

       
            // we are editing, patching

            if (props.hike.hikeDate !== hikeDate || props.hike.hikeDate === undefined) {
                update.hikeDate = hikeDate
            }
            if (props.hike.hikeName !== hikeName || props.hike.hikeName === undefined) {
                update.hikeName = hikeName
            }
            if (props.hike.totalMiles !== totalMiles || props.hike.totalMiles === undefined) {
                update.totalMiles = totalMiles
            }
            if (props.hike.elevationGain !== elevationGain || props.hike.elevationGain === undefined) {
                update.elevationGain = elevationGain
            }
            if (props.hike.peakElevation !== peakElevation || props.hike.peakElevation === undefined) {
                update.peakElevation = peakElevation
            }
            if (props.hike.hikeRating !== hikeRating || props.hike.hikeRating === undefined) {
                update.hikeRating = hikeRating
            }
        

        
        //make sure we do not update a blank object
        if (Object.entries(update).length > 0) {
            //patch or put
            fetch(`${uriBase}${api}/hikes/${props.hike._id}`, {
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
                .then(user => {
                    handleClose()
                    // props.refresh()

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

  
  

    return (
        <div>
            <IconButton>
                <EditIcon onClick={handleOpen}>Edit</EditIcon>
            </IconButton>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <h1>Edit your hike!</h1>
                    <div>
                        Hike Date<input type="text" onChange={onChangeHandler} name="hikeDate" value={hikeDate}></input><br></br>
                        Trail Name<input type="text" onChange={onChangeHandler} name="hikeName" value={hikeName}></input><br></br>
                        Total Miles<input type="number" onChange={onChangeHandler} name='totalMiles' value={totalMiles}></input><br></br>
                        Elevation Gain<input type="number" onChange={onChangeHandler} name='elevationGain' value={elevationGain}></input><br></br>
                        Peak Elevation<input type="number" onChange={onChangeHandler} name='peakElevation' value={peakElevation}></input><br></br>
                        Hike Rating <Tooltip title="Very Easy" color='blue'>
              <IconButton>
			<ChangeHistoryIcon aria-label='Very Easy' style={{
              color: 'blue',
              fontSize: 18,
              value: "Very Easy",  }} 
              onClick= {() => setHikeRating("1-Very Easy")}
              onHover= "<ChangeHistoryOutlineIcon/>" />
			</IconButton>
      </Tooltip>
      <Tooltip title="Easy">
			<IconButton>
            <ChangeHistoryIcon aria-label='Easy' style={{
              color: 'green',
              fontSize: 22,
              value: 2,  
            }} 
            onClick= {() => setHikeRating("2-Easy")}/>
			</IconButton>
      </Tooltip>
      <Tooltip title="Moderate">
			<IconButton>
             <ChangeHistoryIcon aria-label='Moderate' style={{
              color: 'yellow',
              fontSize: 26,
              value: 3,  
            }} 
            onClick= {() => setHikeRating("3-Moderate")}/>
			</IconButton>
      </Tooltip>
      <Tooltip title="Somewhat Difficult">
			<IconButton>
             <ChangeHistoryIcon aria-label='Somewhat Difficult' style={{
              color: 'orange',
              fontSize: 30,
              value: 4,  
            }}
            onClick= {() => setHikeRating("4-Somewhat Difficult")} />
			</IconButton>
      </Tooltip>
      <Tooltip title="Difficult">
			<IconButton>
             <ChangeHistoryIcon aria-label='Difficult' className="test" style={{
              color: 'red',
              fontSize: 34,
              value: 5,  
            }} 
            onClick= {() => setHikeRating("5-Difficult")}/>
			</IconButton> 
      </Tooltip>  
      <br></br>
      Level={hikeRating}
                    </div>

                    <div style={{color: 'red'}}>
                        <button onClick={onSaveHandler}>Save</button><br></br>
                        <button onClick={handleClose}>Cancel</button>
                        <h4>{message}</h4>
                    </div>


                    
                </div>
            </Modal>
        </div>
    );
}
