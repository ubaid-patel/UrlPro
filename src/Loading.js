import { Navigate} from "react-router-dom"
function Loading(){
    let active ;
    if(localStorage.Loading){
        active = JSON.parse(localStorage.Loading)
    }else{
        active = false
    }
    if(active === false){
        return <Navigate to="/"/>
        // return <></>
    }else{
        return(
            <div>
                <div className="Loader"></div>
                <h1>Loading Please Wait...</h1>
            </div>
        )   
    }
}
export default Loading