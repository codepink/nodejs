
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Messenger' }); // jade에서 가져옴
};