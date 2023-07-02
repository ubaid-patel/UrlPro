import { GetAuth } from "./AppConfig"
function Admin(){
    return(
        <>
        <div className="HomeCards" style={{overflowY:"auto",textAlign:"center",padding:"10px",maxHeight:"250px"}}>
            <h1 style={{maxWidth:"none"}}>All Users</h1>
            <table id="allusers">
                <thead>
                    <tr><th>Name</th><th>Email id</th><th>links</th><th>feedbacks</th></tr>
                </thead>
                <tbody>
                    {
                        GetAuth().users.map((data)=>{
                            return<tr key={data.email}><td>{data.name}</td><td>{data.email}</td><td>{data.links}</td><td>{data.feedbacks}</td></tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <div className="HomeCards" style={{overflowY:"auto",textAlign:"center",padding:"10px",maxHeight:"250px"}}>
            <h1 style={{maxWidth:"none"}}>All Feedbacks</h1>
            {
                GetAuth().feedbacks.map((data)=>{
                    let style ={
                        margin:"2px",textAlign:"left",marginLeft:"30px"
                    }
                    let stylep ={
                        textAlign:"left",marginLeft:"50px"
                    }
                    return<>
                    <hr style={{width:"100%",maxWidth:"none"}}/>
                    <h3 style={style}>{data.name}</h3>
                    <h3 style={style}>{data.email}</h3>
                    <h4 style={style}>{data.date}</h4>
                    <p style={stylep}>
                    {data.feedback}
                    </p>
                    <hr style={{width:"100%",maxWidth:"none"}}/>
                    </>
                })
            }
        </div>
        </>
    )
}
export default Admin