export async function authorization(req, res, next) {
  try {
    const { role_id } = req.user;
    if (role_id == 2) {
      return res
        .status(403)
        .json({ messages: `you do not have access into this page` });
    }
    next();
  } catch (error) {
    next(error);
  }
}
