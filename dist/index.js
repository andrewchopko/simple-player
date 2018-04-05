function flipToPlaylist() {
  const el = document.getElementsByClassName('player-card');
  el[0].classList.length < 2 ? el[0].classList.add('flipped') : el[0].classList.remove('flipped');
}

function togglePlayPause(){
  const el = document.getElementsByClassName('button-face');
  if (el[0].classList.length === 3){
    el[0].classList.add('hidden');
    el[1].classList.remove('hidden');
  }else{
    el[0].classList.remove('hidden');
    el[1].classList.add('hidden');
  }
}


const data = {
  icons: {
      play: "images/play-button-sing.png",
      pause: "images/pause-button.png",
      speakerLouder: "images/speaker-louder.png",
      speakerMiddle: "images/speaker-middle.png",
      speakerMinimum: "images/speaker-minimum.png",
      speakerMuted: "images/speaker-muted.png"
  },
  songs: [
    {
      "poster": "./songs/hardkiss/hardkiss-poster.jpg",
      "author": "The HardKiss",
      "song": "Make-Up",
      "src": "./songs/hardkiss/make-up.mp3"
    },
    {
      "poster": "./songs/onuka/onuka-poster.jpg",
      "author": "ONUKA",
      "song": "Intro",
      "src": "./songs/onuka/intro.mp3"
    },
    {
      "poster": "./songs/onuka/onuka-poster.jpg",
      "author": "ONUKA",
      "song": "Misto",
      "src": "./songs/onuka/misto.mp3"
    },
    {
      "poster": "./songs/onuka/onuka-poster.jpg",
      "author": "ONUKA",
      "song": "Vidlik",
      "src": "./songs/onuka/vidlik.mp3"
    },
    {
      "poster": "./songs/rammstein/ramm-poster.jpg",
      "author": "Rammstein",
      "song": "sonne",
      "src": "./songs/rammstein/sonne.mp3"
    },
    {
      "poster": "./songs/hardkiss/hardkiss-poster.jpg",
      "author": "The HardKiss",
      "song": "Stones",
      "src": "./songs/hardkiss/stones.mp3"
    },
    {
      "poster": "./songs/rammstein/ramm-poster.jpg",
      "author": "Rammstein",
      "song": "Kokain",
      "src": "./songs/rammstein/kokain.mp3"
    },
    {
      "poster": "./songs/onuka/onuka-poster.jpg",
      "author": "ONUKA",
      "song": "Svitanok",
      "src": "./songs/onuka/svitanok.mp3"
    },
    {
      "poster": "./songs/onuka/onuka-poster.jpg",
      "author": "ONUKA",
      "song": "Time",
      "src": "./songs/onuka/time.mp3"
    },
    {
      "poster": "./images/poster.jpg",
      "author": "The XX",
      "song": "Intro",
      "src": "./songs/the-xx.mp3"
    }
  ],
};

function TrackList(songs, icons, currentNumber = 0){

  const trackList = {};

  return {
    init: (function(){
      trackList.songs = songs;
      trackList.currentNumber = currentNumber;
      trackList.audio = new Audio(trackList.songs[trackList.currentNumber].src);
      trackList.volume = 0.75;
      trackList.preload = true;
      trackList.icons = icons;
    })(),

    firstSongPreload: function(){
      if(trackList.preload){
        trackList.audio.load();
        trackList.audio.onloadedmetadata = () => {
          document.querySelector('.duration').innerHTML = this.timeFormatter(trackList.audio.duration);
          trackList.progressBarWidth = document.querySelector('.progress-bar').clientWidth;
        };
        trackList.preload = false;
      }
    },

    updateAudio: function(number) {
      trackList.audio = new Audio(trackList.songs[number].src);
    },

    currentTrack: function(){
      this.firstSongPreload();
      trackList.audio.volume = trackList.volume;
      trackList.audio.onloadedmetadata = () => {
        document.querySelector('.duration').innerHTML = this.timeFormatter(trackList.audio.duration);
        trackList.progressBarWidth = document.querySelector('.progress-bar').clientWidth;
      };
    },

    playAudio: function(){
      this.currentTrack();
      trackList.audio.play();
      this.showSongInfo();

      trackList.audio.onended = () => {
        this.nextAudio();
      };
      trackList.audio.ontimeupdate = () => {
        document.querySelector(".time-now").innerHTML = this.timeFormatter(trackList.audio.currentTime);

        //move bar
        document.querySelector('.progress-bar-range').style.width = `${(trackList.audio.currentTime/trackList.audio.duration)*100}%`;
      };
    },

    pauseAudio: function(){
      trackList.audio.pause();
    },

    nextAudio: function(){
      this.pauseAudio();
      trackList.currentNumber === trackList.songs.length - 1 ? trackList.currentNumber = 0 : trackList.currentNumber++;
      this.updateAudio(trackList.currentNumber);
      this.playAudio();
    },

    prevAudio: function(){
      this.pauseAudio();
      trackList.currentNumber === 0 ? trackList.currentNumber = trackList.songs.length - 1 : trackList.currentNumber--;
      this.updateAudio(trackList.currentNumber);
      this.playAudio();
    },

    timeFormatter: function(timeInSec){
      const add0 = (num) => num < 10 ? '0' + num : '' + num;
      const hour = Math.floor(timeInSec / 3600);
      const min = Math.floor((timeInSec - hour * 3600) / 60);
      const sec = Math.floor(timeInSec - hour * 3600 - min * 60);
      return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
    },

    mute: function(){
      trackList.audio.muted = !trackList.audio.muted;
      const el = document.getElementById('speaker');
      if(trackList.audio.muted){
        el.style.backgroundImage = `url(${trackList.icons.speakerMuted})`;
      }else{
        el.style.backgroundImage = `url(${trackList.icons.speakerLouder})`;
      }
    },

    volume: function(val){
      trackList.audio.volume = val;
      trackList.volume = val;
      this.changeSpeaker(trackList.volume);
    },

    changeSpeaker: function(val){
      const el = document.getElementById('speaker');
      if(trackList.volume > 0.65){
        el.style.backgroundImage = `url(${trackList.icons.speakerLouder})`;
      }else if(trackList.volume < 0.65 && trackList.volume > 0.35){
        el.style.backgroundImage = `url(${trackList.icons.speakerMiddle})`;
      }else if(trackList.volume < 0.35 && trackList.volume > 0.00){
        el.style.backgroundImage = `url(${trackList.icons.speakerMinimum})`;
      }else{
        el.style.backgroundImage = `url(${trackList.icons.speakerMuted})`;
      }
    },

    showSongInfo: function(){
      document.getElementsByClassName('song-name')[0].innerHTML = trackList.songs[trackList.currentNumber].song;
      document.getElementsByClassName('singer')[0].innerHTML = trackList.songs[trackList.currentNumber].author;
      document.getElementById('title-bg').style.backgroundImage = `url(${trackList.songs[trackList.currentNumber].poster})`;
    },
  }
}

(function Playlist(songs){
  const preparePlaylist = (song) => {
    return tpl = `
    <div class="song">
      <div class="poster-wrapper">
        <div class="poster" style="background-image: url(${song.poster})"></div>
      </div>
      <div class="info">
        <div class="author">${song.author}</div>
        <div class="song-name">${song.song}</div>
      </div>
    </div>
    `;
  }

  ((songs) => {
    const play = songs.map(preparePlaylist).join('\n');
    const el = document.getElementById('song-list');
    el.innerHTML = play;
 })(songs);
})(data.songs);

const trackList = TrackList(data.songs, data.icons);
