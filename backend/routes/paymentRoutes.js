const express=require('express');
const router=express.Router();
const{createRazorpayOrder,verifyPayment}=require('../controllers/paymentController');
const{protect,authorize}=require('../middleware/auth');

router.post('/create-order',protect,authorize('Customer'),createRazorpayOrder);
router.post('/verify',protect,authorize('Customer'),verifyPayment);

module.exports=router;