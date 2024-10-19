import session from 'express-session'

export const sessionConfig: session.SessionOptions = {
    name: 'skyanalytics_session',
    secret: 'keyboard',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none', // Set to 'none' to allow cross-site cookies
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}