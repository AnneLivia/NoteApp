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
import { UserLogin } from '../../types/User';
import UserRepository from '../../api/services/Users';
import useUserStore from '../../store/useUser';
import { useNavigate } from 'react-router-dom';
import { UserLoginSchema } from '../../validators/UserValidator';
import { ErrorAPI } from '../../types/ErrorAPI';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const addUser = useUserStore((state) => state.addUser);

  const navigate = useNavigate();

  const formik: FormikProps<UserLogin> = useFormik<UserLogin>({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: UserLoginSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const resp = await UserRepository.login(values);
        addUser(resp);
        formik.setFieldValue('identifier', '');
        formik.setFieldValue('password', '');
        navigate('/notes');
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof AxiosError && error.response) {
          const message: ErrorAPI = error.response.data;
          if (message.error.name === 'ValidationError') {
            formik.setFieldError(
              'password',
              'Nome de usuário ou senha Inválida',
            );
            formik.setFieldError(
              'identifier',
              'Nome de usuário ou senha Inválida',
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
      <LegacyCard title='Login' sectioned>
        <Form onSubmit={formik.handleSubmit}>
          <FormLayout>
            <TextField
              name='username'
              value={formik.values.identifier}
              onChange={(value) => formik.setFieldValue('identifier', value)}
              label='Username'
              type='text'
              error={formik.errors.identifier}
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
                    navigate('/signUp');
                  }}
                >
                  Cadastrar
                </Button>
                <Button primary submit>
                  Entrar
                </Button>
              </ButtonGroup>
            </HorizontalStack>
          </FormLayout>
        </Form>
      </LegacyCard>
    </Layout.Section>
  );
};

export default Login;
