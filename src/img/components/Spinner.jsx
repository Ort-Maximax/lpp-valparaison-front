import React from 'react';

const Spinner = props => (
  <svg
    width={200}
    height={200}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    className="lds-flickr"
    style={{ background: '0 0' }}
    {...props}
  >
    <circle cy={50} cx={58.103} fill="#0095ff" r={20}>
      <animate
        attributeName="cx"
        calcMode="linear"
        values="30;70;30"
        keyTimes="0;0.5;1"
        dur={1.2}
        begin="-0.6s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cy={50} cx={41.897} fill="#072087" r={20}>
      <animate
        attributeName="cx"
        calcMode="linear"
        values="30;70;30"
        keyTimes="0;0.5;1"
        dur={1.2}
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cy={50} cx={58.103} fill="#0095ff" r={20}>
      <animate
        attributeName="cx"
        calcMode="linear"
        values="30;70;30"
        keyTimes="0;0.5;1"
        dur={1.2}
        begin="-0.6s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        values="0;0;1;1"
        calcMode="discrete"
        keyTimes="0;0.499;0.5;1"
        repeatCount="indefinite"
        dur="1.2s"
      />
    </circle>
  </svg>
);

export default Spinner;
