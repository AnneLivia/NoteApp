/**
 * note controller
 */

import { factories } from "@strapi/strapi";
import NoteSchema from "../validators/schema";

export default factories.createCoreController(
  "api::note.note",
  ({ strapi }) => ({
    // As rotas desse conteudo foram protegidas para serem acessadas apenas por usuários autenticados
    async find(ctx) {
      await this.sanitizeInput(ctx);

      // obtendo apenas os dados do usuario logado
      const user = ctx.state.user;

      const notes = await strapi.entityService.findMany("api::note.note", {
        sort: { createdAt: "DESC" },
        filters: {
          user: {
            id: user.id,
          },
        },
      });

      // Sanitization removes any malicious code coming from the user’s input.
      const sanitizedResults = await this.sanitizeOutput(notes, ctx);
      console.log(this.transformResponse(sanitizedResults));

      return this.transformResponse(sanitizedResults);
    },
    async delete(ctx) {
      await this.sanitizeInput(ctx);

      // obtendo o parametro id
      const { id } = ctx.request.params;

      // obtendo apenas os dados do usuario logado
      const user = ctx.state.user;

      // colocando o populate para exibir dados de usuário e validar se ele tem autorização para
      // deletar a nota
      const note = await strapi.entityService.findOne("api::note.note", id, {
        populate: { user: true },
      });

      if (!note) {
        return ctx.notFound("note was not found");
      }

      // validando se a nota retornada pertece ao usuário logado
      if (note.user.id !== user.id) {
        return ctx.unauthorized(
          "you do not have permission to delete this note",
        );
      }

      // agora deletar a nota
      const deletedNote = await strapi.entityService.delete(
        "api::note.note",
        id,
      );

      const sanitizedResults = await this.sanitizeOutput(deletedNote, ctx);

      return this.transformResponse(sanitizedResults);
    },
    async update(ctx) {
      await this.sanitizeInput(ctx);

      // obtendo o parametro id
      const { id } = ctx.request.params;

      // obtendo apenas os dados do usuario logado
      const user = ctx.state.user;

      // obtendo o conteudo enviado via body
      const data = ctx.request.body.data;

      // colocando o populate para exibir dados de usuário e validar se ele tem autorização para
      // atualizar a nota
      const note = await strapi.entityService.findOne("api::note.note", id, {
        populate: { user: true },
      });

      if (!note) {
        return ctx.notFound("note was not found");
      }

      // validando se a nota retornada pertece ao usuário logado
      if (note.user.id !== user.id) {
        return ctx.unauthorized(
          "you do not have permission to update this note",
        );
      }

      if (!data) {
        // se não houver dado, lançar erro usando http errors do strapi
        // primeiro parametro é a mensagem, segundo parametro é os details
        // strapi possui vários erros: ApplicationError , PaginationError, NotFound, etc.
        // https://docs.strapi.io/dev-docs/error-handling
        return ctx.badRequest("data object is missing", {
          data: {
            content: "you must provide a content",
            title: "you must provide a title",
          },
        });
      }

      // validar os dados com joi
      const { error } = NoteSchema.validate(data, { abortEarly: false });

      if (error) {
        return ctx.badRequest("fields validation failed", error.details);
      }

      // agora deletar a nota
      const updatedNote = await strapi.entityService.update(
        "api::note.note",
        id,
        {
          data: {
            user: user.id,
            ...data,
          },
        },
      );

      const sanitizedResults = await this.sanitizeOutput(updatedNote, ctx);

      return this.transformResponse(sanitizedResults);
    },
    async create(ctx) {
      await this.sanitizeInput(ctx);
      // obtendo os dados do usuário autenticado
      const user = ctx.state.user;
      // obtendo o conteudo enviado via body
      const data = ctx.request.body.data;

      if (!data) {
        // se não houver dado, lançar erro usando http errors do strapi
        // primeiro parametro é a mensagem, segundo parametro é os details
        // strapi possui vários erros: ApplicationError , PaginationError, NotFound, etc.
        // https://docs.strapi.io/dev-docs/error-handling
        return ctx.badRequest("data object is missing", {
          data: {
            content: "you must provide a content",
            title: "you must provide a title",
          },
        });
      }

      // validar os dados com joi
      const { error } = NoteSchema.validate(data, { abortEarly: false });

      if (error) {
        return ctx.badRequest("fields validation failed", error.details);
      }

      const createdNote = await strapi.entityService.create("api::note.note", {
        data: {
          user: user.id,
          ...data,
          // Se não colocar o código abaixo, o conteudo será salvo como draft e não published
          publishedAt: new Date().getTime(),
        },
      });

      // Sanitization removes any malicious code coming from the user’s input.
      const sanitizedResults = await this.sanitizeOutput(createdNote, ctx);

      // ao usar o metodo abaixo, o resultado é retornado considerando os padrões do strapi
      return this.transformResponse(sanitizedResults);
    },
  }),
);
