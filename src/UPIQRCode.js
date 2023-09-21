import React from 'react';
import QRCode from 'qrcode.react';
import './modal.css';

const UPIQRCode = ({ amount }) => {
  const upi="shlok08@ybl"
  const name="Shlok"
  //const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${encodeURIComponent(amount)}`;
  const upiUrl=`upi://pay?pa=${upi}&pn=${name}&am=${amount}&cu=INR`;
  return (
    <div>
      <QRCode value={upiUrl} id='qr' />
    </div>
  );
};

export default UPIQRCode;
