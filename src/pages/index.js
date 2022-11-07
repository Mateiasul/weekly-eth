// @ts-nocheck
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import ProTip from './components/ProTip';
import Animations from './components/Animations';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [currentWalletValue, setcurrentWalletValue] = useState();
  const [previousWalletValue, setpreviousWalletValue] = useState();
  const [changeInWalletValue, setchangeInWalletValue] = useState();
  const [isLoading, setisLoading] = useState();
  const rpcUR1L = process.env.ALCHEMY_RPC_KEY;

  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          color: 0x8c5454,
          backgroundColor: 0x181518,
          maxDistance: 14.0,
          spacing: 33.0,
        })
      );
    }
  }, [vantaEffect]);

  const web3 = new Web3(process.env.NEXT_PUBLIC_ALCHEMY_URL);

  const fetchCurrentWalletValue = async () => {
    const response = await fetch('/api/etherscan/getLatestWalletBalance', {
      method: 'POST',
      body: JSON.stringify(walletAddress),
    });
    const responeData = await response.json();
    return responeData.result;
  };

  const fetchBlockIdAtDate = async () => {
    const currentDate = new Date();
    const timestamp = new Date(2022, 10, 1).getTime() / 1000; // timestamp in seconds

    const response = await fetch('/api/etherscan/getBlockByTimestamp', {
      method: 'POST',
      body: JSON.stringify(timestamp),
    });
    const responeData = await response.json();
    return responeData.result;
  };

  const getWalletValueAtBlockId = async () => {
    setisLoading(true);
    const blockId = await fetchBlockIdAtDate();
    const currentWalletValueInWei = await fetchCurrentWalletValue();
    const currentWalletValueInEth = web3.utils.fromWei(
      currentWalletValueInWei,
      'ether'
    );
    let oldWalletValue;
    await web3.eth.getBalance(walletAddress, blockId, (err, wei) => {
      oldWalletValue = web3.utils.fromWei(wei, 'ether');
    });

    const totalWeeklyChange = currentWalletValueInEth - oldWalletValue;
    setchangeInWalletValue(totalWeeklyChange);
    setcurrentWalletValue(currentWalletValueInEth);
    setpreviousWalletValue(oldWalletValue);
    console.log(totalWeeklyChange);
    console.log(currentWalletValueInEth);
    console.log(oldWalletValue);
    setisLoading(false);
  };

  return (
    <Container ref={vantaRef} maxWidth="xxl" sx={{ height: '99vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            marginTop: '60px',
          }}
        >
          Estimate your profits / losses on a weekly basis
        </Typography>
        <Typography variant="h6" component="h6" gutterBottom>
          The current estimation is running for week starting 30th of October -
          6 th of November
        </Typography>
        <Paper
          elevation={10}
          sx={{
            padding: '0 30px',
            width: '40%',
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: '0.7',
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Wallet Address"
            name="address"
            autoFocus
            onChange={(e) => setWalletAddress(e.target.value)}
          ></TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
            onClick={() => getWalletValueAtBlockId()}
          >
            Check Weekly Profits
          </Button>
        </Paper>
        <Box
          sx={{
            padding: '0 30px',
            width: '50%',
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isLoading && <Animations />}
          {changeInWalletValue && !isLoading ? (
            <Box>
              <Typography variant="subtitle1" component="h6" gutterBottom>
                Your current wallet value is
                {'  ' + parseFloat(currentWalletValue).toFixed(3)} Ξ
              </Typography>
              <Typography variant="subtitle1" component="h6" gutterBottom>
                Your old wallet value was
                {'  ' + parseFloat(previousWalletValue).toFixed(3)} Ξ
              </Typography>
              <Typography
                variant="subtitle1"
                component="h6"
                sx={{
                  color: changeInWalletValue < 0 ? 'red' : 'green',
                }}
              >
                Change in value over 1 week{' '}
                {'  ' + parseFloat(changeInWalletValue).toFixed(3)} Ξ
              </Typography>
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </Container>
  );
}
