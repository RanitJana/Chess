const AsyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default AsyncHandler;
