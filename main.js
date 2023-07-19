/* 1. render song
   2. scroll top 
   3.play/pause/seek 
   4.CD.rotate 
   5.Next/prev
   6.random
   7. next/repeat when ended
   8.active song
   9.scroll active song into view
   10.play song when click 
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    isRandom: false,
    isPlaying: false,
    isRepeat: false,
    currentIndex: 0,

    songs: [

        {
            name: "GONE",
            singer: "ROSE",
            path: "./assets/music/Gone.mp3",
            image: "assets/img/ROSE.jpg",
        },
        {
            name: "On The Ground",
            singer: "ROSE-BLACKPINK",
            path: "./assets/music/OnTheGround.mp3",
            image: "assets/img/ROSE.jpg",
        },
        {
            name: "GONE",
            singer: "ROSE",
            path: "./assets/music/Gone.mp3",
            image: "assets/img/ROSE.jpg",
        },
        {
            name: "GONE2",
            singer: "ROSE",
            path: "./assets/music/Gone.mp3",
            image: "assets/img/ROSE.jpg",
        },
        {
            name: "GONE3",
            singer: "ROSE",
            path: "./assets/music/Gone.mp3",
            image: "assets/img/ROSE.jpg",
        },
        {
            name: "GONE4",
            singer: "ROSE",
            path: "./assets/music/Gone.mp3",
            image: "assets/img/ROSE.jpg",
        },
        {
            name: "On The Ground",
            singer: "ROSE-BLACKPINK",
            path: "./assets/music/OnTheGround.mp3",
            image: "assets/img/ROSE.jpg",
        },
        {
            name: "On The Ground-Cuoi",
            singer: "ROSE-BLACKPINK",
            path: "./assets/music/OnTheGround.mp3",
            image: "assets/img/ROSE.jpg",
        },

    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
            </div>
          `
        })
        $('.playlist').innerHTML = htmls.join('');

    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },


    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg'
        }], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        //Xử lý phóng to/thu nhỏ CD 
        document.onscroll = function() {
            const scrollTop = (window.scrollY);
            const newCdwidth = cdWidth - scrollTop;
            cd.style.width = newCdwidth < 10 ? 0 : newCdwidth + 'px';
            cd.style.opacity = newCdwidth / cdWidth;

        };
        //Xử lý khi click play/ pause
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        //Xử lý khi được play
        audio.onplay = function() {
            player.classList.add('playing');
            _this.isPlaying = true;
            cdThumbAnimate.play();
        };
        //Xử lý khi pause
        audio.onpause = function() {
            player.classList.remove('playing');
            _this.isPlaying = false;
            cdThumbAnimate.pause();
        };
        //Xử lý khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.value = progressPercent;
            }

        };
        //Xử lý tua 
        progress.onchange = function(e) {
            const seekTime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        };
        //Xử lý khi click next/prev
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        };
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        };

        // Xử lý khi bấm random
        randomBtn.onclick = function() {
            console.log(_this.isRandom);
            _this.isRandom = !_this.isRandom;
            this.classList.toggle("active", _this.isRandom);

        };
        //Xử lý next khi kết thúc bài
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();

            }
        };
        //Xử lý repeat khi kết thúc bài
        repeatBtn.onclick = function() {
            console.log(_this.isRepeat);
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("active", _this.isRepeat);

        };



    },

    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url( ${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        console.log(this.currentSong);
        let newIndex;
        do
            newIndex = Math.floor(Math.random() * this.songs.length); while (this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        console.log(this.currentIndex);
        this.loadCurrentSong();
    },
    start: function() {
        //Định nghĩa các thuộc tính cho object 
        this.defineProperties();
        // Lắng nghe/xử lý các sự kiện DOM 
        this.handleEvents();

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng 
        this.loadCurrentSong();

        //Render playlist
        this.render();
    },

}
app.start();