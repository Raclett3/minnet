import { loadConfig } from './config';
import app from './server';

(() => {
  console.log('Minnet v0.0.0');
  loadConfig(process.cwd() + '/config/config.json');
  app.listen(3000);
})();
