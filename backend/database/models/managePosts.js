const path = require('path');
const sqlite = require('sqlite3').verbose();
const { executeDBOperation } = require('../../framework/DreamTeamUtils');

const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur managePosts.js lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL : managePosts.js');
    }
});

// CREER UN POST
const addPost = async (title, description, dateStart, dateEnd, address, cityName, token, images) => {
    const db = require('../db');
    const sqlPost = 'INSERT INTO Posts (title, description, dateStart, dateEnd, address, cityName, token) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const sqlImage = 'INSERT INTO Images (title, url, idPlant) VALUES (?, ?, ?)';

    try {
        const postResult = await executeDBOperation(db, sqlPost, [title, description, dateStart, dateEnd, address, cityName, token], "all");

        const postID = postResult.lastID;
        for (let image of images) {
            await executeDBOperation(db, sqlImage, [image.title, image.url, postID])
        }

        console.log("Nouveau post créé , Titre : ", title);
        return {
            status: 200,
            success: true
        };
    } catch (e) {
        console.error('Erreur lors de la fonction addPost', e);
        return {
            status: 400,
            success: false
        };
    }
};

// LIRE TOUS LES POSTS
const getAllPosts = async () => {
    try {
        const sql = 'SELECT idPosts, title, description, publishedAt, dateStart, dateEnd, address, cityName, state, accepted, idUser, idPlant FROM Posts';
        const rows = await executeDBOperation(db, sql, [], "all");
        return { 
            body: rows, 
            status: 200, 
            success: true 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction getAllPosts', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

// récupérer les post d'un user
const postsOf = async (uid) => {
    try {
        const sql = 'SELECT idPosts, title, description, publishedAt, dateStart, dateEnd, address, cityName, state, accepted, idUser, idPlant FROM Posts WHERE idUser = ?';
        const rows = await executeDBOperation(db, sql, [uid], "all");
        return { 
            body: rows, 
            status: 200, 
            success: true 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction getAllPosts', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

module.exports = {
    addPost,
    getAllPosts,
    postsOf
}