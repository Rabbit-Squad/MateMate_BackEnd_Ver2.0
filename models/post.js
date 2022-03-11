const pool = require('../modules/connectionPool');
module.exports = {
    getAllPosts : async () => {
        const sql = `SELECT User.nickname, User.profileImg, Post.id, Post.deadline, Post.location, Post.min_num, Post.cur_num, Post.title, Post.content, Post.closed FROM Post INNER JOIN User ON Post.writer = User.id ORDER BY Post.id`;
        try {
            const result = pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    },

    getMyPosts : async (userIdx) => {
        const sql = `SELECT User.nickname, User.profileImg, Post.deadline, Post.location, Post.min_num, Post.cur_num, Post.title, Post.content, Post.closed FROM Post INNER JOIN User ON Post.writer = User.id AND User.id = ${userIdx}`;
        try {
            const result = pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    },

    writePost : async (userIdx, deadline, location, min_num, title, content) => {
        const sql = `INSERT INTO Post (writer, deadline, location, min_num, cur_num, title, content, closed) VALUES (${userIdx}, '${deadline}', '${location}', ${min_num}, 1, '${title}', '${content}', 0)`;
        try {
            const result = pool.queryParam(sql);
            return true;
        } catch (err) {
            throw err;
        }
    }

}