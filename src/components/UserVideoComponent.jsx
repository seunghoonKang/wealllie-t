import React, { Component, useEffect, useRef } from 'react';
// import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';
import { useCookies } from 'react-cookie';

// export default class UserVideoComponent extends Component {
//   getNicknameTag() {
//     // Gets the nickName of the user
//     return JSON.parse(this.props.streamManager.stream.connection.data)
//       .clientData;
//   }

//   render() {
//     return (
//       <div>
//         {this.props.streamManager !== undefined ? (
//           <div className="streamcomponent">
//             <OpenViduVideoComponent streamManager={this.props.streamManager} />
//             <div>
//               <p>{this.getNicknameTag()}</p>
//             </div>
//           </div>
//         ) : null}
//       </div>
//     );
//   }
// }

const UserVideoComponent = (props) => {
  const [cookies] = useCookies(['nickname']);
  const videoRef = useRef();
  function getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(props.streamManager.stream.connection.data).clientData;
  }
  useEffect(() => {
    if (props && !!videoRef) {
      props.streamManager.addVideoElement(videoRef.current);
    }
  }, []);
  console.log('myUserName', props.myUserName);

  return (
    <div>
      {props.streamManager !== undefined && (
        <div className="streamcomponent">
          {/* <OpenViduVideoComponent streamManager={props.streamManager} /> */}
          <video autoPlay={true} ref={videoRef} />
          <div>
            <p>{getNicknameTag()}</p>
            {/* 여기에 쓴 이름이 모두 다 같은 이름으로 뜸 */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVideoComponent;
