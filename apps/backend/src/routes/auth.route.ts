import { Hono } from 'hono';
import { Env } from '@/types/bindings';
import { format_response } from '@/utils/api_response';
import { createAuth } from '@/lib/auth';

// Example authentication route
export const authRoute = () => {
  const route = new Hono<{ Bindings: Env }>();

  // Example endpoint using auth
  route.get('/me', async (c) => {
    // Get environment variables from the context
    const env = c.env;

    // Create auth instance with environment variables
    const auth = await createAuth(env);

    try {
      // Get the authorization header
      const authHeader = c.req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json(
          format_response(401, 'Not authenticated', { is_error: true }),
          401
        );
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // The specific method for authentication depends on the better-auth API
      // This is a placeholder that should be replaced with actual API calls
      // from better-auth once you know the correct methods

      // For example, you might use something like:
      // const user = await auth.api.getUser({ token });
      // or
      // const session = await auth.handler(c.req.raw);

      // For now, let's use a generic API structure for demonstration
      const response = await auth.handler(c.req.raw);
      const userData = await response.json();

      if (!userData || response.status !== 200) {
        return c.json(
          format_response(401, 'Invalid token', { is_error: true }),
          401
        );
      }

      return c.json(
        format_response(200, { user: userData }, { is_error: false })
      );
    } catch (error) {
      return c.json(
        format_response(500, 'Authentication error', { is_error: true, meta: error }),
        500
      );
    }
  });

  return route;
};