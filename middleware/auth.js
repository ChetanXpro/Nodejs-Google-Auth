export const isAuthenticated = (req, res, next) => {
  const token = req.cookies["connect.sid"];

  if (!token) next(new Error("Not Logged In"));
  next();
};

export const isAdmin = (req, res, next) => {
  const id = req.user._id;

  if (req.user.role !== "admin") next(new Error("You Dont have admin role"));

  next();
};
