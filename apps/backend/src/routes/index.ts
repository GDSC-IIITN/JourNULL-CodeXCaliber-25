import { Context, Hono } from "hono";
import DevRoute from "@/routes/dev.route";

export const routes = () => {
	const app = new Hono();
	app.route('/', DevRoute);


	return app;
};