import React, { Suspense, useRef, useCallback } from 'react';
import './index.scss';
import Loading from 'Components/Loading';
import Header from 'Components/Header';
import Sidebar from 'Components/Sidebar';
import MusicPlayer from 'Components/MusicPlayer';
import { useSetState } from 'Utils/hooks';

const initialState = {
    isPlaying: false,  //是否正在播放
    currentTime: 0,  //当前播放位置
    playlist: [  //播放列表
        {
            id: 776039,
            title: 'ONE\'s hope',  //音乐名
            singer: 'やなぎなぎ',  //歌手
            duration: 369.72,  //总时长
            cover: 'https://p1.music.126.net/l22TRH7bs4VG6HMT2Iy56w==/2511284557902801.jpg'  //封面图片
        }
    ],
    playMode: 'list-loop',  //播放模式  list-loop  random
    playingMusic: {  //当前播放的音乐
        id: 776039,
        title: 'ONE\'s hope',
        singer: 'やなぎなぎ',
        duration: 369.72,
        cover: 'https://p1.music.126.net/l22TRH7bs4VG6HMT2Iy56w==/2511284557902801.jpg'
    },
};

const Layout = ({ TargetComponent }) => {
    const audioRef = useRef(null);
    const [state, setState] = useSetState(initialState);

    //设置播放状态
    const setPlaying = useCallback((isPlaying) => {
        setState({ isPlaying });
    },
        []
    );

    //设置当前播放位置
    const setTime = useCallback((currentTime) => {
        setState({ currentTime });
    },
        []
    );

    //设置播放列表
    const setPlaylist = useCallback((playlist) => {
        setState({ playlist });
        if (playlist[0]) {
            setPlayingMusic(playlist[0]);
        }
    },
        []
    );

    //设置当前播放的音乐
    const setPlayingMusic = useCallback((playingMusic) => {
        setState({ playingMusic });
    },
        []
    );

    //设置播放模式
    const setPlayMode = useCallback((playMode) => {
        setState({ playMode });
    },
        []
    );

    //播放时长改变触发事件
    const handleDurationChange = useCallback((e) => {
        console.log('duration change', e.target.duration);
    },
        []
    );

    //播放位置更新触发事件
    const handleTimeUpdate = useCallback((e) => {
        setTime(e.target.currentTime);
    },
        []
    );

    //播放结束触发事件
    const handleEnded = useCallback((e) => {
        const len = state.playlist.length;
        if (len <= 1) {  //列表只有一首歌，单曲循环
            e.target.play();
            return;
        }

        //当前播放音乐对应的下标
        const currentIndex = state.playlist.findIndex(({ id }) => id === state.playingMusic.id) ?? -1;

        let nextIndex = null;

        if (state.playMode === 'list-loop') {  //列表循环
            nextIndex = (currentIndex + 1) % len;
        } else {  //随机
            nextIndex = parseInt(Math.random() * len);
            if (nextIndex === currentIndex) {  //随机的下标与当前播放音乐下标相同，继续播放
                e.target.play();
                return;
            }
        }

        setPlayingMusic(state.playlist[nextIndex]);
    },
        [state.playlist, state.playingMusic]
    );

    //音频可以播放时触发事件
    const handleCanPlay = useCallback((e) => {
        if (state.isPlaying) {
            e.target.play();
        }
    },
        [state.isPlaying]
    );

    return (
        <div className="layout">
            <div className="top">
                <Header />
            </div>

            <div className='middle'>
                <div className="left">
                    <Sidebar />
                </div>
                <div className="right">
                    <Suspense fallback={<Loading />}>
                        <TargetComponent setPlaylist={setPlaylist} />
                    </Suspense>
                </div>
            </div>

            <div className="bottom">
                <MusicPlayer
                    audioRef={audioRef}
                    current={state.currentTime}
                    isPlaying={state.isPlaying}
                    playingMusic={state.playingMusic}
                    playlist={state.playlist}
                    playMode={state.playMode}
                    setPlaying={setPlaying}
                    setTime={setTime}
                    setPlayMode={setPlayMode}
                    setPlayingMusic={setPlayingMusic}
                    setPlaylist={setPlaylist}
                />
            </div>

            <audio
                ref={audioRef}
                src={`https://music.163.com/song/media/outer/url?id=${state.playingMusic.id}`}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
                onCanPlay={handleCanPlay}
            />
        </div>
    );
}

export default Layout;