import { useEffect, useState } from 'react';
import WebMIDI from 'webmidi';

export function useWebMIDI() {
  const [error, setError] = useState(null);
  useEffect(() => {
    WebMIDI.enable((error) => {
      if (error) {
        return setError(error);
      }
      console.log('WebMIDI enabled 🎉');
      console.log('MIDI inputs', WebMIDI.inputs);
      console.log('MIDI outputs', WebMIDI.outputs);
    });
  }, []);

  return { error };
}
