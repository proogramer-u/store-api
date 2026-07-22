const User = require('../models/user')

const register = async (req, res) => {
    const { name, email, password, role, adminCode } = req.body
    const isAdminRequest = role === 'admin'
    const isValidAdminCode =
        process.env.ADMIN_REGISTRATION_CODE &&
        adminCode === process.env.ADMIN_REGISTRATION_CODE

    const user = await User.create({
        name,
        email,
        password,
        role: isAdminRequest && isValidAdminCode ? 'admin' : 'user',
    })

    const token = user.createJWT()

    res.status(201).json({
        user: {
        name: user.name,
        email: user.email,
        role: user.role,
        },
        token,
    })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(401).json({ msg: 'Invalid credentials' })
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        return res.status(401).json({ msg: 'Invalid credentials' })
    }

    const token = user.createJWT()

    res.status(200).json({
        user: {
        name: user.name,
        email: user.email,
        role: user.role,
        },
        token,
    })
}

module.exports = {
    register,
    login,
}
