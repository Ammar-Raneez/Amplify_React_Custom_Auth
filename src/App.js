import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import './App.css';

const initialFormState = {
  password: '',
  tel: '',
  authCode: '',
  formType: 'signUp',
};

function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [user, setUser] = useState();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      setUser(user);
      setFormState(() => ({
        ...formState,
        formType: 'signedIn'
      }));
    } catch (e) {

    }
  }

  const onChange = (e) => {
    e.persist();
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
    }));
  };

  const { formType } = formState;

  const signUp = async () => {
    const { tel, password } = formState;
    await Auth.signUp({
      username: tel,
      password,
    });
    setFormState(() => ({
      ...formState,
      formType: 'confirmSignUp'
    }));
  };

  const confirmSignUp = async () => {
    const { tel, authCode } = formState;
    await Auth.confirmSignUp(tel, authCode);
    setFormState(() => ({
      ...formState,
      formType: 'signIn'
    }));
  };

  const signIn = async () => {
    const { username, password } = formState;
    await Auth.signIn(username, password);
    setFormState(() => ({
      ...formState,
      formType: 'signedIn'
    }));
  };

  return (
    <div className="App">
      {formType === 'signUp' && (
        <div>
          <input name="tel" onChange={onChange} placeholder="Tel num" />
          <input name="password" type="password" onChange={onChange} placeholder="password" />
          <button onClick={signUp}>Sign Up</button>
          <button onClick={() => {
            setFormState(() => ({
              ...formState,
              formType: 'signedIn'
            }));
          }}>Sign In</button>
        </div>
      )}
      {formType === 'confirmSignUp' && (
        <div>
          <input name="authCode" onChange={onChange} placeholder="Confirmation Code" />
          <button onClick={confirmSignUp}>Confirm Sign Up</button>
        </div>
      )}
      {formType === 'signIn' && (
        <div>
          <input name="tel" onChange={onChange} placeholder="Tel num" />
          <input name="password" type="password" onChange={onChange} placeholder="password" />
          <button onClick={signIn}>Sign In</button>
        </div>
      )}
      {formType === 'signedIn' && (
        <div>
          <h1>Hello world, welcome user.</h1>
          <button onClick={() => Auth.signOut()}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default App;
