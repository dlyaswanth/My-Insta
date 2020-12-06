import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
const Profile = () => {
    const [pics,setPics]=useState([])
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch("/ownpost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
           setPics(result.ownpost)
        })
    },[])
    return (
        <div style={{maxWidth:"90%",margin:"5px"}}>
            <div className="pro">
            <div style={{display:"flex",justifyContent:"space-around"}}>
                <img className="profile1" src={state?state.pic:"loading"}  alt="profile" style={{margin:"10px"}}/>
                <div className="pro1"style={{float:"right",marginTop:"50px"}}>
                    <span style={{fontSize:"30px"}}>{state?state.name:"Wait"}&nbsp;&nbsp;
                    </span>
                    <div style={{display:"flex",justifyContent:"space-between",width:"100%",alignItems:"center"}}>
                    <h6>{pics.length} Posts&nbsp;</h6>
                    <h6>{state?state.followers.length:"0"} Followers&nbsp;</h6>
                    <h6>{state?state.following.length:"0"} Following</h6>
                    </div>
                </div>
                </div>
            </div>
          
            <hr />
            <div className="gallery">
                {
                        pics.map(item=>{
                            return(
                                <img className="item" key={item._id} src={item.photo} alt={item.title} onClick={(eve)=>{
                                    eve.preventDefault()
                                    window.location.href=item.photo
                                }} style={{cursor:"pointer"}}/>
                            )
                        })
                }
            </div>
            </div>
    )
}
export default Profile