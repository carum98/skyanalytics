import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import handlebars from 'handlebars'
import { config } from 'config/email.config'
import juice from 'juice'

type SendEmailOptions = {
	to: string | string[]
	subject: string
	template: string
	data: Record<string, any>
	onlyHtml?: boolean
}

export async function sendEmail({ to, subject, template, data, onlyHtml }: SendEmailOptions) {
	const isEnable = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD

	if (!isEnable) {
		console.log('Email is not enabled')
		return
	}

	const source = fs.readFileSync(path.resolve(__dirname, `../views/emails/${template}.hbs`), 'utf8')
	const compiled = handlebars.compile(source)
	const html = compiled(data, {
		helpers: {
			base64ImageSrc
		}
	})

	const transporter = nodemailer.createTransport(config)
	const inlineHtml = juice(html)

	if (onlyHtml) return inlineHtml

	return await transporter.sendMail({
		from: `"SkyAnalytics" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html: inlineHtml,
		encoding: 'utf8'
	})
}

const base64ImageSrc = (imagePath: string) => {
	const bitmap = fs.readFileSync(imagePath)
	const base64String = Buffer.from(bitmap).toString('base64')
  
	return new handlebars.SafeString(`data:image/png;base64,${base64String}`)
}