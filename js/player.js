// 歌曲数据
const songs = [
    {
        title: "神作！",
        format: "无损音质臻享版！",
        duration: "1:45",
        src: "Audio/神作！.wav"
    },
    {
        title: "神作！",
        format: "标准版",
        duration: "1:45",
        src: "Audio/神作！.mp3"
    },
    {
        title: "呜呜呜",
        format: "无损音质臻享版！",
        duration: "0:07",
        src: "Audio/呜呜呜.wav"
    },
    {
        title: "呜呜呜",
        format: "标准版",
        duration: "0:07",
        src: "Audio/呜呜呜.mp3"
    },
    {
        title: "这期...拉了",
        format: "无损音质臻享版！",
        duration: "0:21",
        src: "Audio/这期拉了.wav"
    },
    {
        title: "这期...拉了",
        format: "标准版",
        duration: "0:21",
        src: "Audio/这期拉了.mp3"
    }
];

// 播放器状态
let playerState = {
    isPlaying: false,
    currentSongIndex: 0,
    audioPlayer: null,
    record: null,
    playBtn: null,
    progress: null,
    progressBar: null,
    songList: null,
    playlist: null,
    foldBtn: null
};

// 初始化播放器
function initPlayer() {
    // 获取DOM元素
    playerState.audioPlayer = document.getElementById('audio-player');
    playerState.record = document.getElementById('record');
    playerState.playBtn = document.querySelector('.play-btn');
    playerState.progress = document.getElementById('progress');
    playerState.progressBar = document.getElementById('progress-bar');
    playerState.songList = document.querySelector('.song-list');
    playerState.playlist = document.querySelector('.playlist');
    playerState.foldBtn = document.querySelector('.fold-btn');
    
    // 初始化播放列表
    initPlaylist();
    
    // 加载第一首歌
    loadSong(0);
    
    // 初始化播放列表为展开状态
    playerState.playlist.classList.add('expanded');
    
    // 绑定所有事件
    bindEvents();
}

// 初始化播放列表
function initPlaylist() {
    playerState.songList.innerHTML = '';
    
    songs.forEach((song, index) => {
        createSongItem(song, index);
    });
}

// 创建歌曲列表项
function createSongItem(song, index) {
    const songItem = document.createElement('div');
    songItem.className = 'song-item';
    
    if (index === playerState.currentSongIndex) {
        songItem.classList.add('active');
    }
    
    songItem.innerHTML = `
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-format">${song.format}</div>
        </div>
        <div class="song-duration">${song.duration}</div>
    `;
    
    songItem.addEventListener('click', () => {
        loadSong(index);
        playSong();
    });
    
    playerState.songList.appendChild(songItem);
}

// 加载歌曲
function loadSong(index) {
    // 移除之前活跃的歌曲
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置新的活跃歌曲
    const songItems = document.querySelectorAll('.song-item');
    if (songItems[index]) {
        songItems[index].classList.add('active');
    }
    
    playerState.currentSongIndex = index;
    const song = songs[index];
    playerState.audioPlayer.src = song.src;
    
    // 更新总时间显示
    playerState.audioPlayer.addEventListener('loadedmetadata', () => {
        const totalTimeEl = document.querySelector('.total-time');
        totalTimeEl.textContent = formatTime(playerState.audioPlayer.duration);
    }, { once: true });
}

// 播放/暂停切换
function togglePlay() {
    if (!playerState.audioPlayer.src) {
        loadSong(0);
    }
    
    if (playerState.isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// 播放歌曲
function playSong() {
    playerState.audioPlayer.play();
    playerState.isPlaying = true;
    playerState.playBtn.textContent = '■';
    playerState.record.classList.add('playing');
}

// 暂停歌曲
function pauseSong() {
    playerState.audioPlayer.pause();
    playerState.isPlaying = false;
    playerState.playBtn.textContent = '♪';
    playerState.record.classList.remove('playing');
}

// 上一首
function playPrevSong() {
    let newIndex = playerState.currentSongIndex - 1;
    if (newIndex < 0) {
        newIndex = songs.length - 1;
    }
    changeSong(newIndex);
}

// 下一首
function playNextSong() {
    let newIndex = playerState.currentSongIndex + 1;
    if (newIndex >= songs.length) {
        newIndex = 0;
    }
    changeSong(newIndex);
}

// 切换歌曲
function changeSong(newIndex) {
    loadSong(newIndex);
    if (playerState.isPlaying) {
        playSong();
    }
}

// 更新进度条
function updateProgress(e) {
    const audio = e.target;
    const duration = audio.duration;
    const currentTime = audio.currentTime;
    
    const progressPercent = (currentTime / duration) * 100;
    playerState.progress.style.width = `${progressPercent}%`;
    
    const currentTimeEl = document.querySelector('.current-time');
    currentTimeEl.textContent = formatTime(currentTime);
}

// 点击进度条跳转
function setProgress(e) {
    const progressBar = e.currentTarget;
    const clickX = e.offsetX;
    const width = progressBar.clientWidth;
    
    const duration = playerState.audioPlayer.duration;
    playerState.audioPlayer.currentTime = (clickX / width) * duration;
}

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) {
        return '0:00';
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 处理播放列表展开/折叠
function togglePlaylist() {
    if (playerState.playlist) {
        playerState.playlist.classList.toggle('expanded');
    }
}

// 绑定所有事件
function bindEvents() {
    // 播放/暂停按钮
    playerState.playBtn.addEventListener('click', togglePlay);
    
    // 上一首/下一首按钮
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (prevBtn) prevBtn.addEventListener('click', playPrevSong);
    if (nextBtn) nextBtn.addEventListener('click', playNextSong);
    
    // 折叠按钮
    if (playerState.foldBtn) {
        playerState.foldBtn.addEventListener('click', togglePlaylist);
    }
    
    // 音频事件
    playerState.audioPlayer.addEventListener('timeupdate', updateProgress);
    playerState.audioPlayer.addEventListener('ended', playNextSong);
    
    // 进度条点击事件
    if (playerState.progressBar) {
        playerState.progressBar.addEventListener('click', setProgress);
    }
}

// 页面加载完成后初始化播放器
document.addEventListener('DOMContentLoaded', function() {
    initPlayer();
});