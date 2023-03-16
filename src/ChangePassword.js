import { useState } from "react";
import { changePassword } from "./ApiCalls";
import { displayOneByOne } from "./AppConfig";
function ChangePassword () {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changeResult, setChangeResult] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== newPassword) {
      setChangeResult("New password and confirm new password do not match.");
    } else {
      // Add code here to handle the password change request
      document.getElementById("btnloader").style="display:inline-block;";
      changePassword(oldPassword,newPassword).then((value)=>{
        displayOneByOne(value,"changeResult",40,"success")
        document.getElementById("btnloader").style="display:none;";
      })
      setChangeResult("Password changed successfully.");
    }
  }

  return (
    <div id="changePass">
      <h4 id="changeResult" className="centerText">{changeResult}</h4>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>Old Password:</td>
              <td><input type="password" name="oldPassword" className="inputText" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} /></td>
            </tr>
            <tr>
              <td>New Password:</td>
              <td><input type="password" name="password" className="inputText" value={password} onChange={(event) => setPassword(event.target.value)} /></td>
            </tr>
            <tr>
              <td>Confirm New Password:</td>
              <td><input type="password" name="newPassword" className="inputText" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></td>
            </tr>
            <tr>
              <td colSpan="2"><button type="submit" className="Button submitBtn">Change Password <div id="btnloader" className="hide">&nbsp;</div></button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default ChangePassword;
