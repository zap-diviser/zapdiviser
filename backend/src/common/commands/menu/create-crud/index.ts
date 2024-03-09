import { execSync } from 'child_process';
import * as fs from 'fs';
import * as inquirer from 'inquirer';

export default class CreateCrud {
  async execute() {
    let answer1: any = null;

    while (!answer1) {
      const data = await inquirer.prompt([
        {
          type: 'input',
          name: 'crudName',
          message:
            'Qual o nome do crud que deseja criar? (Primeira Letra Maiúscula, Em inglês, Sem espaços, Sem acentos, Sem caracteres especiais))',
        },
      ]);

      //regex only letters
      const regex = /^[A-Za-z]+$/;
      const crudName = data.crudName;
      const isOnlyLetters = regex.test(crudName);

      if (!isOnlyLetters) {
        console.log('O nome do crud deve conter apenas letras');
        continue;
      }

      //regex first letter uppercase
      const firstLetter = crudName.split('')[0];
      const isFirstLetterUppercase = firstLetter === firstLetter.toUpperCase();
      if (!isFirstLetterUppercase) {
        console.log(
          'O nome do crud deve começar com a primeira letra maiúscula',
        );
        continue;
      }

      //regex no spaces
      const hasSpaces = crudName.includes(' ');
      if (hasSpaces) {
        console.log('O nome do crud não pode conter espaços');
        continue;
      }

      answer1 = data;
    }

    const resourceName = answer1.crudName;

    //STEP 1 - Use Nest CLI to create a resource
    const result = execSync(`nest g resource modules/${resourceName}`, {});

    fs.writeFileSync('result.txt', result.toString());

    const moduleName = result.toString().split('src/modules/')[1].split('/')[0];

    //DTO
    const dtoFilename = result
      .toString()
      .split('\n')[6]
      .split('src/modules/')[1]
      .split('/')[2]
      .split('update-')[1]
      .split('.dto.ts')[0];

    const createDtoPath = `src/modules/${moduleName}/dto/create-${dtoFilename}.dto.ts`;

    const dtoName = fs
      .readFileSync(createDtoPath, 'utf8')
      .split('class ')[1]
      .split(' ')[0]
      .split('Dto')[0]
      .replace('Create', '')
      .trim();

    const providerFilename = result
      .toString()
      .split('\n')[1]
      .split('src/modules/')[1]
      .split('/')[1]
      .split('.controller.ts')[0];

    //SERVICE
    const servicePath = `src/modules/${moduleName}/${providerFilename}.service.ts`;

    const providerName = fs
      .readFileSync(servicePath, 'utf8')
      .split('class ')[1]
      .split(' ')[0]
      .split('Service')[0]
      .trim();

    const serviceMock = fs
      .readFileSync(
        `src/common/commands/menu/create-crud/mocks/service.txt`,
        'utf8',
      )
      .replace(/::PROVIDER_NAME::/g, providerName)
      .replace(/::PROVIDER_FILENAME::/g, providerFilename)
      .replace(/::DTO_NAME::/g, dtoName)
      .replace(/::DTO_FILENAME::/g, dtoFilename);

    fs.writeFileSync(servicePath, serviceMock);

    //ENTITY
    const entityPath = `src/modules/${moduleName}/entities/${dtoFilename}.entity.ts`;

    const entityMock = fs
      .readFileSync(
        `src/common/commands/menu/create-crud/mocks/entity.txt`,
        'utf8',
      )
      .replace(/::LOWER_DTO_NAME::/g, dtoName.toLowerCase())
      .replace(/::DTO_NAME::/g, dtoName);

    fs.writeFileSync(entityPath, entityMock);

    //MODULE
    const modulePath = `src/modules/${moduleName}/${providerFilename}.module.ts`;

    const moduleMock = fs
      .readFileSync(
        `src/common/commands/menu/create-crud/mocks/module.txt`,
        'utf8',
      )
      .replace(/::PROVIDER_NAME::/g, providerName)
      .replace(/::PROVIDER_FILENAME::/g, providerFilename)
      .replace(/::DTO_NAME::/g, dtoName)
      .replace(/::DTO_FILENAME::/g, dtoFilename);

    fs.writeFileSync(modulePath, moduleMock);

    // //CONTROLLER
    const controllerPath = `src/modules/${moduleName}/${providerFilename}.controller.ts`;

    const controllerMock = fs
      .readFileSync(
        `src/common/commands/menu/create-crud/mocks/controller.txt`,
        'utf8',
      )
      .replace(/::PROVIDER_NAME::/g, providerName)
      .replace(/::PROVIDER_FILENAME::/g, providerFilename)
      .replace(/::DTO_NAME::/g, dtoName)
      .replace(/::DTO_FILENAME::/g, dtoFilename)
      .replace(/::LOWER_PROVIDER_NAME::/g, providerName.toLowerCase());

    fs.writeFileSync(controllerPath, controllerMock);

    const controllerTestPath = `src/modules/${moduleName}/${providerFilename}.controller.spec.ts`;
    const serviceTestPath = `src/modules/${moduleName}/${providerFilename}.service.spec.ts`;

    fs.unlinkSync(controllerTestPath);
    fs.unlinkSync(serviceTestPath);
  }
}
