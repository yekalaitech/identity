import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { config } from 'dotenv';
config({path: join(__dirname, '..', '.env')});
