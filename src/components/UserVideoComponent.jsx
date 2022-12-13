import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {
  getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(this.props.streamManager.stream.connection.data)
      .clientData;
  }

  render() {
    return (
      <div>
        {this.props.streamManager !== undefined ? (
          <div className="streamcomponent">
            <OpenViduVideoComponent streamManager={this.props.streamManager} />
            <div>
              <p>{this.getNicknameTag()}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

// const UserVideoComponent = (props) => {
//   const getNicknameTag = (props) => {
//     return JSON.parse(props.streamManager.stream.connection.data).clientData;
//   };

//   return (
//     <div>
//       {props.streamManager !== undefined ? (
//         <div className="streamcomponent">
//           <OpenViduVideoComponent streamManager={props.streamManager} />
//           <div>
//             <p>{getNicknameTag}</p>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default UserVideoComponent;
