const Razorpay=require('razorpay');
const crypto=require('crypto');
const Order=require('../models/Order');

const razorpay=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});

const createRazorpayOrder=async(req,res)=>{
  try{
    const{total_amount}=req.body;
    const order=await razorpay.orders.create({amount:Math.round(total_amount*100),currency:'INR',receipt:'r_'+Date.now()});
    res.json({order_id:order.id,amount:order.amount,currency:order.currency,key:process.env.RAZORPAY_KEY_ID});
  }catch(e){res.status(500).json({message:e.message});}
}

const verifyPayment=async(req,res)=>{
  try{
    const{razorpay_order_id,razorpay_payment_id,razorpay_signature,items,shipping_address,city,total_amount}=req.body;
    const sig=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+'|'+razorpay_payment_id).digest('hex');
    if(sig!==razorpay_signature)return res.status(400).json({message:'Invalid signature'});
    const order=new Order({customer_id:req.user._id,items,shipping_address,city,total_amount,payment_status:'Completed',status:'Pending'});
    const created=await order.save();
    res.status(201).json({success:true,order:created});
  }catch(e){res.status(500).json({message:e.message});}
}

module.exports={createRazorpayOrder,verifyPayment};