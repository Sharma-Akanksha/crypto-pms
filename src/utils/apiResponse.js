function standardResponse(success, message, data = null) {
  return { success, message, data };
}

module.exports = { standardResponse };
