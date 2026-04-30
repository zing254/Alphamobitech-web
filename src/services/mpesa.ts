// M-Pesa Daraja API Integration Service
// To use this in production, register at https://developer.safaricom.co.ke

const MPESA_CONFIG = {
  consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || '',
  consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || '',
  shortcode: import.meta.env.VITE_MPESA_SHORTCODE || '247247',
  passkey: import.meta.env.VITE_MPESA_PASSKEY || '',
  callbackUrl: 'https://your-domain.com/api/mpesa/callback',
  environment: (import.meta.env.VITE_MPESA_ENVIRONMENT || 'sandbox') as 'sandbox' | 'live' | 'simulation',
};

// Get OAuth token
export const getMpesaToken = async (): Promise<string> => {
  if (!MPESA_CONFIG.consumerKey || !MPESA_CONFIG.consumerSecret) {
    throw new Error('M-Pesa credentials not configured. Set VITE_MPESA_CONSUMER_KEY and VITE_MPESA_CONSUMER_SECRET in .env');
  }
  
  const baseUrl = MPESA_CONFIG.environment === 'sandbox' 
    ? 'https://sandbox.safaricom.co.ke' 
    : 'https://api.safaricom.co.ke';
  
  const auth = btoa(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`);
  
  try {
    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('M-Pesa Token Error:', error);
    throw error;
  }
};

// STK Push (Lipa na M-Pesa Online)
export const initiateSTKPush = async (
  phone: string,
  amount: number,
  orderId: string
): Promise<{ checkoutRequestId: string; responseCode: string }> => {
  const token = await getMpesaToken();
  const baseUrl = MPESA_CONFIG.environment === 'sandbox' 
    ? 'https://sandbox.safaricom.co.ke' 
    : 'https://api.safaricom.co.ke';
  
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const password = btoa(`${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`);
  
  const payload = {
    BusinessShortCode: MPESA_CONFIG.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: MPESA_CONFIG.shortcode,
    PhoneNumber: phone,
    CallBackURL: MPESA_CONFIG.callbackUrl,
    AccountReference: orderId,
    TransactionDesc: `Alphamobitect Repair - ${orderId}`,
  };
  
  try {
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    if (data.ResponseCode === '0') {
      return {
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
      };
    } else {
      throw new Error(data.ResponseDescription);
    }
  } catch (error) {
    console.error('M-Pesa STK Push Error:', error);
    throw error;
  }
};

// Check STK Push status
export const checkSTKStatus = async (checkoutRequestId: string): Promise<{
  status: 'pending' | 'completed' | 'failed';
  responseCode: string;
}> => {
  const token = await getMpesaToken();
  const baseUrl = MPESA_CONFIG.environment === 'sandbox' 
    ? 'https://sandbox.safaricom.co.ke' 
    : 'https://api.safaricom.co.ke';
  
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const password = btoa(`${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`);
  
  const payload = {
    BusinessShortCode: MPESA_CONFIG.shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };
  
  try {
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    return {
      status: (data.ResultCode === '0' ? 'completed' : data.ResultCode === '1032' ? 'failed' : 'failed') as 'pending' | 'completed' | 'failed',
      responseCode: data.ResultCode,
    };
  } catch (error) {
    console.error('M-Pesa Query Error:', error);
    throw error;
  }
};

// Format phone number to 254 format
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    return '254' + cleaned;
  }
  
  return cleaned;
};

// Validate Kenyan phone number
export const isValidKenyanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  const regex = /^(254|0)(7[0-9]{8}|1[0-9]{8})$/;
  return regex.test(cleaned);
};

// Simulate M-Pesa STK Push (for demo purposes)
export const simulateSTKPush = async (
  _phone: string,
  _amount: number,
  _orderId: string
): Promise<{ success: boolean; checkoutRequestId: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      checkoutRequestId: `SIM${Date.now()}`,
    };
  }
  throw new Error('Payment request failed. Please try again.');
};

// Check simulated payment status
export const checkSimulatedStatus = async (_checkoutRequestId: string): Promise<{
  status: 'pending' | 'completed' | 'failed';
  responseCode: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { status: 'completed', responseCode: '0' };
};

// WhatsApp notification helper
export const sendWhatsAppNotification = (
  phone: string,
  message: string
): void => {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // Open WhatsApp in new tab (pre-fills message)
  window.open(whatsappUrl, '_blank');
};

// Generate order confirmation WhatsApp message
export const generateOrderMessage = (
  orderDetails: {
    orderId: string;
    service: string;
    device: string;
    date: string;
    time: string;
    amount: number;
    customerName: string;
  }
): string => {
  return `Hello ${orderDetails.customerName}!

Your repair booking is confirmed!

📋 Order ID: ${orderDetails.orderId}
🔧 Service: ${orderDetails.service}
📱 Device: ${orderDetails.device}
📅 Date: ${orderDetails.date}
⏰ Time: ${orderDetails.time}
💰 Amount: KSh ${orderDetails.amount.toLocaleString()}

📍 Location: Stan Bank House, 3rd Floor Room 10, Next to Nairobi National Archives

We'll notify you when your device is ready for pickup!

- Alphamobitect Phones Solution Kenya`;
};

export default {
  getMpesaToken,
  initiateSTKPush,
  checkSTKStatus,
  formatPhoneNumber,
  isValidKenyanPhone,
  simulateSTKPush,
  checkSimulatedStatus,
  sendWhatsAppNotification,
  generateOrderMessage,
};
