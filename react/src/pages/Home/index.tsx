import NoteForm from './NoteForm';
import { Layout, LegacyCard } from '@shopify/polaris';
import NoteList from './NoteList';
import './index.css';
import useUserStore from '../../store/useUser';

const Home = () => {
  const [user, removeUser] = useUserStore((state) => [
    state.user,
    state.removeUser,
  ]);
  return (
    <Layout.Section>
      <LegacyCard title='Nova Anotação' sectioned>
        <p className='user-session'>
          Usuário: {user?.email},{' '}
          <a
            href='#'
            onClick={() => {
              removeUser();
            }}
          >
            logout
          </a>
        </p>
        <NoteForm
          addValue={true}
          defaultValues={{
            title: '',
            content: '',
          }}
        />
      </LegacyCard>
      <LegacyCard title='Anotações' sectioned>
        <NoteList />
      </LegacyCard>
    </Layout.Section>
  );
};

export default Home;
