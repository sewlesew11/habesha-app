import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAdmin, isAuth, } from "../utils.js";
import User from '../models/userModel.js';
import Product from '../models/productModel.js';


const orderRouter = express.Router();
// Create api for order list
orderRouter.get(
    '/',
    isAuth,
    isAdmin,

    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find({}).populate('user', 'name');


        res.send(orders);
    })
);

orderRouter.get(
    '/summary',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$totalPrice' },
                },
            },
        ]);
        const users = await User.aggregate([
            {
                $group: {
                    _id: null,
                    numUsers: { $sum: 1 },
                },
            },
        ]);
        const dailyOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const productCategories = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.send({ users, orders, dailyOrders, productCategories });
    })
);

// API for users to return  orders
orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    })
);

orderRouter.post(
    `/`,
    isAuth,
    expressAsyncHandler(async (req, res) => {

        if (req.body.orderItems.length === 0) {
            res.status(400).send({ message: 'Cart is empty' });
        } else {
            const order = new Order({

                orderItems: req.body.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.shippingPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.user._id,
            });
            const createdOrder = await order.save();
            res
                .status(201)
                .send({ message: 'New Order Created', order: createdOrder });

        }
    })
);
orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {

        const order = await Order.findById(req.params.id);
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }

    })
);
// Chapa
orderRouter.post('/:id/initialize-payment', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            // Retrieve payment details from the request body
            const {
                amount,
                currency,
                email,
                firstName,
                lastName,
                phoneNumber,
                txRef,
                callbackUrl,
                returnUrl,
                title,
                description
            } = req.body;

            // Make a request to the Chapa API to initialize the payment
            const requestOptions = {
                headers: {
                    Authorization: 'Bearer CHAPUBK_TEST-f23unAi8tFo0Mh0WikIexcVpWzxPGwoZ',
                    'Content-Type': 'application/json',
                },
            };

            const payload = {
                amount,
                currency,
                email,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                tx_ref: txRef,
                callback_url: callbackUrl,
                return_url: returnUrl,
                customization: {
                    title,
                    description,
                },
            };
            const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', payload, requestOptions);
            const checkoutUrl = response.data.data.checkout_url;

            // Update the order document with the Chapa checkout URL
            order.chapaCheckoutUrl = checkoutUrl;
            await order.save();

            res.status(200).json({ checkoutUrl });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while initializing the payment' });
    }
});

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,

        };
        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
})
);

orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (order) {
                const deleteOrder = await Order.findByIdAndRemove(req.params.id);
                res.send({ message: 'Order Deleted', order: deleteOrder });
            } else {
                res.status(404).send({ message: 'Order Not Found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    })
);

orderRouter.put(
    '/:id/deliver',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.send({ message: 'Order Delivered', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);


export default orderRouter;