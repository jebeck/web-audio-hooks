import { useEffect, useRef } from 'react';

const DEFAULT_FREQUENCY = 350;
const DEFAULT_GAIN = 0;
const DEFAULT_Q = 1;

export function getFilterDefaultsByType(type) {
  switch (type) {
    case 'lowpass': {
      return {
        Q: DEFAULT_Q,
        frequency: DEFAULT_FREQUENCY,
      };
    }
    case 'highpass': {
      return {
        Q: DEFAULT_Q,
        frequency: DEFAULT_FREQUENCY,
      };
    }
    case 'bandpass': {
      return {
        Q: DEFAULT_Q,
        frequency: DEFAULT_FREQUENCY,
      };
    }
    case 'lowshelf': {
      return {
        frequency: DEFAULT_FREQUENCY,
        gain: 0,
      };
    }
    case 'highshelf': {
      return {
        frequency: DEFAULT_FREQUENCY,
        gain: 0,
      };
    }
    case 'peaking': {
      return {
        Q: DEFAULT_Q,
        frequency: DEFAULT_FREQUENCY,
        gain: DEFAULT_GAIN,
      };
    }
    case 'notch': {
      return {
        Q: DEFAULT_Q,
        frequency: DEFAULT_FREQUENCY,
      };
    }
    case 'allpass': {
      return {
        Q: DEFAULT_Q,
        frequency: DEFAULT_FREQUENCY,
      };
    }
    default: {
      throw new Error(`Unrecognized WebAudio BiquadFilterNode type '${type}'!`);
    }
  }
}

export const FILTER_TYPES = [
  'lowpass',
  'highpass',
  'bandpass',
  'lowshelf',
  'highshelf',
  'peaking',
  'notch',
  'allpass',
];

function shouldBeUpdated(filterNode, options, key) {
  return (
    filterNode &&
    options?.[key] &&
    options?.[key] != null &&
    options?.[key] != '' &&
    filterNode?.[key]?.value != options?.[key]
  );
}

export function useFilter({ audioCtx, destination, ...options }) {
  const filterNodeRef = useRef();

  function getFilter() {
    if (options?.type) {
      if (!filterNodeRef.current) {
        filterNodeRef.current = new BiquadFilterNode(audioCtx, options);
      }
      return filterNodeRef.current;
    }
  }

  useEffect(() => {
    if (options?.type) {
      let target = destination || audioCtx.destination;
      getFilter().connect(target);

      return () => {
        getFilter().disconnect(target);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.type]);

  useEffect(() => {
    const filter = getFilter();
    if (shouldBeUpdated(filter, options, 'detune')) {
      filter.detune.setValueAtTime(options.detune, audioCtx.currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const filter = getFilter();
    if (shouldBeUpdated(filter, options, 'frequency')) {
      filter.frequency.setValueAtTime(options.frequency, audioCtx.currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const filter = getFilter();
    if (shouldBeUpdated(filter, options, 'gain')) {
      /** gain cannot be 0 exactly, tho it can be negative */
      const valueToSet = options?.gain === 0 ? 0.01 : options?.gain;
      /** [MDN] Never change the value directly but use the exponential interpolation methods on the AudioParam interface. */
      filter.gain.exponentialRampToValueAtTime(
        valueToSet,
        audioCtx.currentTime + 1
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const filter = getFilter();
    if (shouldBeUpdated(filter, options, 'Q')) {
      filter.Q.setValueAtTime(options.Q, audioCtx.currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const filter = getFilter();
    if (filter && options?.type && filter.type !== options.type) {
      filter.type = options?.type;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return {
    filterNode: getFilter(),
  };
}
