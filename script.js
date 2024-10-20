const audioInput = document.getElementById('audioInput');
const uploadIcon = document.getElementById('uploadIcon');
const audio = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const songName = document.getElementById('songName');
const volumeControl = document.getElementById('volume');
const speakers = document.querySelectorAll('.altofalante');
const corneta = document.querySelector('.corneta');
let audioContext;
let source;
let analyser;

uploadIcon.addEventListener('click', () => {
  audioInput.click();
});

audioInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  if (file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
    playButton.disabled = false;
    songName.textContent = `Música: ${file.name}`;
  }
});

volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

playButton.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().then(() => {
      playButton.textContent = "Parar Áudio";
      initializeAudioContext();
      startSpeakerAnimation();
    }).catch(error => {
      console.log("Erro ao tentar reproduzir o áudio: ", error);
    });
  } else {
    audio.pause();
    playButton.textContent = "Tocar Áudio";
    stopSpeakerAnimation();
  }
});

function initializeAudioContext() {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
  }
}

function startSpeakerAnimation() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  function animateSpeakers() {
    analyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const scale = 1 + (average / 600);

    speakers.forEach(speaker => {
      speaker.style.transform = `scale(${scale})`;
    });

    corneta.style.transform = `scale(${scale})`;
    
    if (!audio.paused) {
      requestAnimationFrame(animateSpeakers);
    }
  }
  
  animateSpeakers();
}

function stopSpeakerAnimation() {
  speakers.forEach(speaker => {
    speaker.style.transform = 'scale(1)';
  });

  corneta.style.transform = 'scale(1)';
}
