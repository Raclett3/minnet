import { loadConfig } from './config';
import { initPostgres } from './postgres';
import { listen } from './routes';

(async () => {
  console.log('Minnet v0.0.0');
  loadConfig(process.cwd() + '/config/config.json');
  await initPostgres();
  listen(3000);
})();
