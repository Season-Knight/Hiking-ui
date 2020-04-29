/*
 * Profile Page will have the ability to edit user information
 * Upload pictures
 * Set Goals
 * Link to Calendar, Goals, Blog, 
 */

import React, { Component, useContext } from 'react'
import { Link as RLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './ProfilePage.css'
import { uriBase, api } from '../const'
import LinearProgress from '@material-ui/core/LinearProgress';
import { LoginContext } from './LoginContext'
import EditGoals from './EditGoals'
import Carousel, { Dots } from '@brainhubeu/react-carousel'
import '@brainhubeu/react-carousel/lib/style.css'
import AutumnTrail from './assets/images/AutumnTrail.jpg'
import SpringMountain from './assets/images/SpringMountain.jpg'
import WinterScene from './assets/images/WinterScene.jpg'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        // height: 300,
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white',
    },
}));

export default function ProfilePage(props) {
    const [goal, setGoal] = React.useState('')
    const [hikes, setHikes] = React.useState([])
    const [numberGoal, setNumberGoal] = React.useState('')
    const [elevationGoal, setElevationGoal] = React.useState('')
    const [milesGoal, setMilesGoal] = React.useState('')
    const [users, setUsers] = React.useState({})

    const { userId, setUserId } = useContext(LoginContext)
    const classes = useStyles()

    const editGoals = (event) => {
        setNumberGoal(event.target.value)
        setMilesGoal(event.target.value)
        setElevationGoal(event.target.value)
    }


    const refresh = () => {
        console.log(userId)
        fetch(`${uriBase}${api}/users/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(HttpResponse => {
                if (!HttpResponse.ok) {
                    throw new Error("Bad Response")
                }
                return HttpResponse.json()
            })
            .then(response => {
                console.log(response)
                setUsers(response)
                setUserId(response._id)
                fetch(`${uriBase}${api}/hikes/userhikes/${response._id}`, {

                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(HttpResponse => {
                        if (!HttpResponse.ok) {
                            throw new Error("Bad Response")
                        }
                        return HttpResponse.json()
                    })
                    .then(response => {
                        console.log(response)
                        console.log(response.length)
                        setHikes(response)

                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                console.log(error)
            })

        console.log('getting hikes for user')
        console.log(users)

    }

    React.useEffect(() => {
        refresh()
    }, [])

    const calcPercent = (obtained, goal) => {
        // let obtained = hikes.length
        // let goal = users.numberGoal
        return Math.round(obtained / goal * 100)
    }

    const hikeMiles = () => {
        return hikes.reduce((total, { totalMiles }) => total += parseFloat(totalMiles), 0)
    }

    const hikeElevation = () => {
        return hikes.reduce((total, { elevationGain }) => total += parseFloat(elevationGain), 0)

    }



    return (
        <div>
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <h1 style={{fontFamily:'Emilys Candy'}}>Welcome <br></br><span style={{fontSize: 40}}></span>{users.fName} !
                            </h1>

                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                        <Carousel
                            autoPlay={3000}
                            animationSpeed={2000}
                            infinite >
                                <img src={AutumnTrail} alt="Autumn Trail" height='200' />
                                <h3>  "It’s not the mountain we conquer,<br></br> but ourselves."<br></br>-Sir Edmond Hillary</h3>
                                <img src={SpringMountain} alt="SpringMountain" height='200'/>
                                <h3> &nbsp;&nbsp; "There are no shortcuts to any place worth going."<br></br>&nbsp;&nbsp; -Beverly Sills</h3>
                                <img src={WinterScene} alt="Winter Scene" height='200' />
                                <h3 style={{alignItems: 'center'}}>&nbsp;&nbsp;  “Everyone wants to live on top of the mountain, <br></br>but all the happiness and growth <br></br>occurs while you are climbing it.”<br></br>&nbsp;&nbsp;&nbsp;&nbsp;-Andy Rooney</h3>
                            </Carousel>
        </Paper>
                    </Grid>
                    <Grid alignItems='left' item xs={12} sm={6}>
                        <Paper className={classes.paper} textAlign='left'><h1>Hiking Goals</h1>


                            <ul id="goals">
                                <li>
                                    <h3>Hike Total =&nbsp;&nbsp; <span style={{ color: "green", fontSize: 20 }}>
                                        {hikes.length} </span><span style={{float: 'center'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Goal = <span style={{ color: "green", fontSize: 20 }}>{users.numberGoal}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "green", fontSize: 25 }}>{calcPercent(`${hikes.length}`, `${users.numberGoal}`) + ' %'}</span></h3>
                                    <div class="container"></div>
                                    <div class="progress progress-moved1" style={{ width: calcPercent(`${hikes.length}`, `${users.numberGoal}`) + '%' }}>
                                        <div class="progress-bar2"></div>

                                    </div>
                                    <div id="percent-loaded" role="progressbar" aria-valuenow={hikes.length} aria-valuemin="0" aria-valuemax="100"></div>

                                    <h3>Total Miles=  <span style={{ color: "green", fontSize: 20 }}>{hikes.reduce((total, { totalMiles }) => total += parseFloat(totalMiles), 0)}
                                    </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Goal = <span style={{ color: "green", fontSize: 20 }}>{users.milesGoal}
                                        </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ float: 'right' }}>   <span style={{ color: "green", fontSize: 25 }}>{calcPercent(`${hikeMiles()}`, `${users.milesGoal}`)+ ' %'}</span></span>
                                    </h3>
                                    <div class="container"></div>
                                    <div class="progress progress-moved2" style={{ width: calcPercent(`${hikeMiles()}`, `${users.milesGoal}`) + '%' }}>
                                        <div class="progress-bar2"></div>

                                    </div>

                                    <h4>Total Elevation=   <span style={{ color: "green", fontSize: 20 }}>{hikes.reduce((total, { elevationGain }) => total += parseFloat(elevationGain), 0)}
                                    </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Goal = <span style={{ color: "green", fontSize: 20 }}>{users.elevationGoal}
                                        </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{ color: "green", fontSize: 25 }}>{calcPercent(`${hikeElevation()}`, `${users.elevationGoal}`)+ ' %'} </span></h4>
                                    <div class="container"></div>
                                    <div class="progress progress-moved3" style={{ width: calcPercent(`${hikeElevation()}`, `${users.elevationGoal}`) + '%' }}>
                                        <div class="progress-bar2"></div>

                                    </div>
                                    {/* <progress max="100" value="60" class="progressTest"></progress> */}
                                </li>
                                <br></br>
                                <li>
                                    <EditGoals user={users} style={{ color: 'yellow' }}></EditGoals>
                                </li>
                            </ul>

                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}><h1>Links</h1><br></br>
                            <RLink to="/Chart" style={{color: 'green', fontSize: 20}}>Track Your Hikes Here!</RLink><br></br>
                            <br></br>
                            <RLink to="/MyBlog" style={{color: 'yellow', fontSize: 20}}>My Summit Blog!</RLink><br></br>
                            <br></br>
                            <RLink to="/Calendar" style={{color: 'aqua', fontSize: 20}}>Calendar</RLink>
                        </Paper>
                    </Grid>
                    
                </Grid>
            </div>



        </div>

    )


}
