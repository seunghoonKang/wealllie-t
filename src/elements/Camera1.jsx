import styled from 'styled-components';
import React, { useEffect, useRef } from 'react';
import { ReactComponent as Preparing } from '../assets/preparing_cat.svg';
import { useSelector } from 'react-redux';
import arrestedstamp from '../img/arrested.png';

const Camera = ({
  person,
  stamp,
  setStamp,
  voteStatus,
  streamManager,
  ready,
}) => {
  //console.log('여긴 카메라', person);
  console.log('stamp', stamp);
  const videoRef = useRef();
  const gamePage = useSelector((state) => state.game.gamePage);
  function getNicknameTag() {
    // Gets the nickName of the user
    if (streamManager) {
      return JSON.parse(streamManager.stream.connection.data).clientData;
    } else {
      return '';
    }
  }

  // function getReadyTag() {
  //   return JSON.parse(props.streamManager.stream.connection.data).boolkey;
  // }

  useEffect(() => {
    if (streamManager && !!videoRef) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, []);

  //투표할때 필요한 로직
  const arrestedToggle = () => {
    if (gamePage === 2) {
      person !== '' && voteStatus === false && setStamp(person);
      // if (voteStatus == false) {
      //   setStamp(person);
      // }
    }
  };

  return (
    <Wrap onClick={arrestedToggle}>
      <PreParingIconWrap>
        {streamManager !== undefined ? (
          <div>
            {gamePage === 2 && person !== '' && stamp === person && (
              <Arrested>
                <img src={arrestedstamp} alt="투표 지목된 사람" />
              </Arrested>
            )}
            <video autoPlay={true} ref={videoRef} />
          </div>
        ) : (
          <Preparing />
        )}
      </PreParingIconWrap>
      {ready !== undefined ? (
        ready ? (
          <NickName style={{ background: 'orange' }}>
            {getNicknameTag()}
          </NickName>
        ) : (
          <NickName>{getNicknameTag()}</NickName>
        )
      ) : null}
      {/* <NickName>{getNicknameTag()}</NickName> */}
    </Wrap>
  );
};

export default Camera;

const Wrap = styled.div`
  width: 24%;
  height: 45%;
  min-height: 170px;
  /* max-height: 160px; */
  background-color: #e8e8e8;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  position: relative;
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

const Arrested = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-25%);
  margin-left: -80px;
  z-index: 9999 !important;
`;
