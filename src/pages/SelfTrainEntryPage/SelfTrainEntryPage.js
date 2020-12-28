import React, { useEffect, useState } from 'react';

import ReactRouterPropTypes from 'react-router-prop-types';

import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { get } from '@utils/snippet';
import { handleReset } from '@store/Time/time';
import TextBox from '@components/TextBox';
import Button from '@components/Button';
import SelectCard from './SelectCard';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const WrapContent = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WrapCardSection = styled.div`
  display: flex;
  margin-top: 3vh;
  margin-bottom: 3.3vh;
  padding: 2.5vh;
`;

const WrapButton = styled.div`
  > div {
    width: 29.6vh;
    height: 6vh;
    > p {
      font-size: 1.9vh;
    }
  }
`;

const SELECT_NOTHING = 0;
const GUIDE_BUTTON = 1;
const ADD_QUESTION_BUTTON = 2;

export default function SelfTrainEntryPage({ history }) {
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(SELECT_NOTHING);
  const { name } = useSelector(get('auth'));

  useEffect(() => {
    dispatch(handleReset({ keepTrain: false }));
  }, []);

  const handleToggle = (select) => {
    if (select === clicked) return setClicked(SELECT_NOTHING);
    return setClicked(select);
  };

  const isGuide = clicked === GUIDE_BUTTON;

  return (
    <Wrapper>
      <WrapContent>
        <TextBox
          topText={`${name}님 화상 면접을 연습하세요`}
          bottomText="원하는 기능을 선택하여 화상 면접을 대비해 보세요."
        />
        <WrapCardSection>
          <SelectCard
            kind={GUIDE_BUTTON}
            clicked={clicked === GUIDE_BUTTON}
            func={() => handleToggle(GUIDE_BUTTON)}
          />
          <SelectCard
            kind={ADD_QUESTION_BUTTON}
            clicked={clicked === ADD_QUESTION_BUTTON}
            func={() => handleToggle(ADD_QUESTION_BUTTON)}
          />
        </WrapCardSection>
        <WrapButton>
          <Button
            func={
              // TODO: 기본 질문목록 endpoint 재호님이 추가하면 바꿔야 함
              isGuide
                ? () => history.push('/self/setting/3')
                : () => history.push('/questionlist')
            }
            theme={clicked ? 'blue' : 'gray'}
            text="다음"
          />
        </WrapButton>
      </WrapContent>
    </Wrapper>
  );
}

SelfTrainEntryPage.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};
