import Lottie from "react-lottie";
import animationDataFailure from "./AnimationFailure.json";
import animationDataSuccess from "./AnimationSuccess.json";

export const IconF = ({ width = 50 }: { width?: number }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationDataSuccess,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} width={width} />;
};
export const IconS = ({ width = 50 }: { width?: number }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationDataFailure,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} width={width} />;
};
