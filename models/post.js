const pool = require('../modules/connectionPool');
module.exports = {
    getAllPosts : async () => {
        const sql = `SELECT * FROM Post`;
        try {
            const result = pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    },

    getMyPosts : async (userIdx) => {
        const sql = `SELECT * FROM Post WHERE Post.writer=${userIdx}`;
        try {
            const result = pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    }

}