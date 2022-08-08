import { Siesta } from './structures/Client';
import 'dotenv/config';

export const client = new Siesta();

client.init();
