import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import config from 'config/storage.config'

export class S3Storage {
	private readonly _s3: S3Client

	constructor (public readonly folder: string) {
		this._s3 = new S3Client(config)
	}
	
	public async upload(key: string, buffer: Buffer, mimetype: string) {
		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: `${this.folder}/${key}`,
			Body: buffer,
			ContentType: mimetype,
		})

		return await this._s3.send(command)
	}

	public async get(key: string) {
		const command = new GetObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: `${this.folder}/${key}`
		})

		return this._s3.send(command)
	}

	public async delete(key: string) {
		const command = new DeleteObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: `${this.folder}/${key}`
		})

		return await this._s3.send(command)
	}
}