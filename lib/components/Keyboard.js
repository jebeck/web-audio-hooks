import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HEIGHT = 180;
const KEY_WIDTH = 40;
const OCTAVE_WIDTH = KEY_WIDTH * 7;

const BLACK_KEY_WIDTH = KEY_WIDTH * 0.625;

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
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
  fill: black;
  &.active {
    fill: #6e329b;
  }
  &.active:hover {
    fill: #9366b4;
  }
  :not(.active):hover {
    fill: #404040;
    stroke: #404040;
  }
`;

const StyledWhiteKey = styled.rect`
  fill: white;
  &.active {
    fill: #ff72be;
  }
  &.active:hover {
    fill: #ffb8de;
  }
  :not(.active):hover {
    fill: #f0f0f0;
  }
`;

/** aspect ratio for single octave is 16:9 */
export default function Keyboard({
  baseOctave = 4,
  inverted = false,
  notes,
  octaves = 2,
  onKeydown,
  onKeyup,
  style = {},
  width = '50vw',
}) {
  const viewBoxWidth = octaves * OCTAVE_WIDTH + OCTAVE_WIDTH / 7;

  const whiteKeys = useMemo(() => new Array(octaves * 8 - 1).fill(0), [
    octaves,
  ]);
  const blackKeys = useMemo(() => new Array(octaves * 5).fill(0), [octaves]);

  const WhiteKey = inverted ? StyledBlackKey : StyledWhiteKey;
  const BlackKey = inverted ? StyledWhiteKey : StyledBlackKey;

  return (
    <div style={style}>
      <svg viewBox={`0 0 ${viewBoxWidth} ${HEIGHT}`} style={{ width }}>
        <g id="white-keys">
          {whiteKeys.map((x, i) => {
            const noteString = `${WHITE_KEYS[i % 7].toLowerCase()}${
              baseOctave + Math.floor(i / 7)
            }`;
            const pressed = notes.includes(noteString);
            return (
              <WhiteKey
                className={pressed ? 'active' : undefined}
                fill={inverted ? 'black' : 'white'}
                height={HEIGHT}
                key={`${WHITE_KEYS[i % 7]}-${i}`}
                onClick={
                  pressed
                    ? () => onKeyup(noteString)
                    : () => onKeydown(noteString)
                }
                rx={2}
                ry={2}
                stroke={inverted ? 'white' : 'black'}
                width={KEY_WIDTH}
                x={i * KEY_WIDTH}
                y={0}
              />
            );
          })}
        </g>
        <g id="black-keys">
          {blackKeys.map((x, i) => {
            const noteString = `${BLACK_KEYS[i % 5].note.toLowerCase()}${
              baseOctave + Math.floor(i / 5)
            }`;
            const pressed = notes.includes(noteString);
            return (
              <BlackKey
                className={pressed ? 'active' : undefined}
                fill={inverted ? 'white' : 'black'}
                height={HEIGHT * 0.6}
                key={`${BLACK_KEYS[i % 5].note}-${i}`}
                onClick={
                  pressed
                    ? () => onKeyup(noteString)
                    : () => onKeydown(noteString)
                }
                rx={2}
                ry={2}
                stroke={inverted ? 'white' : 'black'}
                width={BLACK_KEY_WIDTH}
                x={BLACK_KEYS[i % 5].x + Math.floor(i / 5) * OCTAVE_WIDTH}
                y={0}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

Keyboard.propTypes = {
  activeColor: PropTypes.string,
  baseOctave: PropTypes.number,
  inverted: PropTypes.bool,
  octaves: PropTypes.number,
  onKeydown: PropTypes.func.isRequired,
  onKeyup: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string).isRequired,
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
