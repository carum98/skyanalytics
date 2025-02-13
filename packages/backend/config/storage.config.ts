import { S3ClientConfig } from '@aws-sdk/client-s3'

export default {
	region: process.env.R2_REGION,
	endpoint: process.env.R2_ENDPOINT,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY,
		secretAccessKey: process.env.R2_SECRET_KEY
	}
} as S3ClientConfig
