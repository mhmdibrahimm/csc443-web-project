/**
 * Centralised error handler. Routes throw `HttpError` (or anything with a
 * numeric `status`) to surface a clean JSON response; everything else is
 * logged and returned as a generic 500.
 */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err && typeof err.status === "number") {
    return res.status(err.status).json({ error: err.message });
  }
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Internal server error" });
}
