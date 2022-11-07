import React from 'react';
import axios from 'axios';

const apiKey = process.env.ETHERSCAN_API_KEY;

export default function handler(req, res) {
  const walletAddress = JSON.parse(req.body);

  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`;

  axios.get(url).then((response) => {
    res.status(200).json(response.data);
    console.log(response.data);
  });
}
