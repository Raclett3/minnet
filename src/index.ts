import { loadConfig } from './config';
import { initPostgres } from './postgres';
import app from './server';

(async () => {
  console.log('Minnet v0.0.0');
  loadConfig(process.cwd() + '/config/config.json');
  await initPostgres();
  app.listen(3000);
})();
