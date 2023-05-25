import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';



const userRouter = express.Router();
// userRouter.get(
//     '/top-sellers',
//     expressAsyncHandler(async (req, res) => {
//         const topSellers = await User.find({ isSeller: true })
//             .sort({ 'seller.rating': -1 })
//             .limit(3);
//         res.send(topSellers);
//     })
// );

userRouter.route('/seed')
    .get(
        expressAsyncHandler(async (req, res) => {
            // await User.deleteMany({});
            const createdUser = await User.insertMany(data.users);
            res.send({ createdUser });
        })
    );
userRouter.route('/signin')
    .post(
        expressAsyncHandler(async (req, res) => {
            console.log(req.body)
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    res.send({
                        _id: user.id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        // isSeller: user.isSeller,
                        token: generateToken(user),
                    });
                    return;
                }
            }
            res.status(401).send({ message: 'Invalid email or password' });
        })
    );
userRouter.route('/register')
    .post(expressAsyncHandler(async (req, res) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        const createdUser = await user.save();
        res.send({
            _id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            //  isSeller: user.isSeller,
            token: generateToken(createdUser),
        });
    })
    );
userRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);
// API for User Update (put = update)
userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            // if (user.isSeller) {
            //     user.seller.name = req.body.sellerName || user.seller.name;
            //     user.seller.logo = req.body.sellerLogo || user.seller.logo;
            //     user.seller.description =
            //         req.body.sellerDescription || user.seller.description;
            // }
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8);
            }
            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                //   isSeller: user.isSeller,
                token: generateToken(updatedUser),
            });
        }
    })
);
// api for list users
userRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({});
        res.send(users);
    })
);
// api for delete users
userRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                if (user.email === 'admin@example.com') {
                    res.status(400).send({ message: 'Can Not Delete Admin User' });
                    return;
                }
                const deleteUser = await User.findByIdAndRemove(req.params.id);
                res.send({ message: 'User Deleted', user: deleteUser });
            } else {
                res.status(404).send({ message: 'User Not Found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    })
);
// api for update users
userRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            //  user.isSeller = Boolean(req.body.isSeller);
            user.isAdmin = Boolean(req.body.isAdmin);
            user.isAdmin = req.body.isAdmin || user.isAdmin;
            const updatedUser = await user.save();
            res.send({ message: 'User Updated', user: updatedUser });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);
export default userRouter;