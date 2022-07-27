/* Những việc cần làm
    1. Render songs
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active
    9. Scroll active song intro view
    10. Play  song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {} ,

    songs: [

        {
          name: "Arena of valor SS9",
          singer: "No infomation",
          path: "./assets/music/Arena_SS9.mp3",
          image: "./assets/img/Arena_SS9_2.jpg"
        },
        {
          name: "Arena of valor SS17",
          singer: "No infomation",
          path: "./assets/music/Arena_SS17.mp3",
          image: "./assets/img/Arena_SS17.jpg"
        },
       
        {
          name: "Anh vẫn ở đây lofi",
          singer: "Thành Đạt",
          path: "./assets/music/Anh Vẫn Ở Đây  Lofi.mp3",
          image: "./assets/img/anhvanoday.jpg"
        },
        {
          name: "Cảm ơn vì tất cả lofi",
          singer: "Anh Quân",
          path: "./assets/music/Cảm Ơn Vì Tất Cả Lofi.mp3",
          image: "./assets/img/camonvitatca.jpg"
        },
        {
          name: "Chỉ bằng cái gật đầu",
          singer: "Yan Nguyễn",
          path: "./assets/music/Chỉ Bằng Cái Gật Đầu Lofi.mp3",
          image: "./assets/img/chibangcaigatdau.jpg"
        },

        {
          name: "Chỉ muốn bên anh thật gần",
          singer: "Y Ling",
          path: "./assets/music/Chỉ Muốn Bên Em Thật Gần Lofi.mp3",
          image: "./assets/img/chimuonbenanhthatgan.jpg"
        },

        {
          name: "Homura",
          singer: "Lisa",
          path: "./assets/music/Homura.mp3",
          image: "./assets/img/homura.jpg"
        },

        {
          name: "Sao mình chưa nắm tay nhau",
          singer: "Yan Nguyễn",
          path: "./assets/music/Sao Mình Chưa Năm Tay Nhau lofi.mp3",
          image: "./assets/img/saominhchuanamtaynhau.jpg"
        },

        {
          name: "Sold out",
          singer: "Hawk Nelson",
          path: "./assets/music/Sold Out.mp3",
          image: "./assets/img/soldout.jpg"
        },

        {
          name: "Trap Queen",
          singer: "Adriana Gomez",
          path: "./assets/music/Trap Queen .mp3",
          image: "./assets/img/trapqueen.jpg"
        }
      ],

      setConfig: function(key , value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
      },

      render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index="${index}" >
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title"> ${song.name} </h3>
                        <p class="author"> ${song.singer} </p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')

      },

      defineProperties: function() {
        Object.defineProperty(this, 'currentSong' ,{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
      },

      handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
          { transform: 'rotate(360deg)'}
        ], {
          duration: 10000, //10 second
          iterations: Infinity
        })
        cdThumbAnimate.pause()


        //Xử lý phóng tu thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function() {
          if(_this.isPlaying) {      
            audio.pause()
          }
          else {
            audio.play()
          }
        }

        //khi song được play:
        audio.onplay = function() {
          _this.isPlaying = true
          player.classList.add('playing')
          cdThumbAnimate.play()
        }

        //khi song bị pause:
        audio.onpause = function() {
          _this.isPlaying = false
          player.classList.remove('playing')
          cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
          if(audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100) /*duration là thời lượng bài hát*/
            progress.value = progressPercent
          } 
        }

        //Xử lý khi tua bài hát
        progress.onchange = function(e) {
          const seekTime = (audio.duration / 100) * e.target.value
          audio.currentTime = seekTime
        }

        //Khi next bài hát
        nextBtn.onclick = function(){
          if(_this.isRandom) {
            _this.playRandomSong()
          }
          else {
            _this.nextSong()
          }
          
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }

        //Khi prev bài hát
        prevBtn.onclick = function(){
          if(_this.isRandom) {
            _this.playRandomSong()
          }
          else {
            _this.prevSong()
          }
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }

        // Xử ý bật / tắt random song
        randomBtn.onclick = function(e) {
          _this.isRandom = !_this.isRandom
          _this.setConfig('isRandom' , _this.isRandom)
          randomBtn.classList.toggle('active' , _this.isRandom) 
        }

        //Xử lí phát lại 1 bài hát
        repeatBtn.onclick = function (e){
          _this.isRepeat = !_this.isRepeat
          _this.setConfig('isRepeat' , _this.isRepeat)
          repeatBtn.classList.toggle('active' , _this.isRepeat)
        }

        //Xử ý next song khi audio ended
        audio.onended = function() {
          if (_this.isRepeat) {
            audio.play()
          }
          else {
            nextBtn.click()
          }
        }

        // Lắng nghe click vào playlist
        playlist.onclick = function(e){
          const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')) { 
              //closest sẽ trả về cái element hoặc là của chính nó hoặc là cha của nó , nếu k thấy nó sẽ trả về null
              // Xử lí khi click vào song
              if(songNode) {
                _this.currentIndex = Number(songNode.dataset.index) 
                //do current index ban đầu là số , khi cho bằng songNode.dataset.index sẽ chuyển thành chuỗi nên cần convert sang kiểu number
                _this.loadCurrentSong()
                _this.render()
                audio.play()
              }
              
              //Xử lí khi click vào song option
              if(e.target.closest('.option')) {

              }
            }
        }
      },

      scrollToActiveSong: function() {
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
        }, 300)
      },

      loadCurrentSong : function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path 

      },
      
      loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
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

      playRandomSong: function() {
        let newIndex
        do {
          newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
      },

      start: function() {

        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //Định nghĩa các thuộc tính cho obj
        this.defineProperties()

        //Lắng nghe và xử lí các sự kiện (DOM event)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render lại danh sách bài hát (playlist)
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active' , this.isRandom) 
        repeatBtn.classList.toggle('active' , this.isRepeat) 

      }
}

app.start()