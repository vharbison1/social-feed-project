'use strict';
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define('posts', {
    user_id: DataTypes.INTEGER,
    post_title: DataTypes.STRING,
    post_body: DataTypes.TEXT,
    post_image_url: DataTypes.TEXT
  }, {});
  posts.associate = function(models) {
    // associations can be defined here
  };
  return posts;
};