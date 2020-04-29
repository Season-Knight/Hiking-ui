import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import MyBlog from './MyBlog'
import Mainpage from './Mainpage'
import Chart from './Chart'
import SignUp from './SignUp'
import Calendar from './Calendar'
import {LoginProvider} from './LoginContext'
import {CalendarProvider} from './CalendarContext'
import ProtectedRoutes from './ProtectedRoutes'
import GoalGraph from './GoalGraph'
import ProfilePage from './ProfilePage'
// import UsersF from './UsersF'


export default function MainRouter(){

    return (
        <div>
            <Router>
                <LoginProvider>
                   <CalendarProvider>
                <Switch>

    <ProtectedRoutes path="/Chart" render={(props) => <Chart {...props} initialMessage="Track Your Hikes Here ;)" />}></ProtectedRoutes> 
                        
                    <Route path= "/MyBlog">
                            <MyBlog></MyBlog>
                        </Route>
                        <Route path= "/SignUp" render ={(props) => <SignUp initialMessage ="Sign Up!" {...props}></SignUp> }>
                           
                        </Route> 
                        <Route path="/GoalGraph" component={GoalGraph} initialMessage="Goal Graph"></Route> 
                        {/* <ProtectedRoutes path ="/users" component = {UsersF}></ProtectedRoutes> */}
                        <Route path= "/Calendar" component = {Calendar}></Route> 
                        <ProtectedRoutes path= "/ProfilePage" component = {ProfilePage}></ProtectedRoutes>      
                        <Route path="/" component= {Mainpage} initialMessage="Welcome Adventurer!"></Route>
                       
                       
                </Switch>
                </CalendarProvider>
                </LoginProvider>                
            </Router>    
        </div>
    )
}