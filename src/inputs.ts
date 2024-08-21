import {z} from '@hono/zod-openapi';

export const ParamSchema=z.object({
    id:z.string().min(1).max(10).openapi({
      param:{
        name:"id",
        in:"path",
      },
      example:"Simple example to show in OpenApispec file!"
    })
  })