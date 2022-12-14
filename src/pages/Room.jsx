import { useState, useEffect } from 'react';
import Notice from '../elements/Notice';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { socket } from '../shared/socket';
import { useBeforeunload } from 'react-beforeunload';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import GameReady from '../components/GameReady';
import GameStart from '../components/GameStart';
import GameVote from '../components/GameVote';
import RoomChat from '../components/RoomChat';
import GameEnd from '../components/GameEnd';
import { useMemo } from 'react';

const Room = () => {
  // 새로고침방지
  useBeforeunload((event) => event.preventDefault());
  const param = useParams();
  const [cookies, setCookies] = useCookies(['nickname']);
  const navigate = useNavigate();
  const gameOperation = useSelector((state) => state.game.gameOperation);

  // console.log('게임 값 다 받고 실행할 값', gameOperation);

  const initialState = [
    { nickname: '', boolkey: false, id: 1 },
    { nickname: '', boolkey: false, id: 2 },
    { nickname: '', boolkey: false, id: 3 },
    { nickname: '', boolkey: false, id: 4 },
    { nickname: '', boolkey: false, id: 5 },
    { nickname: '', boolkey: false, id: 6 },
    { nickname: '', boolkey: false, id: 7 },
    { nickname: '', boolkey: false, id: 8 },
  ];

  const [userCameras, setUserCameras] = useState(initialState);

  const vacancy = useMemo(() => {
    socket.on('userNickname', (userNickname) => {
      console.log('유저닉', userNickname);
      //dispatch(getUserNickname(userNickname));
      setUserCameras(initialState);
      for (let item = 0; item < userNickname.length; item++) {
        if (userCameras[item].nickname !== userNickname[item]) {
          userCameras[item].nickname = userNickname[item];
        }
      }
      return userCameras;
    });
  }, [userCameras]);

  useEffect(() => {
    //로그인 안하면 로비입장 못하게 하기 (useEffect 안에 넣어야 navigate 먹어요)
    if (cookies.nickname == null) {
      alert('로그인이 필요합니다');
      navigate(`/`);
    }
  }, []);
  if (cookies.nickname == null) {
  } else {
    return (
      <>
        {gameOperation !== 0 ? <Notice black="black" /> : <Notice />}
        <Box>
          {gameOperation !== 3 ? (
            <>
              <Game>
                {/* 본인 컴포넌트말고 주석하면 돼용 */}
                {gameOperation === 0 && <GameReady userCameras={userCameras} />}
                {gameOperation === 1 && <GameStart userCameras={userCameras} />}
                {gameOperation === 2 && <GameVote />}
                {/* <GameReady /> */}
                {/* <GameStart /> */}
                {/* <GameVote /> */}
              </Game>
              {/* <GameEnd /> */}
              <RoomChat />
            </>
          ) : (
            <GameEnd />
          )}
        </Box>
      </>
    );
  }
};

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px 0 16px;
`;

//List 없애고 Game 에 합침
const Game = styled.div`
  width: calc(100% - 350px);
  height: 90vh;
  min-height: 650px;
`;

export default Room;
