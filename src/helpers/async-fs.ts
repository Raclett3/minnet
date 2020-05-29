import * as fs from 'fs';

export async function readFile(filename: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data.toString('utf-8'));
    });
  });
}

export async function writeFile(filename: string, data: string): Promise<void> {
  return await new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
