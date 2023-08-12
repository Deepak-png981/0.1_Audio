document.getElementById("audioFile").addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const objectURL = URL.createObjectURL(file);
        const player = document.getElementById("player");
        player.src = objectURL;
    }
});

document.querySelector('.file-upload input[type="file"]').addEventListener('change', function (e) {
    const fileName = e.target.files[0].name;
    document.querySelector('.file-label').textContent = fileName;
});
let gainNode, audioSource;

// Audio Context and nodes setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = document.getElementById('player');
audioSource = audioContext.createMediaElementSource(audioElement);
const gainNodes = [];
const convolver = audioContext.createConvolver();
// check
// let isGainConnected = false;
// let reverbGainNode = audioContext.createGain();
// let isReverbActive = false;
//check end
// Setting up the equalizer
const frequencies = [32, 64, 125, 250, 500];

frequencies.forEach((freq, index) => {
    gainNode = audioContext.createGain();
    const biquadFilter = audioContext.createBiquadFilter();

    biquadFilter.type = "peaking";
    biquadFilter.frequency.value = freq;
    biquadFilter.Q.value = 1;
    biquadFilter.gain.value = 0;

    audioSource.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNodes.push(gainNode);

    document.querySelector(`.slider[data-frequency="${freq}"]`).addEventListener('input', function (e) {
        biquadFilter.gain.value = e.target.value;
    });
});

// Handle the reverb effect
fetch('impulse-response.wav')
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        convolver.buffer = buffer;
    })
    .catch(err => {
        console.error("Error loading impulse response:", err);
    });

// Connect nodes in the following order: source -> biquadFilter (equalizer) -> convolver (reverb) -> destination
audioSource.connect(convolver);
convolver.connect(audioContext.destination);
// Handle the reverb slider
let isSourceConnectedToConvolver = true;  // Assuming initial state

document.querySelector('.reverb-slider').addEventListener('input', function (e) {
    const reverbValue = parseFloat(e.target.value);
    const gainValue = reverbValue / 100;
    let gainNode = audioContext.createGain();
    gainNode.gain.value = gainValue;
    if (isSourceConnectedToConvolver) {
        audioSource.disconnect(convolver);
        isSourceConnectedToConvolver = false;
    }
    audioSource.connect(gainNode);
    gainNode.connect(convolver);
});

document.querySelector('.reset-btn').addEventListener('click', function () {
    document.querySelectorAll('.slider').forEach(slider => {
        slider.value = 0;
        const frequency = slider.getAttribute('data-frequency');
        document.querySelector(`.slider[data-frequency="${frequency}"]`).dispatchEvent(new Event('input'));
    });
});
// document.querySelector('.reset-reverb-btn').addEventListener('click', function () {
//     const reverbSlider = document.querySelector('.reverb-slider');
//     reverbSlider.value = 0;  // Resetting the slider's visual position
//     reverbSlider.dispatchEvent(new Event('input'));  // Triggering the input event to update audio processing

//     // Resetting the actual reverb processing
//     const gainValue = 0;  // No reverb as default
//     gainNode.gain.value = gainValue;
//     audioSource.disconnect(convolver);
//     audioSource.connect(gainNode);
//     gainNode.connect(convolver);
// });
