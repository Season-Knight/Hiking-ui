//example of function
import React, { useContext, useState, useEffect } from 'react'
import './Mainpage.css'
import { Link as RLink } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import { uriBase, api } from '../const';
import Icon from '@material-ui/core/Icon'
import CheckIcon from '@material-ui/icons/Check';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { LoginContext } from './LoginContext';
import queryString from 'query-string';
import teal from '@material-ui/core/colors/teal';

const primary = teal[500];

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
}));

export default function MainPage(props) {
    const [name, setName] = useState(props.initialMessage)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    // const [loggedInMsg, setLoggedInMsg] = useState("The Mountains are Calling")
    const [email, setEmail] = useState("")

    const { loggedIn, setLoggedIn, token, writeToken } = useContext(LoginContext)
    const onClickHandler = () => {
        

        let body = {
            email,
            password,
        }
        fetch(`${uriBase}${api}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(httpResponse => {
                if (!httpResponse.ok) {
                    throw new Error("Unable to Login")
                }
                return httpResponse.json()
            })
            .then(response => {
                console.log(response)

                if (response.hasOwnProperty("token")) {
                    setLoggedIn(true)
                    writeToken(token)
                    // setLoggedInMsg("Going to the Top!")
                } else {
                    setLoggedIn(false)
                    writeToken("")
                    // setLoggedInMsg("You're off Trail, Try Again")
                }
            })

            //     if (token.hasOwnProperty("fName")){
            //         this.setState({loggedIn: "Woohoo its go time!"})
            //     } else {
            //         this.setState({loggedIn: "Are you lost?"})
            //     }
            // })
            .catch(error => {
                console.log(error)
            })
    }
    // onChangeHandler =(event) =>{
    //     this.setState({[event.target.name]: event.target.value})
    //     console.log(this.state)
    // }

    const getLogin = () => {
        window.location.href = `${uriBase}/API/v1/users/auth/googlelogin`
    }
    const isLoggedIn = () => {

        const parsed = queryString.parseUrl(window.location.href);
        if (Object.keys(parsed.query).length > 0) {
            let query = {...parsed.query}
            if (query.hasOwnProperty("token")) {
               console.log("TOKEN", parsed.query.token)
               verifyToken(query.token)
                //props.history.push('/chart')
            }
        }
    }

    const verifyToken = (token)=> {
        fetch(`${uriBase}${api}/users/auth/verifytoken`, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(httpResponse => {
            if (!httpResponse.ok) {
                throw new Error("Unable to Login")
            }
            return httpResponse.json()
        })
        .then(response => {
            
            if (response.hasOwnProperty("token")) {
                setLoggedIn(true)
                writeToken(response.token)
                // setLoggedInMsg("Going to the Top!")
                props.history.push('/users')
            } else {
                setLoggedIn(false)
                writeToken("")
                // setLoggedInMsg("You're off Trail, Try Again")
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        isLoggedIn()
    }, [])

    return (
        <div>
            <div>
                <h1>{name}</h1>
                <h1>The Mountains are calling...</h1>
                <h2>{loggedIn ? "And I must Go!" : "You're off Trail, Try Again."}</h2>
                <div className="signin">
                    {/* User Name<span></span><input onChange={(event) => setUserName(event.target.value)} name="userName" value={userName}></input><br></br> */}
                    E-Mail<input onChange={(event) => setEmail(event.target.value)} name="email" value={email}></input><br></br>
                    Password<input onChange={(event) => setPassword(event.target.value)} name="password" value={password}></input><br></br>
                </div>
            </div>
            <div>
                <br></br>
                <Button
                    variant="contained"
                    color= "primary"
                    startIcon={<CheckIcon />}
                    onClick={onClickHandler} >Log In</Button><br></br><br></br>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EmojiEmotionsIcon />}
                    to="/signup"
                    component={RLink}
                >Sign Up</Button>
                <br></br>
                <br></br>
                <Button 
                variant="contained"
                color="primary"
                onClick={getLogin}><img scr={`${uriBase}/images/btn_google_signin_light_focus_web@2x.png`} alt="Google Login" /></Button><br></br>
                <br></br>
                <RLink to="/Chart">Track Your Hikes Here!</RLink><br></br>
                <br></br>
                <RLink to="/MyBlog">My Summit Blog!</RLink><br></br>
                <br></br>
                <RLink to="/GoalGraph">Goal Graph</RLink>
                {/* <Link to="/Calendar">Calendar</Link> */}

            </div>
        </div>
        //can do onclick as an arrow function however with the this you dont have to call and define it everytime
    )
}

