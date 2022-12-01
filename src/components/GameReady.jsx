import styled from 'styled-components';
import ReadyButton from './gameready/ReadyButton';
import ReadyHeader from './gameready/ReadyHeader';
import HeaderSection from './gameready/HeaderSection';
import Camera from '../elements/Camera1';
import { useState, useEffect } from 'react';
import { ReactComponent as Ready } from '../assets/r_eady.svg';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { socket } from '../shared/socket';

const GameReady = () => {
  const [ready, useReady] = useState(false);
  const [pendingReady, setPendingReady] = useState([]);
  const [cookies] = useCookies(['nickname']);
  const param = useParams();

  const ReadyHandler = () => {
    socket.emit('ready', param.id);
    useReady(!ready);
  };

  socket.on('ready', (nic, bool) => {
    setPendingReady([
      ...pendingReady,
      { nickname: `${nic}`, boolkey: `${bool}` },
    ]);
    console.log('받아오는 pendingReady 값 확인', pendingReady);
  });

  // 가설 1 : 받아오는 닉네임 정보를 맵 돌린다. / 근데 맵 돌리니까 흰 화면 뜸 ;

  // pendingReady.map((h, i) => {
  //   console.log('들어온 사람~', h);
  //   if (h.nickname !== h.nickname) {
  //     const a = h.nickname;
  //     console.log(a);
  //   }
  //   let obj = {};
  //   obj['nickname'] = h.nickname;
  //   obj['boolkey'] = h.boolkey;
  //   console.log(obj);
  // });

  const userCameras = [
    { nickName: cookies.nickname },
    { nickName: 'b' },
    { nickName: 'c' },
    { nickName: 'd' },
    { nickName: 'e' },
    { nickName: 'f' },
    { nickName: 'g' },
    { nickName: 'h' },
  ];

  // const userLength = userCameras.length;

  socket.on('gameStart', (gameStart) => {
    console.log('게임시작됐는지 확인', gameStart);
  });

  return (
    <ReadyLayout>
      <div>
        <ReadyHeader />
        <HeaderSection />

        <ReadyButtonSection>
          <h1>준비 버튼을 클릭하세요 ! </h1>
          <span>모든 플레이어가 준비되면 자동으로 게임이 시작됩니다.</span>
          <div onClick={ReadyHandler}>
            <ReadyButton>준비완료 </ReadyButton>
          </div>
        </ReadyButtonSection>
      </div>
      <Users
      // userLength={userLength}
      >
        {userCameras.map((person) =>
          !ready ? (
            <Camera person={person.nickName} key={person.nickName} />
          ) : cookies.nickname === person.nickName ? (
            <ReadyWrap>
              <Ready />
              <ReadyNickName>{person.nickName}</ReadyNickName>
            </ReadyWrap>
          ) : (
            <Camera person={person.nickName} key={person.nickName} />
          )
        )}

        {/* {pendingReady.map((person, i) =>
          !ready ? (
            <Camera person={person.nickname} key={i} />
          ) : (
            <ReadyWrap>
              <Ready />
              <ReadyNickName>{person.nickname}</ReadyNickName>
            </ReadyWrap>
          )
        )} */}
      </Users>
    </ReadyLayout>
  );
};

export default GameReady;

const ReadyLayout = styled.div`
  width: 100%;
  //height: 100%;
  height: 90vh;
  min-height: 650px;
  background-color: white;
  border-radius: 5px;
`;

const ReadyButtonSection = styled.div`
  /* background-color: #4f9c64; */
  min-height: 160px;
  height: 22vh;
  margin: 1vh 1.5%;
  padding: 2vh 3%;
  //background-color: #f5f5f5;
  background-color: ${(props) => props.theme.color.gray1};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  //margin: 2vh auto; //50px auto 에서 변경
  align-items: flex;
  /* gap: 10px; */
  gap: 2vh;
  h1 {
    /* background-color: white; */
    font-size: 22px;
    font-weight: 700;
  }
  span {
    /* background-color: pink; */
    font-size: 16px;
    color: #2b2b2b;
    margin: 0px 0px 1vh; //27px -> 20px
  }
`;

const Users = styled.div`
  /* display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: space-evenly;
  gap: 16px 16px;
  border-radius: 5px;
  padding: 16px;
  background-color: white;
  min-height: 384px;
  height: 50vh; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly; //가로 띄우기
  align-content: space-evenly; //세로 띄우기
  width: 100%;
  height: 50vh;
  min-height: 312px;
`;

const ReadyWrap = styled.div`
  width: 24%;
  height: 45%;
  background-color: #e8e8e8;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  img {
    align-self: flex-start;
    /* margin: 5px; */
  }
`;

const ReadyNickName = styled.div`
  width: 100%;
  height: 28px;
  background-color: #222222;
  color: white;
  align-self: flex-end;
  text-align: center;
  border-radius: 0px 0px 5px 5px;
`;
