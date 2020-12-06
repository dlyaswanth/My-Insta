import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Reset = () => {
    const history = useHistory()
    const [email,setEmail]=useState("")
    const postdata= ()=>{
        M.toast({html:"Please Wait...",classes:"green",inDuration:"600"});
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
             M.toast({html:"Invalid Email",classes:"red"})
             return 
        }
        fetch("/resetpassword",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                email
            })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                M.toast({html: data.error,classes:"red"})
            }
                else
                {
                    M.toast({html:data.message,classes:"#757575 grey darken-1"})
                    history.push('/signin')
                }
        }).catch(error=>{
            console.log("Error Occured: ",error)
        })
    }
    return ( 
        <>
        <h4 style={{textAlign:"center"}}>Reset Password</h4>
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
            <button className="btlogin" onClick={()=>postdata()}>Reset</button>
        </div>
        </div>
        </>
    )
}
export default Reset