import express from 'express';
import cors from 'cors';
import MoviesRoute from './api/MoviesRoutes.js';
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import MoviesDAO from './dao/moviesDAO.js'

class Index {
    static app = express();

    static router = express.Router();

    static main() {
        dotenv.config();
        Index.setUpServer();
        Index.setUpDatabase();
    }

    static setUpServer() {
        Index.app.use(cors());
        Index.app.use(express.json());


    //set up of the route /api/v1/movies....
        Index.app.use('/api/v1/movies', MoviesRoute.configRoutes(Index.router));
        Index.app.use('*', (req, res) => {
            res.status(404).json({ error: 'Not Found' });
        });
    }


    static async setUpDatabase() {

        const client = new mongodb.MongoClient(process.env.MOVIESFINDER_DB_URI);
        const port = process.env.PORT || 8000;
        try {
            //connect to the mongo cluster
            await client.connect();
            await MoviesDAO.injectDB(client)
            Index.app.listen(port, () => {
                console.log(`server us running on port:${port} `);
            });

        } catch (e) {
            console.error(e);
            process.exit(1)
        }
        




    }
}

Index.main();