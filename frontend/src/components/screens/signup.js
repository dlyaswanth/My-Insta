import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signup = () => {
    const history = useHistory()
    const [name,setName]=useState("")
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const [image,setImage]=useState("")
    var [about,setAbout]=useState("")
    const [url,setUrl]=useState(undefined)
    useEffect(()=>{
        if(url){
            uploadfeilds();
        }
    },[url])
    const profileUpload=()=>{
        const data= new FormData()
        data.append("file",image)
        data.append("upload_preset","my-insta")
        data.append("cloud_name","yash06")
        fetch("	https://api.cloudinary.com/v1_1/yash06/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(error=>{
            console.log("Error Occured: ",error)
        })
    }
    const uploadfeilds=()=>{
        document.getElementById("btn").disabled = true;
        M.toast({html:"Please Wait",classes:"green",inDuration:"600"});
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
            M.toast({html:"Invalid Email",classes:"#757575 grey darken-1"});
            document.getElementById("btn").disabled = false
            return 
       }
       fetch("/signup",{
           method:"post",
           headers:{
               "Content-Type":"application/json"
           },
           body:JSON.stringify({
               name,
               password,
               about,
               email,
               pic:url,
           })
           }).then(res=>res.json())
           .then(data=>{
               if (data.error){
               M.toast({html: data.error,classes:"#757575 grey darken-1"})
               document.getElementById("btn").disabled = false
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
    const postdata= ()=>{
        if (image){
            profileUpload()
        }else{
            uploadfeilds()
        }
       
    }
    return ( 
        <>
        <h4 style={{textAlign:"center"}}>Sign Up</h4>
        <div className="cn1 input-field signin">
            <div className="card1">
                <div className="file-field input-field">
                <div className="btn btn1 disabled">
                    <i className="fa fa-user new1" aria-hidden="true"></i>
                </div>
                <div className="file-path-wrapper input-field">
                <input type="text" placeholder="User-Name" 
                value={name}
                onChange={(er)=>setName(er.target.value)} required/>
                </div>
                    </div>
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
            <div className="file-field input-field">
            <div className="btn btn1 disabled">
            <i className="fas fa-address-card" aria-hidden="true"></i>
            </div>
            <div className="file-path-wrapper input-field">
                <input className="input1" type="text" placeholder="About" onChange={(er)=>setAbout(er.target.value)}/>
            </div>
            </div>
            <div className="file-field input-field">
            <div className="btn btn1 ">
            <i className="far fa-image new1" aria-hidden="true"></i>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper input-field">
                <input className="file-path validate" type="text" placeholder="Profile Pic" />
            </div>
            </div>
            </div>
            <br />
            <button className="btlogin" id="btn" onClick={()=>postdata()}>Sign up</button>
            <h5>
                <Link to="/signin" ><p className="home1">Already have an account ?</p></Link></h5>
        </div>
        </>
    )
}
export default Signup