import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import React, { Component, useCallback } from 'react';
import UserVideoComponent from './UserVideoComponent';
import './OvReactCss.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../shared/socket';

const APPLICATION_SERVER_URL = 'https://minhyeongi.xyz/';

const OvReact = (props) => {
  const [mySessionId, setMySessionId] = useState(props.param);
  const [myUserName, setMyUserName] = useState();
  const [session, setSession] = useState();
  // const [mainStreamManager, setMainStreamManager] = useState();
  const [publisher, setPublisher] = useState();
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState();

  // --- 1) Get an OpenVidu object ---
  const OV = new OpenVidu();

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
  }, [session]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => leaveSession());
    return () => {
      window.removeEventListener('beforeunload', () => leaveSession());
    };
  }, [leaveSession]);

  // const handleChangeSessionId = (e) => {
  //   setMySessionId(e.target.value);
  // };

  // const handleChangeUserName = (e) => {
  //   setMyUserName(e.target.value);
  // };

  // const handleMainVideoStream = (stream) => {
  //   if (mainStreamManager !== stream) {
  //     setMainStreamManager(stream);
  //   }
  // };

  const deleteSubscriber = (streamManager) => {
    let subscribersTemp = subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribersTemp.splice(index, 1);
      setSubscribers(subscribersTemp);
    }
  };

  // const joinSession = () => {
  //   console.log('**joinSession 실행한당');
  //   setSession(OV.initSession());
  // };

  //-----------

  // useEffect(() => {
  //   console.log('**페이지 들어왔당');
  //   joinSession();
  // }, []);

  //원래 이게 joinSession 안에 있었음 => useEffect 사용하면서 밖으로 뺌
  // --- 2) Init a session ---
  useEffect(() => {
    const openVidu = new OpenVidu();
    let session = openVidu.initSession();
    console.log('**useEffect 실행한당');

    // const mySession = session;
    console.log('**session이 뭐야', session);
    // --- 3) Specify the actions when events take place in the session ---

    // 새로운 스트림을 받을 때 마다 On every new Stream received...
    session.on('streamCreated', (event) => {
      console.log('**session.on 실행됨 event::', event);
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      const subscriber = session.subscribe(event.stream, undefined);
      let subscribersTemp = subscribers;
      subscribersTemp.push(subscriber);
      console.log('*****subscribersTemp 확인', subscribersTemp);
      // 새 참가자가 들어온 배열로 state를 업데이트 해줌 Update the state with the new subscribers
      setSubscribers(subscribersTemp);
    });
    console.log('*****useEffect 안에서 subscribers 확인', subscribers);

    // 스트림이 없어질 때마다
    session.on('streamDestroyed', (event) => {
      event.preventDefault();
      // subscribers 배열에서 제거해줌
      deleteSubscriber(event.stream.streamManager);
    });

    // On every asynchronous exception...
    session.on('exception', (exception) => {
      console.warn(exception);
    });

    // --- 4) Connect to the session with a valid user token ---

    // Get a token from the OpenVidu deployment
    getToken().then((token) => {
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      session
        .connect(token, { clientData: myUserName })
        .then(async () => {
          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let publisherTemp = await OV.initPublisherAsync(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---

          session.publish(publisherTemp);

          // Obtain the current video device in use
          const devices = await OV.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );
          const currentVideoDeviceId = publisherTemp.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          // Set the main video in the page to display our webcam and store our Publisher
          setCurrentVideoDevice(currentVideoDevice);
          // setMainStreamManager(publisherTemp);
          setPublisher(publisherTemp);
          //   this.setState({
          //     currentVideoDevice: currentVideoDevice,
          //     mainStreamManager: publisherTemp,
          //     publisher: publisherTemp,
          //   });
        })
        .catch((error) => {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message
          );
        });
    });
  }, []);

  // const leaveSession = () => {
  //   // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

  //   const mySession = session;

  //   if (mySession) {
  //     mySession.disconnect();
  //   }

  //   // Empty all properties...
  //   OV = null;
  //   setSession(undefined);
  //   setSubscribers([]);
  //   setMySessionId('SessionA');
  //   setMyUserName('Participant' + Math.floor(Math.random() * 100));
  //   setMainStreamManager(undefined);
  //   setPublisher(undefined);
  // };

  //   const switchCamera = async () => {
  //     try {
  //       const devices = await OV.getDevices();
  //       const videoDevices = devices.filter(
  //         (device) => device.kind === 'videoinput'
  //       );

  //       if (videoDevices && videoDevices.length > 1) {
  //         const newVideoDevice = videoDevices.filter(
  //           (device) => device.deviceId !== currentVideoDevice.deviceId
  //         );

  //         if (newVideoDevice.length > 0) {
  //           // Creating a new publisher with specific videoSource
  //           // In mobile devices the default and first camera is the front one
  //           const newPublisher = OV.initPublisher(undefined, {
  //             videoSource: newVideoDevice[0].deviceId,
  //             publishAudio: true,
  //             publishVideo: true,
  //             mirror: true,
  //           });

  //           //newPublisher.once("accessAllowed", () => {
  //           await session.unpublish(mainStreamManager);

  //           await session.publish(newPublisher);
  //           setCurrentVideoDevice(newVideoDevice[0]);
  //           setMainStreamManager(newPublisher);
  //           setPublisher(newPublisher);

  //           //   this.setState({
  //           //     currentVideoDevice: newVideoDevice[0],
  //           //     mainStreamManager: newPublisher,
  //           //     publisher: newPublisher,
  //           //   });
  //         }
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'openvidu/api/sessions',
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL +
        'openvidu/api/sessions/' +
        sessionId +
        '/connections',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The token
  };

  console.log('**return 직전 subscribers확인', subscribers);
  console.log('**return 직전 publisher확인', publisher);
  return (
    <div className="container" style={{ background: 'pink' }}>
      {session !== undefined ? (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{mySessionId}</h1>
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
          </div>
          <div id="video-container" className="col-md-6">
            {publisher !== undefined ? (
              <div
                className="stream-container col-md-6 col-xs-6"
                style={{ width: '200px' }}
              >
                <UserVideoComponent streamManager={publisher} />
              </div>
            ) : null}
            {subscribers.map((sub, i) => (
              <div
                key={i}
                className="stream-container col-md-6 col-xs-6"
                style={{ width: '2200px' }}
              >
                <UserVideoComponent
                  streamManager={sub}
                  nickname={props.nickname}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OvReact;
