import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
const Home = () => {
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(UserContext)
    const [comment,setComment]=useState("")
    useEffect(()=>{
        fetch('/getfollowpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])
    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(error=>{
            console.log("Error Ocurred: ",error)
        })
  }
    const unlikePost=(id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newdata = data.map(item=>{
                if (item._id==result._id)
                {
                    return result
                }
                else
                {
                    return item
                }
            })
            setData(newdata)
        }).catch(error=>{
            console.log("Error occured ",error)
        })
    }
    const makeComment=(text,postId)=>{
        const clear = document.getElementById("input")
        clear.value=" "
        fetch('/comment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId,
            text
        })
    }).then(res=>res.json())
    .then(result=>{
        const newdata = data.map(item=>{
            if (item._id == result._id)
            {
                return result
            }
            else
            {
                return item
            }
        })
        setData(newdata)
    }).catch(error=>{
        console.log("Error Ocurred: ",error)
    })
}
const deletePost = (postid)=>{
    fetch(`/deletepost/${postid}`,{
        method:"delete",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
    })
}
const deleteComment=(photoid,commentid)=>{
    fetch(`/deletecomment`,{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            photoid,
            commentid,
        })
    }).then(res=>res.json())
    .then(result=>{
        const newdata = data.map(item=>{
            if (item._id == result._id)
            {
                return result
            }
            else
            {
                return item
            }
        })
        setData(newdata)
    })
}
    return ( 
                <div className="clshome">
                {
                    data.map(item=>
                        {
                            return(
                                <>
                                <br />
                                {
                                item ?
                                <div className="card home-card home" key={item.id}>
                                {
                                    item.postedUser._id == state.id &&
                                    <i className="material-icons" style={
                                        {float:"right",cursor:"pointer",padding:"5px"}} onClick={()=>deletePost(item._id)}
                                    >delete&nbsp;&nbsp;</i>
                                }
                               
                                   <div className="photo">
                                    <img  className="img1" src={item.pic} alt="" style={{margin:"5px"}}/>
                                    <span className="span1"><b>&nbsp;&nbsp;<Link to={item.postedUser._id !== state.id?"/profile/"+item.postedUser._id:"/profile"}>
                                    {item.postedUser.name}</Link></b></span>
                                        <h6>&nbsp;&nbsp;{item.location}</h6>
                                    </div>
                                <div className="card-image" ><img src={item.photo} style={{width:"100%",height:"100%"}}/></div>
                                <div className="home"><br />      
                                {item.likes.includes(state.id)
                                    ?
                                    <i className="material-icons"
                                        onClick={()=>{unlikePost(item._id)}} style={{color:"red",fontSize:"30px",cursor:"pointer"}}
                                    >favorite</i>
                                    :
                                    <i className="material-icons"
                                        onClick={()=>{likePost(item._id)}}
                                        style={{backgroundColor:"white",fontSize:"30px",cursor:"pointer"}}
                                    >favorite_border</i>
                                }
                                <h6>{item.title}</h6>
                                <h6>&nbsp;&nbsp;{item.likes.length} likes&nbsp;&nbsp;<span>&&nbsp;&nbsp;</span> {item.comments.length} comments&nbsp;</h6>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <div>
                                                {
                                                    record.postedUser._id==state.id &&
                                                <i className="material-icons" style={
                                                {float:"right",cursor:"pointer"}} onClick={()=>deleteComment(item._id,record._id)}
                                                >delete</i>
                                                }
                                                <h6 key={record._id}>&nbsp;&nbsp;<span style={{fontWeight:"650"}}>{record.postedUser.name}</span> :  {record.text}</h6>
                                            </div>
                                        )
                                    })
                                }
                                      <form className="form1" id="btn" onSubmit={(eve)=>{
                                    eve.preventDefault()
                                    makeComment(comment,item._id)
                                }}>
                                &nbsp;&nbsp;<input type="text" id="input" className="in" placeholder="Type comment" style={{border:"rigid",width:"70%"}} onChange={eve=>{setComment(eve.target.value)}} onSubmit={eve=>eve.target.value=""} autocomplete="off"/>
                                <i class="material-icons" id="btn"style={{cursor:"pointer"}} onClick={(eve)=>{
                                    eve.preventDefault()
                                    makeComment(comment,item._id);
                                }}  >send</i>
                                </form>   
                                <br />
                                </div>
                            </div>
                             :
                             <div class="progress grey">
                             <div class="determinate">
                             </div>
                             </div>
                            }
                            </>  
                            )
                        }
                        )
                }
                </div>
            )
}
export default Home;