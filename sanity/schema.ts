import { type SchemaTypeDefinition } from "sanity";
import { post } from "./schemas/post";
import { project } from "./schemas/project";
import { tag } from "./schemas/tag";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, project, tag],
};
