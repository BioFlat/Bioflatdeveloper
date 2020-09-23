const HTTPMsg  = require('./HTTPMsg')

module.exports = {

    created : (param,data) => {
        return {
            success:{
                message: param + HTTPMsg['created'],
                data:data
            }
        }
    },
    ok: (data) => {
        return {
            success: {
                message: HTTPMsg.ok,
                data:data
            }
        }
    },
    error: (param,msg) => {
        return {
            error: {
                message:(msg?msg:'') + HTTPMsg[param]
            }
        }
    }
    
}