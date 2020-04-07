import React, {useState, useEffect}from 'react'
import { uriBase, api } from '../const';

///context wil have a provider and consumer
const LoginContext = React.createContext()

 function LoginProvider(props) {

    const [loggedIn, setLoggedIn] = useState(false)
    const [token, setToken] = useState("")


    const writeToken= (token)=> {
        //todo
       window.localStorage.setItem('token', token)
        //Persist token to local storage
        setToken(token)
    }
    const verifyToken = ()=> {
        const token = window.localStorage.getItem('token')
        fetch(`${uriBase}${api}/users/auth/verifytoken`, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(httpResponse => {
            if (!httpResponse.ok) {
                throw new Error("Unable to verify stored token")
            }
            return httpResponse.json()
        })
        .then(response => {
            
            if (response.hasOwnProperty("token")) {
                setLoggedIn(true)
                writeToken(response.token)
                
                // props.history.push('/users')
            } else {
                setLoggedIn(false)
                writeToken("")
                
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    useEffect(() =>{
        verifyToken()
    })

    return (
        <LoginContext.Provider value ={{loggedIn, setLoggedIn, token, writeToken}}>
            {props.children}
        </LoginContext.Provider>
    )
}

const LoginConsumer = LoginContext.Consumer
export {LoginContext, LoginConsumer, LoginProvider}