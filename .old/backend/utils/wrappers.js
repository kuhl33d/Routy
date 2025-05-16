export const controllerWrapper = (controllerName, fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(`Error in ${controllerName} controller:`, error.stack);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};
