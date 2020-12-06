import React,{useState,useEffect,useContext,Component} from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const EditProfile = ()=>{
    const history=useHistory()
    const[image,setImage]=useState("")
    var [name,setName]=useState('')
    var [mail,setMail]=useState('')
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        if(name){
            fetch('/editProfile',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    name,
                })
            }).then(res=>res.json())
            .then(result=>{
                localStorage.setItem("user",JSON.stringify({...state,name:result.name}))
                localStorage.setItem("User",JSON.stringify({...state,name:result.name}))
                dispatch({type:"UPDATEEDIT1",payload:result.name})
            })
            .catch(error=>{
                console.log("Error Occured: ",error)
            })
        }
    },[name])
    useEffect(()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail))
        {
            return 
        }
        else if(mail){
            fetch('/editProfile1',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    mail,
                })
            }).then(res=>res.json())
            .then(result=>{
                localStorage.setItem("user",JSON.stringify({...state,email:result.email}))
                localStorage.setItem("User",JSON.stringify({...state,email:result.email}))
                dispatch({type:"UPDATEEDIT2",payload:result.email})
            })
            .catch(error=>{
                console.log("Error Occured: ",error)
            })
        }
    },[mail])
    useEffect(()=>{
        if(image)
        {
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
                fetch('/uploadProfile',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    localStorage.setItem("User",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPRO",payload:result.pic})
                })
            })
            .catch(error=>{
                console.log("Error Occured: ",error)
            })
        }
    },[image])
    const updateProfile=(file)=>{
        setImage(file)
    }
    const Update=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail))
        {
            M.toast({html:"Invalid Mail",classes:"red"})
        }
        else{
        M.toast({html:"Updated..",classes:"#757575 grey darken-1"})
        history.push('/')}
    }
    const removeProfile=(id)=>{
        fetch('/removeprofile',{
            method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        id
                    })
                })
                .then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:"https://res.cloudinary.com/yash06/image/upload/v1607009785/avatar-default-icon_gfftkl.png"}))
                    localStorage.setItem("User",JSON.stringify({...state,pic:"https://res.cloudinary.com/yash06/image/upload/v1607009785/avatar-default-icon_gfftkl.png"}))
                    dispatch({type:"UPDATEPRO",payload:"https://res.cloudinary.com/yash06/image/upload/v1607009785/avatar-default-icon_gfftkl.png"})
                })
    }
    const Cancel=()=>{
        history.push('/')
    }
    return (
        <>
        <h2 style={{textAlign:"center"}}>Edit Profile</h2>
        <div className="cn1 input-field signin">
        <div className="card1">
        <div className="file-field input-field ">
            <div className="btn btn1 disabled">
            <i class="fas fa-envelope new1" aria-hidden="true"></i>
            </div>
            <div className="file-path-wrapper input-field">
                <input type="text" placeholder="Change Name" defaultValue={state?state.name:""} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="btn btn1 disabled">
            <i class="fa fa-key new1" aria-hidden="true"></i>
            </div>
            <div className="file-path-wrapper input-field">
                <input type="text" placeholder="Change Mail"  defaultValue={state?state.email:""} onChange={(e)=>setMail(e.target.value)} />
            </div>
            </div>
            <div className="file-field input-field">
            <div className="btn btn1">
                <span><i class="fas fa-plus-circle"></i></span>
                <input type="file" onChange={(e)=>updateProfile(e.target.files[0])}/>
            </div>
            </div><button className="btn btn1" onClick={removeProfile(state.id)}
            ><i class="fas fa-minus-circle"></i></button>
            <div className="file-path-wrapper input-field" style={{visibility:"hidden"}}>
                <input className="file-path validate" type="text" placeholder="Profile Pic" />
            </div>
        </div>  
        <div className="btn btn1 red" onClick={Cancel}><i class="fas fa-window-close"></i></div>
            <span>&nbsp;&nbsp;</span>
        <div className="btn btn1" onClick={Update}><i class="fas fa-check-circle"></i></div>
        </div>
        </>
    )
}
export default EditProfile