import './_config';

import { expect } from 'chai';

import { EncryptDecrypt } from '../lib/encrypt-decrypt';

describe('EncryptDecrypt tests', () => {
	it('Should encrypt', async () => {
		const encrypted = await EncryptDecrypt.encrpt('yekalai');
		expect(encrypted).to.exist;
	});
	it('Should decrpt', async () => {
		const text = 'yekalai';
		const encrypted = await EncryptDecrypt.encrpt(text);
		const decrppted = await EncryptDecrypt.decrypt(encrypted);
		expect(decrppted).to.eq(text);
	});
});
