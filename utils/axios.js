const axios = require("axios");

const post = (url, data, headers) => {
  return axios.post(url, data, {
    headers,
  });
};

module.exports = { post };
