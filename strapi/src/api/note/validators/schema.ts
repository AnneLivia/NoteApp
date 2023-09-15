import joi from "joi";

const NoteSchema = joi.object({
  content: joi.string().trim().required(),
  title: joi.string().trim().required(),
});

export default NoteSchema;
