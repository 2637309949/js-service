const comm = require('comm')
const bcrypt = require('bcryptjs')
const moleculer = comm.moleculer
const {
    withMethod
} = moleculer

withMethod({
    checkPasswordCriteria(password) {
        const passwordCriteria = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&^*])(?=.{8,})/
        // Test criteria
        let isValid = passwordCriteria.test(password)
        return isValid ? true : false
    },
    checkPasswordCriteria(password) {
        const passwordCriteria = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&^*])(?=.{8,})/
        // Test criteria
        let isValid = passwordCriteria.test(password)
        return isValid ? true : false
    },
    async hashPassword (password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    },
    async comparePassword (password, userPassword) {
        const isMatch = await bcrypt.compare(password, userPassword)
        return isMatch
    }
})
