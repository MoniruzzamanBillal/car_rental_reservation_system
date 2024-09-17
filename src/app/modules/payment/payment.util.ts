/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import config from "../../config";

interface TPaymentData {
  transactionId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export const initiatePayment = async (paymentData: TPaymentData) => {
  const result = await axios.post(process.env.PAYMENT_URL!, {
    tran_id: `${paymentData.transactionId}`,
    store_id: config.STORE_ID,
    signature_key: config.SIGNATURE_KEY,
    success_url: `https://car-rental-reservation-system-beta.vercel.app/api/payment/confirmation?transactionId=${paymentData.transactionId}`,
    fail_url: `https://car-rental-reservation-system-beta.vercel.app/api/payment/cancel-payment`,
    cancel_url: "https://rent-ride-ivory.vercel.app/",
    amount: paymentData.amount,
    currency: "BDT",
    desc: "Merchant Registration Payment",
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "N/A",
    cus_phone: paymentData.customerPhone,
    type: "json",
  });

  return result.data;
};

// ! for verifying payment
export const verifyPay = async (trnxID: string) => {
  try {
    const result = await axios.get(config.PAYMENT_Check_URL!, {
      params: {
        request_id: trnxID,
        store_id: config.STORE_ID,
        signature_key: config.SIGNATURE_KEY,
        type: "json",
      },
    });

    return result?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
