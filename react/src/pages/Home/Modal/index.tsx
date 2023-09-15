import { Modal } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import NoteForm from '../NoteForm';
import useNoteStore from '../../../store/useNotes';
import { NoteAttributes } from '../../../types/NotesAPI';
import './index.css';

type handleModal = {
  active: {
    show: boolean;
    id?: number;
  };
  setActive: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      id?: number;
    }>
  >;
};

const CustomModal = ({ active, setActive }: handleModal) => {
  const notes = useNoteStore((state) => state.notes);
  const [noteToBeUpdated, setNoteToBeUpdated] = useState<NoteAttributes>();
  const [valueWasUpdated, setValueWasUpdated] = useState(false);

  useEffect(() => {
    if (active.id) {
      const noteToBeUpdated = notes.find((note) => note.id === active.id);
      if (noteToBeUpdated) {
        setNoteToBeUpdated(noteToBeUpdated);
      }
    }
  }, [active.id, notes]);

  const handleChange = useCallback(() => {
    setActive({
      show: false,
      id: undefined,
    });
    setNoteToBeUpdated(undefined);
    setValueWasUpdated(false);
  }, [setActive]);

  useEffect(() => {
    if (valueWasUpdated) {
      handleChange();
    }
  }, [valueWasUpdated, handleChange]);

  return (
    noteToBeUpdated && (
      <div>
        <Modal
          fullScreen
          open={active.show}
          onClose={handleChange}
          title='Editar Nota'
        >
          <Modal.Section>
            <NoteForm
              addValue={false}
              id={active.id}
              defaultValues={{
                title: noteToBeUpdated ? noteToBeUpdated.title : '',
                content: noteToBeUpdated ? noteToBeUpdated.content : '',
              }}
              setValueWasUpdated={setValueWasUpdated}
            />
          </Modal.Section>
        </Modal>
      </div>
    )
  );
};

export default CustomModal;
