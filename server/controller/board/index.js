const post=require('./post');
const board=require('./board');
const common=require('./common');
const attachment=require('./attachment');
const comment=require('./comment');
module.exports={
    ...common,
    ...post,
    ...board,
    ...attachment,
    ...comment,
}