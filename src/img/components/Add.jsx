import React from 'react';

const Add = props => (
  <svg viewBox="0 2 98 98" width={512} height={512} {...props}>
    <linearGradient
      id="a"
      gradientUnits="userSpaceOnUse"
      x1={49}
      y1={92.667}
      x2={49}
      y2={7.635}
      gradientTransform="matrix(1 0 0 -1 0 104)"
    >
      <stop offset={0} stopColor="#00efd1" />
      <stop offset={1} stopColor="#00acea" />
    </linearGradient>
    <path
      d="M49 11C25.8 11 7 29.8 7 53s18.8 42 42 42 42-18.8 42-42-18.8-42-42-42zm0 78c-19.9 0-36-16.1-36-36s16.1-36 36-36 36 16.1 36 36-16.1 36-36 36z"
      fill="url(#a)"
    />
    <linearGradient
      id="b"
      gradientUnits="userSpaceOnUse"
      x1={49}
      y1={92.667}
      x2={49}
      y2={7.635}
      gradientTransform="matrix(1 0 0 -1 0 104)"
    >
      <stop offset={0} stopColor="#00efd1" />
      <stop offset={1} stopColor="#00acea" />
    </linearGradient>
    <path
      d="M66 50H52V36c0-1.7-1.3-3-3-3s-3 1.3-3 3v14H32c-1.7 0-3 1.3-3 3s1.3 3 3 3h14v14c0 1.7 1.3 3 3 3s3-1.3 3-3V56h14c1.7 0 3-1.3 3-3s-1.3-3-3-3z"
      fill="url(#b)"
    />
  </svg>
);

export default Add;
