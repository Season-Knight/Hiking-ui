//example of function
import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
// import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import {uriBase, api} from '../const'
import {LoginContext} from './LoginContext'


const useStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        // "background-color": "grey"
      },
      
    },
  }));

  
export default function SignUp (props){
    const classes = useStyles();

    let [message, setMessage] = React.useState(props.initialMessage)
 //first is the variable we use, the 2nd is the function to change the variable
 //function will be set as an arrow function
    let [fName, setfName] = React.useState("")
    let [lName, setlName] = React.useState("")
    let [userName, setUserName] = React.useState("")
    let [password, setPassword] = React.useState("")
    let [email, setEmail] = React.useState("")
    let {userId, setUserId} = useContext(LoginContext)
    
    const onClickHandler = (event) => {
        event.preventDefault()
        let formData = new FormData()
        formData.append("fName", fName)
        formData.append("lName", lName)
        formData.append("email", email)
        formData.append("userName", userName)
        formData.append("password", password)
        formData.append("numberGoal", 0)
        formData.append("milesGoal", 0)
        formData.append("elevationGoal", 0)
           
            

        fetch(`${uriBase}${api}/users/signup`,{
            method: "POST",
            body: formData
        })
        .then(HttpRequest => {
            if(!HttpRequest.ok){
                throw new Error ("Sign up Failed")
            }
                return HttpRequest.json()
        })
        .then(user => {
            //ToDo Handle User
            setUserId(user._id)
            setMessage("Welcome!")
            props.history.push("/Mainpage") //redirect
        })
        .catch(error => {
            console.log(error)
        })

        setMessage("You are Signed Up!")
    }

    const onChangeHandler = (event) => {
        switch (event.target.name) {
            case 'fName':
                setfName(event.target.value)
                break
            case 'lName':
                setlName(event.target.value)  
                break  
            case 'email':
                setEmail(event.target.value)  
                break  
            case 'userName':
                setUserName(event.target.value)   
                break
            case 'password':
                setPassword(event.target.value)
                break

                default: 
        }
    }
    return (
        <div className={classes.root}>
            <h1>{message}</h1>
            <form>
            <div>
               <input type= "text" placeholder="First Name" onChange={onChangeHandler} name="fName" value={fName}></input><br></br>
             <input placeholder="Last Name" onChange={onChangeHandler} name="lName" value={lName}></input><br></br>
                <input placeholder = "E-Mail" onChange={onChangeHandler} name="email" value={email}></input><br></br>
             <input placeholder = "User Name" onChange={onChangeHandler} name='userName' value={userName}></input><br></br>
              <input placeholder = "Password" onChange={onChangeHandler} name='password' value={password}></input><br></br>
            </div>
            <div>
            <input type='submit' onClick={onClickHandler}></input><br></br>
            </div>
            </form>
            <div>
            <Link to="Mainpage">Back to Login </Link><br></br>
           
            </div>
        </div>
    )
}