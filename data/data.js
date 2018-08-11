const VideoA = {
    id: '1',
    title: 'Anand',
    duration: 20,
    watched: true,
};

const VideoB = {
    id: '2',
    title: 'Aravind',
    duration: 30,
    watched: true,
};

const videos = [VideoA, VideoB];
const getVideoByID = (id) => new Promise((resolve) => {
    const [video] = videos.filter((video) => video.id == id);
    resolve(video);
});

const getVideos = () => new Promise((resolve) => {
    resolve(videos);
});

const createVideo = ({ title, duration, released }) => {
    const video = {
        id: (new Buffer(title, 'utf-8')).toString('base64'),
        title,
        duration,
        released,
    };
    videos.push(video);

    return video;
};

exports.getVideoByID = getVideoByID;
exports.getVideos = getVideos;
exports.createVideo = createVideo;