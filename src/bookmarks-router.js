const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('./store')
const url = require('url');

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })

  .post(bodyParser, (req, res) => {
    const { title, url, description='', rating=1 } = req.body;
      
    if (!title) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!url) {
        logger.error(`URL is required`);
        return res
          .status(400)
          .send('Invalid data');
    }

    if (Number.isNaN(parseFloat(rating))) {
        logger.error(`Rating is not number`);
        return res
          .status(400)
          .send('Invalid data');
    }
  
    
  
    // get an id
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    };
  
    lists.push(list);
  
    logger.info(`List with id ${id} created`);
  
    res
      .status(201)
      .location(`http://localhost:8000/list/${id}`)
      .json({id});
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id == id);
  
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
  
    const listIndex = lists.findIndex(li => li.id == id);
  
    if (listIndex === -1) {
      logger.error(`List with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    lists.splice(listIndex, 1);
  
    logger.info(`List with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter