const poolPromise = require('./mysql');
module.exports = {
    queryParam : async (sql) => {
        return new Promise (async (resolve, reject) => {
            try {
                const pool = await poolPromise; // pool생성
                const connection = await pool.getConnection();
                try {
                    const result = await connection.query(sql); //sql 쿼리 수행
                    connection.release();
                    resolve(result); //프로미스 이행
                } catch (err) {
                    connection.release();
                    reject(err); // 프로미스 실패
                }
            } catch (err) {
                reject(err);
            }
        })
    }
}