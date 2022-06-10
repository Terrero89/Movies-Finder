export default class MoviesDAO {
    static movies;

    static async injectDB(conn) {
        if (MoviesDAO.movies) {
            return;
        } try {
            MoviesDAO.movies = await conn.db(process.env.MOVIESREVIEWS_NS)
        } catch (e) {
            console.error(`unable to connect to database MovieDAO: ${e}`);
        }
    }


static async getMovies({

    filters = null,
    page = 0,
    moviesPerPage = 20, // will only allow 20 movies per page

} = {}){
    let query;
    if (filters) {
        if ('title' in filters) {
            query = { $text: { $search: filters.title } }
        } else if ('rated' in filters) {
            query = { rated: { $eq: filters.rated } }
        }

    }
    let cursor;
    try {
        cursor = await moviesDAO.movies
        .find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);
        const moviesList = await cursor.toArray()
        const totalNumMovies = await MoviesDao.movies.countDocuments(query);
        return {moviesList, totalNumMovies};

    }catch(e){console.error(`Unable to find command command, ${e}`)}
    return {moviesList: [], totalNumMovies: 0};
}

}

