import { Options } from 'nodemailer/lib/smtp-connection'

export const config: Options = {
	host: 'smtp-mail.outlook.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		ciphers: 'SSLv3',
	}
}