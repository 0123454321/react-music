import { memo } from 'react';
import style from './index.module.scss';
import { Link } from 'react-router-dom';
import { LikeOutlined } from '@ant-design/icons';
import { convertDate, replaceHttpToHttps as rp } from 'Utils/index';

import type { PlaylistCommentRes } from 'Apis/playlist';

interface Props {
    data: PlaylistCommentRes;
}

function CommentList({ data }: Props) {
    const { hotComments, comments, total } = data;

    const renderList = (title: string, list: PlaylistCommentRes['comments']) => {
        return (
            <>
                <div className="sub-title">{title}</div>
                {list.map(({ beReplied, content, user, time, likedCount }, idx) =>
                    <div className="comment" key={idx}>
                        <div className="image">
                            <img src={`${rp(user.avatarUrl)}?param=50y50`} loading='lazy' />
                        </div>
                        <div className="container">
                            <div className="content">
                                <span>
                                    <Link to={`User?id=${user.userId}`}>{user.nickname}：</Link>
                                    {content}
                                </span>
                                {beReplied[0] &&
                                    <div className="reply">
                                        <span>
                                            <Link to={`User?id=${beReplied[0].user.userId}`}>{beReplied[0].user.nickname}：</Link>
                                            {beReplied[0].content}
                                        </span>
                                    </div>
                                }
                            </div>
                            <div className="footer">
                                <span className="date">{convertDate(time)}</span>
                                <span className="like">
                                    <LikeOutlined style={{ color: '#1890ff' }} />({likedCount})
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className={style['comment-list']}>
            <div className="title">
                评论列表
                <span className="total">
                    共 {total} 条
                </span>
            </div>
            {hotComments.length > 0 &&
                renderList('精彩评论', hotComments)
            }
            {comments.length > 0 &&
                renderList('最新评论', comments)
            }
        </div>
    )
}

export default memo(CommentList);