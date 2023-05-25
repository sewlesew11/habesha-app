import React, { useState } from 'react';
import axios from 'axios';


function Payment() {




    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [error, setError] = useState('');

    const handlePayment = async (event) => {
        event.preventDefault();

        const paymentData = {
            amount: 100, // Example amount, you can use your own value
            currency: 'USD', // Example currency, you can use your own value
            email: 'example@example.com', // Example email, you can use your own value
            firstName: 'John', // Example first name, you can use your own value
            lastName: 'Doe', // Example last name, you can use your own value
            phoneNumber: '1234567890', // Example phone number, you can use your own value
            txRef: 'chewatatest-6669', // Example transaction reference, you can use your own value
            callbackUrl: 'https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60', // Example callback URL, you can use your own value
            returnUrl: '', // Example return URL, you can use your own value
            title: '', // Example title, you can use your own value
            description: '', // Example description, you can use your own value
        };

        try {
            const response = await axios.post('http://localhost:5000/api/transaction/initialize', paymentData);
            const { checkout_url } = response.data;
            setCheckoutUrl(checkout_url);
            setError('');
        } catch (error) {
            setError('An error occurred while initializing the payment');
        }
    };

    if (checkoutUrl) {
        // Redirect to the checkout URL
        window.location.href = checkoutUrl;
    }

    return (
        <div className="payment">
            <div className="payment-container">
                <div className="payment-section">
                    <div className="payment-title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment-detail">
                        <form onSubmit={handlePayment}>
                            {/* Add your payment form fields here */}
                            <button type="submit">Pay Now</button>
                        </form>
                        {error && <p>{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
