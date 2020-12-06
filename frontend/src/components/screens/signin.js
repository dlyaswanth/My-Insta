import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'
const Signin = () => {
    const {state,dispatch}=useContext(UserContext)
    const [value,setValue]=useState(false)
    const history = useHistory()
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const postdata= (btn)=>{
        document.getElementById("btn").disabled = true;
        M.toast({html:"Please Wait...",classes:"green",outDuration:"1000",timeOut:"800"});
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
             M.toast({html:"Invalid Email",classes:"red"})
             document.getElementById("btn").disabled = false
             return 
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                password,
                email
            })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                M.toast({html: data.error,classes:"red"})
                document.getElementById("btn").disabled = false;
            }
                else
                {
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("User",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"Logged in",classes:"#757575 grey darken-1"})
                    history.push('/')
                }
        }).catch(error=>{
            console.log("Error Occured: ",error)
        })
    }
    return ( 
        <>
        <h4 style={{textAlign:"center"}}>Log In</h4>
        <div className="cn1 input-field signin">
            <div className="card1">
            <div className="file-field input-field">
                <div className="btn btn1 disabled">
                    <i className="fas fa-envelope new1" aria-hidden="true"></i>
                </div>
                <div className="file-path-wrapper input-field">
                <input className="input1" type="text" placeholder="Mail Id"
                value={email}
                onChange={(er)=>setEmail(er.target.value)} required/></div>
                </div>
                <div className="file-field input-field">
            <div className="btn btn1 disabled">
            <i className="fa fa-key new1" aria-hidden="true"></i>
            </div>
            <div className="file-path-wrapper input-field">
            <input className="input1" type="password" placeholder="Password" value={password} onChange={(er)=>setPassword(er.target.value)} required/>
            </div>
            </div>
            <button className="btlogin" id="btn" onClick={()=>postdata()}>Login</button>
        </div>
        <h5>
            <Link to="/reset" ><p className="home1">Forgot Password</p></Link></h5>
        </div>
        </>
    )
}
export default Signin