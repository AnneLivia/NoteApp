import * as Yup from 'yup';

const NoteFormSchema = Yup.object().shape({
  content: Yup.string().trim().required('O conteúdo é obrigatório'),
  title: Yup.string().trim().required('O título é obrigatório'),
});

export default NoteFormSchema;
