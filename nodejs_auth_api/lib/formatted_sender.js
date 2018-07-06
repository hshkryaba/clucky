module.exports = function getFormatter(res) {
  return (function(res, status, data, message = '', iserror = true) {
    res.status(status).json({
      status: status,
      message: (iserror) ? null : message,
      result: (iserror)
        ? null
        : (Array.isArray(data))
          ? data
          : [data],
      error: (iserror) ? {
        code: data.code || -1,
        message: data.message || 'UNKNOWN ERROR'
      } : null
    });
  }.bind(undefined, res));
};
