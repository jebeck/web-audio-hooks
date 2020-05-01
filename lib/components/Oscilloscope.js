import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';

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
    bg: '#424242',
    stroke: 'deeppink',
  },
};

function OscilloscopeContainer(props) {
  const { absolute, height = 180, position, width = 320 } = props;
  const canvasRef = useRef();
  return (
    <Fragment>
      <canvas
        height={height}
        ref={canvasRef}
        width={width}
        style={{
          maxHeight: height,
          maxWidth: width,
          position: absolute ? 'absolute' : 'relative',
          ...position,
        }}
      />
      <Oscilloscope canvasRef={canvasRef} {...props} />
    </Fragment>
  );
}

OscilloscopeContainer.defaultProps = {
  absolute: true,
};

OscilloscopeContainer.propTypes = {
  absolute: PropTypes.bool,
  analyser: PropTypes.object,
  height: PropTypes.number,
  position: PropTypes.shape({
    top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  width: PropTypes.number,
};

export default OscilloscopeContainer;
