import styled from 'styled-components';
import React, { useEffect, useRef } from 'react';
import { ReactComponent as Preparing } from '../assets/preparing_cat.svg';

const Camera = ({ person, param, streamManager }) => {
  // console.log('여긴 카메라', person);
  const videoRef = useRef();
  function getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  }

  // function getReadyTag() {
  //   return JSON.parse(props.streamManager.stream.connection.data).boolkey;
  // }

  useEffect(() => {
    if (streamManager && !!videoRef) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, []);
  console.log('streamManager::', streamManager);
  console.log('person::', person);
  console.log('getNicknameTag::', getNicknameTag());
  return (
    <Wrap>
      <PreParingIconWrap>
        {/* <Preparing /> */}
        {streamManager !== undefined && (
          <div className="streamcomponent">
            {/* <OpenViduVideoComponent streamManager={props.streamManager} /> */}
            <video id="<whatever>" autoPlay={true} ref={videoRef} />
            {/* <div>
              <Name>{getNicknameTag()}</Name>
            </div> */}
          </div>
        )}
      </PreParingIconWrap>
      <NickName>{person}</NickName>
    </Wrap>
  );
};

export default Camera;

const Wrap = styled.div`
  width: 24%;
  height: 45%;
  background-color: #e8e8e8;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const PreParingIconWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NickName = styled.div`
  width: 100%;
  height: 28px;
  line-height: 28px;
  background-color: #dfdfdf;
  color: #2b2b2b;
  font-weight: 600;
  font-size: 14px;
  align-self: flex-end;
  text-align: center;
  border-radius: 0px 0px 5px 5px;
`;
const Name = styled.p`
  width: 100%;
`;
