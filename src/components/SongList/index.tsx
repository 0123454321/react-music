import React, { useState, useContext, useEffect, useCallback } from 'react';
import style from './index.module.scss';
import Loading from 'Components/Loading';
import { Link } from 'react-router-dom';
import { FuncContext, StateContext } from 'AppContainer/index';
import { message, Modal } from 'antd';
import {
    CaretRightOutlined,
    PlusOutlined,
    HeartOutlined,
    DownloadOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { songlistTracks } from 'Apis/playlist';
import { convertTime, searchItem } from 'Utils/index';
import { songDetail } from 'Apis/song';
import { resolveSongs } from 'Utils/resolve';
import music from 'Utils/music';

import type { SongItem } from 'AppContainer/index';

interface Props {
    songList?: SongItem[];
    isCreator?: boolean;
    songIds?: number[];
}

function SongList({ songList, songIds, isCreator }: Props) {
    const state = useContext(StateContext);
    const { playSong, collectSong, setPlaylist } = useContext(FuncContext);
    const { playingItem, playlist } = state;

    const [currentList, setCurrentList] = useState<SongItem[]>(songList || []);
    const [page, setPage] = useState<number>(1);

    //添加到播放列表
    const handleAddToPlaylist = useCallback((songItem: SongItem) => {
        // 播放列表中已有该歌曲
        if (playlist.find(item => item.id === songItem.id)) {
            return;
        }

        // 追加到当前播放列表
        const newList = playlist.slice();
        newList.push(songItem);
        setPlaylist(newList);
    }, [playlist]);

    //下载
    const handleDownload = useCallback((songItem: SongItem) => {
        const { id, name } = songItem;
        music().download(id, name);
    }, []);

    // 播放指定歌曲
    const handlePlay = useCallback((songItem: SongItem) => {
        // 播放
        playSong(songItem);

        // 播放列表中已有该歌曲
        if (playlist.find(item => item.id === songItem.id)) {
            return;
        }

        // 追加到当前播放列表
        const newList = playlist.slice();
        newList.push(songItem);
        setPlaylist(newList);
    }, [playlist]);

    //收藏歌单中的某首歌
    const handleCollectSong = useCallback((id: number) => {
        collectSong(id);
    }, []);

    //删除歌单中的某首歌
    const handleDelete = useCallback((songItem: SongItem) => {
        Modal.confirm({
            title: '删除歌曲',
            content: `是否要删除歌曲 ${songItem.name} ？`,
            okText: '是',
            cancelText: '否',
            async onOk() {
                // 歌单 id
                const playlistId = Number(searchItem(window.location.hash, 'id'));
                await songlistTracks('del', playlistId, songItem.id);
                message.success('已删除');

                // 在 currentList 中删除
                const newList = currentList.slice();
                const index = currentList.findIndex(item => item.id === songItem.id);
                newList.splice(index, 1);
                setCurrentList(newList);
            }
        })
    }, [currentList]);

    // 翻页
    const handleSetPage = useCallback((type: 'prev' | 'next') => {
        const maxPage = Math.ceil(songIds.length * 0.02);
        let nextPage: number;
        if (type === 'prev') {
            nextPage = page - 1 || 1;
        } else {
            nextPage = page + 1 < maxPage ? page + 1 : maxPage;
        }

        setPage(nextPage);
    }, [songIds, page]);

    useEffect(() => {
        // 根据分页加载数据
        const getData = async () => {
            setCurrentList([]);
            const start = (page - 1) * 50;
            const ids = songIds.slice(start, start + 50);
            const songRes = await songDetail(ids);
            setCurrentList(resolveSongs(songRes.songs, 'detail'));
        }

        if (songIds) {
            getData();
        }
    }, [songIds, page]);

    if (currentList.length === 0) {
        return <Loading />;
    }

    return (
        <div className={style.songlist}>
            <div className="title">
                歌曲列表
                <span>{(songList || songIds).length}首歌</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">歌曲标题</th>
                        <th scope="col">时长</th>
                        <th scope="col">歌手</th>
                        <th scope="col">专辑</th>
                    </tr>
                </thead>
                <tbody>
                    {currentList.map((item, index) => {
                        const { id, name, singers, duration, isFree, albumId, albumName } = item;

                        return (
                            <tr key={id} className={isFree ? '' : "fee"}>
                                <td>
                                    <span>{(page - 1) * 50 + index + 1}</span>
                                    <CaretRightOutlined
                                        className={playingItem.id === id ? 'play-btn-playing' : 'play-btn'}
                                        onClick={() => handlePlay(item)}
                                    />
                                </td>
                                <td>
                                    <Link to={`/Song?id=${id}`} title={name}>{name}</Link>
                                    <div className="icons">
                                        {isFree &&
                                            <>
                                                <PlusOutlined title="添加到播放列表" onClick={() => handleAddToPlaylist(item)} />
                                                <HeartOutlined title="收藏到歌单" onClick={() => handleCollectSong(id)} />
                                                <DownloadOutlined title="下载" onClick={() => handleDownload(item)} />
                                            </>
                                        }
                                        {isCreator &&
                                            <DeleteOutlined title="删除" onClick={() => handleDelete(item)} />
                                        }
                                    </div>
                                </td>
                                <td>{convertTime(duration)}</td>
                                <td>
                                    {singers.map(({ id, name }, idx) =>
                                        <React.Fragment key={idx}>
                                            <Link to={`/Singer?id=${id}`} title={name} className={style.singer}>{name}</Link>
                                            {idx !== singers.length - 1 &&
                                                <span> / </span>
                                            }
                                        </React.Fragment>
                                    )}
                                </td>
                                <td><Link to={`/Album?id=${albumId}`} title={albumName}>{albumName}</Link></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {songIds &&
                <div className="pagination">
                    <div className='page-btn' onClick={() => handleSetPage('prev')}>&lt;</div>
                    <div className="page">{page}</div>
                    <div className="page-btn" onClick={() => handleSetPage('next')}>&gt;</div>
                </div>
            }
        </div>
    )
}

export default SongList;