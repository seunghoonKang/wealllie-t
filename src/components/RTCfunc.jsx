import { OpenVidu } from 'openvidu-browser';
import getToken from './RTCfuncApi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserVideoComponent from './UserVideoComponent';

export const useOpenvidu = (userId, meetingRoomId) => {
  const param = useParams();
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState();
  const [session, setSession] = useState();

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
  }, [session]);

  useEffect(() => {
    const openVidu = new OpenVidu();
    let session = openVidu.initSession();

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, '');
      const data = JSON.parse(event.stream.connection.data);
      setSubscribers((prev) => {
        return [
          ...prev.filter((it) => it.userId !== data.userId),
          {
            streamManager: subscriber,
            userId: data.userId,
            // gender: data.gender,
          },
        ];
      });
    });

    session.on('streamDestroyed', (event) => {
      event.preventDefault();

      const data = JSON.parse(event.stream.connection.data);
      setSubscribers((prev) => prev.filter((it) => it.userId !== data.userId));
    });

    session.on('exception', (exception) => {
      console.warn(exception);
    });

    getToken(String(meetingRoomId)).then((token) => {
      session
        .connect(token, JSON.stringify({ userId }))
        .then(async () => {
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          const devices = await openVidu.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );

          const publisher = openVidu.initPublisher('', {
            audioSource: undefined,
            videoSource: videoDevices[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
          });

          setPublisher(publisher);
          session.publish(publisher);
        })
        .catch((error) => {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message
          );
        });
    });

    setSession(session);
    return () => {
      if (session) {
        session.disconnect();
      }
      setSession(null);
      setPublisher(null);
      setSubscribers([]);
    };
  }, [meetingRoomId, userId]); //gender 뺌

  useEffect(() => {
    window.addEventListener('beforeunload', () => leaveSession());
    return () => {
      window.removeEventListener('beforeunload', () => leaveSession());
    };
  }, [leaveSession]);

  const onChangeCameraStatus = useCallback(
    (status) => {
      publisher?.publishVideo(status);
    },
    [publisher]
  );

  const onChangeMicStatus = useCallback(
    (status) => {
      publisher?.publishAudio(status);
    },
    [publisher]
  );

  const streamList = useMemo(
    () => [{ streamManager: publisher, userId }, ...subscribers],
    [publisher, subscribers, userId] //gender 뺌
  );
  console.log('-------streamList', streamList);
  // return [publisher, streamList, onChangeCameraStatus, onChangeMicStatus];
  // return { publisher, streamList, onChangeCameraStatus, onChangeMicStatus };
  return (
    <>
      {/* {streamList.map((sub, i) => (
        <div key={i}>
          <UserVideoComponent
            streamManager={sub}
            // nickname={nickname}
          />
        </div>
      ))} */}
      일단 찍히나 보자
    </>
  );
};
export default useOpenvidu;
