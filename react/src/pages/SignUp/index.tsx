import {
  Form,
  FormLayout,
  TextField,
  Button,
  Layout,
  LegacyCard,
  ButtonGroup,
  HorizontalStack,
} from '@shopify/polaris';
import { DiamondAlertMajor } from '@shopify/polaris-icons';
import { FormikProps, useFormik } from 'formik';
import { UserRegister } from '../../types/User';
import UserRepository from '../../api/services/Users';
import useUserStore from '../../store/useUser';
import { useNavigate } from 'react-router-dom';
import { UserSignUpSchema } from '../../validators/UserValidator';
import { AxiosError } from 'axios';
import { ErrorAPI } from '../../types/ErrorAPI';
import { toast } from 'react-toastify';

const SignUp = () => {
  const addUser = useUserStore((state) => state.addUser);

  const navigate = useNavigate();

  const formik: FormikProps<UserRegister> = useFormik<UserRegister>({
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    validationSchema: UserSignUpSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const resp = await UserRepository.signUp(values);
        addUser(resp);
        formik.setFieldValue('username', '');
        formik.setFieldValue('email', '');
        formik.setFieldValue('password', '');
        navigate('/notes');
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof AxiosError && error.response) {
          const message: ErrorAPI = error.response.data;
          if (message.error.name === 'ApplicationError') {
            formik.setFieldError(
              'username',
              'Nome de usuário ou e-mail já cadastrado',
            );
            formik.setFieldError(
              'email',
              'Nome de usuário ou e-mail já cadastrado',
            );
          }
        } else {
          toast.error('Ocorreu algum erro inesperado', {
            icon: DiamondAlertMajor,
          });
        }
      }
    },
  });
  return (
    <Layout.Section>
      <LegacyCard title='Cadastrar' sectioned>
        <Form onSubmit={formik.handleSubmit}>
          <FormLayout>
            <TextField
              name='username'
              value={formik.values.username}
              onChange={(value) => formik.setFieldValue('username', value)}
              label='Username'
              type='text'
              error={formik.errors.username}
              autoComplete='off'
            />

            <TextField
              name='email'
              value={formik.values.email}
              onChange={(value) => formik.setFieldValue('email', value)}
              label='E-mail'
              type='text'
              error={formik.errors.email}
              autoComplete='off'
            />

            <TextField
              name='password'
              value={formik.values.password}
              onChange={(value) => formik.setFieldValue('password', value)}
              label='Password'
              type='password'
              error={formik.errors.password}
              autoComplete='off'
            />
            <HorizontalStack align='center'>
              <ButtonGroup>
                <Button
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Login
                </Button>
                <Button primary submit>
                  Cadastrar e Entrar
                </Button>
              </ButtonGroup>
            </HorizontalStack>
          </FormLayout>
        </Form>
      </LegacyCard>
    </Layout.Section>
  );
};

export default SignUp;
