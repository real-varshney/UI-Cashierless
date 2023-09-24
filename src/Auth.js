import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebaseConfig'
const Auth = ({getloggedIn}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [toggle, setToggle] = useState(true);
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((err) => alert(err.message)
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        console.log("Autrhorised");
      }
    });
    return unsubscribe;
  }, []);

  return  (
    <div>
        <div>Log In</div>
        <div>
            <div class='login_flex'>    
                <input type="text" name="username" id="usr" onChange={(value) => setEmail(value.target.value)} placeholder="email_id"/>
                <input type="password" name="password" id="psd" onChange={(value) => setPassword(value.target.value)} placeholder="password"/>
                <button class='btn' onClick={signIn}>Log In</button>
            </div>
            {/* <div><button onClick={login_toggler}>Signup</button></div> */}
        </div>
        
    </div>
  )
};

export default Auth;
