const messageModel = require("../Models/messageModel");

module.exports.addMessage = async (req, res, next)=>{
    try{
        const {from, to, message} = req.body;
        console.log("from : ",from, " to: ",to, " message: ",message);
        const data = await messageModel.create({
            message:{text: message},
            users:[from,to],
            sender:from,
        });
        if(data) return res.json({msg: "Message added successfully."});
        else return res.json({msg: "Failed to added Messages to the database.",status:400});
    }catch(ex){
        next(ex);
    }
};
module.exports.getMessage = async (req, res, next)=>{
    const {from, to} =req.body;
    const messages = await messageModel
    .find({
        users:{
            $all: [from,to],
        },
    })
    .sort({ updateAt:1 });
    console.log("messages: ",messages);
    const messageList = messages.map((msg)=>{
        return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
        };
    });
    console.log("messageList: ",messageList);
    res.json(messageList);
};