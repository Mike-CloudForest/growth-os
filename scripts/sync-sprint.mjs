import { cpSync, mkdirSync } from 'node:fs';
mkdirSync(new URL('../docs/sprint/', import.meta.url), {recursive:true});
cpSync(new URL('../public/sprint/', import.meta.url),new URL('../docs/sprint/', import.meta.url),{recursive:true});
console.log('Synced the campaign desk from public/sprint to docs/sprint.');
