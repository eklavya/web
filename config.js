'use strict';

module.exports = {
  url: 'https://saurabhrawat.in',
  pathPrefix: '/',
  title: 'Personal website of Saurabh Rawat',
  subtitle: 'I try hard to sound smart here.',
  copyright: '© ' + new Date().getFullYear() + ' All rights reserved.',
  disqusShortname: 'saurabhrawat',
  postsPerPage: 4,
  googleAnalyticsId: '',
  useKatex: false,
  menu: [
    {
      label: 'Articles',
      path: '/'
    },
    {
      label: 'Resume',
      path: '/pages/resume'
    }
  ],
  author: {
    name: 'Saurabh Rawat',
    photo: '/profile.jpg',
    bio: 'Developer, Entrepreneur',
    contacts: {
      email: 'saurabh.rawat90@gmail.com',
      github: 'eklavya',
      linkedin: 'rawatsaurabh',
    }
  }
};
