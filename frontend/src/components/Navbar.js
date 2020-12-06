import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
const NavBar = () => {
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList=()=>{
        if(state){
            return [
                <li key="1">&nbsp;&nbsp;<i className="fas fa-search modal-trigger" data-target="modal1" style={{color:"black",cursor:"pointer"}}>&nbsp;&nbsp;</i></li>,
                <li key="2"><Link to = "/createpost"><i className="fas fa-plus-square" style={{fontSize:"30px",color:"black",cursor:"pointer"}}></i></Link> </li >,
                <li key="3"><Link to = "/profile"><i className="fas fa-user" style={{fontSize:"30px",color:"black",cursor:"pointer"}}></i></Link> </li >,
                <li key="4"><Link to = "/editProfile"><i className="fas fa-user-edit" style={{fontSize:"30px",color:"black",cursor:"pointer"}}></i></Link></li> ,
                <li key="6"><Link to = "/following"><i className="fas fa-user-friends" style={{fontSize:"30px" ,color:"black",cursor:"pointer"}}></i></Link></li >,
                <li key="7">&nbsp;&nbsp;<i className="fas fa-times-circle" style={{fontSize:"30px",color:"black",cursor:"pointer"}} onClick={()=>{
                    localStorage.clear();
                    dispatch({type:"CLEAR"})
                    history.push('/signin')}}>&nbsp;&nbsp;</i></li>,
            ]
        }
        else{
            return [
                <li key="8"><Link to = "/signin"> <i className="fas fa-user" style={{fontSize:"30px"}}></i></Link></li >,
                <li key="9"> <Link to = "/signup"><i className="fas fa-user-plus" style={{fontSize:"30px"}}></i></Link></li >
            ]
        }
    }
    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }
    return ( 
        <nav>
            <div className = "nav-wrapper #e0e0e0 grey lighten-2" >
                <Link to = {state?"/":"/signin"} key="11"
                className = "brand-logo left" ><i className="fas fa-home" style={{fontSize:"30px"}}></i></Link> 
                <ul key="21"id = "nav-mobile"
                className = "right" >
                    {renderList()}            
                </ul>  
            </div > 
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            id="search"
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection" key="40">
               {userDetails.map(item=>
               {
                 return <Link key={item?item._id:"11"}to={item?item._id !== state.id ? "/profile/"+item._id:'/profile':"11"} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li key="15" className="collection-item"><img src={item?item.pic:"11"} className="photo img1"/>&nbsp;&nbsp;{item?item.name:"11"}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>document.getElementById('search').value=''}>close</button>
          </div>
        </div>
        </nav >
    )
}
export default NavBar