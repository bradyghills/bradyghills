/* ========= Eden Radio Player =========
   Poolsuite‑inspired floating radio
   Add / remove tracks in the `tracks` array.
   Files are loaded from /assets/music/
   ==================================== */

   const tracks = [
    { name: "Gotta Have You - The Weepies", file: "gottahaveyou.mp3" },
    { name: "BTSTU - Jai Paul", file: "btstu.mp3" },
    { name: "Simulation Swarm - Big Thief", file: "simulationswarm.mp3" },
    { name: "Image - Magdalena Bay",  file: "image.mp3" },
    { name: "I'm Only Sleeping - The Beatles", file: "imonlysleeping.mp3" },
    { name: "Bye Storm - Injury Reserve", file: "byestorm.mp3" },
    { name: "Towers - Bon Iver", file: "towers.mp3" },
    { name: "Mendiezeeno - Frat Mouse", file: "mendiezeeno.mp3" },
    { name: "Look at the Sky - Porter Robinson", file: "lookatthesky.mp3" },
    { name: "Gild the Lily - Billy Strings",  file: "gildthelily.mp3" },
    { name: "Revival - Zach Bryan",  file: "revival.mp3" },
    { name: "The Barrel - Aldous Harding",  file: "thebarrel.mp3" },
    { name: "Agoraphobia - Deerhunter",  file: "agoraphobia.mp3" }
    // 👉 Add more tracks here ↴
    // { name: "New Track Name", file: "new_track.mp3" }
  ];
  
  let current = 0;
  const audio   = document.getElementById('audio-player');
  const titleEl = document.getElementById('track-title');
  const playBtn = document.getElementById('play-pause-btn');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const muteBtn = document.getElementById('mute-btn');
  const minBtn  = document.getElementById('minimize-btn');
  const player  = document.getElementById('music-player');
  const header  = document.getElementById('music-player-header');
  const equalizerBars = document.querySelectorAll('.equalizer-bar');
  console.log(equalizerBars); // Debugging: Check if the bars are being selected

  // Get references to the time display elements
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');
  
  // ================= Playback =================
  function loadTrack(index) {
    current = (index + tracks.length) % tracks.length; // wrap around
    const track = tracks[current];
    audio.src = `assets/music/${track.file}`;
    titleEl.textContent = track.name;
    audio.play();
    playBtn.textContent = '❚❚';
    toggleEqualizerAnimation(true);
  }
  
  function playPause() {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '❚❚';
    } else {
      audio.pause();
      playBtn.textContent = '▶︎';
    }
  }
  
  function nextTrack() { loadTrack(current + 1); }
  function prevTrack() { loadTrack(current - 1); }
  
  function toggleMute() {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇' : '🔈';
  }
  
  function toggleMinimize() {
    player.classList.toggle('minimized');
    minBtn.textContent = player.classList.contains('minimized') ? '▢' : '_';
  }
  
  function toggleEqualizerAnimation(isPlaying) {
    equalizerBars.forEach(bar => {
      if (isPlaying) {
        bar.style.animationPlayState = 'running'; // Resume animation
        bar.style.transform = ''; // Reset any manual transform
      } else {
        bar.style.animationPlayState = 'paused'; // Pause animation
        bar.style.transform = 'scaleY(0.3)'; // Set all bars to a low height
      }
    });
  }

  function updateMarquee(isPlaying) {
    const marquee = document.querySelector('.track-marquee');
    if (isPlaying) {
      marquee.classList.remove('paused'); // Remove the paused class to enable scrolling
    } else {
      marquee.classList.add('paused'); // Add the paused class to stop scrolling
    }
  }

  // Format time as mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Update the current time and total duration
  function updateTimeDisplay() {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalDurationEl.textContent = formatTime(audio.duration || 0);
  }
  
  // ================= Event listeners =================
  playBtn.addEventListener('click', () => {
    playPause();
    toggleEqualizerAnimation(!audio.paused);
    updateMarquee(!audio.paused);
  });

  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  muteBtn.addEventListener('click', toggleMute);
  minBtn.addEventListener('click', toggleMinimize);

  audio.addEventListener('play', () => {
    console.log('Audio playing, starting equalizer animation');
    toggleEqualizerAnimation(true);
    updateMarquee(true);
  });

  audio.addEventListener('pause', () => {
    console.log('Audio paused, stopping equalizer animation');
    toggleEqualizerAnimation(false);
    updateMarquee(false);
  });

  audio.addEventListener('ended', () => {
    nextTrack();
    toggleEqualizerAnimation(false);
    currentTimeEl.textContent = '0:00';
    updateMarquee(false);
  });

  // Update the total duration when a new track loads
  audio.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audio.duration || 0);
  });

  // Update the current time every second while the track is playing
  audio.addEventListener('timeupdate', updateTimeDisplay);
  
  // ================= Draggable =================
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  header.addEventListener('mousedown', e => {
    if (e.target.closest('.control-btn')) return;
    const rect = player.getBoundingClientRect();
    offset.x = e.pageX - rect.left;
    offset.y = e.pageY - rect.top;
    isDragging = true;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;

    const newX = e.pageX - offset.x;
    const newY = e.pageY - offset.y;

    // Clamp the position to keep the player within the viewport
    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - player.offsetWidth));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - player.offsetHeight));

    player.style.left = `${clampedX}px`;
    player.style.top = `${clampedY}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });

  // ================= Init =================
  window.addEventListener('DOMContentLoaded', () => {
    loadTrack(0); // Load the first track

    // Attempt to autoplay the first track
    audio.play()
      .then(() => {
        console.log('Autoplay started successfully');
        playBtn.textContent = '❚❚'; // Update the play button to show "pause"
        toggleEqualizerAnimation(true); // Start the equalizer animation
        updateMarquee(true); // Update the marquee to show the current track
      })
      .catch(err => {
        console.warn('Autoplay blocked by the browser:', err);
        playBtn.textContent = '▶︎'; // Show the play button ready to go
        toggleEqualizerAnimation(false); // Stop the equalizer animation
        updateMarquee(false); // Update the marquee to show "Not Playing"
      });
  });
