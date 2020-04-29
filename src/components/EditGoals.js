import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { uriBase, api } from '../const'
import EditIcon from '@material-ui/icons/Edit';
import {LoginContext} from './LoginContext'
import Button from '@material-ui/core/Button'; 
import yellow from '@material-ui/core/colors/yellow'


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
const color = yellow[500]
const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 500,
        backgroundColor: 'black',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    button: {
        color: yellow[500]
    }
}));

export default function EditGoals(props) {
   
    const classes = useStyles();
    // console.log(props.hike)
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
       
    const [numberGoal, setNumberGoal] = React.useState(props.user.numberGoal)
    const [elevationGoal, setElevationGoal] = React.useState(props.user.elevationGoal)
    const [milesGoal, setMilesGoal] = React.useState(props.user.milesGoal)
    const [message, setMessage] = React.useState("");    

    const onChangeHandler = (event) => {
        switch (event.target.name) {
            case 'numberGoal':
                setNumberGoal(event.target.value)
                break
            case 'milesGoal':
                setMilesGoal(event.target.value)  
                break  
            case 'elevationGoal':
                setElevationGoal(event.target.value)   
                break
             
                default: 
        }
    }
    
  

    const onSaveHandler = () => {
        
        let update = {}
        
       
      
            // we are editing, patching

            if (props.user.numberGoal !== numberGoal || props.user.numberGoal === undefined) {
                update.numberGoal = numberGoal
            }
            if (props.user.milesGoal !== milesGoal || props.user.milesGoal === undefined) {
                update.milesGoal = milesGoal
            }
            if (props.user.elevationGoal !== elevationGoal || props.user.elevationGoal === undefined) {
                update.elevationGoal = elevationGoal
            }
         
        

        
        //make sure we do not update a blank object
        if (Object.entries(update).length > 0) {
            //patch or put
            fetch(`${uriBase}${api}/users/${props.user._id}`, {
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
            <Button 
                variant="contained"
                color="secondary"
                size="large"
                className={classes.button}
                startIcon={<EditIcon /> }
                onClick={handleOpen}>Edit Goals

            </Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <h1>Set or Change your Goals!</h1>
                    <div>
                        
                         Number of Hikes Completed Goal<input type="number" onChange={onChangeHandler} name='numberGoal' value={numberGoal}></input><br></br>
                         Miles Hiked Goal<input type="number" onChange={onChangeHandler} name='milesGoal' value={milesGoal}></input><br></br>
                         Elevation Climbed Overall Goal<input type="number" onChange={onChangeHandler} name='elevationGoal' value={elevationGoal}></input><br></br>
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
