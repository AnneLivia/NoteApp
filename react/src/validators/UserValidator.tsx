import * as Yup from 'yup';

const UserLoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .required('O nome de usuário é obrigatório')
    .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres'),
  password: Yup.string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const UserSignUpSchema = Yup.object().shape({
  username: Yup.string()
    .required('O nome de usuário é obrigatório')
    .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres'),
  email: Yup.string()
    .required('O E-mail é obrigatório')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'O e-mail fornecido é inválido',
    ),
  password: Yup.string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export { UserLoginSchema, UserSignUpSchema };
