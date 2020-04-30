import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HEIGHT = 180;
const KEY_WIDTH = 40;
const OCTAVE_WIDTH = KEY_WIDTH * 8;

const BLACK_KEY_WIDTH = KEY_WIDTH * 0.625;

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
const BLACK_KEYS = [
  {
    note: 'C#',
    x: KEY_WIDTH - (2 / 3) * BLACK_KEY_WIDTH,
  },
  {
    note: 'D#',
    x: KEY_WIDTH * 2 - (1 / 3) * BLACK_KEY_WIDTH,
  },
  {
    note: 'F#',
    x: KEY_WIDTH * 4 - (2 / 3) * BLACK_KEY_WIDTH,
  },
  {
    note: 'G#',
    x: KEY_WIDTH * 5 - BLACK_KEY_WIDTH / 2,
  },
  {
    note: 'A#',

    x: KEY_WIDTH * 6 - (1 / 3) * BLACK_KEY_WIDTH,
  },
];

const StyledBlackKey = styled.rect`
  :hover {
    fill: #404040;
    stroke: #404040;
  }
`;

const StyledWhiteKey = styled.rect`
  :hover {
    fill: #f0f0f0;
  }
`;

/** aspect ratio for single octave is 16:9 */
export default function Keyboard({
  inverted = false,
  octaves = 2,
  style = {},
  width = '50vw',
}) {
  const viewBoxWidth = octaves * OCTAVE_WIDTH;

  const whiteKeys = useMemo(() => new Array(octaves * 8).fill(0), [octaves]);
  const blackKeys = useMemo(() => new Array(octaves * 5).fill(0), [octaves]);

  const WhiteKey = inverted ? StyledBlackKey : StyledWhiteKey;
  const BlackKey = inverted ? StyledWhiteKey : StyledBlackKey;

  return (
    <div style={style}>
      <svg viewBox={`0 0 ${viewBoxWidth} ${HEIGHT}`} style={{ width }}>
        <g id="white-keys">
          {whiteKeys.map((x, i) => (
            <WhiteKey
              fill={inverted ? 'black' : 'white'}
              height={HEIGHT}
              key={`${WHITE_KEYS[i % 8]}-${i}`}
              rx={2}
              ry={2}
              stroke={inverted ? 'white' : 'black'}
              width={KEY_WIDTH}
              x={i * KEY_WIDTH}
              y={0}
            />
          ))}
          =
        </g>
        <g id="black-keys">
          {blackKeys.map((x, i) => (
            <BlackKey
              fill={inverted ? 'white' : 'black'}
              height={HEIGHT * 0.6}
              key={`${BLACK_KEYS[i % 5].note}-${i}`}
              rx={2}
              ry={2}
              stroke={inverted ? 'white' : 'black'}
              width={BLACK_KEY_WIDTH}
              x={BLACK_KEYS[i % 5].x + Math.floor(i / 5) * OCTAVE_WIDTH}
              y={0}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

Keyboard.propTypes = {
  inverted: PropTypes.bool,
  octaves: PropTypes.number,
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
