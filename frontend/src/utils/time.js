function getPostTime(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const secondsAgo = Math.floor((now - then) / 1000);

    const minutes = Math.floor(secondsAgo / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return `${weeks} weeks ago`;
}

export default getPostTime