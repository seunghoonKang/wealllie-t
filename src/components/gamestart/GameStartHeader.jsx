import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../shared/socket';
import { ReactComponent as Megaphone } from '../../assets/megaphone.svg';
import { ReactComponent as VoteIcon } from '../../assets/voteIcon.svg';
import { useCookies } from 'react-cookie';
import Button from '../../elements/Button';
import styled from 'styled-components';

const GameStartHeader = ({ earlyVote, setEarlyVote }) => {
  const [disabledBtn, setDisabledBtn] = useState('투표준비');
  const userNickname = useSelector((state) => state.room.userNickname);
  const [cookies, setCookies] = useCookies(['nickname']);
  const navigate = useNavigate();
  const param = useParams();
  const [earlyVoteCount, setEarlyVoteCount] = useState(0);

  const tempGoOutBtn = () => {
    alert('방 나가기 소켓 임시로 넣었음');
    socket.emit('leaveRoom', param.id);
    socket.on('leaveRoom', () => {
      navigate('/home');
    });
    navigate('/home');
  };

  const voteBtnHandler = () => {
    //방에 들어온 인원이 for문을 돌며,
    //cookies에 있는 닉네임과 같은 사람이라면 투표
    //투표완료 되면 버튼 다시 비활성화
    for (let i = 0; i < userNickname.length; i++) {
      if (userNickname[i] === cookies.nickname) {
        setEarlyVoteCount((prev) => prev + 1);
        setEarlyVote(true);
        socket.emit('nowVote', param.id, true);
        setDisabledBtn('투표완료');
      }
    }

    //방 인원이 투표한 숫자가 게임 인원의 과반수 이상이라면
    //voteStart emit 해주고 투표페이지로 이동하면 될거같음
    if (earlyVoteCount >= userNickname.length / 2) {
      socket.emit('voteStart', (curr) => {
        console.log(curr);
      });
      alert('이제 투표페이지 가야지?');
    }
  };

  // useEffect(() => {

  // }, [voteBtnHandler]);

  //투표하기 활성화 btn -> 시간은 3분으로 변경 예정
  useEffect(() => {
    const checkNotDisabledBtn = setTimeout(() => {
      setDisabledBtn('투표하기');
    }, 5000);

    return () => {
      clearTimeout(checkNotDisabledBtn);
    };
  }, []);

  return (
    <HeaderSection>
      <HeaderTitle>
        <div className="flex">
          <MegaphoneDiv>
            <Megaphone width="15" height="13" fill="none" />
          </MegaphoneDiv>
          <div>스파이가 알아채지 못하게 답변해야해요 !</div>
        </div>
        <div className="flex gap-[6px]">
          <VoteIconDiv>
            <VoteIcon width="16" height="16" fill="none" />
          </VoteIconDiv>
          <div className=" pr-2">
            {earlyVoteCount}/{userNickname.length}
          </div>
        </div>
      </HeaderTitle>
      <Button type={'button'} addStyle={{}} onClick={tempGoOutBtn}>
        나가기 임시
      </Button>
      <Button
        type={'button'}
        addStyle={{
          backgroundColor: '#FF7300',
          borderRadius: '10px 10px 0 0',
          width: '113px',
          height: '40px',
          color: '#fff',
        }}
        onClick={voteBtnHandler}
        disabled
      >
        {disabledBtn}
      </Button>
    </HeaderSection>
  );
};

const HeaderSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 999;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px 10px 0 0;
  background-color: #fff;
  height: 40px;
  width: 97%;
`;

const MegaphoneDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  margin-right: 8px;
`;

const VoteIconDiv = styled.div`
  display: flex;
  align-items: center;
`;

export default GameStartHeader;