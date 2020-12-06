import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar'
import './App.css'
import { BrowserRouter, Route, Switch,useHistory } from 'react-router-dom'
import Home from './components/screens/home' 
import Signin from './components/screens/signin'
import Signup from './components/screens/signup'
import Profile from './components/screens/profile'
import Post from './components/screens/createpost'
import {reducer,init} from  './reducers/userReducer'
import User from './components/screens/user'
import Following from './components/screens/FollowingPost'
import EditProfile from './components/screens/editProfile'
import Reset from './components/screens/resetPassword'
export const UserContext=createContext()
const Routing =()=>{
    const history=useHistory()
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("User"))
        if(user){
            dispatch({type:"USER",payload:user}
            )
        }
        else
        {
            if (!history.location.pathname.startsWith('/reset'))
                history.push('/signin')
        }
    },[])
    return(
        <Switch>
            <Route exact path = "/" >< Home /></Route>  
            <Route path = '/signin' >< Signin /></Route> 
            <Route path = '/signup'>< Signup /></Route> 
            <Route exact path ='/profile'>< Profile /></Route> 
            <Route path ='/createpost'>< Post /></Route> 
            <Route exact path ='/profile/:userid'>< User/></Route> 
            <Route exact path ='/following'>< Following/></Route> 
            <Route path='/editProfile'><EditProfile /></Route>
            <Route path='/reset'><Reset /></Route>
        </Switch>
    )
}
function App() {
    const [state,dispatch]=useReducer(reducer,init)
    return ( 
        <UserContext.Provider value={{state,dispatch}}>
        <BrowserRouter>
        <NavBar />
        <Routing />
        </BrowserRouter >
        </UserContext.Provider>
    )
}
export default App;