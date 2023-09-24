import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./Auth.css";
const Auth = ({ getloggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [toggle, setToggle] = useState(true);
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((err) =>
      alert(err.message)
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        console.log("Autrhorised");
        getloggedIn();
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="Login">
      <div className="login-form">
        <div className="title">LOGIN</div>
        <div className="form">
            <div className="input-container">
              <label id="uname">Username</label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="input"
                placeholder="email..."
                type="text"
              />
            </div>
            <div className="input-container">
              <label id="uname">Password</label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="input"
                placeholder="password....."
                type="password"
              />
            </div>
            <div className="button-container">
              <input type="submit" onClick={signIn} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
