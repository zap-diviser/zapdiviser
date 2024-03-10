import { parse } from 'dotenv';
import { expand } from 'dotenv-expand';
import { readFileSync } from 'fs';

const configuration = () => {
  const config = parse(readFileSync('../.env'));

  expand(config);

  return config;
};

export default configuration;
