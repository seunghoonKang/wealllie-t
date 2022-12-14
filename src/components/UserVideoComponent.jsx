import React, { Component, useEffect, useRef } from 'react';
// import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';

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
  const videoRef = useRef();
  function getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(props.streamManager.stream.connection.data).clientData;
  }

  // function getReadyTag() {
  //   return JSON.parse(props.streamManager.stream.connection.data).boolkey;
  // }

  useEffect(() => {
    if (props && !!videoRef) {
      props.streamManager.addVideoElement(videoRef.current);
    }
  }, []);

  console.log('props 뭐있나 확인', props);
  console.log('ready상태', props.ready);

  return (
    <div>
      {props.streamManager !== undefined && (
        <div className="streamcomponent">
          {/* <OpenViduVideoComponent streamManager={props.streamManager} /> */}
          <video autoPlay={true} ref={videoRef} />
          <div>
            <Name>{getNicknameTag()}</Name>
            {props.ready ? <p>준비돼써</p> : <p>준비안돼써</p>}
            {/* <p>ready 상태 : {getReadyTag()}</p> */}
            {/* 여기에 쓴 이름이 모두 다 같은 이름으로 뜸 */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVideoComponent;

const Name = styled.p`
  width: 100%;
`;
