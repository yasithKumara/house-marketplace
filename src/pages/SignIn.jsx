import React, { useState } from "react";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import {toast} from 'react-toastify'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState)=>({
      ...prevState,
      // very important
      [e.target.id]: e.target.value
    }))
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('sign in was called')

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // updateProfile(auth.currentUser, { displayName: name });

      // const formDataCopy = {...formData}
      // delete formDataCopy.password
      // formDataCopy.timestamp = serverTimestamp()

      // await setDoc(doc(db, 'users', user.uid) ,formDataCopy)
        console.log('no errors', user
        )
      navigate("/");
    } catch (error) {
      toast.error('Incorrect User Credentials')
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="emailInput"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              className="passwordInput"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>
          <Link className="forgotPasswordLink" to="/forgot-password">
            Forgot Password
          </Link>{" "}
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="SignInButton" type="submit">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        {/* Google auth */}
        <Link to='/sign-up' className="registerLink">
        Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
