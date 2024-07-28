import session from 'express-session'

export const sessionConfig: session.SessionOptions = {
    name: 'skyanalytics_session',
    secret: 'keyboard',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}