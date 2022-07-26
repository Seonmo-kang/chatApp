const User = require('../Models/userModel');
const brcypt = require('bcrypt'); // crypt password

module.exports.register = async (req,res,next) =>{
    try{
        console.log(req.body);
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({ username });
        if(usernameCheck)
            return res.json({msg:"Username already used", status: false});
        const emailCheck =  await User.findOne({ email });
        if(emailCheck)
            return res.json({msg:"Email already used", status: false});
        const hashedPassword = await brcypt.hash(password,10);
        const user = await User.create({
            username,email, password:hashedPassword,
        });
        delete user.password;
        return res.json({status:true, user});
    }catch(error){
        next(error);
    }
};

module.exports.login = async (req,res,next) =>{
    try{
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if(!user)
            return res.json({msg:"Incorrect email or password", status: false});  
        const isPasswordValid = await brcypt.compare(password, user.password);
        if(!isPasswordValid)
            return res.json({msg:"Incorrect email or password", status: false});
        user = user.toObject();
        delete user.password;
        return res.json({status:true, user});
    }catch(error){
        next(error);
    }
};

module.exports.setAvatar = async (req,res,next) =>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({ 
            isSet:userData.isAvatarImageSet,
             image:userData.avatarImage
        });
    } catch(ex){
        next(ex);
    }
}

module.exports.getAllUsers = async (req,res,next) =>{
    try{
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]);
        return res.json(users);
    } catch(ex){
        next(ex);
    }
}