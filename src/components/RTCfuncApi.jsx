import axios from 'axios';
import { OPENVIDU_SERVER_SECRET, OPENVIDU_SERVER_URL } from './url';

export default function getToken(roomId) {
  return createSession(roomId).then((roomId) => createToken(roomId));
}
const OPENVIDU_SERVER_URL = 'https://minhyeongi.xyz/';

function createSession(roomId) {
  return new Promise((resolve, reject) => {
    var data = JSON.stringify({ customSessionId: roomId });
    axios
      .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('CREATE SESION', response);
        resolve(response.data.id);
      })
      .catch((response) => {
        var error = Object.assign({}, response);
        if (error?.response?.status === 409) {
          resolve(roomId);
        } else {
          console.log(error);
          console.warn(
            'No connection to OpenVidu Server. This may be a certificate error at ' +
              OPENVIDU_SERVER_URL
          );
          window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
        }
      });
  });
}

function createToken(roomId) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        OPENVIDU_SERVER_URL +
          '/openvidu/api/sessions/' +
          roomId +
          '/connection',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('TOKEN', response);
        resolve(response.data.token);
      })
      .catch((error) => reject(error));
  });
}
