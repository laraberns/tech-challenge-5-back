const functions = require('firebase-functions')
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const serviceAccount = require('./creds.json')

const admin = require('firebase-admin');

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

//test notification
exports.sendHttpPushNotification = functions.https.onRequest(async (req, res) => {
    const userId = req.body.userId;
    const message = req.body.message;

    try {
        const tokenDoc = await db.collection('FCMTokens').doc(userId).get();
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

// send daily notifications
exports.sendTaskReminderNotifications = functions.pubsub.schedule('every day 12:10').onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    try {
        const tasksSnapshot = await db.collection('tasks')
            .where('status', 'in', ['Backlog', 'Em Desenvolvimento'])
            .where('finalDate', '==', tomorrowString)
            .get();

        if (tasksSnapshot.empty) {
            console.log('No tasks to send notifications for.');
            return null;
        }

        tasksSnapshot.forEach(async (taskDoc) => {
            const task = taskDoc.data();
            const fcmToken = task.fcmtoken;

            if (fcmToken) {
                const payload = {
                    token: fcmToken,
                    notification: {
                        title: 'Lembrete de Tarefa',
                        body: `A tarefa "${task.name}" está prestes a vencer amanhã.`
                    }
                };

                try {
                    const response = await admin.messaging().send(payload);
                    console.log('Successfully sent message:', response);
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            }
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
});