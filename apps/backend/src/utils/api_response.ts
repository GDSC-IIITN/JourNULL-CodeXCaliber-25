interface Response {
	success: boolean;
	status: number;
	message: unknown;
	meta?: unknown;
}

/**
 * Format the response to be sent back to the client
 * @param status Status code of the response
 * @param message Message to be sent back
 * @param meta Metadata to be sent back
 * @param is_error If the response is an error
 * @returns Formatted response
 */
export const format_response = (
	status: number,
	message: unknown,
	{
		meta,
		is_error = false,
	}: {
		meta?: unknown;
		is_error?: boolean;
	},
) => {
	const response: Response = {
		success: !is_error,
		status,
		message,
	};

	if (meta) {
		response.meta = meta;
	}

	return response;
};
