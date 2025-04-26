import { Context, Hono } from "hono";
import DevRoute from "@/routes/dev.route";
import JournalRoute from "@/routes/journal.route";

export const routes = () => {
	const app = new Hono();
	app.route('/', DevRoute);
	app.route('/journal', JournalRoute);


	return app;
};