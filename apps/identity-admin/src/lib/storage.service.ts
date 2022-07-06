import type { StateStore } from 'oidc-client';

export class StorageService implements StateStore {
	private store: { [key: string]: string } = {};

	set(key: string, value: any): Promise<void> {
		console.log(key, value);
		if (key === 'state' || key === 'returnUrl') {
			localStorage.setItem(key, value);
		}
		this.store[key] = value;
		return Promise.resolve();
	}

	get(key: string): Promise<any> {
		console.log('get', key);
		if (!this.store[key] && (key === 'state' || key === 'returnUrl')) {
			return Promise.resolve(localStorage.getItem(key));
		}
		return Promise.resolve(this.store[key]);
	}

	remove(key: string): Promise<any> {
		localStorage.removeItem(key);
		delete this.store[key];
		return Promise.resolve();
	}

	getAllKeys(): Promise<string[]> {
		return Promise.resolve(Object.keys(this.store));
	}
}
