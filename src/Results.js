import { useEffect, useRef, useState } from "react";
import defaultImage from './camera.svg';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './modal.css';
import UPIQRCode from './UPIQRCode';
import Home from './Home.js';
import {
  Cluster,
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { encodeURL, createQR } from "@solana/pay";
import BigNumber from "bignumber.js";
import QRCodeStyling from '@solana/qr-code-styling';


const Results = (props) => {
  const {path,output,closeModel,processimage}=props
  const [isDisabled, setIsDisabled] = useState(true);
  const [issolDisabled, setsolIsDisabled] = useState(false);
  const [balance, setBalance] = useState(0);
  const [txDone, setTxDone] = useState(false);
  const ref = useRef(null);
  let url='';

  useEffect(() => {
    const timer = setInterval(() => {
        checkTx();
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}, []);

async function checkTx() {
  const balNew = await fetchBalance();
  console.log("checked", balNew);
  console.log("balance dekhlo", balance)
  if (balNew != balance) {
      setTxDone(true);
      console.log("tx hogaya bro", balance);
  }
}
async function fetchBalance() {
  const address = reciptaddress;
  const key = new PublicKey(address);
  const connection = new Connection(clusterApiUrl("devnet"));
  const bal = await connection.getBalance(key);
  return bal / LAMPORTS_PER_SOL;
}

function createTxQr(recipientAddr, Amount) {
  const recipient = new PublicKey(recipientAddr);
  const amount = new BigNumber(Amount);
  const reference = new Keypair().publicKey;
  const label = ""; //project name
  const message = ""; //what message on tx ?
  const memo = ""; //project name
  const url = encodeURL({
      recipient,
      amount,
      reference,
      label,
      message,
      memo,
  });
  console.log("url", url.href);

  if (typeof window !== "undefined") {
      const qrCode = createQR(url,200);
      qrCode.append(ref.current);
  }
  
  console.log("bro bal", balance)
}

  function createData(Item, Quantity, Cost) {
    return {Item, Quantity, Cost};
  }
  let map=[];
  let names=["kurkure","parleg","lays","redbull"];
  let counter=[0,0,0,0]
  let cost=[20,10,20,125]
  let totalcost=0;
  let soltotalcost=0;
  let upiId="shlok08@ybl";
  console.log(output)
  console.log(typeof(output))
  for (var j = 0; j < output.length; j++) {
    var item = output[j];
  
    if(item==0)
    {
      counter[0]++; 
    }
    else if(item ===2 )
    {
      counter[2]++;
  }
    else if(item ===1 )
    {  
      counter[1]++;
    
  }
  else
  {
    counter[3]++; 
}
    }
    let i = 0;

   
while (i < counter.length) {
  
    if(counter[i]!==0){
      console.log(i+"   "+counter[i]);
      map.push(createData(names[i],counter[i],cost[i]*counter[i]))
      totalcost=totalcost+cost[i]*counter[i];
    }
    i++;
}
soltotalcost=totalcost*0.001;

console.log(map)
  function onclickfun(){
    
    processimage(defaultImage)
    closeModel(false);
  }
  function upigenrator(){
    setsolIsDisabled(true)
    setIsDisabled(false)
  }

  function solanaqr(){

    createTxQr(reciptaddress,soltotalcost)
    setIsDisabled(true)

setsolIsDisabled(false)
  }

let reciptaddress='kTTpYq1DrudiVtnGKVwZcc5SYvRi3PhF2ai5kVqzkiu';
  
  
  

  return (
    <div className='total'>
    <div className='leftside'>
      <img src={path} id="imagefinal"></img>
      <div id="table"><TableContainer style={{ maxHeight: '100%', overflow: 'auto',backgroundColor:'#3F2305' }} component={Paper}>
      <Table sx={{ minWidth: 650, fontSize: '14rem' ,color:'beige'}}  style={{ maxHeight: '10%', overflow: 'auto' }}saria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: '2rem',color:"beige" }}>Item</TableCell>
            <TableCell sx={{ fontSize: '2rem',color:"beige" }} align="right">Quantity&nbsp;</TableCell>
            <TableCell sx={{ fontSize: '2rem',color:"beige" }} align="right">Cost&nbsp;(Rs)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map.map((row) => (
            <TableRow 
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, fontSize: '1.5rem',color:"beige" }}
            >
              <TableCell component="th" scope="row" sx={{ fontSize: '1.2  rem',color:"beige" }}>
                {row.Item} 
              </TableCell>
              <TableCell align="right" sx={{ fontSize: '1.2  rem',color:"beige" }}>{row.Quantity}</TableCell>
              <TableCell align="right"sx={{ fontSize: '1.2  rem',color:"beige" }}>{row.Cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer></div>
      
    
    </div>
    <div className='rightside'>
      <h2 id="finalamt"> The total payable amount is Rs. {totalcost}</h2>
      <button className='paymentbtn' onClick={solanaqr}> Pay With Solana</button>
      <button className='paymentbtn upi' onClick={upigenrator}> Pay With Upi</button>
      <div id="qrimage">
      {isDisabled ? null : (
        <UPIQRCode amount={totalcost} />
      )}
    </div>
    <div id="qrimage">
      {issolDisabled ? null : (
        <div id="qrimage" ref={ref}></div>
      )}
    </div>
    <button id="sucess" onClick={onclickfun}>On Sucess</button>
    </div>
    </div>
  );
};

export default Results;
