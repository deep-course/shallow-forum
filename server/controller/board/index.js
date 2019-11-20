const post=require('./post');
const board=require('./board');
const common=require('./common');
const attachment=require('./attachment');
module.exports={
    ...common,
    ...post,
    ...board,
    ...attachment
}