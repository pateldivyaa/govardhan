// src/services/otpService.js
import twilio from 'twilio';

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Twilio SMS Service
async function sendTwilioSMS(mobile, otp) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio credentials not configured');
      return { success: false, message: 'SMS service not configured' };
    }

    const client = twilio(accountSid, authToken);
    
    const message = await client.messages.create({
      body: `Your Govardhan Thal reservation OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
      from: fromNumber,
      to: `+91${mobile}` // Assuming Indian numbers
    });

    console.log('Twilio SMS sent:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return { success: false, message: error.message };
  }
}

// Textlocal SMS Service (Popular in India)
async function sendTextlocalSMS(mobile, otp) {
  try {
    const apiKey = process.env.TEXTLOCAL_API_KEY;
    const sender = process.env.TEXTLOCAL_SENDER || 'GOVTHL';

    if (!apiKey) {
      console.error('Textlocal API key not configured');
      return { success: false, message: 'SMS service not configured' };
    }

    const message = `Your Govardhan Thal reservation OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
    
    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: apiKey,
        numbers: mobile,
        message: message,
        sender: sender
      })
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Textlocal SMS sent:', data.message_id);
      return { success: true, messageId: data.message_id };
    } else {
      console.error('Textlocal SMS error:', data.errors);
      return { success: false, message: data.errors?.[0]?.message || 'SMS sending failed' };
    }
  } catch (error) {
    console.error('Textlocal SMS error:', error);
    return { success: false, message: error.message };
  }
}

// MSG91 SMS Service (Another popular Indian service)
async function sendMSG91SMS(mobile, otp) {
  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID; // You need to create template on MSG91
    const senderId = process.env.MSG91_SENDER_ID || 'GOVTHL';

    if (!authKey || !templateId) {
      console.error('MSG91 credentials not configured');
      return { success: false, message: 'SMS service not configured' };
    }

    const response = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${mobile}&authkey=${authKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        OTP: otp,
        sender_id: senderId
      })
    });

    const data = await response.json();
    
    if (data.type === 'success') {
      console.log('MSG91 SMS sent:', data.request_id);
      return { success: true, messageId: data.request_id };
    } else {
      console.error('MSG91 SMS error:', data);
      return { success: false, message: data.message || 'SMS sending failed' };
    }
  } catch (error) {
    console.error('MSG91 SMS error:', error);
    return { success: false, message: error.message };
  }
}

// AWS SNS SMS Service
async function sendAWSSMS(mobile, otp) {
  try {
    const { SNSClient, PublishCommand } = await import('@aws-sdk/client-sns');
    
    const snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const message = `Your Govardhan Thal reservation OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
    
    const command = new PublishCommand({
      Message: message,
      PhoneNumber: `+91${mobile}`,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: 'GOVTHL'
        },
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional'
        }
      }
    });

    const result = await snsClient.send(command);
    console.log('AWS SNS SMS sent:', result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error('AWS SNS SMS error:', error);
    return { success: false, message: error.message };
  }
}

// Main SMS sending function
export async function sendOTP(mobile, otp) {
  const smsProvider = process.env.SMS_PROVIDER || 'console'; // console, twilio, textlocal, msg91, aws

  // For development/testing - just log to console
  if (smsProvider === 'console' || process.env.NODE_ENV === 'development') {
    console.log(`=== SMS TO ${mobile} ===`);
    console.log(`Your Govardhan Thal reservation OTP is: ${otp}`);
    console.log(`Valid for 10 minutes. Do not share this code.`);
    console.log(`========================`);
    return { success: true, provider: 'console' };
  }

  try {
    let result;
    
    switch (smsProvider) {
      case 'twilio':
        result = await sendTwilioSMS(mobile, otp);
        break;
      case 'textlocal':
        result = await sendTextlocalSMS(mobile, otp);
        break;
      case 'msg91':
        result = await sendMSG91SMS(mobile, otp);
        break;
      case 'aws':
        result = await sendAWSSMS(mobile, otp);
        break;
      default:
        console.error('Unknown SMS provider:', smsProvider);
        result = { success: false, message: 'Invalid SMS provider configured' };
    }

    if (result.success) {
      console.log(`OTP sent successfully via ${smsProvider} to ${mobile}`);
    } else {
      console.error(`Failed to send OTP via ${smsProvider}:`, result.message);
    }

    return { ...result, provider: smsProvider };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, message: error.message, provider: smsProvider };
  }
}

// Utility function to validate Indian mobile number
export function validateIndianMobile(mobile) {
  const cleanMobile = mobile.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanMobile);
}

// Rate limiting helper (you can implement Redis-based rate limiting)
export function checkRateLimit(mobile) {
  // Implement rate limiting logic here
  // For now, just return true
  return { allowed: true, remainingAttempts: 5 };
}