import { Injectable } from '@nestjs/common';
import { Provider } from 'oidc-provider';

import { oidcConfiguration } from '../configuration/index.js'

import { OidcModelAdapterProvider } from './oidc-model-adapter-provider.js';
import { OidcModelAdapter } from './oidc-model-adapter.js';
import { RendererService } from './renderer.service.js';

@Injectable()
export class OidcProviderFactory {
  static __current: Provider;
  constructor(private readonly oidcModelAdapterProvider: OidcModelAdapterProvider, private readonly renderService: RendererService) {

  }

  getProvider() {
    if (!OidcProviderFactory.__current) {
      OidcModelAdapter.setModels(this.oidcModelAdapterProvider.getModels())
      const configuration = {...oidcConfiguration};
      OidcProviderFactory.__current = new Provider(process.env.ISSUER, {
        adapter: OidcModelAdapter,
        ...oidcConfiguration,
        renderError: async (ctx, out, error) => {
          const parsed = new URL(ctx.req.url || '', `https://${ctx.req.headers.host}`);
          const rendered = await this.renderService.renderData(ctx.req, `${ctx.protocol}://${ctx.host}/error`);
          console.log(out);
          if (rendered) {
            ctx.type = 'html';
            ctx.body = rendered.body
          }          
        }
      })
    }
    return OidcProviderFactory.__current;
  }

}