var Promise = require('bluebird'),
    mongoose = Promise.promisifyAll(require('mongoose')),
    Message = mongoose.model('Message'),
    UserUtils = require('utils/users'),
    MessageUtils = require('utils/messages'),
    GroupMessage = mongoose.model('GroupMessage'),
    joi = require('joi'),
    pattern = require('utils/pattern');

module.exports = {
  
  one : One,
  get : Get,
  add : Add,

  validateOwners : ValidateOwners,

  validateReqOne : ValidateReqOne,
  validateReqGet : ValidateReqGet,
  validateReqAdd : ValidateReqAdd

};

function One(request,reply) {

  var msgId = request.params.id,
      user = request.auth.credentials;

  MessageUtils.exists(msgId,user)
              .then(function(msg){
                reply.data = msg;
                reply.next();
              })
              .catch(function(e) {
                reply.next(e);
              });
}

function Get(request,reply) {

  Promise.all([
            UserUtils.exists(request.query.from),
            UserUtils.exists(request.query.to)
           ])
           .then(function(){
              reply.next();
           })
           .catch(function(e){
            reply.next(e);
           });
}

function Add(request,reply) {

  Promise.all([
            UserUtils.exists(request.body.from),
            UserUtils.exists(request.body.to)
           ])
          .then(function() {
            reply.next();
          })
          .catch(function(e) {
            reply.next(e);
          });

}

function ValidateReqOne(request,reply) {

  return {
    params : {
      id : joi.string().regex(pattern.objectId)
    }
  };

}

function ValidateReqGet(request,reply) {
  
  return {
    query : {
      from : joi.string().regex(pattern.objectId),
      to : joi.string().regex(pattern.objectId),
      start : joi.number().required(),
      end : joi.number().required()
    }
  };
}

function ValidateReqAdd(request,reply) {
  
  return {
    payload : {
      from : joi.string().regex(pattern.objectId),
      to : joi.string().regex(pattern.objectId),
      content : joi.string(),
      created : joi.number()
    }
  };
}

function ValidateOwners(request,reply) {
  
  var userId = request.auth.credentials.id,
      from = request.query.from,
      to = request.query.to;

  if(userId == from || userId == to) {
    reply.next();
    return;
  }

  reply.next('Not authorized to view messages');

}