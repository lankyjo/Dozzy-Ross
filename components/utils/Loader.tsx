import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <div className="fixed flex w-full h-screen inset-0 justify-center items-center bg-black z-999W">
      <StyledWrapper>
        <div className="loader">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>
      </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
.loader{
 display: flex;
 justify-content: center;
 align-items: center;
}
  .bar {
    display: inline-block;
    width: 3px;
    height: 20px;
    background-color: rgba(255, 255, 255, .5);
    border-radius: 10px;
    animation: scale-up4 1s linear infinite;
  }

  .bar:nth-child(2) {
    height: 35px;
    margin: 0 5px;
    animation-delay: .25s;
  }

  .bar:nth-child(3) {
    animation-delay: .5s;
  }

  @keyframes scale-up4 {
    20% {
      background-color: #ffff;
      transform: scaleY(1.5);
    }

    40% {
      transform: scaleY(1);
    }
  }`;

export default Loader;
