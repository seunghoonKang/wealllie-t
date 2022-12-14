import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
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

  return (
    <div>
      {props.streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={props.streamManager} />
          <div>
            <p>{cookies.nickname}</p>
            {/* props.nickname 하니까 모두가 내이름으로 뜸 */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
