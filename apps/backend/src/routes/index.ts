import { Context, Hono } from "hono";
import DevRoute from "@/routes/dev.route";
import { authRoute } from "@/routes/auth.route";

export const routes = () => {
	const app = new Hono();
	app.route('/', DevRoute);
	app.route('/auth', authRoute());

	return app;
};