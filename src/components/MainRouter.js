import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
// import Tracker from './TrackerForm'
import MyBlog from './MyBlog'
import Mainpage from './Mainpage'
import Chart from './Chart'
import SignUp from './SignUp'
import Calendar from './Calendar'
import {LoginProvider} from './LoginContext'
import {CalendarProvider} from './CalendarContext'
import ProtectedRoutes from './ProtectedRoutes'
import GoalGraph from './GoalGraph'
// import UsersF from './UsersF'
// import Tokenator from './Tokenator'

export default function MainRouter(){

    return (
        <div>
            <Router>
                <LoginProvider>
                   <CalendarProvider>
                <Switch>

                <Route path="/Chart" component={Chart} initialMessage="Track Your Hikes Here ;)"></Route> 
                        
                    <Route path= "/MyBlog">
                            <MyBlog></MyBlog>
                        </Route>
                        <Route path= "/SignUp" render ={(props) => <SignUp initialMessage ="Sign Up!" {...props}></SignUp> }>
                           
                        </Route>  
                        {/* <ProtectedRoutes path ="/users" component = {UsersF}></ProtectedRoutes> */}
                        <Route path= "/Calendar" component = {Calendar}></Route>       
                        <Route path="/" component= {Mainpage} initialMessage="Welcome Adventurer!"></Route>
                        <Route path="/GoalGraph" component={GoalGraph} initialMessage="Goal Graph"></Route>
                       
                </Switch>
                </CalendarProvider>
                </LoginProvider>                
            </Router>    
        </div>
    )
}