// Test helper that lives on the SAME module pipeline as the controllers.
//
// Background: in this repo the server source is CJS while Vitest test files
// are ESM. A test's ESM import of a source file and a controller's CJS
// require() of the same file can resolve to DIFFERENT module instances, so
// vi.mock() factories and vi.spyOn() on ESM imports never reach the code the
// controllers actually execute (verified empirically: the controllers kept
// seeing the real socket module with uninitialized io).
//
// The exception is Mongoose models: models compile onto Mongoose's shared
// singleton, and the `mongoose.models.X ||` guard in each model file
// collapses every instance onto ONE object — which is why vi.spyOn() on the
// models works from tests.
//
// This helper uses plain CJS require() (identical pipeline to the
// controllers) to initialize the REAL Socket.IO server on an unlistened HTTP
// server. Tests then spy on the returned `io` object's `to()` to capture
// room-targeted emissions without any client connections.
const http = require("node:http");
const { initSocket } = require("../../config/socket.js");

const server = http.createServer();
const io = initSocket(server);

module.exports = { io, server };
