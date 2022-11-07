import React from 'react';
import axios from 'axios';

const apiKey = process.env.ETHERSCAN_API_KEY;

export default function handler(req, res) {
  const timestamp = JSON.parse(req.body);

  const url = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`;
  console.log(timestamp);

  axios.get(url).then((response) => {
    res.status(200).json(response.data);
    console.log(response.data);
  });
}
