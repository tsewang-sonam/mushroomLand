var db = require('../conf/database');
const PostModel ={}

PostModel.create = (title,description,path, thumbnail,fk_userId) => {
    let baseSQL = ' INSERT INTO post (title, description, path, thumbnail, created, fk_userId) VALUE(?,?,?,?, now(), ?);;'; 
    return db.execute(baseSQL,[title,description, path,thumbnail,fk_userId,])
    .then(([results,fields])=>{
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));

}
PostModel.search =(searchTerm) =>{
    let baseSQL=" SELECT  id, title, description, thumbnail, concat_ws(' ',title, description) AS haystack \
        FROM post	\
        HAVING haystack like ? ;";
        let sqlReadySearchTerm = "%"+searchTerm+"%";
        return db.execute(baseSQL,[sqlReadySearchTerm])
        .then(([results, fields])=>{
            return Promise.resolve(results);

        })
        .catch((err) => Promise.reject(err));
    }

PostModel.getRecentPosts = (numberOfPost) =>{
    let baseSQL = 'SELECT id, title,description,thumbnail, created FROM post ORDER BY created DESC LIMIT ?';
   return db.execute(baseSQL,[numberOfPost])
    .then(([results, fields])=>{
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));

};

PostModel.getPostById = (postId) =>{
    let baseSQl = `SELECT  u.username, p.title, p.description, p.path, p.created 
  FROM users u 
  JOIN post p 
  ON u.id-fk_userid 
  WHERE p.id=?;`;

  return db.execute(baseSQl, [postId])
  .then(([results, fields])=>
  {
  
      return Promise.resolve(results);
       
    
  })
  .catch(err => Promise.reject(err));

}

module.exports = PostModel;
