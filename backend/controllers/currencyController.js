const axios = require("axios");

exports.getExchangeRate = async (req, res) => {
  try {
    const { base, target } = req.query;
    const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_API_KEY}`);
    const rate = response.data.rates[target] / response.data.rates[base];
    res.json({ rate });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exchange rate" });
  }
};
