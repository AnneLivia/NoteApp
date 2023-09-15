import { UserLogin, UserRegister } from '../../types/User';
import { PostUser, UserAttributes } from '../../types/UserAPI';
import client from '../client';

type RepositoryMethods = {
  login: (data: UserLogin) => Promise<UserAttributes>;
  signUp: (data: UserRegister) => Promise<UserAttributes>;
};

const UserRepository = <RepositoryMethods>{
  login: async (data) => {
    const resp: PostUser = await client.post('/auth/local', data);
    return {
      jwt: resp.data.jwt,
      ...resp.data.user,
    };
  },
  signUp: async (data: UserRegister) => {
    const resp: PostUser = await client.post('/auth/local/register', data);
    return {
      jwt: resp.data.jwt,
      ...resp.data.user,
    };
  },
};

export default UserRepository;
