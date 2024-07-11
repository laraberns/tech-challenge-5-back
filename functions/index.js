const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendHttpPushNotification = functions.https.onRequest(async (req, res) => {
    const userId = req.body.userId;
    const message = req.body.message;

    try {
        const tokenDoc = await admin.firestore().collection('FCMTokens').doc(userId).get();
        const FCMToken = tokenDoc.data()?.token;

        if (!FCMToken) {
            throw new Error('FCM token not available');
        }

        const payload = {
            token: FCMToken,
            notification: {
                title: 'Your App Name',
                body: message
            }
        };

        const response = await admin.messaging().send(payload);
        console.log('Successfully sent message:', response);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ error: error.message });
    }
});