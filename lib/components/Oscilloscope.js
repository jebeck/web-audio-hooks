import React, { useRef } from 'react';
import PropTypes from 'react';

import { useTimeDomainData } from '../../src/hooks/useTimeDomainData';

import OscilloscopeWorker from '../workers/Oscilloscope.worker';

function Oscilloscope({ analyser, canvasRef, ...rest }) {
  const workerOptions = ['bg', 'stroke'].reduce((acc, key) => {
    acc[key] = rest?.[key] || colors?.[rest?.theme || 'dark']?.[key];
    return acc;
  }, {});

  useTimeDomainData({
    analyser,
    canvasRef,
    Worker: OscilloscopeWorker,
    workerOptions,
  });

  return null;
}

const colors = {
  light: {
    bg: 'ghostwhite',
    stroke: 'black',
  },
  dark: {
    bg: '#414141',
    stroke: 'deeppink',
  },
};

function OscilloscopeContainer(props) {
  const { height = 180, position, width = 320 } = props;
  const canvasRef = useRef();
  return (
    <>
      <canvas
        height={height}
        ref={canvasRef}
        width={width}
        style={{ position: 'absolute', ...position }}
      />
      <Oscilloscope canvasRef={canvasRef} {...props} />
    </>
  );
}

OscilloscopeContainer.propTypes = {
  analyser: PropTypes.object,
  height: PropTypes.number,
  position: PropTypes.object,
  // position: PropTypes.shape({
  //   top: PropTypes.number,
  //   right: PropTypes.number,
  //   bottom: PropTypes.number,
  //   left: PropTypes.number,
  // }),
  width: PropTypes.number,
};

export default OscilloscopeContainer;
