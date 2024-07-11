const { db } = require('../firebase.js');

exports.storeFCMToken = async (req, res) => {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
        return res.status(400).send('UserID e FCM Token são requeridos.');
    }

    try {
        // Verifica se o usuário já possui um token armazenado
        const tokenRef = db.collection('FCMTokens').doc(userId);
        const tokenDoc = await tokenRef.get();

        if (tokenDoc.exists) {
            // Se já existe, atualiza o token existente
            await tokenRef.update({ token: fcmToken });
            res.status(200).send('Token FCM atualizado com sucesso.');
        } else {
            // Se não existe, cria um novo documento com o token
            await tokenRef.set({ token: fcmToken });
            res.status(200).send('Token FCM armazenado com sucesso.');
        }
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno ao armazenar o token FCM.');
    }
};

exports.getAllFCMTokens = async (req, res) => {
    try {
        const tokensSnapshot = await db.collection('FCMTokens').get();

        if (tokensSnapshot.empty) {
            return res.status(404).send('Nenhum token FCM encontrado.');
        }

        let tokens = [];
        tokensSnapshot.forEach(doc => {
            tokens.push({ userId: doc.id, token: doc.data().token });
        });

        res.status(200).send(tokens);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno ao recuperar os tokens FCM.');
    }
};
