import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

export const initAudio = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = 120;
    console.log("Audio Context Started");
}

export const playTestNote = () => {
    synth.triggerAttackRelease("C4", "8n");
};