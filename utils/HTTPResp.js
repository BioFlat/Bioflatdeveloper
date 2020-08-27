const HTTPMsg  = require('./HTTPMsg')

module.exports = {

    created : (param,data) => {
        return {
            success:{
                message: HTTPMsg.created(param),
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
                message:msg?msg:'' + HTTPMsg[param]
            }
        }
    },
    passwordMismatch: () => {
        return {
            error: {
                message: HTTPMsg.passwordMismatch
            }
        }
    }
    
}