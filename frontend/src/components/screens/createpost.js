import React,{useState,useEffect,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const Post = ()=>{
    const history=useHistory()
    const [title,setTitle]=useState("")
    const [location,setLocation]=useState(" ") 
    const{state,dispatch}=useContext(UserContext)
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    const [url1,setUrl1]=useState("")
    useEffect(()=>{
        if(url){
            document.getElementById("btn").disabled = true;
            M.toast({html:"Please Wait...",classes:"green",inDuration:"900"})
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                location,
                title,
                url,
                url1,
            })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                M.toast({html: data.error,classes:"#757575 grey darken-1"})
                document.getElementById("btn").disabled = false;}
                else
                {
                M.toast({html:"Posted",classes:"#757575 grey darken-1"})
                history.push('/')
                }
        }).catch(error=>{
            console.log("Error Occured: ",error)
        })
    }
    },[url])
    const postDetail=()=>{
        const data= new FormData()
        data.append("file",image)
        data.append("upload_preset","my-insta")
        data.append("cloud_name","yash06")
        fetch("	https://api.cloudinary.com/v1_1/yash06/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then( data=>{
            setUrl(data.url)
        })
        .catch(error=>{
            console.log("Error Occured: ",error)
        })
    }
    return(
        <div className='input-field cn1' style={{margin:"30px auto",maxWidth:"500px",padding:"30px",textAlign:"center"}}>
            <div className="file-field input-field">
            <div className="btn">
                <span><i class="fas fa-plus-circle"></i></span>
                <input type="file"  onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper input-field">
                <input className="file-path validate" type="text" placeholder="Choose a file"/>
            </div>
            </div>
            <input type="text" placeholder="Location" 
            onChange={(e)=>setLocation(e.target.value)}/>
            <input type="text" placeholder="Caption" 
            value={title}
            onChange={(e)=>setTitle(e.target.value)}/>
            <button className="btlogin" id="btn" onClick={()=>postDetail()}>Post</button>
        </div>
    )
}
export default Post;