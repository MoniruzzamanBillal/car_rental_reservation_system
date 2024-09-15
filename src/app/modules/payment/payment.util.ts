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
    tran_id: `${paymentData.transactionId}${Date.now()}`,
    store_id: config.STORE_ID,
    signature_key: config.SIGNATURE_KEY,
    success_url: `http://localhost:3000/api/v1/payment/confirmation?transactionId=${paymentData.transactionId}&status=success`,
    fail_url: `http://localhost:3000/api/v1/payment/confirmation?status=failed`,
    cancel_url: "http://localhost:5173/",
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
