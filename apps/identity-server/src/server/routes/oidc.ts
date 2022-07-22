import assert from 'assert';
import { stringify } from 'querystring';
import { inspect } from 'util';

import type { RenderFunction } from '@yekalaitech/svelte-adapter-node';
import { Application, NextFunction, Request, Response, urlencoded } from 'express';
import { errors, Provider } from 'oidc-provider';

const body = urlencoded({ extended: false });

const keys = new Set();
const debug = (obj) =>
	stringify(
		Object.entries(obj).reduce((acc, [key, value]) => {
			keys.add(key);
			if (!value || !(value as string).length) return acc;
			acc[key] = inspect(value, { depth: null });
			return acc;
		}, {}),
		'<br/>',
		': ',
		{
			encodeURIComponent(value) {
				return keys.has(value) ? `<strong>${value}</strong>` : value;
			}
		}
	);

const routeProvider = (app: Application, provider: Provider, render: RenderFunction): void => {
	// const { constructor: { errors: { SessionNotFound } } } = provider;

	app.use((req, res, next) => {
		res.render = async (view: string, locals: any) => {
			const rendered = await render({
				path: view,
				headers: req.headers,
				method: req.method,
				query: req.query,
				rawBody: locals ? JSON.stringify(locals) : undefined
			});
			if (rendered && rendered.status !== 404) {
				res.writeHead(rendered.status, rendered.headers);				
				if (rendered.body) {
					res.write(rendered.body);
				}
				res.end();
			}
		};
		next();
	});

	function setNoCache(req: Request, res: Response, next: NextFunction) {
		res.set('Pragma', 'no-cache');
		res.set('Cache-Control', 'no-cache, no-store');
		next();
	}

	app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
		try {
			const { uid, prompt, params, session } = await provider.interactionDetails(req, res);

			const client = await provider.Client.find((params as any).client_id);

			switch (prompt.name) {
				case 'login': {
					return res.render('login', {
						client,
						uid,
						details: prompt.details,
						params,
						title: 'Sign-in',
						session: session ? debug(session) : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt)
						}
					});
				}
				case 'consent': {
					return res.render('interaction', {
						client,
						uid,
						details: prompt.details,
						params,
						title: 'Authorize',
						session: session ? debug(session) : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt)
						}
					});
				}
				default:
					return undefined;
			}
		} catch (err) {
			return next(err);
		}
	});

	app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
		try {
			const {
				prompt: { name }
			} = await provider.interactionDetails(req, res);
			assert.equal(name, 'login');
			// const account = await Account.findByLogin(req.body.login);
			const account = {
				accountId: '1'
			};

			const result = {
				login: {
					accountId: account.accountId
				}
			};

			await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
		} catch (err) {
			next(err);
		}
	});

	app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
		try {
			const interactionDetails = await provider.interactionDetails(req, res);
			const {
				prompt: { name, details },
				params,
				session: { accountId }
			} = interactionDetails;
			assert.equal(name, 'consent');

			let { grantId } = interactionDetails;
			let grant;

			if (grantId) {
				// we'll be modifying existing grant in existing session
				grant = await provider.Grant.find(grantId);
			} else {
				// we're establishing a new grant
				grant = new provider.Grant({
					accountId,
					clientId: (params as any).client_id
				});
			}

			if (details.missingOIDCScope) {
				grant.addOIDCScope((details as any).missingOIDCScope.join(' '));
			}
			if (details.missingOIDCClaims) {
				grant.addOIDCClaims(details.missingOIDCClaims);
			}
			if (details.missingResourceScopes) {
				for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
					grant.addResourceScope(indicator, scopes.join(' '));
				}
			}

			grantId = await grant.save();

			const consent: { grantId?: string } = {};
			if (!interactionDetails.grantId) {
				// we don't have to pass grantId to consent, we're just modifying existing one
				consent.grantId = grantId;
			}

			const result = { consent };
			await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
		} catch (err) {
			next(err);
		}
	});

	app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
		try {
			const result = {
				error: 'access_denied',
				error_description: 'End-User aborted interaction'
			};
			await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
		} catch (err) {
			next(err);
		}
	});

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		console.log(err);
		if (err instanceof errors.SessionNotFound) {
			// handle interaction expired / session not found error
            res.render('login');
		}
		next(err);
	});
};

export { routeProvider };
