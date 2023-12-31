const venom = require('venom-bot');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let clientInstance; // To hold the client instance after creation

venom.create({
    session: 'customer-support' // name of session
}).then((client) => {
    console.log('WhatsApp session created');
    clientInstance = client; // Store the client instance

    // Endpoint to send a WhatsApp message
    app.post('/send-whatsapp', async (req, res) => {
        console.log('Received a POST request to /send-whatsapp');
        try {
            const { number, message } = req.body; // Extract number and message from request body
            if (!number || !message) {
                return res.status(400).send('Please provide both number and message');
            }

            console.log(`Sending message "${message}" to ${number}...`);
            const result = await clientInstance.sendText(`${number}@c.us`, message);
            console.log('Result: ', result);
            res.status(200).send('Message sent successfully');
        } catch (error) {
            console.error('Error when sending: ', error);
            res.status(500).send('Error sending message');
        }
    });
}).catch((error) => {
    console.error('WhatsApp session creation error: ', error);
});

// Start Express server after WhatsApp session creation
const server = app.listen(3000, () => {
    console.log('Listening on port 3000');
});

// Handling server close gracefully if needed
process.on('SIGINT', () => {
    server.close(() => {
        if (clientInstance) {
            clientInstance.close();
        }
        process.exit(0);
    });
});
