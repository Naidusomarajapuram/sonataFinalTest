let database = require('../data/dataOperation')
let controller = {}
controller.getData = async(req, res) => {
    try {

        let username = req.username
            // let booksQuery = "SELECT *  FROM [r10x-test].dbo.book_master"
        let userQuery = "SELECT *  FROM [r10x-test].dbo.login WHERE username = '" + username + "'"


        // var booksData = await database.sqlQuery(booksQuery)
        let usersData = await database.sqlQuery(userQuery)
        let userRecord = usersData.recordset
        let books = []

        for (let k = 0; k < userRecord.length; k++) {


            let userId = userRecord[k].user_id

            let userBookQuery = "SELECT *  FROM [r10x-test].dbo.book_user_map WHERE user_id = '" + userId + "'"
            let usersBookData = await database.sqlQuery(userBookQuery)
            let userBookRecord = usersBookData.recordset


            for (let i = 0; i < userBookRecord.length; i++) {
                let book_id = userBookRecord[i].book_id
                let bookSet = "SELECT *  FROM [r10x-test].dbo.book_master WHERE book_id = '" + book_id + "'"
                let bookData = await database.sqlQuery(bookSet)
                let bookRecord = bookData.recordset[0]
                books.push(bookRecord)
            }



        }



        res.send({
            user_details: userRecord[0],
            books: books
        })
    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "unsuccessful" })
    }


}


module.exports = controller