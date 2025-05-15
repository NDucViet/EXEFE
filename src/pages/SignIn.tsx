import React from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

const SignIn: React.FC = () => {
  const handleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error('No credential received');
      return;
    }

    const idtoken = credentialResponse.credential;
    try {
      const res = await axios.post('https://localhost:7135/api/Auth/Sign-in-google', {idtoken});
      const { accessToken} = res.data;
    localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <GoogleOAuthProvider clientId="104873536196-65tbscmmi8qvsgm1ttm3uq5npl33944i.apps.googleusercontent.com">
      <div className="App">
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.error('Login Failed')}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
