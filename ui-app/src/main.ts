require('../node_modules/jquery/dist/jquery.js');
import * as $ from 'jquery';

require('../node_modules/bootstrap/dist/js/bootstrap.js');
require('../node_modules/bootstrap/dist/css/bootstrap.css');

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.info('app.environment:', app.environment);
if (app.environment === 'production') {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
