import { Hono } from "hono";
import DevRoute from "@/routes/dev.route";
import authRoute from "@/routes/auth.route";
import journalRoute from "@/routes/journal.route";
import aiRoute from "@/routes/ai.route";
import integrationsRoute from "./integrations.route";
import emotionsRoute from "./emotions.route";

export const routes = () => {
	const app = new Hono();
	app.route('/', DevRoute);
	app.route('/auth', authRoute);
	app.route('/journal', journalRoute);
	app.route('/ai', aiRoute);
	app.route('/integrations', integrationsRoute);
	app.route('/emotions', emotionsRoute);

	return app;
};