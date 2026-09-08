// Canonical Socket.IO room names. Every room is namespaced by organization so
// realtime events can never cross tenants. Pure functions — unit-tested;
// socket.js (join side) and taskController.js (emit side) must both use these
// instead of hand-building room strings.
const adminRoom = (orgId) => `org_${orgId}:admin-room`;
const employeeRoom = (orgId) => `org_${orgId}:employee-room`;
const userRoom = (orgId, userId) => `org_${orgId}:user_${userId}`;

module.exports = { adminRoom, employeeRoom, userRoom };
