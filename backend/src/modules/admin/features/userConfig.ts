import * as bcrypt from 'bcrypt';

//AdminJS Features

const encryptPasswordFeature = () => {
  const encryptPasswordRequest = async (request: any) => {
    if (request.payload.password) {
      request.payload = {
        ...request.payload,
        password: await bcrypt.hash(request.payload.password, 10),
      };
    }
    return request;
  };

  return {
    actions: {
      new: {
        before: encryptPasswordRequest,
      },
      edit: {
        before: encryptPasswordRequest,
      },
    },
  };
};

export default function userConfig(entity: any) {
  return {
    resource: entity,
    options: {
      listProperties: ['id', 'email', 'name', 'phone', 'is_active'],
      editProperties: ['email', 'name', 'phone', 'password', 'is_active'],
    },

    features: [encryptPasswordFeature],
  };
}
