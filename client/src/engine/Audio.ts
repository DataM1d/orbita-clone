import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
        attack: 0.0005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
    }
}).toDestination();

export const initAudio = async () => {
    await Tone.start();
    Tone.Transport.start();//Start the master clock
    console.log("Audio Context & Transport Started");
}

export const TriggerMagnetNote = (note: string) => {
    synth.triggerAttackRelease(note, "8n");
};