import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ParamSchema } from "./inputs";
import { UserSchema } from "./outputs";
import { Hono } from "hono";
import {swaggerUI} from '@hono/swagger-ui';

const app = new OpenAPIHono();

const getUserRoute = createRoute({
  method: "get",
  path: "/users/{id}",
  request: {
    params: ParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema
        }
      },
      description: "Get a user's details by ID."
    }
  }
})

const postUserRoute = createRoute({
  method: "post",
  path: "/users",
  request: {
    params: UserSchema
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: UserSchema
        }
      },
      description: "Create a new user."
    }
  }
})

const handleUserRequest = (c:any, id:any) => {
  try {
    return c.json({
      id,
      age: 22,
      name: "Raja",
    })
  } catch (error) {
    return c.json({ error: 'Failed to process request' }, 500)
  }
}

app.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid("param");
  return handleUserRequest(c, id)
})

const generateNewId=()=>{
  return Math.floor(Math.random() * 1000);
} 

app.openapi(postUserRoute, (c) => {
  const userData = c.req.valid("param");
  // Assuming you have logic to generate a new ID
  const newId = generateNewId();
  return handleUserRequest(c, newId.toString());
})

app.doc('/doc',{
  openapi:"3.0.0",
  info:{
    version:'1.0.0',
    title:'My API',
  }
})

app.get('/swgui',swaggerUI({url:'/doc'}));

export default app;