import { configOptions } from '../../../ormconfig';
import { createDatabase } from 'typeorm-extension';

createDatabase({ ifNotExist: true, options: configOptions });
