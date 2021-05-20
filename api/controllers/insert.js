let database = require('../data/dataOperation')
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
controller.insertData = async(req, res) => {
    try {
        let { name, author, releaseDate } = req.body
        let username = req.username

        let pool = await sql.connect(config)
        let insertBook = await pool.request()
            .input('name', sql.VarChar, name)
            .input('author', sql.VarChar, author)
            .input('releaseDate', sql.DateTime, releaseDate)
            .query('INSERT INTO [r10x-test].dbo.book_master VALUES (@name, @author, @releaseDate) SELECT SCOPE_IDENTITY() AS id;')

        let bookrecord = insertBook.recordset[0]
        let book_id = bookrecord.id

        let userData = await pool.request()
            .input('username', sql.VarChar, username)

        .query('SELECT * FROM [r10x-test].dbo.login WHERE username = @username')
        let userRecords = userData.recordset
        for (let i = 0; i < userRecords.length; i++) {
            let user_id = userRecords[i].user_id

            let insertBookUser = await pool.request()
                .input('user_id', sql.Int, user_id)
                .input('book_id', sql.Int, book_id)

            .query('INSERT INTO [r10x-test].dbo.book_user_map VALUES (@book_id, @user_id) SELECT SCOPE_IDENTITY() AS id;')
            console.log(insertBookUser)
        }



        console.log(insertBook)

        res.send({ status: true, message: 'success', book_id: book_id })
    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "unsuccessful" })
    }


}

module.exports = controller