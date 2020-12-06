
import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile = () => {
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const {userid}=useParams()
    const [show,setShow]=useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
           setProfile(result)
        })
    },[])
    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             localStorage.setItem("User",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             localStorage.setItem("User",JSON.stringify(data))
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShow(true) 
        })
    }
    return ( 
        <>
        {userProfile 
            ?
            <div style={{maxWidth:"90%",margin:"0px auto"}}>
                <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",borderBottom:"1px solid grey"}}>
                <img className="profile1" src={userProfile.user.pic}/>
                    <div style={{textAlign:"right"}}>
                        <h4>{userProfile.user.name}</h4>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6>{userProfile.posts.length}  Posts</h6>
                            <h6>{userProfile.user.followers.length} Followers</h6>
                            <h6>{userProfile.user.following.length} Following</h6>
                        </div>
                        {
                            show?<button style={{margin:"15px"}}className="btn btn1" onClick={()=>followUser()}>Follow</button>:<button style={{margin:"15px"}}className="btn btn1" onClick={()=>unfollowUser()}>Unfollow</button>
                        }
                    </div>
                </div>
                <div className="gallery">
                {
                        userProfile.posts.map(item=>{
                            return(
                                <img key={item.id}className="item" src={item.photo} alt={item.title} width="20px" height="20px" onClick={(eve)=>{
                                    eve.preventDefault()
                                    window.location.href=item.photo
                                }} style={{cursor:"pointer"}}/>
                            )
                        })
                    }
                </div>
            </div>
            :
            <div className="progress grey">
                <div className="determinate"></div>
            </div>
        }
        </>
    )
}
export default Profile