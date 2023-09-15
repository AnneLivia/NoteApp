import {
  EditMajor,
  DeleteMinor,
  DiamondAlertMajor,
} from '@shopify/polaris-icons';
import {
  Button,
  ButtonGroup,
  Icon,
  LegacyCard,
  LegacyStack,
} from '@shopify/polaris';
import './index.css';
import useFetchNotes from '../../../query/useFetchNotes';
import ContentLoading from '../../../components/Loading';
import useNoteStore from '../../../store/useNotes';
import NoteRepository from '../../../api/services/Notes';
import CustomModal from '../Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useUserStore from '../../../store/useUser';
import { AxiosError } from 'axios';
import { ErrorAPI } from '../../../types/ErrorAPI';

const NoteList = () => {
  const { isLoading } = useFetchNotes();
  const user = useUserStore((state) => state.user);

  const [active, setActive] = useState<{
    show: boolean;
    id?: number;
  }>({
    show: false,
    id: undefined,
  });

  const [notes, removeNote] = useNoteStore((state) => [
    state.notes,
    state.removeNote,
    state.updateNote,
  ]);

  const handleOnDelete = async (id: number) => {
    try {
      if (user) {
        await NoteRepository.delete(id, user.jwt);
        toast.success('Nota removida com sucesso', {
          icon: DeleteMinor,
        });
        removeNote(id);
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError && error.response) {
        const message: ErrorAPI = error.response.data;
        switch (message.error.name) {
          case 'ForbiddenError':
          case 'UnauthorizedError': {
            return toast.error(
              'Você não tem autorização para remover essa nota',
              {
                icon: DiamondAlertMajor,
              },
            );
          }
          case 'NotFoundError': {
            return toast.error('A nota não foi encontrada', {
              icon: DiamondAlertMajor,
            });
          }
        }
      }

      toast.error('Erro ao remover nota', {
        icon: DiamondAlertMajor,
      });
    }
  };

  const handleOnUpdate = async (id: number) => {
    try {
      setActive({
        show: true,
        id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading ? (
    <ContentLoading />
  ) : (
    <>
      <div className='content'>
        {notes?.map((note) => {
          const [createdDate, createdHour] = new Date(note.publishedAt)
            .toLocaleString()
            .split(',');
          return (
            <LegacyCard.Section title={note.title} key={note.id}>
              <LegacyStack spacing='loose' vertical>
                <p>{note.content}</p>
                <LegacyStack distribution='fillEvenly'>
                  <p>
                    <i>
                      Criado em: {createdDate}, às {createdHour}
                    </i>
                  </p>
                  <LegacyStack distribution='trailing'>
                    <ButtonGroup>
                      <Button
                        size='slim'
                        icon={<Icon source={EditMajor} />}
                        onClick={() => handleOnUpdate(note.id)}
                      ></Button>
                      <Button
                        destructive
                        size='slim'
                        icon={<Icon source={DeleteMinor} />}
                        onClick={() => handleOnDelete(note.id)}
                      ></Button>
                    </ButtonGroup>
                  </LegacyStack>
                </LegacyStack>
              </LegacyStack>
            </LegacyCard.Section>
          );
        })}
        <footer className='footer-notes'>
          <p>
            {notes?.length} Nota{notes?.length !== 1 && 's'}
          </p>
        </footer>
      </div>
      <CustomModal active={active} setActive={setActive} />
    </>
  );
};

export default NoteList;
