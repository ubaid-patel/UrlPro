import { useSelector } from "react-redux"
import { selectAuth } from "../reducers/authSlice"
import React from "react";
import styles from '../css/admin.module.css'
function Admin(){
    const auth = useSelector(selectAuth);
    return(
        <React.Fragment>
        <div className={styles.Users}>
            <h1 >All Users</h1>
            <table>
                <thead>
                    <tr><th>Name</th><th>Email id</th><th>links</th><th>feedbacks</th></tr>
                </thead>
                <tbody>
                    {
                        auth.users.map((data)=>{
                            return<tr key={data.email}><td>{data.name}</td><td>{data.email}</td><td>{data.links}</td><td>{data.feedbacks}</td></tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <div className={styles.FeedBacks}>
            <h1>All Feedbacks</h1>
            {
                auth.feedbacks.map((data)=>{
                    return<React.Fragment>
                    <hr/>
                    <h3>{data.name}</h3>
                    <h3>{data.email}</h3>
                    <h4>{data.date}</h4>
                    <p>
                    {data.feedback}
                    </p>
                    <hr/>
                    </React.Fragment>
                })
            }
        </div>
        </React.Fragment>
    )
}
export default Admin