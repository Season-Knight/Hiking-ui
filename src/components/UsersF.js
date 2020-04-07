import React from 'react';
import { uriBase, api } from '../const'
//function structure
//effect functions
import { Link } from 'react-router-dom'
import objectId from 'bson-objectid'
import {LoginContext} from '/logincontext'

export default function UsersF(props) {
    const [users, setUsers] = React.useState([])
    //form data

    const [id, setId] = React.useState(objectId())
    const [fName, setfName] = React.useState("")
    const [lName, setlName] = React.useState("")
    const [userName, setUserName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showId, setShowId] = React.useState(true)


    const refresh = () => {

        fetch(`${uriBase}${api}/users`, {
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
            })
            .catch(error => {
                console.log(error)
            })
    }
    const onEditClickHandler = (event, index) => {
        let user = users[index]
        setId(user._id)
        setfName(user.fName)
        setlName(user.lName)
        setUserName(user.userName)
        setPassword(user.password)
        setShowId(false)
    }
    const onSaveHandler = () => {
        let update = {}
        let method = "PATCH"
        let user= users.find((user) => {
            return user._id === id
        })
        
        if (user !== undefined){
            //found we are editing, patching
            
                        if (user.fName !== fName || user.fName === undefined) {
                            update.fName = fName
                        }
                        if (user.lName !== lName || user.lName === undefined) {
                            update.lName = lName
                        }                 
                        if (user.userName !== userName || user.userName === undefined) {
                            update.userName = userName
                        }
                        if (user.password !== password || user.password === undefined) {
                            update.password = password
                        }
                                  
                 
            }//end of if statment

        else {
            //not found, we are posting
            method = "PUT"
            update._id = id
            update.fName = fName
            update.lName = lName
            update.userName = userName
            update.password = password


        }
        //make sure we do not update a blank object
        if (Object.entries(update).length > 0)  {
        //patch or put
            fetch(`${uriBase}${api}/users/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(update)
    })
    .then(HttpResponse => {
        if (!HttpResponse.ok) {
            throw new Error(`Coudn't ${method}`)
        }
        return HttpResponse.json()
    })
    .then(user => {
        onCancelHandler()
        refresh()
       
    })
    .catch(error => {
        console.log(error)
    })
}
}
    const onCancelHandler = () => {
        setId(objectId())
        setfName("")
        setlName("")
        setUserName("")
        setPassword("")
        setShowId(true)

    }
    const onDeleteClickHandler = (index) => (event) => {
        const id = users[index]._id
        fetch(`${uriBase}${api}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
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
                refresh()
            })
            .catch(error => {
                console.log(error)
            })
    }
    React.useEffect(() => {
        refresh()
    }, [])

    const onChangeHandler = (event) => {
        switch (event.target.name) {
            case 'id':
                setId(event.target.value)
                break
            case 'fName':
                setfName(event.target.value)
                break
            case 'lName':
                setlName(event.target.value)
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
    const idField =() =>{
        let rtnVal = null
        if (showId === true) {
            rtnVal = (       
            <div>
                ID<input onChange={onChangeHandler} type="text" name="id" value={id}></input><br></br>
            </div>
        )
        }
        return rtnVal
    }

    return (
        <div>
            <h1>Users</h1>
            <div>
                <ul>
                    {
                        users.map((user, index) => {
                            return (
                                <li key={index}> {user.fName} {user.lName}
                                    <button onClick={(event) => { onEditClickHandler(event, index) }}>Edit</button>
                                    <button onClick={(event) => { onDeleteClickHandler(event, index) }}>Delete</button>

                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div>
                {idField()}
                First Name<input type="text" onChange={onChangeHandler} name="fName" value={fName}></input><br></br>
                Last Name<input type="text" onChange={onChangeHandler} name="lName" value={lName}></input><br></br>
                User Name<input type="text" onChange={onChangeHandler} name='userName' value={userName}></input><br></br>
                Password<input type="text" onChange={onChangeHandler} name='password' value={password}></input><br></br>
            </div>
            <div>
                <button onClick={onSaveHandler}>Save</button>
                <button onClick={onCancelHandler}>Cancel</button>
            </div>




            <div>
                <Link to="login">Back to Login </Link><br></br>
                <Link to="signup">Back to Sign Up </Link><br></br>

            </div>
         </div>   
       )
       } 
