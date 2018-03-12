const mongoose = require('mongoose');
const Player = require('../models/player');

var getPlayerByName = (data, res) => {
    var playerName = data.playerName;
    Player.find({name: playerName}, function(err, response) {
        
        if (err) { //error
             return res.json({
                message: 'An error occurred',
                error: err
            })
        } else { //got player
            return res.json({
                message: 'Success',
                obj: response
            })
        }
    });
};

var upsertPlayer = (data, res) => {
    var player = data.player;

    if (!player._id) {
        player._id = new mongoose.mongo.ObjectID();
    }
    Player.findByIdAndUpdate(player._id, {name: player.name, points: player.points},
        {upsert: true}, function(err, response){
       
        if (err) { //error
            return res.json({
                message: 'An error occurred',
                error: err
            })
        } else { //update user
            return res.json({
                message: 'Success',
                obj: response
            })
        }
    });
};

module.exports = {
    "getPlayerByName": getPlayerByName,
    "upsertPlayer": upsertPlayer
}