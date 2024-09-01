let audioContext;
let samples = [];
let sampleSources = [];
let gainNodes = [];
let analyserNodes = [];
let isSamplePaused = false;
let isSequencerPaused = false;
let startTime = 0;
let pauseTime = 0;
let liveInputNode;
let liveStream;
const preloadedDrumBuffers = {};
let tempo = 120;
const steps = 16;
let sequencerInterval;
let isSequencerPlaying = false;
let isSamplePlaying = false;

const drumSounds = {
    kick: "./Audio/drums/kick.wav",
    snare: "./Audio/drums/snare.wav",
    hihat: "./Audio/drums/hihat.wav"
};

const samplePaths = ["./Audio/Mathy_Luka_GTR.wav", "./Audio/Mathy_Bass_Dirt.wav", "./Audio/Mathy_Drums.mp3"];

document.addEventListener("DOMContentLoaded", () => {
    setupControlButtons();
    setupTempoControl();
    setupSequencerControls();
    
    const profileButtons = document.querySelectorAll('ul li a[data-profile]');
    profileButtons.forEach(button => {
      button.addEventListener('click', () => {
        setActiveProfile(button);
      });
    });
});

// Function to set the active profile button
function setActiveProfile(button) {
    const profileButtons = document.querySelectorAll('ul li a[data-profile]');
    profileButtons.forEach(btn => btn.classList.remove('active')); // Remove active class 
    button.classList.add('active'); // Add active class to clicked button
  }

// Function to initialize the Audio Context
function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext({ latencyHint: 0.001, sampleRate: 44100 });
        console.log("Audio Context Started with low latency settings");

        setupVolumeControls();
        setupDrumMachine();
        setupKeyboardControls();
        setupLiveInput();
        preloadDrumSounds();
        
        // Reattach event listeners for EQ controls after context is initialized
        setupEQControls();

        // Enable controls after initialization
        document.querySelectorAll('.controls button').forEach(button => button.disabled = false);
    }
}

function setupControlButtons() {
    const initializeAudioBtn = document.querySelector('.initialize-audio');
    const playSamplesBtn = document.querySelector('.play-samples');
    const stopSamplesBtn = document.querySelector('.stop-samples');
    const pauseSamplesBtn = document.querySelector('.pause-samples');
    const resumeSamplesBtn = document.querySelector('.resume-samples');

    initializeAudioBtn.addEventListener('click', () => {
        initializeAudioContext();
        initializeAudioBtn.disabled = true; // Disable after initialization
    });

    playSamplesBtn.addEventListener('click', () => {
        if (!isSamplePlaying) {
            startSamplePlayback();
            isSamplePlaying = true;
            playSamplesBtn.disabled = true;
            stopSamplesBtn.disabled = false;
            pauseSamplesBtn.disabled = false;
        }
    });

    stopSamplesBtn.addEventListener('click', () => {
        if (isSamplePlaying) {
            stopSamplePlayback();
            isSamplePlaying = false;
            playSamplesBtn.disabled = false;
            stopSamplesBtn.disabled = true;
            pauseSamplesBtn.disabled = true;
            resumeSamplesBtn.disabled = true;
        }
    });

    pauseSamplesBtn.addEventListener('click', () => {
        if (isSamplePlaying) {
            pauseSamplePlayback();
            isSamplePaused = true;
            pauseSamplesBtn.disabled = true;
            resumeSamplesBtn.disabled = false;
        }
    });

    resumeSamplesBtn.addEventListener('click', () => {
        if (isSamplePaused) {
            resumeSamplePlayback();
            isSamplePaused = false;
            pauseSamplesBtn.disabled = false;
            resumeSamplesBtn.disabled = true;
        }
    });

    const playSequencerBtn = document.querySelector('.start-sequencer');
    const stopSequencerBtn = document.querySelector('.stop-sequencer');
    const pauseSequencerBtn = document.querySelector('.pause-sequencer');
    const resumeSequencerBtn = document.querySelector('.resume-sequencer');

    playSequencerBtn.addEventListener('click', () => {
        if (!isSequencerPlaying) {
            startSequencer();
            isSequencerPlaying = true;
            playSequencerBtn.disabled = true;
            stopSequencerBtn.disabled = false;
            pauseSequencerBtn.disabled = false;
        }
    });

    stopSequencerBtn.addEventListener('click', () => {
        if (isSequencerPlaying) {
            stopSequencer();
            isSequencerPlaying = false;
            playSequencerBtn.disabled = false;
            stopSequencerBtn.disabled = true;
            pauseSequencerBtn.disabled = true;
            resumeSequencerBtn.disabled = true;
        }
    });

    pauseSequencerBtn.addEventListener('click', () => {
        if (isSequencerPlaying) {
            pauseSequencer();
            isSequencerPaused = true;
            pauseSequencerBtn.disabled = true;
            resumeSequencerBtn.disabled = false;
        }
    });

    resumeSequencerBtn.addEventListener('click', () => {
        if (isSequencerPaused) {
            resumeSequencer();
            isSequencerPaused = false;
            pauseSequencerBtn.disabled = false;
            resumeSequencerBtn.disabled = true;
        }
    });
}

// Functions for Sample Playback
function startSamplePlayback() {
    if (audioContext) {
        setupSamples(samplePaths).then((response) => {
            samples = response;
            startTime = audioContext.currentTime;
            playSamples();
        }).catch((error) => {
            console.error("Error setting up samples:", error);
        });
    } else {
        console.error("Audio Context is not initialized. Please start the audio context first.");
    }
}

function stopSamplePlayback() {
    sampleSources.forEach(source => source.stop());
    resetSamplePlaybackControls();
    console.log("Sample Playback Stopped");
}

function pauseSamplePlayback() {
    sampleSources.forEach(source => source.stop());
    pauseTime = audioContext.currentTime - startTime;
    console.log("Sample Playback Paused");
}

function resumeSamplePlayback() {
    playSamples(pauseTime);
    console.log("Sample Playback Resumed");
}

function resetSamplePlaybackControls() {
    isSamplePaused = false;
    isSamplePlaying = false;
    const playSamplesBtn = document.querySelector('.play-samples');
    const stopSamplesBtn = document.querySelector('.stop-samples');
    const pauseSamplesBtn = document.querySelector('.pause-samples');
    const resumeSamplesBtn = document.querySelector('.resume-samples');

    playSamplesBtn.disabled = false;
    stopSamplesBtn.disabled = true;
    pauseSamplesBtn.disabled = true;
    resumeSamplesBtn.disabled = true;
}

// Functions for Sequencer Playback
function startSequencer() {
    let currentStep = 0;
    const interval = (60 / tempo) / 4 * 1000; // Convert BPM to interval in milliseconds

    sequencerInterval = setInterval(() => {
        document.querySelectorAll('.sequencer-step').forEach(step => {
            const track = step.dataset.track;
            const stepIndex = parseInt(step.dataset.step, 10);

            if (stepIndex === currentStep && step.classList.contains('active')) {
                playDrumSound(track);
            }
        });

        currentStep = (currentStep + 1) % steps;
    }, interval);
}

function stopSequencer() {
    clearInterval(sequencerInterval);
    console.log("Sequencer Stopped");
}

function pauseSequencer() {
    clearInterval(sequencerInterval);
    console.log("Sequencer Paused");
}

function resumeSequencer() {
    startSequencer();
    console.log("Sequencer Resumed");
}

function setupTempoControl() {
    const tempoInput = document.getElementById('tempo');
    tempoInput.addEventListener('input', (event) => {
        tempo = parseInt(event.target.value, 10);
        console.log(`Tempo set to ${tempo} BPM`);
        if (isSequencerPlaying) resetSequencer(); // Reset the sequencer to adjust for new tempo
    });
}

function resetSequencer() {
    clearInterval(sequencerInterval);
    startSequencer();
}

// Setup Functions
function setupEQControls() {
    document.querySelectorAll('.eq-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const target = document.querySelector(toggle.dataset.target);
            if (target) {
                const isVisible = target.style.display === 'block';
                document.querySelectorAll('.eq-dropdown').forEach(dropdown => dropdown.style.display = 'none'); // Hide all dropdowns
                target.style.display = isVisible ? 'none' : 'block'; // Toggle the clicked dropdown
            }
        });
    });

    // Ensure EQ Sliders are updating dynamically
    for (let i = 1; i <= samplePaths.length; i++) {
        document.getElementById(`bassSlider${i}`).addEventListener("input", event => {
            updateEQ(i, 'bass', event.target.value);
        });
        document.getElementById(`midSlider${i}`).addEventListener("input", event => {
            updateEQ(i, 'mid', event.target.value);
        });
        document.getElementById(`trebleSlider${i}`).addEventListener("input", event => {
            updateEQ(i, 'treble', event.target.value);
        });
    }
}

function setupVolumeControls() {
    for (let i = 1; i <= samplePaths.length; i++) {
        const volumeSlider = document.getElementById(`volumeSlider${i}`);
        volumeSlider.addEventListener("input", () => {
            const gainNode = gainNodes[i - 1];
            if (gainNode) {
                gainNode.gain.value = volumeSlider.value;
            }
        });
    }
}

function setupSequencerControls() {
    document.querySelectorAll('.sequencer-step').forEach(step => {
        step.addEventListener('click', () => {
            step.classList.toggle('active'); // Toggle the step on or off
        });
    });
}

function setupDrumMachine() {
    document.querySelectorAll('.drum-pad').forEach(pad => {
        pad.addEventListener('click', async () => {
            const sound = pad.getAttribute('data-sound');
            await playDrumSound(sound);
        });
    });
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case '1':
                playDrumSound('kick');
                break;
            case '2':
                playDrumSound('snare');
                break;
            case '3':
                playDrumSound('hihat');
                break;
        }
    });
}

// Audio Setup and Playback Functions
async function preloadDrumSounds() {
    console.log("Preloading drum sounds...");
    for (const [name, path] of Object.entries(drumSounds)) {
        try {
            const buffer = await getFile(path);
            preloadedDrumBuffers[name] = buffer;
            console.log(`Preloaded drum sound: ${name}`);
        } catch (error) {
            console.error(`Error preloading drum sound ${name}:`, error);
        }
    }
}

async function setupSamples(paths) {
    console.log("Setting up samples");
    const audioBuffers = [];

    for (const path of paths) {
        try {
            const sample = await getFile(path);
            audioBuffers.push(sample);
        } catch (error) {
            console.error(`Error setting up sample ${path}:`, error);
        }
    }

    console.log("Setting up done");
    return audioBuffers;
}

function playSamples(offset = 0) {
    sampleSources = samples.map((sample, index) => {
        const sampleSource = audioContext.createBufferSource();
        sampleSource.buffer = sample;

        const bassEQ = new BiquadFilterNode(audioContext, {
            type: 'lowshelf',
            frequency: 500,
            gain: parseFloat(document.getElementById(`bassSlider${index + 1}`).value)
        });

        const midEQ = new BiquadFilterNode(audioContext, {
            type: 'peaking',
            Q: Math.SQRT1_2,
            frequency: 1500,
            gain: parseFloat(document.getElementById(`midSlider${index + 1}`).value)
        });

        const trebleEQ = new BiquadFilterNode(audioContext, {
            type: 'highshelf',
            frequency: 3000,
            gain: parseFloat(document.getElementById(`trebleSlider${index + 1}`).value)
        });

        const gainNode = audioContext.createGain();
        gainNode.gain.value = parseFloat(document.getElementById(`volumeSlider${index + 1}`).value);
        gainNodes[index] = gainNode;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserNodes[index] = analyser;

        sampleSource.connect(bassEQ).connect(midEQ).connect(trebleEQ).connect(gainNode).connect(analyser).connect(audioContext.destination);

        sampleSource.eqNodes = { bass: bassEQ, mid: midEQ, treble: trebleEQ };
        sampleSource.gainNode = gainNode;

        sampleSource.start(0, offset);

        updateMeter(index, analyser);

        return sampleSource;
    });
}

async function getFile(filePath) {
    try {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    } catch (error) {
        console.error(`Error fetching or decoding file ${filePath}:`, error);
        throw error;
    }
}

function playDrumSound(sound) {
    if (audioContext) {
        const buffer = preloadedDrumBuffers[sound];
        if (buffer) {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
        } else {
            console.error(`Sound buffer not found for ${sound}`);
        }
    } else {
        console.error("Audio Context is not initialized. Please start the audio context first.");
    }
}

function setupLiveInput() {
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
        .then(stream => {
            liveStream = stream;
            const liveInput = audioContext.createMediaStreamSource(stream);

            const bassEQ = new BiquadFilterNode(audioContext, {
                type: 'lowshelf',
                frequency: 100,
                gain: parseFloat(document.getElementById('bassSliderLive').value)
            });

            const midEQ = new BiquadFilterNode(audioContext, {
                type: 'peaking',
                Q: Math.SQRT1_2,
                frequency: 1500,
                gain: parseFloat(document.getElementById('midSliderLive').value)
            });

            const trebleEQ = new BiquadFilterNode(audioContext, {
                type: 'highshelf',
                frequency: 3000,
                gain: parseFloat(document.getElementById('trebleSliderLive').value)
            });

            const gainNode = audioContext.createGain();
            gainNode.gain.value = parseFloat(document.getElementById('volumeSliderLive').value);
            liveInputNode = gainNode;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            liveInput.connect(bassEQ).connect(midEQ).connect(trebleEQ).connect(gainNode).connect(analyser).connect(audioContext.destination);

            updateMeterLive(analyser);

            document.getElementById('bassSliderLive').addEventListener('input', event => {
                bassEQ.gain.value = event.target.value;
            });
            document.getElementById('midSliderLive').addEventListener('input', event => {
                midEQ.gain.value = event.target.value;
            });
            document.getElementById('trebleSliderLive').addEventListener('input', event => {
                trebleEQ.gain.value = event.target.value;
            });
            document.getElementById('volumeSliderLive').addEventListener('input', event => {
                gainNode.gain.value = event.target.value;
            });

        }).catch(error => {
            console.error('Error accessing live audio input:', error);
        });
}

function updateMeter(index, analyser) {
    const canvas = document.getElementById(`meterCanvas${index + 1}`);
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const height = (average / 255) * canvas.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, canvas.height - height, canvas.width, height);
    }

    draw();
}

function updateMeterLive(analyser) {
    const canvas = document.getElementById('meterCanvasLive');
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const height = (average / 255) * canvas.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, canvas.height - height, canvas.width, height);
    }

    draw();
}

function updateEQ(index, band, value) {
    if (sampleSources.length > 0) {
        const eqNode = sampleSources[index - 1].eqNodes[band];
        if (eqNode) {
            eqNode.gain.value = value;
        } 
    }
}
