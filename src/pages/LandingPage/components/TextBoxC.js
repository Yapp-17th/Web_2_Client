import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  @media only screen and (max-width: 1150px) {
    margin: 25px;
  }
  height: 200px;
  width: 330px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const WrapIcon = styled.img`
  z-index: 1;
  position: absolute;
  top: -40px;
  left: 27px;
  width: 80px;
  height: 80px;
`;

const WrapContent = styled.div`
  width: 100%;
  height: 256px;
  box-shadow: 0 6px 12px 0 rgba(4, 4, 161, 0.1);
  border: solid 1px #f6f6f6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const WrapInnerContent = styled.div`
  height: 140px;
  width: 260px;
`;

const WrapText = styled.div`
  ${({ lineHeight }) => lineHeight && `line-height: ${lineHeight}`};
  font-size: ${({ size }) => size}px;
  ${({ bold }) => bold && 'font-family: AppleSDGothicNeoB00;'}
  color: ${({ color }) => color};
`;

const WrapPadding = styled.div`
  padding: ${({ padding }) => padding && '30px 0 30px 0'};
`;

export default function TextBoxC({ header, summary, icon }) {
  return (
    <Wrapper>
      <WrapIcon src={icon} />
      <WrapContent>
        <WrapInnerContent>
          <WrapPadding padding>
            <WrapText size={19} bold>
              {header}
            </WrapText>
          </WrapPadding>
          <div>
            {summary.map((each, key) => (
              <WrapText
                key={`${key}-summary-C`}
                size={13}
                lineHeight="130%"
                color="#3d3d3d"
              >
                {each}
              </WrapText>
            ))}
          </div>
        </WrapInnerContent>
      </WrapContent>
    </Wrapper>
  );
}

TextBoxC.propTypes = {
  header: PropTypes.string,
  summary: PropTypes.array,
  icon: PropTypes.string.isRequired,
};

TextBoxC.defaultProps = {
  header: '',
  summary: [],
};
