function requestLogger(router) {
  router.use((req, res, next) => {
    logger.debug(`--> ${req.method} ${req.path}`);
    next();
  });
}

module.exports = requestLogger
;