const pool = require('../modules/connectionPool');
module.exports = {
    getAllPosts : async () => {
        const sql = `SELECT User.nickname, User.profileImg, Post.id, Post.deadline, Post.location, Post.min_num, Post.cur_num, Post.title, Post.content, Post.closed FROM Post INNER JOIN User ON Post.writer = User.id ORDER BY Post.id`;
        try {
            const result = await pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    },

    getMyPosts : async (userIdx) => {
        const sql = `SELECT User.nickname, User.profileImg, Post.deadline, Post.location, Post.min_num, Post.cur_num, Post.title, Post.content, Post.closed FROM Post INNER JOIN User ON Post.writer = User.id AND User.id = ${userIdx}`;
        try {
            const result = await pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    },

    checkPostDeadline : async (deadline) => {
        const currentDate = new Date();
        const deadlineDate = new Date(deadline);
        const between = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / 1000 / 60);

        if (between < 5 || between > 60) {
            return false;
        } else {
            return true;
        }
    },

    writePost : async (userIdx, deadline, location, min_num, title, content) => {
        const sql = `INSERT INTO Post (writer, deadline, location, min_num, cur_num, title, content, closed) VALUES (${userIdx}, '${deadline}', '${location}', ${min_num}, 1, '${title}', '${content}', 0)`;
        try {
            return await pool.queryParam(sql);
        } catch (err) {
            throw err;
        }
    },

    getPostInfo : async (postIdx) => {
        const sql = `SELECT * FROM Post WHERE Post.id = ${postIdx}`;
        try {
            const result = await pool.queryParam(sql);
            if (result[0].length === 0) {
                return false;
            } 
            else {
                return result[0][0].deadline;
            }
        } catch (err) {
            throw err;
        }
    },

    modifyPost : async (userIdx, postIdx, deadline, location, min_num, title, content) => {
        const sql = `UPDATE Post SET writer = ${userIdx}, deadline = '${deadline}', location = '${location}', min_num = ${min_num}, title = '${title}', content = '${content}' WHERE Post.id = ${postIdx}`;
        try {
            return await pool.queryParam(sql);
        } catch (err) {
            throw err;
        }
    }
}