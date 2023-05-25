


import axios from 'axios';

import { CART_EMPTY } from '../constants/cartConstants';
import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DELETE_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_INITIALIZE_PAYMENT_FAIL,
    ORDER_INITIALIZE_PAYMENT_REQUEST,
    ORDER_INITIALIZE_PAYMENT_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_MINE_LIST_FAIL,
    ORDER_MINE_LIST_REQUEST,
    ORDER_MINE_LIST_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_SUMMARY_REQUEST,
    ORDER_SUMMARY_SUCCESS
} from "../constants/orderConstants";

// Order Create Action

export const createOrder = (order) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });

    try {
        const { userSignin: { userInfo } } = getState();

        const { data } = await axios.post('http://localhost:5000/api/orders', order, {
            headers: {
                authorization: `Bearer ${userInfo.token}`,
            },
        });

        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        dispatch({ type: CART_EMPTY });
        localStorage.removeItem('cartItems');
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};


export const deleteOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_DELETE_SUCCESS, payload: { message: 'Order Deleted', orderId } });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_DELETE_FAIL, payload: message });
    }
};

export const deliverOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.put(
            `http://localhost:5000/api/orders/${orderId}/deliver`,
            {},
            {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            }
        );
        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
    }
};

export const summaryOrder = () => async (dispatch, getState) => {
    dispatch({ type: ORDER_SUMMARY_REQUEST });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.get('http://localhost:5000/api/orders/summary', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_SUMMARY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Details Order Action
export const detailsOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
};
// Chapa
export const initializePayment = (orderId, paymentData) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_INITIALIZE_PAYMENT_REQUEST });

        const response = await axios.post(`http://localhost:5000/api/orders/${orderId}/initialize-payment`, paymentData);
        const { checkoutUrl } = response.data;

        dispatch({ type: ORDER_INITIALIZE_PAYMENT_SUCCESS, payload: checkoutUrl });
    } catch (error) {
        dispatch({
            type: ORDER_INITIALIZE_PAYMENT_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Order Payment Action
export const payOrder = (order, paymentResult) => async (
    dispatch,
    getState
) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
    const { userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.put(`http://localhost:5000/api/orders/${order._id}/pay`, paymentResult, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
};

// Order History Action

export const listOrderMine = () => async (dispatch, getState) => {
    dispatch({ type: ORDER_MINE_LIST_REQUEST });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.get('http://localhost:5000/api/orders/mine', {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
    }
};
export const listOrders = () => async (dispatch, getState) => {
    // export const listOrders = ({ seller = '' }) => async (dispatch, getState) => {
    dispatch({ type: ORDER_LIST_REQUEST });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.get('http://localhost:5000/api/orders', {
            //  const { data } = await axios.get(`http://localhost:5000/api/orders?seller=${seller}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_LIST_FAIL, payload: message });
    }
};