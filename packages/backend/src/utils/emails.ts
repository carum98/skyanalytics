import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import handlebars from 'handlebars'
import { config } from 'config/email.config'

type SendEmailOptions = {
	to: string
	subject: string
	template: string
	data: Record<string, any>
}

export async function sendEmail({ to, subject, template, data }: SendEmailOptions) {
	const isEnable = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD

	if (!isEnable) {
		console.log('Email is not enabled')
		return
	}

	const source = fs.readFileSync(path.resolve(__dirname, `../views/emails/${template}.hbs`), 'utf8')
	const compiled = handlebars.compile(source)
	const html = compiled(data)

	const transporter = nodemailer.createTransport(config)

	return await transporter.sendMail({
		from: `"SkyAnalytics" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html,
	})
}