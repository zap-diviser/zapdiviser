import { parse } from 'dotenv';
import { expand } from 'dotenv-expand';
import { readFileSync, existsSync } from 'fs';

const configuration = () => {
  let config: any;

  if (existsSync('../.env')) {
    config = parse(readFileSync('../.env'));
  } else {
    config = { ...process.env };
  }

  expand({ processEnv: config, parsed: config });

  return config;
};

export default configuration;
