const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

//获取token
export const getToken = () => {
    return getCookie('MUSIC_U');
}

//将秒数转换成形如01:42的字符串
export const convertTime = (time) => {
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

//搜索字符串中指定参数的值  searchItem('?id=1&data=2', data) --> 2
export const searchItem = (search, item) => {
    const match = search.match(new RegExp(`[?&]${item}=\\w+`));
    return match ? match[0].split('=')[1] : null;
}

//将时间戳转换成形如刚刚、x分钟前、x小时前、x天前、x月前、x年前的字符串
export const convertDate = (timestamp) => {
    const diff = Date.now() - new Date(timestamp);
    const d = new Date(diff);
    return diff <= 60000 ? '刚刚' :  //60秒内
        diff <= 3600000 ? `${parseInt(diff / 60000)}分钟前` :  //60分钟内
        diff <= 86400000 ? `${parseInt(diff / 3600000)}小时前` :  //24小时内
        d.getFullYear() > 1970 ? `${d.getFullYear() - 1970}年前` :
        d.getMonth() ? `${d.getMonth()}个月前` : `${d.getDate() - 1}天前`;
}