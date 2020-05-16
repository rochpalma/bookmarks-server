function makeBookmarksArray() {
    return [
      {
        id: 1,
        title: 'Kissanime',
        url: 'https://www.kissanime.ru',
        description: 'Watch free anime series',
        rating: 4,
      },
      {
        id: 2,
        title: 'Code with Mosh',
        url: 'https://codewithmosh.com/',
        description: 'Learn to code with video tutorials',
        rating: 5,
      },
      {
        id: 3,
        title: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/',
        description: 'Learn to code at home',
        rating: 5,
      },
    ]
  }
  
  module.exports = {
    makeBookmarksArray,
  }