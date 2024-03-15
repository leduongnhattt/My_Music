const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const Player_storage_Key = "Music";

const player = $(".player");
const playlist = $(".playlist");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(Player_storage_Key)) || {},

  songs: [
    {
      name: "Querry",
      singer: "QNT x Trung Trần ft RPT MCK",
      path: "./asserts/music/Querry-QNT-Trung-Tran-MCK.mp3",
      image: "./asserts/img/R.jpg",
    },
    {
      name: "Nơi này có anh",
      singer: "Sơn Tùng MTP",
      path: "./asserts/music/NoiNayCoAnh-SonTungMTP-4772041.mp3",
      image: "./asserts/img/maxresdefault.jpg",
    },
    {
      name: "Ghé qua",
      singer: "Dick x Tofu x PC",
      path: "./asserts/music/GheQua-TaynguyenSoundTofuPC-7031399.mp3",
      image: "./asserts/img/maxresdefault (1).jpg",
    },
    {
      name: "Từng quen",
      singer: "Wren Evans x Ltsnk",
      path: "./asserts/music/b76sn4ccpk.mp3",
      image: "./asserts/img/OIP.jpg",
    },
    {
      name: "Hẹn một mai (Remix)",
      singer: "LouB",
      path: "./asserts/music/Hẹn Một Mai - LouB Remix.mp3",
      image: "./asserts/img/maxresdefault (2).jpg",
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(Player_storage_Key, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
              <div class="song ${
                index == this.currentIndex ? "active" : ""
              }" data-index="${index}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
              `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Handle CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iteration: Infinity,
    });
    cdThumbAnimate.pause();

    // Resize CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Handle click button play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // Khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi progress of song bị change
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Handle khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // When next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Khi back song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
    };
    // Handle turn on / off random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    // Handle song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click;
      }
    };

    // Handle repeat a song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Listener on click
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      // Handle click on Song
      if (songNode || e.target.closest(".option")) {
        // Handle click on Song
        if (songNode) {
          //songNode.getAttribute('data-index');
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }

        // Handle click on Option
        if( e.target.closest(".option")){
            
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    console.log(heading, cdThumb, audio);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Assign config to application
    this.loadConfig();

    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Xử lý các event liên quan đến DOM
    this.handleEvents();

    //Tải the first song vào UI
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Show initial state of button repeat and random
    randomBtn.classList.toggle("active", _this.isRandom);
    randomBtn.classList.toggle("active", _this.isRepeat);
  },
};
app.start();
