import React, { useState } from 'react';
import OpenViduSession from 'openvidu-react';
import axios from 'axios';

//Library-React 함수형으로 바꿈
const Test = () => {
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState(`OpenVidu_User_`); //'OpenVidu_User_' + Math.floor(Math.random() * 100)
  const [token, setToken] = useState(undefined);
  const [session, setSession] = useState(); //기본값 undefined?

  //요청해서 받는게 토큰?
  const APPLICATION_SERVER_URL = 'https://wealllion.shop';

  const handlerJoinSessionEvent = () => {
    console.log('Join session');
  };

  const handlerLeaveSessionEvent = () => {
    console.log('Leave session');
    setSession(undefined);
  };

  const handlerErrorEvent = () => {
    console.log('Leave session');
  };

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL +
        '/openvidu/api/sessions/' +
        sessionId +
        '/connections',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The token
  };

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + '/openvidu/api/sessions',
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The sessionId
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const joinSession = async (event) => {
    event.preventDefault();
    if (mySessionId && myUserName) {
      const myToken = await getToken();
      setToken(myToken);
      setSession(true);
    }
  };

  return (
    <div>
      {session === undefined ? (
        <div id="join">
          <div id="join-dialog">
            <h1> Join a video session </h1>
            <form onSubmit={joinSession}>
              <p>
                <label>Participant: </label>
                <input
                  type="text"
                  id="userName"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  required
                />
              </p>
              <p>
                <label> Session: </label>
                <input
                  type="text"
                  id="sessionId"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  required
                />
              </p>
              <p>
                <input name="commit" type="submit" value="JOIN" />
              </p>
            </form>
          </div>
        </div>
      ) : (
        <div id="session">
          <OpenViduSession
            id="opv-session"
            sessionName={mySessionId}
            user={myUserName}
            token={token}
            joinSession={handlerJoinSessionEvent}
            leaveSession={handlerLeaveSessionEvent}
            error={handlerErrorEvent}
          />
        </div>
      )}
    </div>
  );
};

export default Test;
