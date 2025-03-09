const axios = require("axios");

exports.getExchangeRate = async (req, res) => {
  try {
    const { base, target } = req.query;
    const response = await axios.get(`https://api.forexrateapi.com/v1/latest?api_key=${process.env.FOREX_API_KEY}&base=${base}&currencies=${target}`);
    const rate = response.data.rates[target] 
    res.json({ rate });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exchange rate" });
  }
};

//http://localhost:5000/api/currencyEx?base=LKR&target=USD example url