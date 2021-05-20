let sql = require('mssql')
let serverDetails = require('../data/config.json')
let config = {
    user: serverDetails.sqlServer.username,
    password: serverDetails.sqlServer.password,
    server: serverDetails.sqlServer.host,
    port: serverDetails.sqlServer.port,
    database: serverDetails.sqlServer.databaseName,
    options: {
        encrypt: false
    }
};
let controller = {}
controller.updateData = async(req, res) => {
    try {
        let { bookId, name, author, releaseDate } = req.body


        let pool = await sql.connect(config)
        let updateBook = await pool.request()
            .input('book_id', sql.Int, bookId)
            .input('name', sql.VarChar, name)
            .input('author', sql.VarChar, author)
            .input('releaseDate', sql.DateTime, releaseDate)
            .query(' UPDATE [r10x-test].dbo.book_master SET name = @name, author = @author, release_date = @releaseDate WHERE book_id = @book_id')







        res.send({ status: true, message: 'success', bookId: bookId })
    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "unsuccessful" })
    }


}

module.exports = controller