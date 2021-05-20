let database = require("../data/dataOperation")
let jwt = require('jsonwebtoken')
let controller = {}


controller.login = async(req, res) => {

    try {
        let { username, password } = req.body

        let query = "SELECT * FROM [r10x-test].dbo.login WHERE username = '" + username + "'"

        let data = await database.sqlQuery(query)
        if (data.recordsets.length == 0) {
            res.send("There is no user with this username")
        } else {

            let record = data.recordsets[0][0]
            let passwordInDb = record.password
            if (password === passwordInDb) {

                let token = jwt.sign({ username: username }, "the screat", { expiresIn: 3000 })
                res.json({
                    status: true,
                    message: "success",
                    token: token,
                    userId: record.user_id,
                    name: record.full_name,
                    email: record.email
                        //     })
                })

            } else {
                res.send("Please provide Right credentials")
            }

        }

    } catch (e) {
        res.send("Please provide Right credentials")
    }
}

controller.isAuthenticated = (req, res, next) => {
    let token = req.headers.authtoken

    jwt.verify(token, "the screat", (err, data) => {
        if (err) {
            res.send("Invalid token")
        } else {

            req.username = data.username
            next()
        }
    })

}

module.exports = controller