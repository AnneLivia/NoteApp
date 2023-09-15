import { create } from 'zustand';
import { UserAttributes } from '../types/UserAPI';

type UserStore = {
  user?: UserAttributes;
  addUser: (user: UserAttributes) => void;
  removeUser: () => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  addUser: (user: UserAttributes) => {
    set(() => {
      return {
        user,
      };
    });
  },
  removeUser: () => {
    set(() => {
      return {
        user: undefined,
      };
    });
  },
}));

export default useUserStore;
