const { db } = require('../firebase.js');

exports.storeFCMToken = async (req, res) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        return res.status(400).send('UserID e FCM Token são requeridos.');
    }

    try {
        // Verifica se já existe algum documento com o mesmo userId ou com um nome diferente
        const snapshot = await db.collection('FCMTokens').where('userId', '==', userId).get();

        if (!snapshot.empty) {
            return res.status(200).send('UserID já existe com outro token.');
        }

        // Se não existe, cria um novo documento com o userId e token
        const docRef = await db.collection('FCMTokens').add({ userId, token });
        console.log('Token FCM armazenado com sucesso:', docRef.id);
        return res.status(200).send('Token FCM armazenado com sucesso.');
        
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).send('Erro interno ao armazenar o token FCM.');
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
