import CreateCrud from './create-crud/index';
import * as inquirer from 'inquirer';
import { execSync } from 'child_process';

execSync('cls', { stdio: 'inherit' });

console.log(
  '\n\n\nBem vindo ao FAST CLI NEST - feito por italo, para vocês S2\n\n\n',
);

const options = [
  {
    name: 'Criar um novo Crud',
    value: CreateCrud,
  },
];

async function init() {
  await new Promise((res) => setTimeout(res, 100));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'prize',
      message: 'Selecione a opção desejada:',
      choices: options.map((option) => option.name),
    },
  ]);

  const option = options.find((option) => option.name === answer.prize);

  const action = new option!.value();
  await action.execute();
}

init();
