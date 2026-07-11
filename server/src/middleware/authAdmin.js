import jwt from "jsonwebtoken";

export function authAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Login required" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "JWT_SECRET not configured" });
    req.admin = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Login again." });
  }
}

export function signAdminToken(username) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ username, role: "admin" }, secret, { expiresIn: "24h" });
}
