// Email Notification Service using EmailJS
// Register at https://www.emailjs.com/ to get your credentials
// Free tier allows 200 emails per month

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export const EMAIL_CONFIG: EmailConfig = {
  serviceId: 'service_alphamobitect',
  templateId: 'template_5gyolu4',
  publicKey: 'vVhlKW5YoKXiTUfRe',
};

// Load EmailJS SDK
export const loadEmailJS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('emailjs-sdk')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'emailjs-sdk';
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load EmailJS'));
    document.head.appendChild(script);
  });
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (
  customerEmail: string,
  orderDetails: {
    orderId: string;
    service: string;
    device: string;
    date: string;
    time: string;
    amount: number;
    customerName: string;
    paymentMethod: string;
  }
): Promise<boolean> => {
  try {
    await loadEmailJS();
    
    // @ts-ignore - EmailJS is loaded dynamically
    const emailjs = window.emailjs;
    
    if (typeof emailjs === 'undefined') {
      console.log('EmailJS not configured - skipping email notification');
      return false;
    }

    const templateParams = {
      to_email: customerEmail,
      to_name: orderDetails.customerName,
      from_name: 'Alphamobitect Phones Solution Kenya',
      order_id: orderDetails.orderId,
      service_name: orderDetails.service,
      device_model: orderDetails.device,
      appointment_date: orderDetails.date,
      appointment_time: orderDetails.time,
      amount: `KSh ${orderDetails.amount.toLocaleString()}`,
      payment_method: orderDetails.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Pay at Pickup',
      location: 'Stanbank, 3rd Floor Room 10, Nairobi',
    };

    await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    return true;
  } catch (error) {
    console.log('Email notification skipped (EmailJS not configured)');
    return false;
  }
};

// Simulated email (for demo - logs to console)
export const simulateEmailNotification = (
  customerEmail: string,
  orderDetails: {
    orderId: string;
    service: string;
    device: string;
    date: string;
    time: string;
    amount: number;
    customerName: string;
  }
): void => {
  console.log('=== BOOKING CONFIRMATION EMAIL ===');
  console.log(`To: ${customerEmail}`);
  console.log(`Subject: Your repair booking is confirmed - ${orderDetails.orderId}`);
  console.log(`
Dear ${orderDetails.customerName},

Your repair booking has been confirmed!

Order ID: ${orderDetails.orderId}
Service: ${orderDetails.service}
Device: ${orderDetails.device}
Appointment: ${orderDetails.date} at ${orderDetails.time}
Amount: KSh ${orderDetails.amount.toLocaleString()}

Location:
Stanbank, 3rd Floor Room 10, Nairobi

We will notify you when your device is ready!

Best regards,
Alphamobitect Phones Solution Kenya
  `);
  console.log('=================================');
};

export default {
  loadEmailJS,
  sendBookingConfirmationEmail,
  simulateEmailNotification,
};
