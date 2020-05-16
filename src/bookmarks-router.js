const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./logger')
const { PORT } = require('./config');
const { bookmarks }  = require('./store')
const validator = require('validator');
const BookmarksService = require('./bookmarks-service');

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    rating: Number(bookmark.rating),
  })

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        BookmarksService.getAllBookmarks(req.app.get('db'))
        .then(bookmarks => {
            res.json(bookmarks.map(serializeBookmark))
        })
        .catch(next)
    })

    .post(bodyParser, (req, res) => {
        const { title, url, description='', rating=1 } = req.body;
        
        if (!title) {
            logger.error('Title is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!url) {
            logger.error('URL is required');
            return res
            .status(400)
            .send('Invalid data');
        }

        if (!validator.isURL(url)){
            logger.error('URL is not valid');
            return res
            .status(400)
            .send('Invalid data');
        } 
        
        if (Number.isNaN(parseFloat(rating))) {
            logger.error('Rating is not number');
            return res
            .status(400)
            .send('Invalid data');
        }
    
        const id = uuid();

        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        };
    
        bookmarks.push(bookmark);
    
        logger.info(`Bookmark with id ${id} created`);
    
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json({bookmark});
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res, next) => {
        const { bookmark_id } = req.params
        BookmarksService.getById(req.app.get('db'), bookmark_id)
        .then(bookmark => {
            if (!bookmark) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res.status(404).json({
                error: { message: `Bookmark Not Found` }
            })
            }
            res.json(serializeBookmark(bookmark))
        })
        .catch(next)
    })
  .delete((req, res) => {
    const { bookmark_id } = req.params;
  
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == bookmark_id);
  
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter