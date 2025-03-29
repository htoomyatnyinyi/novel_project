import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const Oauth = () => {
  return (
    <div>
      <h1>Test Login Page</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default Oauth;
