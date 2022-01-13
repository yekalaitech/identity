import './_config.js';

import { readFileSync } from 'fs';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		httpsOptions:
			process.env.NODE_ENV === 'dev'
				? {
						key: readFileSync(process.env.TLS_KEY_PATH),
						cert: readFileSync(process.env.TLS_CERT_PATH)
				  }
				: {}
	});
	app.enableCors({
		credentials: true
	});
	await app.listen(process.env.PORT, process.env.HOST);
}
bootstrap();
