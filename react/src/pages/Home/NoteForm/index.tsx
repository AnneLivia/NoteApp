import { Form, FormLayout, TextField, Button } from '@shopify/polaris';
import { FormikProps, useFormik } from 'formik';
import NoteFormSchema from '../../../validators/NoteValidator';
import Note from '../../../types/Note';
import {
  AddNoteMajor,
  EditMajor,
  DiamondAlertMajor,
} from '@shopify/polaris-icons';
import useNoteStore from '../../../store/useNotes';
import { NoteAttributes } from '../../../types/NotesAPI';
import NoteRepository from '../../../api/services/Notes';
import { toast } from 'react-toastify';
import useUserStore from '../../../store/useUser';
import { AxiosError } from 'axios';
import { ErrorAPI } from '../../../types/ErrorAPI';

type NoteFormProps = {
  defaultValues: Note;
  addValue: boolean;
  id?: number;
  setValueWasUpdated?: React.Dispatch<React.SetStateAction<boolean>>;
};

const NoteForm = ({
  defaultValues,
  addValue,
  id,
  setValueWasUpdated,
}: NoteFormProps) => {
  const user = useUserStore((state) => state.user);
  const addNewNote = useNoteStore((state) => state.addNewNote);
  const updateNote = useNoteStore((state) => state.updateNote);

  const formik: FormikProps<Note> = useFormik<Note>({
    initialValues: {
      ...defaultValues,
    },
    validationSchema: NoteFormSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        if (user) {
          if (addValue) {
            const newNote: NoteAttributes = await NoteRepository.create(
              values,
              user.jwt,
            );
            addNewNote(newNote);
          } else if (id && setValueWasUpdated) {
            const newNote: NoteAttributes = await NoteRepository.update(
              id,
              values,
              user.jwt,
            );

            updateNote(id, newNote);
            setValueWasUpdated(true);
          }

          toast.success(
            `Nota ${addValue ? 'adicionada' : 'atualizada'} com sucesso`,
            {
              icon: addValue ? AddNoteMajor : EditMajor,
            },
          );

          formik.setFieldValue('title', '');
          formik.setFieldValue('content', '');
        }
      } catch (error: unknown) {
        console.error(error);
        if (setValueWasUpdated) setValueWasUpdated(true);
        if (error instanceof AxiosError && error.response) {
          const message: ErrorAPI = error.response.data;
          switch (message.error.name) {
            case 'ForbiddenError':
            case 'UnauthorizedError': {
              return toast.error(
                'Você não tem permissão para realizar essa operação',
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

        toast.error(
          `Erro inesperado ao ${addValue ? 'adicionar' : 'atualizar'} nota`,
          {
            icon: addValue ? AddNoteMajor : EditMajor,
          },
        );
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormLayout>
        <TextField
          name='title'
          value={formik.values.title}
          onChange={(value) => formik.setFieldValue('title', value)}
          label='Título:'
          type='text'
          error={formik.errors.title}
          autoComplete='off'
        />

        <TextField
          name='content'
          value={formik.values.content}
          onChange={(value) => formik.setFieldValue('content', value)}
          label='Conteúdo:'
          type='text'
          error={formik.errors.content}
          autoComplete='off'
        />

        <Button submit icon={addValue ? AddNoteMajor : EditMajor}>
          {addValue ? 'Inserir' : 'Editar'}
        </Button>
      </FormLayout>
    </Form>
  );
};

export default NoteForm;
