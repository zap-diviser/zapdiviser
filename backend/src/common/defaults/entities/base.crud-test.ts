// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceOptionsTesting from 'db/data-source.testing';

export class TestBaseServiceCrud<CreateDto, UpdateDto> {
  createData: CreateDto | any;
  updateData: UpdateDto | any;
  title: string;
  label: string;
  service: any;
  connection: DataSource;

  constructor(label: string) {
    //capitalize first letter
    this.label = label;
    this.title = `Serviço de ${label.charAt(0).toUpperCase() + label.slice(1)}`;
  }

  beforeAll(service, imports = []) {
    beforeAll(async () => {
      const module = await Test.createTestingModule({
        imports: [TypeOrmModule.forRoot(dataSourceOptionsTesting), ...imports],
      }).compile();

      this.service = await module.resolve<typeof service>(service);
      this.connection = await module.get(DataSource);
    });
  }

  afterAll(): void {
    afterAll(async () => {
      await this.connection.destroy();
    });
  }

  create(): void {
    describe(undefined, () => {
      it(`Deve criar ${this.label}`, async () => {
        const data =
          this.createData instanceof Function
            ? this.createData()
            : this.createData;
        const createdInstance = await this.service.create(data);
        const findCreatedInstance = await this.service.findOne(
          createdInstance.uuid,
        );
        expect(createdInstance.uuid).toEqual(findCreatedInstance.uuid);
      });
    });
  }

  findAll() {
    describe(undefined, () => {
      it(`Deve listar ${this.label}`, async () => {
        await this.service.create(this.createData);
        const findAllInstance = await this.service.findAll();
        expect(findAllInstance.length).toBeGreaterThan(0);
      });
    });
  }

  findOne() {
    describe(undefined, () => {
      it(`Deve buscar ${this.label}`, async () => {
        const createdInstance = await this.service.create(this.createData);
        const findCreatedInstance = await this.service.findOne(
          createdInstance.uuid,
        );
        expect(createdInstance.uuid).toEqual(findCreatedInstance.uuid);
      });
    });
  }

  update() {
    describe(undefined, () => {
      it(`Deve atualizar ${this.label}`, async () => {
        const createdInstance = await this.service.create(this.createData);
        const updatedInstance = await this.service.update(
          createdInstance.uuid,
          this.updateData,
        );
        expect(updatedInstance.uuid).toEqual(createdInstance.uuid);
      });
    });
  }

  delete() {
    describe(undefined, () => {
      it(`Deve deletar ${this.label}`, async () => {
        const data =
          this.createData instanceof Function
            ? this.createData()
            : this.createData;
        const createdInstance = await this.service.create(data);
        const deletedInstance = await this.service.remove(createdInstance.uuid);
        expect(deletedInstance.uuid).toEqual(createdInstance.uuid);
        const instanceFounded = await this.service.findOne(
          createdInstance.uuid,
        );
        expect(instanceFounded).toBeNull();
      });
    });
  }
}
