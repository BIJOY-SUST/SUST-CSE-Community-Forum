/* Start Express Server */
const express = require('express');

const hbs = require('hbs');

const url = require('url');
const crypto = require("crypto");
const path = require('path');
const fs = require('file-system');
const mv = require('mv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const detect = require('detect-file-type');
var session = require('express-session');




const app = express();
app.use(session({secret:'XASDASDA'}));
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);


const dirProPic = multer({ dest: './src/website/media/proPic/' });
const dirCoverPic = multer({ dest: './src/website/media/coverPic/' });
const dirPostFile = multer({ dest: './src/website/media/postFile/' });


const urlencodedParser = bodyParser.urlencoded({ extended: false }); // Create application/x-www-form-urlencoded parser

const dirPublicPath = path.join(__dirname, './website');

app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());



/* User build-in function
so that we can use it into front-end */

const isEqual = function (a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
}
const isNotEqual = function (a, b, opts) {
    if (a != b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
}
const isGreater = function (a, b, opts) {
    if (a > b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
}

const isLess = function (a, b, opts) {
    if (a > b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
}

hbs.registerHelper('if_eq', isEqual);
hbs.registerHelper('if_notEq', isNotEqual);
hbs.registerHelper('if_greater', isGreater);
hbs.registerHelper('if_less', isLess);


app.set('view engine', 'hbs');
app.set('views', dirPublicPath);
app.use(express.static(dirPublicPath));


const port = process.env.PORT || 3005;


/* ------------Start Database-MongoDB --------------------- */
const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/sustcselifedb', {
    useNewUrlParser: true,
    useCreateIndex: true
});

/* Here we placed tables included columns for our database */

const Users = mongoose.model('Users', {
    userUniqueId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    userRegNo: {
        type: String,
        trim: true
    },
    userEmail: {
        type: String,
        unique: true,
        trim: true
    },
    userPassword: {
        type: String,
        trim: true
    },
    userProPicAddr: {
        type: String,
        trim: true
    },
    userCoverPicAddr: {
        type: String,
        trim: true
    },
    userType: {
        type: String,
        trim: true
    },
    isAdministrator: {
        type: Number
    }
});

const Follows = mongoose.model('Follows', {

    followerID: {
        type: String,
        trim: true
    },
    followerName: {
        type: String,
        trim: true
    },
    followerProPic: {
        type: String,
        trim: true
    },
    followingID: {
        type: String,
        trim: true
    },
    followingName: {
        type: String,
        trim: true
    },
    followingProPic: {
        type: String,
        trim: true
    }
});

const Groups = mongoose.model('Groups', {
    groupUniqueId: {
        type: String,
        trim: true
    },
    groupName: {
        type: String,
        trim: true
    },
    groupCoverPicAddr: {
        type: String,
        trim: true
    }
});

const groupRequests = mongoose.model('groupRequests', {
    groupUniqueId: {
        type: String,
        trim: true
    },
    userUniqueId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    userPicAddr: {
        type: String,
        trim: true,
    },
    userRequestMessage: {
        type: String,
        trim: true
    }
});

const groupMembers = mongoose.model('groupMembers', {
    groupUniqueId: {
        type: String,
        trim: true
    },
    userUniqueId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    userPicAddr: {
        type: String,
        trim: true
    }, 
    isAdmin: {
        type: String,
        trim: true
    }
});


const Posts = mongoose.model('Posts', {
    postNumber: {
        type: Number
    },
    postUniqueId: {
        type: String,
        trim: true
    },
    userORGroupUniqueID: {
        type: String,
        trim: true
    },
    postOwnerUniqueID: {
        type: String,
        trim: true
    },
    postOwnerPic: {
        type: String,
        trim: true
    },
    postOwnerName: {
        type: String,
        trim: true
    },
    postTime: {
        type: String,
        trim: true
    },
    postText: {
        type: String,
        trim: true
    },
    postFileAddr: {
        type: String,
        trim: true
    },
    isFileType: {
        type: String,
        trim: true
    },

    isImageFile: {
        type: String,
        trim: true
    },
    isPdfFile: {
        type: String,
        trim: true
    },
    isVideoFile: {
        type: String,
        trim: true
    },
    isUserOrGroup: {
        type: String,
        trim: true
    },
    isGroupName: {
        type: String,
        trim: true
    },
    isAdmin: {
        type: String,
        trim: true
    },
    isLike:{
        type: String,
        trim: true
    },
    likeCount: {
        type: Number
    },
    commentCount: {
        type: Number
    }
});

const Likes = mongoose.model('Likes', {
    likeUniqueId: {
        type: String,
        trim: true
    },
    originPostUniqueID: {
        type: String,
        trim: true
    },
    ownerLikeUniqueID: {
        type: String,
        trim: true
    },
    isLike: {
        type: String,
        trim: true
    },
    userPhoto: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        trim: true
    }
});

const Comments = mongoose.model('Comments', {
    commentUniqueId: {
        type: String,
        trim: true
    },
    originPostUniqueID: {
        type: String,
        trim: true
    },
    ownerCommentUniqueID: {
        type: String,
        trim: true
    },
    userPhoto: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        trim: true
    },
    commentTime: {
        type: String,
        trim: true
    },
    commentText: {
        type: String,
        trim: true
    },
    isCommentMine: {
        type: String,
        trim: true
    },
    isIamAdmin:{
        type: String,
        trim: true
    }

});

const Notifications = mongoose.model('Notifications', {
    notifyUniqueId: {
        type: String,
        trim: true
    },
    notifyWhom: {
        type: String,
        trim: true
    },
    notifyLink: {
        type: String,
        trim: true
    },
    notifyLinkGroup: {
        type: String,
        trim: true
    },
    notifyUserUniqueID: {
        type: String,
        trim: true
    },
    notifyUserPhoto: {
        type: String,
        trim: true,
    },
    notifyUserName: {
        type: String,
        trim: true
    },
    notifyTime: {
        type: String,
        trim: true
    },
    notifyText: {
        type: String,
        trim: true
    },
    isFollow: {
        type: String,
        trim: true
    },
    isLike: {
        type: String,
        trim: true
    },
    isComment: {
        type: String,
        trim: true
    },
    isGroup: {
        type: String,
        trim: true
    },
    notifyListColor: {
        type: String,
        trim: true
    }
});

/* Elections Tables - Start From Here */

const Elections = mongoose.model('Elections', {
    electionUniqueId: {
        type: String,
        trim: true
    },
    electionName: {
        type: String,
        trim: true
    },
    electionCoverPicAddr: {
        type: String,
        trim: true
    },
    startTime: {
        type: String,
        trim: true
    },
    startHour: {
        type: String,
        trim: true
    },
    startDate: {
        type: String,
        trim: true
    },
    endTime: {
        type: String,
        trim: true
    },
    endDate: {
        type: String,
        trim: true
    },
    endHour: {
        type: String,
        trim: true
    },
    CECRegNo: {
        type: String,
        trim: true
    },
    CEC_name: {
        type: String,
        trim: true
    },
    CEC_id: {
        type: String,
        trim: true
    },
    CEC_proPic: {
        type: String,
        trim: true
    },

    EC1RegNo: {
        type: String,
        trim: true
    },
    EC1_name: {
        type: String,
        trim: true
    },
    EC1_id: {
        type: String,
        trim: true
    },
    EC1_proPic: {
        type: String,
        trim: true
    },

    EC2RegNo: {
        type: String,
        trim: true
    },
    EC2_name: {
        type: String,
        trim: true
    },
    EC2_id: {
        type: String,
        trim: true
    },
    EC2_proPic: {
        type: String,
        trim: true
    }
});


const ElectionPosts = mongoose.model('ElectionPosts', {
    userRegNo: {
        type: String,
        trim: true
    },
    electionName : {
        type: String,
        trim: true
    },
    userUniqueId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    userProPicAddr: {
        type: String,
        trim: true
    },
    postName: {
        type: String,
        trim: true
    },
    numberOfVotes: {
        type: Number
    },
    electionUniqueId: {
        type: String,
        trim: true
    },
    hasVoted : {
        type: Number
    }
});







/* ------------End Database-MongoDB ------------------------ */
/* For better workflow */
var bestFriend = '';
var groupRegNo = '';


/* --------------------------------------Election page start-------------------------------------- */
/* election main page view */
app.get('/electionMain', async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    
    else {
        real2showDate("esdd");
        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            myAllNotification = resultAllUnreadNotification.length;


            await Elections.find({}).then(async function (resultAllElections) {
    
                len_allElection = resultAllElections.length;
                PastElections = [];
                PresentElections = [];
                FutureElections = [];

                for (let li = 0; li < resultAllElections.length; li++) {
                    var element = resultAllElections[li];

                    await ElectionPosts.findOne({electionUniqueId: element.electionUniqueId, userRegNo : req.cookies.userRegNo}).then(async function (e2p) {
                        if (e2p.hasVoted == 1) {
                            element.hasVoted = 1;
                        }
                        else element.hasVoted = 0;

                        console.log("hasvoted", element.hasVoted, req.cookies.userRegNo);

                        const now_time = now2RealDate();
                
                        console.log(now_time, element.startTime, element.endTime, element.startTime <= now_time, element.endTime > now_time );

                        if (element.startTime < now_time && element.endTime < now_time) {
                            PastElections.push(element);
                        }
                        else if ( element.startTime > now_time && element.endTime > now_time ) {
                            FutureElections.push(element);
                        }
                        else if ( element.startTime <= now_time && element.endTime > now_time ){
                            PresentElections.push(element);
                    }
                    }).catch((error) => {
                        console.log('Error : Failed to save election posts');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to users!'
                        });
                    });
                }
                res.render('electionMain', {
                    myKey: req.cookies.key,
                    myName: req.cookies.name,
                    myProPic: req.cookies.proPicAddr,
                    myCoverPic: req.cookies.proCoverPicAddr,
                    isAdministrator :  req.cookies.isAdministrator,
                    userType : req.cookies.userType,
                    userRegNo : req.cookies.userRegNo,
                    myAllNotification: myAllNotification,
                    PastElections : PastElections,
                    FutureElections : FutureElections,
                    PresentElections : PresentElections
                });
            }).catch((error) => {
                console.log('Failed to find resultAllUnreadNotification');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find resultAllUnreadNotification'
                });
            });

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
        console.log("Is Administrator" , req.cookies.isAdministrator);
    }
});


function real2showDate(s) {

    check = new Date(s);
    if (isNaN(check.getHours())) return check.getHours();
    date = s.substr(0, 10);
    time = s.substr(11, 8);

    hour = parseInt(time.substr(0, 2), 10);
    minute = time.substr(3, 2), 10;
    
    year = parseInt(date.substr(0, 4), 10);
    month = parseInt(date.substr(5, 2), 10);
    day = parseInt(date.substr(8, 2), 10);

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var AMPM = (hour < 12) ? "AM" : "PM";
    var time = hour % 12 + ':' +  minute + ' ' + AMPM;
    var date = day + ' ' + monthNames[month-1] + ' ' + year
    var dateTime = time + ', ' + date;

    const showTime = {
        time : time,
        date : date
    };

    return showTime;

}
function int2str(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
function now2RealDate(){
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = int2str(today.getHours(),2) + ':' + int2str(today.getMinutes(),2) + ':' + int2str(today.getSeconds(),2) ;
    var date = today.getFullYear() + '-' + int2str(today.getMonth()+1,2) + '-' + int2str(today.getDate(),2) ;
    return date + ' ' + time;
}

/* For creating election */
app.post('/createElection', dirCoverPic.single('myImage'), urlencodedParser, async function (req, res) {
    
    if (!req.file) {
        res.render('test.hbs', {
            alert_name:'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading a Election cover!'
        });
    }
    const EC_List = [];
    const election = {
        key: req.body.electionname + Date.now(),
        name: req.body.electionname
    };
    election.key = crypto.createHash('sha256').update(election.key).digest("base64");
    await Users.find({ userRegNo : req.body.cec_reg}).then(async function (resultAllUnreadNotification) {

        if (resultAllUnreadNotification.length === 0) {
            console.log('Failed to find Cheif Election Commissioner');
        }
        else EC_List.push(resultAllUnreadNotification[0]);

        await Users.find({ userRegNo : req.body.ec4_reg}).then(async function (resultAllUnreadNotification) {

            console.log('Searching for EC1', resultAllUnreadNotification.length, req.body.ec4_reg);
           
            if (resultAllUnreadNotification.length === 0) {
                
                console.log('Failed to find Cheif Election Commissioner');
            }
            else  EC_List.push(resultAllUnreadNotification[0]);

            await Users.find({ userRegNo : req.body.ec2_reg}).then(async function (resultAllUnreadNotification) {
                console.log('Searching for EC2');

                if (resultAllUnreadNotification.length === 0) {
                    console.log('Failed to find Cheif Election Commissioner');     
                }
                else EC_List.push(resultAllUnreadNotification[0]);
                if(EC_List.length == 3) {

                    var fileName = req.file.originalname;
                    var preFilePath = req.file.path.substring(4,req.file.path.length)
                        preFilePath = __dirname + "/" + preFilePath;
                    var dateFile = "/" + Date.now() + "/" + fileName;
                    var newFilePath = path.join(__dirname, './website/media/coverPic/' + dateFile);
                    var proFilePath = "/media/coverPic" + dateFile;
                
                    await fileNewPath(preFilePath, newFilePath).then(async function(result) {
                        console.log('File path changed successfully');
                        const newElection = new Elections({
                            electionUniqueId: election.key,
                            electionName: election.name,
                            electionCoverPicAddr: proFilePath,
                            CECRegNo : req.body.cec_reg,
                            EC1RegNo : req.body.ec4_reg,
                            EC2RegNo : req.body.ec2_reg,
                            startTime : '2030-09-03 22:30:00',
                            startDate : 'Undefined',
                            startHour : '',
                            endTime : '2030-09-03 22:30:01',
                            endDate : 'Undefined',
                            endHour : '',

                        });
                
                        await newElection.save().then(async function(result) {
                            console.log('Your Election created successfully');

                            await Users.find({}).then(async function (allUserList) {
                                for (let li = 0; li < allUserList.length; li++) {
                                    var element = allUserList[li];

                                    const electionPosts = new ElectionPosts({
                                        electionUniqueId: election.key,
                                        userRegNo : element.userRegNo,
                                        electionName : election.name,
                                        userUniqueId: element.key,
                                        userName: element.userName,
                                        userProPicAddr: element.userProPicAddr,
                                        numberOfVotes : 0,
                                        postName : 'voter',
                                        hasVoted : 0
                                    });
                        
                                    await electionPosts.save().then((result2)=>{
                                        console.log("Created Election Successfully");
                                        
                                        console.log("yayy");
                                        
                                    }).catch((error)=>{
                                        console.log('Error : Failed to make Election');
                                        res.render('home.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'We are sorry you are having trouble creating admin of your group!'
                                        });
                                    });



                                }

                                res.redirect('electionMain');
                            
                            }).catch((error) => {
                                console.log('Error : Failed to users');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to users!'
                                });
                            });
                
                            
                            
                        }).catch((error) => {

                            console.log('Error : Failed to create a group');
                            res.render('home.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'We are sorry you are having trouble creating a group!'
                            });
                        });
                
                    }).catch((error) => {
                        console.log('Error : File path transfer');
                        res.render('register.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'We are sorry you are having trouble uploading an image!'
                        });
                    });
                }
                else {
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find Election Commissioner '
                    });
                }
        
            }).catch((error) => {
                console.log('Failed to find Election Commissioner 2');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find Election Commissioner 2'
                });
            });
    
        }).catch((error) => {
            console.log('Failed to find Election Commissioner 1');
    
        });
    


    }).catch((error) => {
        console.log('Failed to find Cheif Election Commissioner');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find Cheif Election Commissioner'
        });
    });
    
});


/* For election edit */
app.get('/electionEdit', async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    
    else {
        real2showDate("esdd");
        var myAllNotification = 0;

        var electionUniqueId = req.session.electionUniqueId;
        console.log(req.session.electionUniqueId);

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {

            myAllNotification = resultAllUnreadNotification.length;

            console.log("Enter into edit");
            
            await Elections.findOne({electionUniqueId: electionUniqueId}).then(async function  (election){
        
                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Vice President"}).then(async function (candidates){
                    var vicePresident = candidates;

                    await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "General Secretary"}).then(async function (candidates1){
                        var generalSecretary = candidates1;

                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Assistant General Secretary"}).then(async function (candidates2){
                            var assistantGeneralSecretary = candidates2;

                            await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2016 Batch"}).then(async function  (candidates3){
                                var executive_member_2016 = candidates3;

                                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2017 Batch"}).then(async function  (candidates4){
                                    var executive_member_2017 = candidates4;

                                    await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2018 Batch"}).then(async function  (candidates5){
                                        var executive_member_2018 = candidates5;

                                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2019 Batch"}).then(async function  (candidates6){
                                            var executive_member_2019 = candidates6;

                                            res.render('election_edit', {
                                                myKey: req.cookies.key,
                                                myName: req.cookies.name,
                                                myProPic: req.cookies.proPicAddr,
                                                myCoverPic: req.cookies.proCoverPicAddr,
                                                electionUniqueId : req.body.electionUniqueId,
                                                myAllNotification: myAllNotification,
                                                election : election,
                                                vicePresident : vicePresident,
                                                generalSecretary : generalSecretary,
                                                assistantGeneralSecretary : assistantGeneralSecretary,
                                                executive_member_2016 : executive_member_2016,
                                                executive_member_2017 : executive_member_2017,
                                                executive_member_2018 : executive_member_2018,
                                                executive_member_2019 : executive_member_2019
                                            });      
                                    
                                        }).catch((error)=>{
                                            console.log('Login failed');
                                            res.render('login.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Incorrect username or password'
                                            });
                                        });                                      
                                
                                    }).catch((error)=>{
                                        console.log('Login failed');
                                        res.render('login.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Incorrect username or password'
                                        });
                                    });
                                    
                
                                    
                                  
                            
                                }).catch((error)=>{
                                    console.log('Login failed');
                                    res.render('login.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Incorrect username or password'
                                    });
                                });
                                
            
                                
                              
                        
                            }).catch((error)=>{
                                console.log('Login failed');
                                res.render('login.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Incorrect username or password'
                                });
                            });
                            
        
                            
                          
                    
                        }).catch((error)=>{
                            console.log('Login failed');
                            res.render('login.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Incorrect username or password'
                            });
                        });
                        
    
                        
                      
                
                    }).catch((error)=>{
                        console.log('Login failed');
                        res.render('login.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Incorrect username or password'
                        });
                    });


                  
            
                }).catch((error)=>{
                    console.log('Login failed');
                    res.render('login.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Incorrect username or password'
                    });
                });
        
            }).catch((error)=>{
                console.log('Login failed');
                res.render('login.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Incorrect username or password'
                });
            });

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
        console.log("Is Administrator" , req.cookies.isAdministrator);
       
    }
});

/* Redirects to a running Election page where user can vote */
app.post('/electionRun', async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    
    else {
        real2showDate("esdd");
        var myAllNotification = 0;

        var electionUniqueId = req.body.run_electionUniqueId;
        console.log(electionUniqueId, req.cookies.userRegNo);

        req.session.electionUniqueId = electionUniqueId;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {

            myAllNotification = resultAllUnreadNotification.length;

            console.log("Enter into election Run");
            
            await Elections.findOne({electionUniqueId: electionUniqueId}).then(async function  (election){
                console.log(req.cookies.userRegNo, electionUniqueId)
                console.log("Trying to find this election1");
                // Blocks the voting URL From backend if hasVoted 
                
                await ElectionPosts.findOne({electionUniqueId: electionUniqueId, userRegNo : req.cookies.userRegNo}).then(async function  (electionPost){
                    console.log("Yayy, found elections");
                    voterStatus = electionPost;
                    if (voterStatus.hasVoted == 1) {
                        res.redirect('electionMain');  
                    } 
                    else {
                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Vice President"}).then(async function (candidates){
                            var vicePresident = candidates;

                            await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "General Secretary"}).then(async function (candidates1){
                                var generalSecretary = candidates1;

                                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Assistant General Secretary"}).then(async function (candidates2){
                                    var assistantGeneralSecretary = candidates2;

                                    await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2016 Batch"}).then(async function  (candidates3){
                                        var executive_member_2016 = candidates3;

                                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2017 Batch"}).then(async function  (candidates4){
                                            var executive_member_2017 = candidates4;

                                            await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2018 Batch"}).then(async function  (candidates5){
                                                var executive_member_2018 = candidates5;

                                                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2019 Batch"}).then(async function  (candidates6){
                                                    var executive_member_2019 = candidates6;

                                                    res.render('election_run', {
                                                        myKey: req.cookies.key,
                                                        myName: req.cookies.name,
                                                        myProPic: req.cookies.proPicAddr,
                                                        myCoverPic: req.cookies.proCoverPicAddr,
                                                        electionUniqueId : req.body.electionUniqueId,
                                                        myAllNotification: myAllNotification,
                                                        election : election,
                                                        vicePresident : vicePresident,
                                                        generalSecretary : generalSecretary,
                                                        assistantGeneralSecretary : assistantGeneralSecretary,
                                                        executive_member_2016 : executive_member_2016,
                                                        executive_member_2017 : executive_member_2017,
                                                        executive_member_2018 : executive_member_2018,
                                                        executive_member_2019 : executive_member_2019
                                                    });      
                                            
                                                }).catch((error)=>{
                                                    console.log('Login failed');
                                                    res.render('login.hbs', {
                                                        alert_name: 'danger',
                                                        alert_msg_visibility: 'visible',
                                                        SorF: 'Failure!',
                                                        status: 'Incorrect username or password'
                                                    });
                                                });                                      
                                        
                                            }).catch((error)=>{
                                                console.log('Login failed');
                                                res.render('login.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Incorrect username or password'
                                                });
                                            });
                                    
                                        }).catch((error)=>{
                                            console.log('Login failed');
                                            res.render('login.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Incorrect username or password'
                                            });
                                        });
                                        
                                
                                    }).catch((error)=>{
                                        console.log('Login failed');
                                        res.render('login.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Incorrect username or password'
                                        });
                                    });

                                }).catch((error)=>{
                                    console.log('Login failed');
                                    res.render('login.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Incorrect username or password'
                                    });
                                });

                        
                            }).catch((error)=>{
                                console.log('Login failed');
                                res.render('login.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Incorrect username or password'
                                });
                            });


                        
                    
                        }).catch((error)=>{
                            console.log('Login failed');
                            res.render('login.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Incorrect username or password'
                            });
                        });
                    }
                }).catch((error)=>{
                    console.log('Failed election post search');
                    res.render('login.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Could not find election post'
                    });
                });

        
            }).catch((error)=>{
                console.log('Login failed');
                res.render('login.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: "Can't find this election"
                });
            });



        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
        console.log("Is Administrator" , req.cookies.isAdministrator);
       
    }
});



/* If any voter give vote and press the submit button then this function will invoke */
app.post('/electionVote', async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    
    else {
        var myAllNotification = 0;
        console.log("enter in vote count")
        console.log(req.body.vicePresident);

        var electionUniqueId = req.body.postelectionUniqueId;
    
        console.log(electionUniqueId);

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {

            myAllNotification = resultAllUnreadNotification.length;

            console.log("Enter into election Vote");

            
            
            await Elections.findOne({electionUniqueId: electionUniqueId}).then(async function  (election){
        
                await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.vicePresident}, {$inc: {numberOfVotes : 1}}).then(async function (candidates){
                    var vicePresident = candidates;

                    await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.generalSecretary}, {$inc: {numberOfVotes : 1}}).then(async function (candidates1){

                        await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.assistantGeneralSecretary}, {$inc: {numberOfVotes : 1}}).then(async function (candidates2){

                            await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.executive_member_2016}, {$inc: {numberOfVotes : 1}}).then(async function  (candidates3){

                                await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.executive_member_2017}, {$inc: {numberOfVotes : 1}}).then(async function  (candidates4){

                                    await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.executive_member_2018}, {$inc: {numberOfVotes : 1}}).then(async function  (candidates5){

                                        await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.executive_member_2019}, {$inc: {numberOfVotes : 1}}).then(async function  (candidates6){

                                            await ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.cookies.userRegNo}, {$set: {hasVoted : 1}}).then(async function  (candidates7){
                                                console.log(candidates7, req.cookies.key);
                                
                                                res.redirect('electionMain');     
                                        
                                            }).catch((error)=>{
                                                console.log('Login failed');
                                                res.render('login.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Incorrect username or password'
                                                });
                                            }); 
                                        


                                                
                                    
                                        }).catch((error)=>{
                                            console.log('Login failed');
                                            res.render('login.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Incorrect username or password'
                                            });
                                        });                                      
                                
                                    }).catch((error)=>{
                                        console.log('Login failed');
                                        res.render('login.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Incorrect username or password'
                                        });
                                    });
                                    
                
                                    
                                  
                            
                                }).catch((error)=>{
                                    console.log('Login failed');
                                    res.render('login.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Incorrect username or password'
                                    });
                                });
                                
            
                                
                              
                        
                            }).catch((error)=>{
                                console.log('Login failed');
                                res.render('login.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Incorrect username or password'
                                });
                            });
                            
        
                            
                          
                    
                        }).catch((error)=>{
                            console.log('Login failed');
                            res.render('login.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Incorrect username or password'
                            });
                        });
                        
    
                        
                      
                
                    }).catch((error)=>{
                        console.log('Login failed');
                        res.render('login.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Incorrect username or password'
                        });
                    });


                  
            
                }).catch((error)=>{
                    console.log('Login failed');
                    res.render('login.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Incorrect username or password'
                    });
                });

        
            }).catch((error)=>{
                console.log('Login failed');
                res.render('login.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Incorrect username or password'
                });
            });



        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
        console.log("Is Administrator" , req.cookies.isAdministrator);
       
    }
});

/* For viewing an election, its starting and ending time and candidates*/
app.get('/electionView', async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    
    else {
        real2showDate("esdd");
        var myAllNotification = 0;

        var electionUniqueId = req.session.electionUniqueId;
        console.log(req.session.electionUniqueId);

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {

            myAllNotification = resultAllUnreadNotification.length;

            console.log("Enter into edit");
            
            await Elections.findOne({electionUniqueId: electionUniqueId}).then(async function  (election){
        
                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Vice President"}).then(async function (candidates){
                    var vicePresident = candidates;

                    await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "General Secretary"}).then(async function (candidates1){
                        var generalSecretary = candidates1;

                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Assistant General Secretary"}).then(async function (candidates2){
                            var assistantGeneralSecretary = candidates2;

                            await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2016 Batch"}).then(async function  (candidates3){
                                var executive_member_2016 = candidates3;

                                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2017 Batch"}).then(async function  (candidates4){
                                    var executive_member_2017 = candidates4;

                                    await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2018 Batch"}).then(async function  (candidates5){
                                        var executive_member_2018 = candidates5;

                                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2019 Batch"}).then(async function  (candidates6){
                                            var executive_member_2019 = candidates6;

                                            res.render('election_view', {
                                                myKey: req.cookies.key,
                                                myName: req.cookies.name,
                                                myProPic: req.cookies.proPicAddr,
                                                myCoverPic: req.cookies.proCoverPicAddr,
                                                electionUniqueId : req.body.electionUniqueId,
                                                myAllNotification: myAllNotification,
                                                election : election,
                                                vicePresident : vicePresident,
                                                generalSecretary : generalSecretary,
                                                assistantGeneralSecretary : assistantGeneralSecretary,
                                                executive_member_2016 : executive_member_2016,
                                                executive_member_2017 : executive_member_2017,
                                                executive_member_2018 : executive_member_2018,
                                                executive_member_2019 : executive_member_2019
                                            });
                                            
                        
                                            
                                          
                                    
                                        }).catch((error)=>{
                                            console.log('Login failed');
                                            res.render('login.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Incorrect username or password'
                                            });
                                        });
                                        
                    
                                        
                                      
                                
                                    }).catch((error)=>{
                                        console.log('Login failed');
                                        res.render('login.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Incorrect username or password'
                                        });
                                    });
                                    
                
                                    
                                  
                            
                                }).catch((error)=>{
                                    console.log('Login failed');
                                    res.render('login.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Incorrect username or password'
                                    });
                                });
                                
            
                                
                              
                        
                            }).catch((error)=>{
                                console.log('Login failed');
                                res.render('login.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Incorrect username or password'
                                });
                            });
                            
        
                            
                          
                    
                        }).catch((error)=>{
                            console.log('Login failed');
                            res.render('login.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Incorrect username or password'
                            });
                        });
                        
    
                        
                      
                
                    }).catch((error)=>{
                        console.log('Login failed');
                        res.render('login.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Incorrect username or password'
                        });
                    });


                  
            
                }).catch((error)=>{
                    console.log('Login failed');
                    res.render('login.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Incorrect username or password'
                    });
                });

               

            

        
            }).catch((error)=>{
                console.log('Login failed');
                res.render('login.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Incorrect username or password'
                });
            });



        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
        console.log("Is Administrator" , req.cookies.isAdministrator);
       
    }
});

/* If any user click in the result button, this buttion redirect this function */
app.post('/electionResult', async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    
    else {
        real2showDate("esdd");
        var myAllNotification = 0;

        var electionUniqueId = req.body.election_id_result;
        console.log("Result", electionUniqueId);

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {

            myAllNotification = resultAllUnreadNotification.length;

            console.log("Enter into Result");
            
            await Elections.findOne({electionUniqueId: electionUniqueId}).then(async function  (election){
        
                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Vice President"}).then(async function (candidates){
                    var vicePresident = candidates;
                    console.log("yayy, before sort");
                    vicePresident.sort((a, b) => (a.numberOfVotes <= b.numberOfVotes) ? 1 : -1);
                    console.log("yayy, after sort");


                    for (let li = 0; li < vicePresident.length; li++) {
                        if (li ==0) vicePresident[li].result = "Winner";
                        else vicePresident[li].result = "Participant";
                    }
                    console.log(vicePresident);

                    await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "General Secretary"}).then(async function (candidates1){
                        var generalSecretary = candidates1;
                        generalSecretary.sort((a, b) => (a.numberOfVotes <= b.numberOfVotes) ? 1 : -1);

                        for (let li = 0; li < generalSecretary.length; li++) {
                            if (li ==0) generalSecretary[li].result = "Winner";
                            else generalSecretary[li].result = "Participant";
                        }

                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Assistant General Secretary"}).then(async function (candidates2){
                            var assistantGeneralSecretary = candidates2;
                            assistantGeneralSecretary.sort((a, b) => (a.numberOfVotes <= b.numberOfVotes) ? 1 : -1);
                            for (let li = 0; li < assistantGeneralSecretary.length; li++) {
                                if (li ==0) assistantGeneralSecretary[li].result = "Winner";
                                else assistantGeneralSecretary[li].result = "Participant";
                            }

                            await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2016 Batch"}).then(async function  (candidates3){
                                var executive_member_2016 = candidates3;
                                executive_member_2016.sort((a, b) => (a.numberOfVotes <= b.numberOfVotes) ? 1 : -1);

                                for (let li = 0; li < executive_member_2016.length; li++) {
                                    if (li ==0) executive_member_2016[li].result = "Winner";
                                    else executive_member_2016[li].result = "Participant";
                                }

                                await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2017 Batch"}).then(async function  (candidates4){
                                    var executive_member_2017 = candidates4;
                                    executive_member_2017.sort((a, b) => (a.numberOfVotes <= b.numberOfVotes) ? 1 : -1);
                                    for (let li = 0; li < executive_member_2017.length; li++) {
                                        if (li ==0) executive_member_2017[li].result = "Winner";
                                        else executive_member_2017[li].result = "Participant";
                                    }

                                    await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2018 Batch"}).then(async function  (candidates5){
                                        var executive_member_2018 = candidates5;
                                        executive_member_2018.sort((a, b) => (a.numberOfVotes <= b.numberOfVotes) ? 1 : -1);
                                        for (let li = 0; li < executive_member_2018.length; li++) {
                                            if (li ==0) executive_member_2018[li].result = "Winner";
                                            else executive_member_2018[li].result = "Participant";
                                        }

                                        await ElectionPosts.find({electionUniqueId: electionUniqueId, postName : "Executive Member 2019 Batch"}).then(async function  (candidates6){
                                            var executive_member_2019 = candidates6;
                                            executive_member_2019.sort((a, b) => (a.numberOfVotes <= b.numberOfVotes) ? 1 : -1);

                                            for (let li = 0; li < executive_member_2019.length; li++) {
                                                if (li ==0) executive_member_2019[li].result = "Winner";
                                                else executive_member_2019[li].result = "Participant";
                                            }

                                            res.render('election_result', {
                                                myKey: req.cookies.key,
                                                myName: req.cookies.name,
                                                myProPic: req.cookies.proPicAddr,
                                                myCoverPic: req.cookies.proCoverPicAddr,
                                                electionUniqueId : req.body.electionUniqueId,
                                                myAllNotification: myAllNotification,
                                                election : election,
                                                vicePresident : vicePresident,
                                                generalSecretary : generalSecretary,
                                                assistantGeneralSecretary : assistantGeneralSecretary,
                                                executive_member_2016 : executive_member_2016,
                                                executive_member_2017 : executive_member_2017,
                                                executive_member_2018 : executive_member_2018,
                                                executive_member_2019 : executive_member_2019
                                            });
                                            
                        
                                            
                                          
                                    
                                        }).catch((error)=>{
                                            console.log('Login failed2');
                                            res.render('login.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Incorrect username or password'
                                            });
                                        });
                                        
                    
                                        
                                      
                                
                                    }).catch((error)=>{
                                        console.log('Login failed1');
                                        res.render('login.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Incorrect username or password'
                                        });
                                    });
                                    
                
                                    
                                  
                            
                                }).catch((error)=>{
                                    console.log('Login failed');
                                    res.render('login.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Incorrect username or password'
                                    });
                                });
                                
            
                                
                              
                        
                            }).catch((error)=>{
                                console.log('Login failed');
                                res.render('login.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Incorrect username or password'
                                });
                            });
                            
        
                            
                          
                    
                        }).catch((error)=>{
                            console.log('Login failed');
                            res.render('login.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Incorrect username or password'
                            });
                        });
                        
    
                        
                      
                
                    }).catch((error)=>{
                        console.log('Login failed');
                        res.render('login.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Incorrect username or password'
                        });
                    });


                  
            
                }).catch((error)=>{
                    console.log('Login failed');
                    res.render('login.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Incorrect username or password'
                    });
                });

               

            
        
            }).catch((error)=>{
                console.log('Login failed');
                res.render('login.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Incorrect username or password'
                });
            });



        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
        console.log("Is Administrator" , req.cookies.isAdministrator);
       
    }
});



/* For creating election candidates */
app.post('/createElectionCandidate', urlencodedParser,  async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {
        var electionUniqueId = req.session.electionUniqueId;
        console.log('create new user');
        console.log(electionUniqueId, req.body.userRegNo);
            
        await ElectionPosts.find({electionUniqueId: electionUniqueId, userRegNo : req.body.userRegNo}).then( (candidates) =>{
            console.log(candidates);
            if (candidates.length == 0) {
                
                console.log('This reg no. does not Exist!');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'This reg no. does not Exist!'
                });
            }

            else{

                ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.userRegNo}, 
                    {$set: {postName : req.body.postName}}).then((resultUser) => {
                    console.log(resultUser);
                        
                    console.log('Created Candidate successfully');
                    res.redirect('electionEdit');
            
                }).catch((error) => {
                    console.log('Failed to update Election Candidate');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update Election Candidate'
                    });
                });
        }
    
        }).catch((error)=>{
            console.log('Login failed');
            res.render('login.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Incorrect username or password'
            });
        });  
    }
});

/* If you want to delete any post from an election */
app.post('/deleteElectionPost', urlencodedParser,  async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {
        var electionUniqueId = req.body.postelectionUniqueId;
        console.log("Entered to delete");
        console.log(electionUniqueId);
        console.log(req.body.userRegNo);
        console.log("waiting to delete");
        await ElectionPosts.find({electionUniqueId: electionUniqueId, userRegNo : req.body.userRegNo}).then( (candidates) =>{
            if (candidates.length == 0) {
                console.log('This reg no. does not Exist!');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'This reg no. does not Exist!'
                });
            }
            else{

                ElectionPosts.updateOne({electionUniqueId: electionUniqueId, userRegNo : req.body.userRegNo}, 
                    {$set: {postName : 'voter'}}).then((resultUser) => {
                    console.log(resultUser);
                        
                    console.log('Deleted Post successfully');
                    // req.session.electionUniqueId = req.body.electionUniqueId;
                    res.redirect('electionEdit');
            
                }).catch((error) => {
                    console.log('Failed to update Election Candidate');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update Election Candidate'
                    });
                });
        }
    
        }).catch((error)=>{
            console.log('Login failed');
            res.render('login.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Incorrect username or password'
            });
        });  
    }
});

/* If you want to edit election start time */
app.post('/editStartTime', urlencodedParser,  async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {
        
        
        var electionUniqueId = req.session.electionUniqueId;
         
        var timedate = real2showDate(req.body.startTime);
        console.log("Entering Edit Start Time");
        console.log(electionUniqueId, req.body.startTime);

        Elections.updateOne({electionUniqueId: electionUniqueId}, 
            {$set: {startTime : req.body.startTime,startHour: timedate.time, startDate: timedate.date }}).then((resultUser) => {

            res.redirect('electionEdit');
    
        }).catch((error) => {
            console.log('Failed to update Election Candidate');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update Election Candidate'
            });
        });
    }

            

       
});

/* If you want to edit election end time */
app.post('/editEndTime', urlencodedParser,  async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {
        
        var electionUniqueId = req.session.electionUniqueId;
        d = electionUniqueId;
        var timedate = real2showDate(req.body.endTime);
        console.log(electionUniqueId, req.body.endTime);

        Elections.updateOne({electionUniqueId: electionUniqueId}, 
            {$set: {endTime : req.body.endTime, endHour: timedate.time, endDate: timedate.date}}).then((resultUser) => {
    
            console.log('Editted end time successfully');
            res.redirect('electionEdit');
    
        }).catch((error) => {
            console.log('Failed to update Election Candidate');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update Election Candidate'
            });
        });
    }

            

       
});


/**
 * The work of next 3 functions have been implemented differently in other functions
 * 
 */


/* No function ; If you want to see the running elections */
app.post('/runningElection', urlencodedParser,  async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        res.render('election_run', {
            myKey: req.cookies.key,
            myName: req.cookies.name,
            myProPic: req.cookies.proPicAddr,
            myCoverPic: req.cookies.proCoverPicAddr,

            myAllNotification: myAllNotification
        })
    }
});

/* No funtion:  when an election ends it redirect the results page */
app.post('/resultElection', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        res.render('election_results', {
            myKey: req.cookies.key,
            myName: req.cookies.name,
            myProPic: req.cookies.proPicAddr,
            myCoverPic: req.cookies.proCoverPicAddr,

            myAllNotification: myAllNotification
        })
    }
});


/* No Function: This funciton will redirect to the upcoming elections */
app.post('/upcomingElection', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {
        
        req.session.electionUniqueId = req.body.electionUniqueId;

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });


        if (req.body.upElection === 'details') {
            console.log("Enter into details");
            res.redirect('electionView');
           
        }
        else if (req.body.upElection === 'delete') {
            console.log("Enter into delete");
            // write your code here
        }
        else{
            console.log("Enter into edit");
            res.redirect('electionEdit');
            

            
                

            
        }

    }
});


/* ----------------------------Election page end----------------------------------------- */



/* --------------------------Index page--------------------------------------------- */
/* This function will redirect index page */
app.get('/', function (req, res) {

    if (req.cookies.key === undefined) res.render('index');
    else {
        res.redirect('home');
    }
});

/* -------------------------------------Logout page ------------------------- */
/* This function will redirect logout page */
app.get('/logout', (req, res) => {
    req.session.electionUniqueId = null;
    if (req.cookies.token === undefined) res.render('index');
    else {
        res.clearCookie('token');
        res.clearCookie('key');
        res.clearCookie('name');
        res.clearCookie('email');
        res.clearCookie('proPicAddr');
        res.clearCookie('proCoverPicAddr');
        res.clearCookie('isAdministrator');
        res.clearCookie('userType');
        res.clearCookie('userRegNo');
        
        console.log('Logout successfully');
        res.render('index');
    }
});


/*  --------------------------------------Login page ------------------------------------ */
/* This function will redirect the home page */ 
app.get('/login',function (req,res) {

    if (req.cookies.key === undefined) res.render('login');
    else {
        res.redirect('home');
    }

});

/* This function will redirect from login to home page */
app.post('/login', urlencodedParser,async function (req, res) {

    const user = {
        email: req.body.email,
        password: req.body.password
    };

    user.password = crypto.createHash('sha256').update(user.password).digest("base64");
    
    await Users.findOne({userEmail: user.email,userPassword:user.password}).then((resultUser)=>{
        res.cookie('token', resultUser.userUniqueId);
        res.cookie('key', resultUser.userUniqueId);
        res.cookie('name', resultUser.userName);
        res.cookie('email', resultUser.userEmail);
        res.cookie('proPicAddr', resultUser.userProPicAddr);
        res.cookie('proCoverPicAddr', resultUser.userCoverPicAddr);
        res.cookie('userType', resultUser.userType);
        res.cookie('isAdministrator', resultUser.isAdministrator);
        res.cookie('userRegNo', resultUser.userRegNo);

        console.log('Login successfully');

        res.redirect('home');

    }).catch((error)=>{
        console.log('Login failed');
        res.render('login.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Incorrect username or password'
        });
    });
});

/* -------------------------------------Register page----------------------------- */
function fileNewPath(oldPath, newPath) {
    return new Promise(function (resolve, reject) {
        mv(oldPath, newPath, { mkdirp: true }, function (err) {
            if (err !== undefined) {
                return reject(err);
            } else {
                return resolve();
            }
        });
    });
}

/* This function will redirect to register page if user isn't login */
app.get('/register', function (req, res) {
    // req.session.electionUniqueId = null;
    if (req.cookies.key === undefined) res.render('register');
    else {
        res.redirect('home');
    }
});
/* This function will invoke if any user compelte the register from and submitted it */
app.post('/register', dirProPic.single('myImage'), urlencodedParser, async function (req, res) {

    if (!req.file) {
        res.render('register.hbs', {
            alert_name:'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading an image!'
        });
    }


    const user = {
        key: req.body.username + req.body.email,
        name: req.body.username,
        regNo: req.body.regno,
        email: req.body.email,
        password: req.body.password
    };
    
    const batch = parseInt(user.regNo.substr(0, 4));
    if (batch >= 2016) {
        user.type = "student";
    }
    else user.type = "alumni";
    user.key = crypto.createHash('sha256').update(user.key).digest("base64");
    user.password = crypto.createHash('sha256').update(user.password).digest("base64");

    var fileName = req.file.originalname;
    var preFilePath = req.file.path.substring(4,req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
    var dateFile = "/" + Date.now() + "/" + fileName;
    var newFilePath = path.join(__dirname, './website/media/proPic/' + dateFile);
    var proFilePath = "/media/proPic" + dateFile;
    // console.log(preFilePath);
    // console.log(dateFile);
    // console.log(newFilePath);
    // console.log(proFilePath);
    await fileNewPath(preFilePath, newFilePath).then(async function(result) {
        // console.log(result);
        console.log('File path changed successfully');
        const newUser = new Users({
            userUniqueId: user.key,
            userName: user.name,
            userRegNo: user.regNo,
            userEmail: user.email,
            userPassword: user.password,
            userProPicAddr: proFilePath,
            userCoverPicAddr: '/img/indexPage/picture7.png',
            userType: user.type,
            isAdministrator : 0
        });
        await newUser.save().then(async function() {
            console.log('Your information uploaded successfully');

            await Posts.find({}).then(async function (allPostList) {
                for (let li = 0; li < allPostList.length; li++) {
                    var element = allPostList[li];

                    var likeKey = 'sustCSElifeLIKE' + li.toString() + Date.now();
                    likeKey = crypto.createHash('sha256').update(likeKey).digest("base64");

                    const newLike = new Likes({
                        likeUniqueId: likeKey,
                        originPostUniqueID: element.postUniqueId,
                        ownerLikeUniqueID: newUser.userUniqueId,
                        isLike: 'no',
                        userPhoto: newUser.userProPicAddr,
                        userName: newUser.userName
                    });
                    await newLike.save().then(async function(){
                        console.log('Like save successfully');


                    }).catch((error) => {
                        console.log('Error : Failed to save like');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to save like!'
                        });
                    });
                }

                
                await Elections.find({}).then(async function (elections) {
                    for (let li = 0; li < elections.length; li++) {
                        var election = elections[li];
                        console.log(user.regNo, election.electionName)
                        const electionPosts = new ElectionPosts({
                            electionUniqueId: election.electionUniqueId,
                            userRegNo : user.regNo,
                            electionName : election.electionName,
                            userUniqueId: user.key,
                            userName: user.name,
                            userProPicAddr: proFilePath,
                            numberOfVotes : 0,
                            postName : 'voter',
                            hasVoted : 0
                        });
            
                        await electionPosts.save().then((result2)=>{
                            console.log("Created Election Successfully");
                            
                            console.log("yayy");
                            
                        }).catch((error)=>{
                            console.log('Error : Failed to make Election');
                            res.render('home.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'We are sorry you are having trouble creating admin of your group!'
                            });
                        });



                    }
                
                }).catch((error) => {
                    console.log('Error : Failed to users');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to users!'
                    });
                });

                res.render('register.hbs', {
                    alert_name: 'success',
                    alert_msg_visibility: 'visible',
                    SorF: 'Success!',
                    status: 'Your account created successfully'
                });

                // res.redirect('myProfile');

            }).catch((error) => {
                console.log('Error : Failed to users');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to users!'
                });
            });

            
        }).catch((error) => {
            // console.log(error.errmsg);
            console.log('Error : Upload user information');
            res.render('register.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'We are sorry you are having trouble creating account!'
            });
        });

    }).catch((error) => {
        // console.log(error);
        console.log('Error : File path transfer');
        res.render('register.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading an image!'
        });
    });
});


/* --------------------------Home page------------------ */
app.get('/home', async function (req, res) {
    // req.session.electionUniqueId = null;
    if (req.cookies.key === undefined) res.render('index');
    else {
        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('ekhane');
            
            console.log(resultAllUnreadNotification.length);
            

            await Follows.find({ followerID: req.cookies.key }).then(async function(resultAllUser) {
                var allMan = []
                allMan.push(req.cookies.key);
                console.log(resultAllUser.length);
                for (var i=0;i<resultAllUser.length;i++){
                    allMan.push(resultAllUser[i].followingID);
                }
                // console.log(allMan);
                await Users.find({ userUniqueId: { $nin: allMan } }).then(async function (resultAllFreeUser) {
                    
                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId:  allGroup  }).then(async function (resultAllMyGroup) {

                            await groupRequests.find({ userUniqueId: req.cookies.key }).then(async function (resultAllRequestGroup) {

                                console.log(resultAllRequestGroup.length);
                                for (var j = 0; j < resultAllRequestGroup.length; j++) {
                                    allGroup.push(resultAllRequestGroup[j].groupUniqueId);
                                }

                                await Groups.find({ groupUniqueId: { $nin: allGroup } }).then(async function (resultAllOthersGroup) {
                                    var groupIdForPost = []
                                    console.log(resultAllGroup.length);
                                    for (var i = 0; i < resultAllGroup.length; i++) {
                                        groupIdForPost.push(resultAllGroup[i].groupUniqueId);
                                    }
                                    // collect mygroup and myfriend post only
                                    await Posts.find({ userORGroupUniqueID: groupIdForPost, isUserOrGroup:'group' }).then(async function (groupAllPostList) {
                                        await Posts.find({ userORGroupUniqueID: allMan, isUserOrGroup: 'user' }).then(async function (friendAllPostList) {
                                            var allPostList = [];
                                            for (let gr = 0; gr < groupAllPostList.length; gr++) {
                                                var element = groupAllPostList[gr];
                                                allPostList.push(element);
                                            }

                                            for (let gr = 0; gr < friendAllPostList.length; gr++) {
                                                var element = friendAllPostList[gr];
                                                allPostList.push(element);
                                            }


                                            var allMyPost_Like = [];
                                            for (let li = 0; li < allPostList.length; li++) {
                                                allMyPost_Like.push(allPostList[li].postUniqueId);
                                            }

                                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                                // console.log(allUserList);
                                                
                                                console.log('Collect all post from database')

                                                allMyComment = [];
                                                for (var k = 0; k < allPostList.length; k++) {
                                                    var obj = (allPostList[k]);
                                                    // console.log(obj);
                                                    await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                                        var obj2;
                                                        // console.log(resultPerPost);

                                                        commentLengthHigh = Math.min(5, resultPerPost.length);

                                                        for (var l = 0; l < commentLengthHigh; l++) {
                                                            obj2 = (resultPerPost[l]);
                                                            // console.log(obj2);
                                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                                // resultPerPost[j].isCommentMine='yes';
                                                                obj2.isCommentMine = 'yes';
                                                            }

                                                            allMyComment.push(obj2);
                                                        }

                                                    }).catch((error) => {
                                                        console.log('Failed to collect all comment per post');
                                                        res.render('test.hbs', {
                                                            alert_name: 'danger',
                                                            alert_msg_visibility: 'visible',
                                                            SorF: 'Failure!',
                                                            status: 'Failed to collect all comment per post'
                                                        });
                                                    });
                                                }



                                                // allPostList = allPostList.reverse();
                                                allPostList.sort((a, b) => (a.postNumber < b.postNumber) ? 1 : -1)




                                                console.log('Now in home get function');

                                                resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                                                resultAllMyGroup = resultAllMyGroup.slice(0,9);
                                                resultAllOthersGroup = resultAllOthersGroup.slice(0,11);

                                                res.render('home', {
                                                    myKey: req.cookies.key,
                                                    myName: req.cookies.name,
                                                    myProPic: req.cookies.proPicAddr,
                                                    myCoverPic: req.cookies.proCoverPicAddr,

                                                    resultAllFreeUser: resultAllFreeUser,

                                                    resultAllMyGroup: resultAllMyGroup,
                                                    lengthresultAllMyGroup: resultAllMyGroup,

                                                    resultAllOthersGroup: resultAllOthersGroup,

                                                    myAllGroupMembersList: resultAllGroup,

                                                    allMyPost: allPostList,
                                                    allMyComment: allMyComment,

                                                    resultAllLikeList: resultAllLikeList,


                                                    myAllNotification: resultAllUnreadNotification.length

                                                });

                                            }).catch((error) => {
                                                console.log('Failed to collect like list');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to collect like list'
                                                });
                                            });

                                        }).catch((error) => {
                                            console.log('Failed to collect all friend post');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect all friend post'
                                            });
                                        });
                                            
                                    }).catch((error) => {
                                        console.log('Failed to collect all group post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all group post'
                                        });
                                    });
  


                                }).catch((error) => {
                                    console.log('Failed to collect group');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect group'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to collect group');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect group'
                                });
                            });



                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });

                    

                    

                }).catch((error) => {
                    console.log('Failed to collect user');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect user'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find follow');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find follow'
                });
            });
        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
    }
});

/* -----------------------------------------Watch Videos--------------------- */
/* This function will redirect to watch lab */
app.get('/watch', async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('ekhane');

            console.log(resultAllUnreadNotification.length);


            await Follows.find({ followerID: req.cookies.key }).then(async function (resultAllUser) {
                var allMan = []
                allMan.push(req.cookies.key);
                console.log(resultAllUser.length);
                for (var i = 0; i < resultAllUser.length; i++) {
                    allMan.push(resultAllUser[i].followingID);
                }
                // console.log(allMan);
                await Users.find({ userUniqueId: { $nin: allMan } }).then(async function (resultAllFreeUser) {

                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllMyGroup) {

                            await groupRequests.find({ userUniqueId: req.cookies.key }).then(async function (resultAllRequestGroup) {

                                console.log(resultAllRequestGroup.length);
                                for (var j = 0; j < resultAllRequestGroup.length; j++) {
                                    allGroup.push(resultAllRequestGroup[j].groupUniqueId);
                                }

                                await Groups.find({ groupUniqueId: { $nin: allGroup } }).then(async function (resultAllOthersGroup) {
                                    var groupIdForPost = []
                                    console.log(resultAllGroup.length);
                                    for (var i = 0; i < resultAllGroup.length; i++) {
                                        groupIdForPost.push(resultAllGroup[i].groupUniqueId);
                                    }
                                    // collect mygroup and myfriend post only
                                    await Posts.find({ userORGroupUniqueID: groupIdForPost, isUserOrGroup: 'group', isVideoFile: 'yes'  }).then(async function (groupAllPostList) {
                                        await Posts.find({ userORGroupUniqueID: allMan, isUserOrGroup: 'user', isVideoFile: 'yes' }).then(async function (friendAllPostList) {
                                            var allPostList = [];
                                            for (let gr = 0; gr < groupAllPostList.length; gr++) {
                                                var element = groupAllPostList[gr];
                                                allPostList.push(element);
                                            }

                                            for (let gr = 0; gr < friendAllPostList.length; gr++) {
                                                var element = friendAllPostList[gr];
                                                allPostList.push(element);
                                            }


                                            var allMyPost_Like = [];
                                            for (let li = 0; li < allPostList.length; li++) {
                                                allMyPost_Like.push(allPostList[li].postUniqueId);
                                            }

                                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                                // console.log(allUserList);

                                                console.log('Collect all post from database')

                                                allMyComment = [];
                                                for (var k = 0; k < allPostList.length; k++) {
                                                    var obj = (allPostList[k]);
                                                    // console.log(obj);
                                                    await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                                        var obj2;
                                                        // console.log(resultPerPost);

                                                        commentLengthHigh = Math.min(5, resultPerPost.length);

                                                        for (var l = 0; l < commentLengthHigh; l++) {
                                                            obj2 = (resultPerPost[l]);
                                                            // console.log(obj2);
                                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                                // resultPerPost[j].isCommentMine='yes';
                                                                obj2.isCommentMine = 'yes';
                                                            }

                                                            allMyComment.push(obj2);
                                                        }

                                                    }).catch((error) => {
                                                        console.log('Failed to collect all comment per post');
                                                        res.render('test.hbs', {
                                                            alert_name: 'danger',
                                                            alert_msg_visibility: 'visible',
                                                            SorF: 'Failure!',
                                                            status: 'Failed to collect all comment per post'
                                                        });
                                                    });
                                                }



                                                // allPostList = allPostList.reverse();
                                                allPostList.sort((a, b) => (a.postNumber < b.postNumber) ? 1 : -1)




                                                console.log('Now in home get function');

                                                resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                                                resultAllMyGroup = resultAllMyGroup.slice(0, 9);
                                                resultAllOthersGroup = resultAllOthersGroup.slice(0, 12);

                                                res.render('watch', {
                                                    myKey: req.cookies.key,
                                                    myName: req.cookies.name,
                                                    myProPic: req.cookies.proPicAddr,
                                                    myCoverPic: req.cookies.proCoverPicAddr,

                                                    resultAllFreeUser: resultAllFreeUser,

                                                    resultAllMyGroup: resultAllMyGroup,
                                                    lengthresultAllMyGroup: resultAllMyGroup,

                                                    resultAllOthersGroup: resultAllOthersGroup,

                                                    myAllGroupMembersList: resultAllGroup,

                                                    allMyPost: allPostList,
                                                    allMyComment: allMyComment,

                                                    resultAllLikeList: resultAllLikeList,


                                                    myAllNotification: resultAllUnreadNotification.length

                                                });

                                            }).catch((error) => {
                                                console.log('Failed to collect like list');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to collect like list'
                                                });
                                            });

                                        }).catch((error) => {
                                            console.log('Failed to collect all friend post');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect all friend post'
                                            });
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect all group post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all group post'
                                        });
                                    });



                                }).catch((error) => {
                                    console.log('Failed to collect group');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect group'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to collect group');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect group'
                                });
                            });



                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });





                }).catch((error) => {
                    console.log('Failed to collect user');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect user'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find follow');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find follow'
                });
            });
        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
    }
});

/* ---------------------------------------- Follow Page------------------------------------- */

/* This function will invoke if any user follow/unfollow other user */
app.post('/followSetting', urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });


    var friendUserKey = req.body.friendKeyValue;

    console.log(req.body.iAmFollowBtn);
    console.log(friendUserKey);
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;
    

    if(req.body.iAmFollowBtn==='iWantToFollow'){

        var notificationKey = 'sustCSElifeNotify' + Date.now();
        notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");
        


        var newNotification = new Notifications({
            notifyUniqueId: notificationKey,
            notifyWhom: friendUserKey,
            notifyLink: req.cookies.key,
            notifyLinkGroup: req.cookies.key,
            notifyUserUniqueID: req.cookies.key,
            notifyUserPhoto: req.cookies.proPicAddr,
            notifyUserName: req.cookies.name,
            notifyTime: dateTime,
            notifyText: 'started following you',
            isFollow: 'yes',
            isLike: 'no',
            isComment: 'no',
            isGroup: 'no',
            notifyListColor: 'ipPeopleList3'
        });

        await newNotification.save().then(async function(resultNotify){
            
            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);

                    await Users.findOne({ userUniqueId: friendUserKey }).then(async function (resultUser) {

                        await Posts.find({ userORGroupUniqueID: friendUserKey, isUserOrGroup: 'user' }).then(async function (allUserList) {
                            console.log('Collect all post from database')
                            var allMyPost = allUserList;

                            var allMyPost_Like = [];
                            for (let li = 0; li < allMyPost.length; li++) {
                                allMyPost_Like.push(allMyPost[li].postUniqueId);
                            }

                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {



                                allMyComment = [];
                                for (var i = 0; i < allMyPost.length; i++) {
                                    var obj = (allMyPost[i]);
                                    // console.log(obj);
                                    await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                        var obj2;
                                        // console.log(resultPerPost);

                                        commentLengthHigh = Math.min(5, resultPerPost.length);

                                        for (var j = 0; j < commentLengthHigh; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });
                                }
                                const newFollow = new Follows({
                                    followingID: resultUser.userUniqueId,
                                    followingName: resultUser.userName,
                                    followingProPic: resultUser.userProPicAddr,
                                    followerID: req.cookies.key,
                                    followerName: req.cookies.name,
                                    followerProPic: req.cookies.proPicAddr
                                });

                                console.log('new follow complete');
                                console.log(resultUser.userUniqueId);
                                console.log(resultUser.userName);
                                console.log(resultUser.userProPicAddr);

                                await newFollow.save().then(async function (result) {
                                    await Follows.find({ followerID: friendUserKey }).then(async function (resultFollower) {

                                        await Follows.find({ followingID: friendUserKey }).then(async function (resultFollowing) {
                                            await Follows.find({ followerID: req.cookies.key, followingID: resultUser.userUniqueId }).then((resultFollow) => {

                                                // console.log(resultFollow);
                                                var followBtnText = 'Follow';
                                                var followBtnValue = 'iWantToFollow';
                                                if (resultFollow.length != 0) {
                                                    followBtnText = 'Following';
                                                    followBtnValue = 'iAlreadyFollow';
                                                }

                                                allMyPost = allMyPost.reverse();

                                                res.render('friendProfile', {
                                                    myKey: req.cookies.key,
                                                    myName: req.cookies.name,
                                                    myProPic: req.cookies.proPicAddr,
                                                    myCoverPic: req.cookies.proCoverPicAddr,

                                                    resultUser: resultUser,
                                                    followBtnText: "Following",
                                                    followBtnValue: "iAlreadyFollow",
                                                    sumAllPost: allMyPost.length,
                                                    sumAllFollower: resultFollower.length,
                                                    sumAllFollowing: resultFollowing.length,

                                                    allMyPost: allMyPost,
                                                    allMyComment: allMyComment,

                                                    resultAllLikeList: resultAllLikeList,

                                                    resultAllFreeGroup: resultAllFreeGroup,

                                                    myAllNotification: myAllNotification

                                                })
                                            }).catch((error) => {
                                                console.log('Failed to find follow');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to find follow'
                                                });
                                            });
                                        }).catch((error) => {
                                            console.log('Failed to find follow');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to find follow'
                                            });
                                        });


                                    }).catch((error) => {
                                        console.log('Failed to find follow');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to find follow'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Failed to save follow');
                                    console.log(error);
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to save follow'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Failed to collect like list');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect like list'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to collect all post');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect all post'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to collect one user information');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one user information'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });
        }).catch((error) => {
            console.log('Failed to save notification');
            console.log(error);
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save notification'
            });
        });



    }
    else if (req.body.iAmFollowBtn === 'iAlreadyFollow'){

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);

                await Users.findOne({ userUniqueId: friendUserKey }).then(async function (resultUser) {
                    await Follows.findOneAndDelete({ followerID: req.cookies.key, followingID: resultUser.userUniqueId }).then(async function (resultFollow) {

                        await Follows.find({ followerID: friendUserKey }).then(async function (resultFollower) {

                            await Follows.find({ followingID: friendUserKey }).then(async function (resultFollowing) {


                                    await Posts.find({ userORGroupUniqueID: friendUserKey, isUserOrGroup: 'user' }).then(async function (allUserList) {
                                        console.log('Collect all post from database')
                                        var allMyPost = allUserList;
                                        var allMyPost_Like = [];
                                        for (let li = 0; li < allMyPost.length; li++) {
                                            allMyPost_Like.push(allMyPost[li].postUniqueId);
                                        }

                                        await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {

                                            allMyComment = [];
                                            for (var i = 0; i < allMyPost.length; i++) {
                                                var obj = (allMyPost[i]);
                                                // console.log(obj);
                                                await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                                    var obj2;
                                                    // console.log(resultPerPost);

                                                    commentLengthHigh = Math.min(5, resultPerPost.length);

                                                    for (var j = 0; j < commentLengthHigh; j++) {
                                                        obj2 = (resultPerPost[j]);
                                                        // console.log(obj2);
                                                        if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                            // resultPerPost[j].isCommentMine='yes';
                                                            obj2.isCommentMine = 'yes';
                                                        }

                                                        allMyComment.push(obj2);
                                                    }

                                                }).catch((error) => {
                                                    console.log('Failed to collect all comment per post');
                                                    res.render('test.hbs', {
                                                        alert_name: 'danger',
                                                        alert_msg_visibility: 'visible',
                                                        SorF: 'Failure!',
                                                        status: 'Failed to collect all comment per post'
                                                    });
                                                });
                                            }



                                            await Follows.find({ followerID: req.cookies.key, followingID: resultUser.userUniqueId }).then((resultFollow) => {


                                                // console.log(resultFollow);
                                                var followBtnText = 'Follow';
                                                var followBtnValue = 'iWantToFollow';
                                                if (resultFollow.length != 0) {
                                                    followBtnText = 'Following';
                                                    followBtnValue = 'iAlreadyFollow';
                                                }




                                                allMyPost = allMyPost.reverse();




                                                res.render('friendProfile', {
                                                    myKey: req.cookies.key,
                                                    myName: req.cookies.name,
                                                    myProPic: req.cookies.proPicAddr,
                                                    myCoverPic: req.cookies.proCoverPicAddr,

                                                    resultUser: resultUser,
                                                    followBtnText: "Follow",
                                                    followBtnValue: "iWantToFollow",
                                                    sumAllPost: allMyPost.length,
                                                    sumAllFollower: resultFollower.length,
                                                    sumAllFollowing: resultFollowing.length,

                                                    allMyPost: allMyPost,
                                                    allMyComment: allMyComment,

                                                    resultAllLikeList: resultAllLikeList, 

                                                    resultAllFreeGroup: resultAllFreeGroup,
                                                    myAllNotification: myAllNotification

                                                })
                                            }).catch((error) => {
                                                console.log('Failed to find follow');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to find follow'
                                                });
                                            });
                                        }).catch((error) => {
                                            console.log('Failed to collect like list');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect like list'
                                            });
                                        });



                                    }).catch((error) => {
                                        console.log('Failed to collect all post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all post'
                                        });
                                    });

                                }).catch((error) => {
                                            console.log('Failed to find follow');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to find follow'
                                            });
                                        });
                            }).catch((error) => {
                                console.log('Failed to find follow');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to find follow'
                                });
                            });


                        }).catch((error) => {
                            console.log('Failed to find follow');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to find follow'
                            });
                        });
                    
                }).catch((error) => {
                    console.log('Failed to collect one user information');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect one user information'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
        

    }
    else if (req.body.iAmFollowBtn === 'iWantToFollowPeople'){

        var notificationKey = 'sustCSElifeNotify' + Date.now();
        notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");

        var newNotification = new Notifications({
            notifyUniqueId: notificationKey,
            notifyWhom: friendUserKey,
            notifyLink: req.cookies.key,
            notifyLinkGroup: req.cookies.key,
            notifyUserUniqueID: req.cookies.key,
            notifyUserPhoto: req.cookies.proPicAddr,
            notifyUserName: req.cookies.name,
            notifyTime: dateTime,
            notifyText: 'started following you',
            isFollow: 'yes',
            isLike: 'no',
            isComment: 'no',
            isGroup: 'no',
            notifyListColor: 'ipPeopleList3'
        });

        await newNotification.save().then(async function (resultNotify) {

            var friendKeyValue = friendUserKey;
            await Users.findOne({ userUniqueId: friendKeyValue }).then(async function (resultUser) {
                const newFollow = new Follows({
                    followingID: resultUser.userUniqueId,
                    followingName: resultUser.userName,
                    followingProPic: resultUser.userProPicAddr,
                    followerID: req.cookies.key,
                    followerName: req.cookies.name,
                    followerProPic: req.cookies.proPicAddr
                });

                console.log('new follow complete');
                // console.log(resultUser.userUniqueId);
                // console.log(resultUser.userName);
                // console.log(resultUser.userProPicAddr);

                await newFollow.save().then(async function (result) {
                    console.log('save hoitese');
                    await Follows.find({ followerID: req.cookies.key }).then(async function (resultAllUser) {
                        
                        var allMan = []
                        allMan.push(req.cookies.key);
                        console.log(resultAllUser.length);
                        for (var i = 0; i < resultAllUser.length; i++) {
                            allMan.push(resultAllUser[i].followingID);
                        }

                        console.log(allMan);
                        await Users.find({ userUniqueId: { $nin: allMan } }).then(async function (resultAllFreeUser) {
                            // console.log(resultAllUser);
                            // await Follows.find({followingID: { $nin}})

                            // console.log(resultAllFreeUser);
                            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                                var allGroup = []
                                console.log(resultAllGroup.length);
                                for (var i = 0; i < resultAllGroup.length; i++) {
                                    allGroup.push(resultAllGroup[i].groupUniqueId);
                                }
                                // console.log(allMan);
                                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                                    console.log('Now in home get function');
                                    res.render('peoples', {
                                        myKey: req.cookies.key,
                                        myName: req.cookies.name,
                                        myProPic: req.cookies.proPicAddr,
                                        resultAllFreeUser: resultAllFreeUser,
                                        resultAllFreeGroup: resultAllFreeGroup,
                                        myAllNotification: myAllNotification

                                    });
                                }).catch((error) => {
                                    console.log('Failed to collect group');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect group'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to find group members');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to find group members'
                                });
                            });



                        }).catch((error) => {
                            console.log('Login failed');
                            res.render('login.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Incorrect username or password'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find follow');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find follow'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to save follow');
                    console.log(error);
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save follow'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect one user information');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect one user information'
                });
            });
        }).catch((error) => {
            console.log('Failed to save notification');
            console.log(error);
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save notification'
            });
        });
    }
});

/* This function will invoke anyone follow or unfollow from search page */
app.post('/searchFollowSetting', urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    var friendUserKey = req.body.friendKeyValue;

    console.log(req.body.iAmFollowBtn);
    console.log(friendUserKey);

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;


    if (req.body.iAmFollowBtn === 'Following') {
        await Follows.findOneAndDelete({ followerID: req.cookies.key, followingID: friendUserKey }).then(async function (resultFollow) {

            var searchText = req.body.Search;

            searchText = ".*" + searchText + "*.";

            await Users.find({ userName: { "$regex": searchText, "$options": "i" } }).then(async function (searchResultUsers) {

                await Groups.find({ groupName: { "$regex": searchText, "$options": "i" } }).then(async function (searchResultGroups) {

                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllMyGroup) {
                            resultAllMyGroup = resultAllMyGroup.slice(0, 10);

                            // For Groups Section
                            newSearchResultGroups = []

                            for (var index = 0; index < searchResultGroups.length; index++) {
                                var element = searchResultGroups[index];

                                var newElement = {}
                                newElement.groupUniqueId = element.groupUniqueId;
                                newElement.groupName = element.groupName;
                                newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                                newElement.presentCondition = 'Join';

                                await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {

                                    if (resultIsPositive.length == 1) {
                                        newElement.presentCondition = 'Request sent';
                                        newSearchResultGroups.push(newElement);
                                    }
                                    else {
                                        await groupMembers.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive2) {

                                            if (resultIsPositive2.length == 1) {
                                                newElement.presentCondition = 'Enter';
                                                newSearchResultGroups.push(newElement);
                                            }
                                            else {
                                                newElement.presentCondition = 'Join';
                                                newSearchResultGroups.push(newElement);
                                            }

                                        }).catch((error) => {
                                            console.log('Failed to check is request sent or not');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to check is request sent or not'
                                            });
                                        });
                                    }

                                }).catch((error) => {
                                    console.log('Failed to check is request sent or not');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to check is request sent or not'
                                    });
                                });
                            }

                            // For User Section
                            newSearchResultUsers = []
                            for (var index = 0; index < searchResultUsers.length; index++) {
                                var element = searchResultUsers[index];

                                var newElement = {}
                                newElement.userUniqueId = element.userUniqueId;
                                newElement.userName = element.userName;
                                newElement.userEmail = element.userEmail;
                                newElement.userProPicAddr = element.userProPicAddr;
                                newElement.userCoverPicAddr = element.userCoverPicAddr;
                                newElement.presentCondition = 'Follow';

                                await Follows.find({ followingID: element.userUniqueId, followerID: req.cookies.key }).then(async function (resultIsPositive) {

                                    if (resultIsPositive.length == 1) {
                                        newElement.presentCondition = 'Following';
                                        newSearchResultUsers.push(newElement);
                                    }
                                    else {
                                        newElement.presentCondition = 'Follow';
                                        newSearchResultUsers.push(newElement);
                                    }

                                }).catch((error) => {
                                    console.log('Failed to check is follow or not');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to check is follow or not'
                                    });
                                });
                            }

                            res.render('navBarSearchResults', {
                                myKey: req.cookies.key,
                                myName: req.cookies.name,
                                myProPic: req.cookies.proPicAddr,
                                myCoverPic: req.cookies.proCoverPicAddr,

                                resultAllFreeGroup: resultAllMyGroup,

                                searchText: searchText,

                                searchResultUsers: newSearchResultUsers,
                                searchResultGroups: newSearchResultGroups,
                                myAllNotification: myAllNotification
                            });

                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to search word');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to search word'
                    });
                });


            }).catch((error) => {
                console.log('Failed to search word');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to search word'
                });
            });

        }).catch((error) => {
            console.log('Failed to delete follow');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to delete follow'
            });
        });


    }
    else if (req.body.iAmFollowBtn === 'Follow') {

        var notificationKey = 'sustCSElifeNotify' + Date.now();
        notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");

        var newNotification = new Notifications({
            notifyUniqueId: notificationKey,
            notifyWhom: friendUserKey,
            notifyLink: req.cookies.key,
            notifyLinkGroup: req.cookies.key,
            notifyUserUniqueID: req.cookies.key,
            notifyUserPhoto: req.cookies.proPicAddr,
            notifyUserName: req.cookies.name,
            notifyTime: dateTime,
            notifyText: 'started following you',
            isFollow: 'yes',
            isLike: 'no',
            isComment: 'no',
            isGroup: 'no',
            notifyListColor: 'ipPeopleList3'
        });

        await newNotification.save().then(async function (resultNotify) {

            var friendKeyValue = friendUserKey;
            await Users.findOne({ userUniqueId: friendKeyValue }).then(async function (resultUser) {
                const newFollow = new Follows({
                    followingID: resultUser.userUniqueId,
                    followingName: resultUser.userName,
                    followingProPic: resultUser.userProPicAddr,
                    followerID: req.cookies.key,
                    followerName: req.cookies.name,
                    followerProPic: req.cookies.proPicAddr
                });

                console.log('new follow complete');
                // console.log(resultUser.userUniqueId);
                // console.log(resultUser.userName);
                // console.log(resultUser.userProPicAddr);

                await newFollow.save().then(async function (result) {
                    console.log('save hoitese');
                
                    var searchText = req.body.Search;

                    searchText = ".*" + searchText + "*.";

                    await Users.find({ userName: { "$regex": searchText, "$options": "i" } }).then(async function (searchResultUsers) {

                        await Groups.find({ groupName: { "$regex": searchText, "$options": "i" } }).then(async function (searchResultGroups) {

                            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                                var allGroup = []
                                console.log(resultAllGroup.length);
                                for (var i = 0; i < resultAllGroup.length; i++) {
                                    allGroup.push(resultAllGroup[i].groupUniqueId);
                                }
                                // console.log(allMan);
                                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllMyGroup) {
                                    resultAllMyGroup = resultAllMyGroup.slice(0, 10);

                                    // For Groups Section
                                    newSearchResultGroups = []

                                    for (var index = 0; index < searchResultGroups.length; index++) {
                                        var element = searchResultGroups[index];

                                        var newElement = {}
                                        newElement.groupUniqueId = element.groupUniqueId;
                                        newElement.groupName = element.groupName;
                                        newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                                        newElement.presentCondition = 'Join';

                                        await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {

                                            if (resultIsPositive.length == 1) {
                                                newElement.presentCondition = 'Request sent';
                                                newSearchResultGroups.push(newElement);
                                            }
                                            else {
                                                await groupMembers.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive2) {

                                                    if (resultIsPositive2.length == 1) {
                                                        newElement.presentCondition = 'Enter';
                                                        newSearchResultGroups.push(newElement);
                                                    }
                                                    else {
                                                        newElement.presentCondition = 'Join';
                                                        newSearchResultGroups.push(newElement);
                                                    }

                                                }).catch((error) => {
                                                    console.log('Failed to check is request sent or not');
                                                    res.render('test.hbs', {
                                                        alert_name: 'danger',
                                                        alert_msg_visibility: 'visible',
                                                        SorF: 'Failure!',
                                                        status: 'Failed to check is request sent or not'
                                                    });
                                                });
                                            }

                                        }).catch((error) => {
                                            console.log('Failed to check is request sent or not');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to check is request sent or not'
                                            });
                                        });
                                    }

                                    // For User Section
                                    newSearchResultUsers = []
                                    for (var index = 0; index < searchResultUsers.length; index++) {
                                        var element = searchResultUsers[index];

                                        var newElement = {}
                                        newElement.userUniqueId = element.userUniqueId;
                                        newElement.userName = element.userName;
                                        newElement.userEmail = element.userEmail;
                                        newElement.userProPicAddr = element.userProPicAddr;
                                        newElement.userCoverPicAddr = element.userCoverPicAddr;
                                        newElement.presentCondition = 'Follow';

                                        await Follows.find({ followingID: element.userUniqueId, followerID: req.cookies.key }).then(async function (resultIsPositive) {

                                            if (resultIsPositive.length == 1) {
                                                newElement.presentCondition = 'Following';
                                                newSearchResultUsers.push(newElement);
                                            }
                                            else {
                                                newElement.presentCondition = 'Follow';
                                                newSearchResultUsers.push(newElement);
                                            }

                                        }).catch((error) => {
                                            console.log('Failed to check is follow or not');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to check is follow or not'
                                            });
                                        });
                                    }

                                    res.render('navBarSearchResults', {
                                        myKey: req.cookies.key,
                                        myName: req.cookies.name,
                                        myProPic: req.cookies.proPicAddr,
                                        myCoverPic: req.cookies.proCoverPicAddr,

                                        resultAllFreeGroup: resultAllMyGroup,

                                        searchText: searchText,

                                        searchResultUsers: newSearchResultUsers,
                                        searchResultGroups: newSearchResultGroups,
                                        myAllNotification: myAllNotification
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect group');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect group'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to find group members');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to find group members'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to search word');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to search word'
                            });
                        });


                    }).catch((error) => {
                        console.log('Failed to search word');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to search word'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to save follow');
                    console.log(error);
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save follow'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect one user information');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect one user information'
                });
            });
        }).catch((error) => {
            console.log('Failed to save notification');
            console.log(error);
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save notification'
            });
        });
    }
});



/* ------------------------------ Start Group -------------------------- */


/* This function will invoke if you create a group */

app.post('/createGroup', dirCoverPic.single('myImage'), urlencodedParser, async function (req, res) {

    


    if (!req.file) {
        res.render('test.hbs', {
            alert_name:'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading a group cover!'
        });
    }

    const group = {
        key: req.body.username + Date.now(),
        name: req.body.username
    };
    group.key = crypto.createHash('sha256').update(group.key).digest("base64");

    var fileName = req.file.originalname;
    var preFilePath = req.file.path.substring(4,req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
    var dateFile = "/" + Date.now() + "/" + fileName;
    var newFilePath = path.join(__dirname, './website/media/coverPic/' + dateFile);
    var proFilePath = "/media/coverPic" + dateFile;

    await fileNewPath(preFilePath, newFilePath).then(async function(result) {
        // console.log(result);
        console.log('File path changed successfully');
        const newGroup = new Groups({
            groupUniqueId: group.key,
            groupName: group.name,
            groupCoverPicAddr: proFilePath
        });

        await newGroup.save().then(async function(result) {
            console.log('Your group created successfully');

            const newGroupMember = new groupMembers({
                groupUniqueId: group.key,
                userUniqueId: req.cookies.key,
                userName: req.cookies.name,
                userPicAddr: req.cookies.proPicAddr,
                isAdmin: 'yes'
            });

            await newGroupMember.save().then((result2)=>{
                groupRegNo = group.key;
                res.redirect('viewAGroup');
                
            }).catch((error)=>{
                console.log('Error : Failed to make admin');
                res.render('home.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'We are sorry you are having trouble creating admin of your group!'
                });
            });
            
        }).catch((error) => {
            // console.log(error);
            // console.log(error.errmsg);
            console.log('Error : Failed to create a group');
            res.render('home.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'We are sorry you are having trouble creating a group!'
            });
        });

    }).catch((error) => {
        // console.log(error);
        console.log('Error : File path transfer');
        res.render('register.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading an image!'
        });
    });
});

/* This function will redirect an group */
app.get('/viewAGroup', async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    var groupKeyValue = groupRegNo;

    // console.log(groupKeyValue);

    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
        var allGroup = []
        console.log(resultAllGroup.length);
        for (var i = 0; i < resultAllGroup.length; i++) {
            allGroup.push(resultAllGroup[i].groupUniqueId);
        }
        // console.log(allMan);
        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {


            await Groups.findOne({ groupUniqueId: groupKeyValue }).then(async function (okGroup) {
                await groupMembers.find({ groupUniqueId: groupKeyValue, isAdmin: "yes" }).then(async function (allAdmin) {
                    await groupMembers.find({ groupUniqueId: groupKeyValue, isAdmin: "no" }).then(async function (allMember) {
                        await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {
                            await groupRequests.find({ groupUniqueId: groupKeyValue }).then(async function (allMemberRequest) {

                                console.log('Now in home get function');
                                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);

                                await Posts.find({ userORGroupUniqueID: groupKeyValue, isUserOrGroup: 'group' }).then(async function (allPostList) {
                                    // console.log(allUserList);
                                    console.log('Collect all post from database')
                                    var allPostFromThisGroup = allPostList;

                                    var allMyPost_Like = [];
                                    for (let li = 0; li < allPostFromThisGroup.length; li++) {
                                        allMyPost_Like.push(allPostFromThisGroup[li].postUniqueId);
                                    }

                                    await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                        allMyComment = [];
                                        for (var i = 0; i < allPostFromThisGroup.length; i++) {
                                            var obj = (allPostFromThisGroup[i]);
                                            // console.log(obj);
                                            await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                                var obj2;
                                                // console.log(resultPerPost);

                                                commentLengthHigh = Math.min(5, resultPerPost.length);

                                                for (var j = 0; j < commentLengthHigh; j++) {
                                                    obj2 = (resultPerPost[j]);
                                                    // console.log(obj2);
                                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                        // resultPerPost[j].isCommentMine='yes';
                                                        obj2.isCommentMine = 'yes';
                                                    }

                                                    allMyComment.push(obj2);
                                                }


                                            }).catch((error) => {
                                                console.log('Failed to collect all comment per post');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to collect all comment per post'
                                                });
                                            });
                                        }

                                        allPostFromThisGroup = allPostFromThisGroup.reverse();

                                        // console.log(allPostFromThisGroup);


                                        res.render('groupProfile.hbs', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,

                                            singleGroupKey: okGroup.groupUniqueId,
                                            singleGroupName: okGroup.groupName,
                                            singleGroupCoverPicAddr: okGroup.groupCoverPicAddr,

                                            youKnowWho: youKnowWho,

                                            allMemberRequest: allMemberRequest,

                                            allAdmin: allAdmin,
                                            allMember: allMember,


                                            resultAllFreeGroup: resultAllFreeGroup,

                                            sumAllPost: allPostFromThisGroup.length,
                                            sumAllMember: allAdmin.length + allMember.length,
                                            allPostFromThisGroup: allPostFromThisGroup,
                                            allMyComment: allMyComment,
                                            resultAllLikeList: resultAllLikeList,

                                            myAllNotification: myAllNotification
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect like list');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect like list'
                                        });
                                    });


                                }).catch((error) => {
                                    console.log('Failed to collect all post');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect all post'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to collect groupMembers information');
                                console.log(error);
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect groupMembers information'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to collect my information');
                            console.log(error);
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect my information'
                            });
                        });


                    }).catch((error) => {
                        console.log('Failed to collect groupMembers information');
                        console.log(error);
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect groupMembers information'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect groupAdmins information');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect groupAdmins information'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect one user information');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect one user information'
                });
            });


        }).catch((error) => {
            console.log('Failed to collect group');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to collect group'
            });
        });

    }).catch((error) => {
        console.log('Failed to find group members');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find group members'
        });
    });


});

/* This function will invoke when user wants to view a group */

app.post('/viewAGroup', async function (req, res) {

    if(req.cookies.token === undefined){
        res.redirect('index');
    }
    else{
        groupRegNo = req.body.groupKeyValue;
        res.redirect('viewAGroup');

    }

    // don't delete below code

    // var groupKeyValue = req.body.groupKeyValue;

    // // console.log(groupKeyValue);

    // await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
    //     var allGroup = []
    //     console.log(resultAllGroup.length);
    //     for (var i = 0; i < resultAllGroup.length; i++) {
    //         allGroup.push(resultAllGroup[i].groupUniqueId);
    //     }
    //     // console.log(allMan);
    //     await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {


    //         await Groups.findOne({ groupUniqueId: groupKeyValue }).then(async function (okGroup) {
    //             await groupMembers.find({ groupUniqueId: groupKeyValue, isAdmin: "yes" }).then(async function (allAdmin) {
    //                 await groupMembers.find({ groupUniqueId: groupKeyValue, isAdmin: "no" }).then(async function (allMember) {
    //                     await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {
    //                         await groupRequests.find({ groupUniqueId: groupKeyValue }).then(async function (allMemberRequest) {
                                
    //                             console.log('Now in home get function');
    //                             resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);

    //                             await Posts.find({ userORGroupUniqueID: groupKeyValue, isUserOrGroup: 'group' }).then(async function (allPostList) {
    //                                 // console.log(allUserList);
    //                                 console.log('Collect all post from database')
    //                                 var allPostFromThisGroup = allPostList;
                                    
    //                                 var allMyPost_Like = [];
    //                                 for (let li = 0; li < allPostFromThisGroup.length; li++) {
    //                                     allMyPost_Like.push(allPostFromThisGroup[li].postUniqueId);
    //                                 }

    //                                 await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


    //                                     allMyComment = [];
    //                                     for (var i = 0; i < allPostFromThisGroup.length; i++) {
    //                                         var obj = (allPostFromThisGroup[i]);
    //                                         // console.log(obj);
    //                                         await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
    //                                             var obj2;
    //                                             // console.log(resultPerPost);

    //                                             commentLengthHigh = Math.min(5, resultPerPost.length);

    //                                             for (var j = 0; j < commentLengthHigh; j++) {
    //                                                 obj2 = (resultPerPost[j]);
    //                                                 // console.log(obj2);
    //                                                 if (obj2.ownerCommentUniqueID === req.cookies.key) {
    //                                                     // resultPerPost[j].isCommentMine='yes';
    //                                                     obj2.isCommentMine = 'yes';
    //                                                 }

    //                                                 allMyComment.push(obj2);
    //                                             }


    //                                         }).catch((error) => {
    //                                             console.log('Failed to collect all comment per post');
    //                                             res.render('test.hbs', {
    //                                                 alert_name: 'danger',
    //                                                 alert_msg_visibility: 'visible',
    //                                                 SorF: 'Failure!',
    //                                                 status: 'Failed to collect all comment per post'
    //                                             });
    //                                         });
    //                                     }

    //                                     allPostFromThisGroup = allPostFromThisGroup.reverse();

    //                                     // console.log(allPostFromThisGroup);
                                        

    //                                     res.render('groupProfile.hbs', {
    //                                         myKey: req.cookies.key,
    //                                         myName: req.cookies.name,
    //                                         myProPic: req.cookies.proPicAddr,
    //                                         myCoverPic: req.cookies.proCoverPicAddr,

    //                                         singleGroupKey: okGroup.groupUniqueId,
    //                                         singleGroupName: okGroup.groupName,
    //                                         singleGroupCoverPicAddr: okGroup.groupCoverPicAddr,

    //                                         youKnowWho: youKnowWho,

    //                                         allMemberRequest: allMemberRequest,

    //                                         allAdmin: allAdmin,
    //                                         allMember: allMember,


    //                                         resultAllFreeGroup: resultAllFreeGroup,

    //                                         sumAllPost: allPostFromThisGroup.length,
    //                                         sumAllMember: allAdmin.length + allMember.length,
    //                                         allPostFromThisGroup: allPostFromThisGroup,
    //                                         allMyComment: allMyComment,
    //                                         resultAllLikeList: resultAllLikeList
    //                                     });
                                    
    //                                 }).catch((error) => {
    //                                     console.log('Failed to collect like list');
    //                                     res.render('test.hbs', {
    //                                         alert_name: 'danger',
    //                                         alert_msg_visibility: 'visible',
    //                                         SorF: 'Failure!',
    //                                         status: 'Failed to collect like list'
    //                                     });
    //                                 });

    //                             }).catch((error) => {
    //                                 console.log('Failed to collect all post');
    //                                 res.render('test.hbs', {
    //                                     alert_name: 'danger',
    //                                     alert_msg_visibility: 'visible',
    //                                     SorF: 'Failure!',
    //                                     status: 'Failed to collect all post'
    //                                 });
    //                             });

    //                         }).catch((error) => {
    //                             console.log('Failed to collect groupMembers information');
    //                             console.log(error);
    //                             res.render('test.hbs', {
    //                                 alert_name: 'danger',
    //                                 alert_msg_visibility: 'visible',
    //                                 SorF: 'Failure!',
    //                                 status: 'Failed to collect groupMembers information'
    //                             });
    //                         });

    //                     }).catch((error) => {
    //                         console.log('Failed to collect my information');
    //                         console.log(error);
    //                         res.render('test.hbs', {
    //                             alert_name: 'danger',
    //                             alert_msg_visibility: 'visible',
    //                             SorF: 'Failure!',
    //                             status: 'Failed to collect my information'
    //                         });
    //                     });


    //                 }).catch((error) => {
    //                     console.log('Failed to collect groupMembers information');
    //                     console.log(error);
    //                     res.render('test.hbs', {
    //                         alert_name: 'danger',
    //                         alert_msg_visibility: 'visible',
    //                         SorF: 'Failure!',
    //                         status: 'Failed to collect groupMembers information'
    //                     });
    //                 });
    //             }).catch((error) => {
    //                 console.log('Failed to collect groupAdmins information');
    //                 res.render('test.hbs', {
    //                     alert_name: 'danger',
    //                     alert_msg_visibility: 'visible',
    //                     SorF: 'Failure!',
    //                     status: 'Failed to collect groupAdmins information'
    //                 });
    //             });
    //         }).catch((error) => {
    //             console.log('Failed to collect one user information');
    //             res.render('test.hbs', {
    //                 alert_name: 'danger',
    //                 alert_msg_visibility: 'visible',
    //                 SorF: 'Failure!',
    //                 status: 'Failed to collect one user information'
    //             });
    //         });
        

    //     }).catch((error) => {
    //         console.log('Failed to collect group');
    //         res.render('test.hbs', {
    //             alert_name: 'danger',
    //             alert_msg_visibility: 'visible',
    //             SorF: 'Failure!',
    //             status: 'Failed to collect group'
    //         });
    //     });

    // }).catch((error) => {
    //     console.log('Failed to find group members');
    //     res.render('test.hbs', {
    //         alert_name: 'danger',
    //         alert_msg_visibility: 'visible',
    //         SorF: 'Failure!',
    //         status: 'Failed to find group members'
    //     });
    // });


});



/* This function will handle group reguest */
app.post('/groupRequestHandler', urlencodedParser, async function (req, res) {

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;  

    var groupKeyValue = req.body.groupKey;
    var userKeyValue = req.body.userRequestKey;
    var clickBtn = req.body.status;
    
    console.log(clickBtn);
    if (clickBtn === 'rejected') {

        await groupRequests.findOneAndDelete({ groupUniqueId: groupKeyValue, userUniqueId: userKeyValue }).then(async function () {

            groupRegNo = groupKeyValue;
            res.redirect('viewAGroup');

        }).catch((error) => {
            console.log('Failed to delete request');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to delete request'
            });
        });

    }
    else{
        await Users.findOne({ userUniqueId: userKeyValue }).then(async function(resultUser) {
            console.log('new user found successfully');
            const newGroupMember = new groupMembers({

                    groupUniqueId: groupKeyValue,
                    userUniqueId: resultUser.userUniqueId,
                    userName: resultUser.userName,
                    userPicAddr: resultUser.userProPicAddr,
                    isAdmin: 'no'
            });

            await newGroupMember.save().then(async function(result2){

                console.log('save user into this group');

                await groupRequests.findOneAndDelete({groupUniqueId: groupKeyValue, userUniqueId: userKeyValue}).then(async function (demo2){
                    console.log('delete successfull');
                    await Groups.findOne({ groupUniqueId: groupKeyValue }).then(async function (oneGroupInfo) {
                        var notificationKey = 'sustCSElifeNotify' + Date.now();
                        notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");

                        var newNotification = new Notifications({
                            notifyUniqueId: notificationKey,
                            notifyWhom: userKeyValue,
                            notifyLink: groupKeyValue,
                            notifyLinkGroup: groupKeyValue,
                            notifyUserUniqueID: req.cookies.key,
                            notifyUserPhoto: oneGroupInfo.groupCoverPicAddr,
                            notifyUserName: oneGroupInfo.groupName,
                            notifyTime: dateTime,
                            notifyText: 'approved your request',
                            isFollow: 'no',
                            isLike: 'no',
                            isComment: 'no',
                            isGroup: 'yes',
                            notifyListColor: 'ipPeopleList3'
                        });
                        
                        await newNotification.save().then(async function (resultNotify) {
                            console.log('Notification sent successfully');
                            groupRegNo = groupKeyValue;
                            res.redirect('viewAGroup');

                        }).catch((error) => {
                            console.log('Failed to save notification');
                            // console.log(error);
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to save notification'
                            });
                        });
                    }).catch((error) => {
                        console.log('Failed to find group info');
                        // console.log(error);
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group info'
                        });
                    });

                }).catch((error) => {
                        console.log('Failed to delete request');
                        console.log(error);
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to delete request'
                        });
                });

                

            }).catch((error)=>{
                console.log('Error : Failed to accept new user');
                res.render('home.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Error : Failed to accept new user'
                });
            });

        }).catch((error) => {
            console.log('Failed to collect one user information');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to collect one user information'
            });
        });
    }

});

/* This function will handle group comment uploading functionalities */
app.post('/groupCommentUpload', urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    console.log('group theke comment kora hoise');

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
        commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;
    
    var eachPostUniqueID = req.body.eachPostUniqueID;
    var groupKeyValue = req.body.groupUniqueID;
    console.log(eachPostUniqueID);
    console.log(groupKeyValue);

    await Groups.findOne({ groupUniqueId: groupKeyValue }).then(async function (oneGroupInfo) {

        await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (onePostInfo) {

            var notificationKey = 'sustCSElifeNotify' + Date.now();
            notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");

            if(onePostInfo.postOwnerUniqueID != req.cookies.key){
                var newNotification = new Notifications({
                    notifyUniqueId: notificationKey,
                    notifyWhom: onePostInfo.postOwnerUniqueID,
                    notifyLink: eachPostUniqueID,
                    notifyLinkGroup: groupKeyValue,
                    notifyUserUniqueID: req.cookies.key,
                    notifyUserPhoto: req.cookies.proPicAddr,
                    notifyUserName: req.cookies.name,
                    notifyTime: dateTime,
                    notifyText: 'commented on your post in ' + oneGroupInfo.groupName,
                    isFollow: 'no',
                    isLike: 'no',
                    isComment: 'yes',
                    isGroup: 'yes',
                    notifyListColor: 'ipPeopleList3'
                });
                await newNotification.save().then(async function (resultNotify) {
                    console.log('Notification saved successfully');
                }).catch((error) => {
                    console.log('Failed to save notification');
                    console.log(error);
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save notification'
                    });
                });
            }



            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {

                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                    await Groups.findOne({ groupUniqueId: groupKeyValue }).then(async function (okGroup) {
                        await groupMembers.find({ groupUniqueId: groupKeyValue, isAdmin: "yes" }).then(async function (allAdmin) {
                            await groupMembers.find({ groupUniqueId: groupKeyValue, isAdmin: "no" }).then(async function (allMember) {
                                
                                await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {
                                    await groupRequests.find({ groupUniqueId: groupKeyValue }).then(async function (allMemberRequest) {

                                        await Posts.updateOne({
                                            postUniqueId: eachPostUniqueID
                                        }, {
                                            $inc: {
                                                commentCount: 1
                                            }

                                        }).then(async function (resultPost) {

                                            console.log('Comment count changed successfully');
                                            console.log(youKnowWho);
                                            
                                            const newComment = new Comments({
                                                commentUniqueId: commentKey,
                                                originPostUniqueID: eachPostUniqueID,
                                                ownerCommentUniqueID: req.cookies.key,
                                                userPhoto: req.cookies.proPicAddr,
                                                userName: req.cookies.name,
                                                commentTime: dateTime,
                                                commentText: req.body.commentText,
                                                isCommentMine: '',
                                                isIamAdmin: youKnowWho.isAdmin

                                            });

                                            await newComment.save().then(async function () {
                                                console.log('Comment save successfully');

                                                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);

                                                await Posts.find({ userORGroupUniqueID: groupKeyValue, isUserOrGroup: 'group' }).then(async function (allPostList) {
                                                    // console.log(allUserList);
                                                    console.log('Collect all post from MongoDB');
                                                    var allPostFromThisGroup = allPostList;


                                                    var allMyPost_Like = [];
                                                    for (let li = 0; li < allPostFromThisGroup.length; li++) {
                                                        allMyPost_Like.push(allPostFromThisGroup[li].postUniqueId);
                                                    }

                                                    await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                                        allMyComment = [];
                                                        for (var i = 0; i < allPostFromThisGroup.length; i++) {
                                                            var obj = (allPostFromThisGroup[i]);
                                                            await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                                                var obj2;
                                                                commentLengthHigh = Math.min(5, resultPerPost.length);
                                                                for (var j = 0; j < commentLengthHigh; j++) {
                                                                    obj2 = (resultPerPost[j]);
                                                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                                        obj2.isCommentMine = 'yes';
                                                                    }
                                                                    allMyComment.push(obj2);
                                                                }
                                                            }).catch((error) => {
                                                                console.log('Failed to collect all comment per post');
                                                                res.render('test.hbs', {
                                                                    alert_name: 'danger',
                                                                    alert_msg_visibility: 'visible',
                                                                    SorF: 'Failure!',
                                                                    status: 'Failed to collect all comment per post'
                                                                });
                                                            });
                                                        }

                                                        console.log('Everything looks clear');


                                                        allPostFromThisGroup = allPostFromThisGroup.reverse();
                                                        
                                                        res.render('groupProfile.hbs', {
                                                            myKey: req.cookies.key,
                                                            myName: req.cookies.name,
                                                            myProPic: req.cookies.proPicAddr,
                                                            myCoverPic: req.cookies.proCoverPicAddr,

                                                            singleGroupKey: okGroup.groupUniqueId,
                                                            singleGroupName: okGroup.groupName,
                                                            singleGroupCoverPicAddr: okGroup.groupCoverPicAddr,

                                                            youKnowWho: youKnowWho,

                                                            allMemberRequest: allMemberRequest,

                                                            allAdmin: allAdmin,
                                                            allMember: allMember,


                                                            resultAllFreeGroup: resultAllFreeGroup,

                                                            sumAllPost: allPostFromThisGroup.length,
                                                            sumAllMember: allAdmin.length + allMember.length,
                                                            allPostFromThisGroup: allPostFromThisGroup,
                                                            allMyComment: allMyComment,
                                                            resultAllLikeList: resultAllLikeList,

                                                            myAllNotification: myAllNotification
                                                        });
                                                    
                                                    }).catch((error) => {
                                                        console.log('Failed to collect like list');
                                                        res.render('test.hbs', {
                                                            alert_name: 'danger',
                                                            alert_msg_visibility: 'visible',
                                                            SorF: 'Failure!',
                                                            status: 'Failed to collect like list'
                                                        });
                                                    });

                                                }).catch((error) => {
                                                    console.log('Failed to collect all post');
                                                    res.render('test.hbs', {
                                                        alert_name: 'danger',
                                                        alert_msg_visibility: 'visible',
                                                        SorF: 'Failure!',
                                                        status: 'Failed to collect all post'
                                                    });
                                                });

                                            }).catch((error) => {
                                                console.log('Error : Failed to save comment');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to save comment!'
                                                });
                                            });
                                        }).catch((error) => {
                                            console.log('Failed to update comment count');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to update comment count'
                                            });
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect groupMembers request information');
                                        console.log(error);
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect groupMembers request information'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect my information');
                                    console.log(error);
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect my information'
                                    });
                                });


                            }).catch((error) => {
                                console.log('Failed to collect groupMembers information');
                                console.log(error);
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect groupMembers information'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect groupAdmins information');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect groupAdmins information'
                            });
                        });
                    }).catch((error) => {
                        console.log('Failed to collect this group information');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect this group information'
                        });
                    });


                }).catch((error) => {
                    console.log('Failed to collect my group');
                    console.log(error);;

                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect my group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members me');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members me'
                });
            });

            
        }).catch((error) => {
            console.log('Failed to collect post information');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to collect post information'
            });
        });
    }).catch((error) => {
        console.log('Failed to collect group information');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to collect group information'
        });
    });

});


/* This function will handle group comment uploading functionalities from home */
app.post('/groupCommentUploadFromHome', urlencodedParser, async function (req, res) {



    console.log('group theke comment kora hoise');

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    var eachPostUniqueID = req.body.eachPostUniqueID;
    var groupKeyValue = req.body.groupUniqueID;
    console.log(eachPostUniqueID);
    console.log(groupKeyValue);


    await Groups.findOne({ groupUniqueId: groupKeyValue }).then(async function (oneGroupInfo) {

        await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (onePostInfo) {

            var notificationKey = 'sustCSElifeNotify' + Date.now();
            notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");

            if(onePostInfo.postOwnerUniqueID != req.cookies.key){
                var newNotification = new Notifications({
                    notifyUniqueId: notificationKey,
                    notifyWhom: onePostInfo.postOwnerUniqueID,
                    notifyLink: eachPostUniqueID,
                    notifyLinkGroup: groupKeyValue,
                    notifyUserUniqueID: req.cookies.key,
                    notifyUserPhoto: req.cookies.proPicAddr,
                    notifyUserName: req.cookies.name,
                    notifyTime: dateTime,
                    notifyText: 'commented on your post in ' + oneGroupInfo.groupName,
                    isFollow: 'no',
                    isLike: 'no',
                    isComment: 'yes',
                    isGroup: 'yes',
                    notifyListColor: 'ipPeopleList3'
                });
                await newNotification.save().then(async function (resultNotify) {
                    console.log('Notification saved successfully');
                }).catch((error) => {
                    console.log('Failed to save notification');
                    console.log(error);
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save notification'
                    });
                });
            }



            await groupMembers.find({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {



                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: 1
                    }

                }).then(async function (resultPost) {

                    console.log('Comment count changed successfully');

                    // console.log(youKnowWho);


                    const newComment = new Comments({
                        commentUniqueId: commentKey,
                        originPostUniqueID: eachPostUniqueID,
                        ownerCommentUniqueID: req.cookies.key,
                        userPhoto: req.cookies.proPicAddr,
                        userName: req.cookies.name,
                        commentTime: dateTime,
                        commentText: req.body.commentText,
                        isCommentMine: '',
                        isIamAdmin: youKnowWho.isAdmin

                    });

                    await newComment.save().then(async function () {
                        console.log('Comment save successfully');

                        if (req.body.nijerPost === 'watch') {
                            res.redirect('watch');
                        }
                        else {
                            res.redirect('home');
                        }

                    }).catch((error) => {
                        console.log('Error : Failed to save comment');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to save comment!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to update comment count');
                    console.log(error);

                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });

            }).catch((error) => {
                console.log('Failed to collect my information');
                console.log(error);
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect my information'
                });
            });

        }).catch((error) => {
            console.log('Failed to collect post information');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to collect post information'
            });
        });
    }).catch((error) => {
        console.log('Failed to collect group information');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to collect group information'
        });
    });

});


/* This function will handle group comment uploading functionalities from a single post */
app.post('/groupCommentUploadEachPost', urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    console.log('group theke comment kora hoise');

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    var eachPostUniqueID = req.body.postKeyValue;
    var groupKeyValue = req.body.groupKeyValue;
    var eachPostOwnerUniqueID = req.body.eachPostOwnerUniqueID;

    console.log(eachPostUniqueID);
    console.log(groupKeyValue);
    console.log(eachPostOwnerUniqueID);

    await Groups.findOne({ groupUniqueId: groupKeyValue }).then(async function (oneGroupInfo) {

        await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (onePostInfo) {

            var notificationKey = 'sustCSElifeNotify' + Date.now();
            notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");

            if(onePostInfo.postOwnerUniqueID != req.cookies.key){
                var newNotification = new Notifications({
                    notifyUniqueId: notificationKey,
                    notifyWhom: onePostInfo.postOwnerUniqueID,
                    notifyLink: eachPostUniqueID,
                    notifyLinkGroup: groupKeyValue,
                    notifyUserUniqueID: req.cookies.key,
                    notifyUserPhoto: req.cookies.proPicAddr,
                    notifyUserName: req.cookies.name,
                    notifyTime: dateTime,
                    notifyText: 'commented on your post in ' + oneGroupInfo.groupName,
                    isFollow: 'no',
                    isLike: 'no',
                    isComment: 'yes',
                    isGroup: 'yes',
                    notifyListColor: 'ipPeopleList3'
                });
                await newNotification.save().then(async function (resultNotify) {
                    console.log('Notification saved successfully');
                }).catch((error) => {
                    console.log('Failed to collect post information');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect post information'
                    });
                });
            }

            

            await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {

                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: 1
                    }

                }).then(async function (resultPost) {

                    console.log('Comment count changed successfully');

                    const newComment = new Comments({
                        commentUniqueId: commentKey,
                        originPostUniqueID: eachPostUniqueID,
                        ownerCommentUniqueID: req.cookies.key,
                        userPhoto: req.cookies.proPicAddr,
                        userName: req.cookies.name,
                        commentTime: dateTime,
                        commentText: req.body.commentText,
                        isCommentMine: '',
                        isIamAdmin: youKnowWho.isAdmin

                    });

                    await newComment.save().then(async function () {
                        console.log('Comment save successfully');


                        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                            var allGroup = []
                            console.log(resultAllGroup.length);
                            for (var i = 0; i < resultAllGroup.length; i++) {
                                allGroup.push(resultAllGroup[i].groupUniqueId);
                            }
                            // console.log(allMan);
                            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                                await Users.findOne({ userUniqueId: eachPostOwnerUniqueID }).then(async function (resultUser) {
                                    await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {


                                        await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (resultOnePost) {
                                            console.log('post ta paise')
                                            // console.log(resultOnePost);
                                            resultOnePostOBJ = []
                                            resultOnePostOBJ.push(resultOnePost);

                                            var allMyPost_Like = [];
                                            for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                                allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                            }

                                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {



                                                allMyComment = []
                                                await Comments.find({ originPostUniqueID: eachPostUniqueID }).then((resultPerPost) => {
                                                    //     // console.log(resultPerPost);
                                                    console.log('Comment collect kora shuru korse')
                                                    var obj2;
                                                    // console.log(resultPerPost);
                                                    for (var j = 0; j < resultPerPost.length; j++) {
                                                        obj2 = (resultPerPost[j]);
                                                        // console.log(obj2);
                                                        if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                            // resultPerPost[j].isCommentMine='yes';
                                                            obj2.isCommentMine = 'yes';
                                                        }

                                                        allMyComment.push(obj2);
                                                    }

                                                    //     // allMyComment.push(resultPerPost);
                                                    // console.log(resultOnePost);
                                                    // console.log(allMyComment);


                                                    res.render('viewGroupOnePost', {
                                                        myKey: req.cookies.key,
                                                        myName: req.cookies.name,
                                                        myProPic: req.cookies.proPicAddr,
                                                        myCoverPic: req.cookies.proCoverPicAddr,

                                                        singleGroupKey: groupKeyValue,
                                                        youKnowWho: youKnowWho,

                                                        resultUser: resultUser,

                                                        resultOnePost: resultOnePostOBJ,
                                                        allMyComment: allMyComment,

                                                        resultAllLikeList: resultAllLikeList,

                                                        resultAllFreeGroup: resultAllFreeGroup,

                                                        myAllNotification: myAllNotification
                                                    });

                                                }).catch((error) => {
                                                    console.log('Failed to collect all comment per post');
                                                    res.render('test.hbs', {
                                                        alert_name: 'danger',
                                                        alert_msg_visibility: 'visible',
                                                        SorF: 'Failure!',
                                                        status: 'Failed to collect all comment per post'
                                                    });
                                                });
                                            
                                            }).catch((error) => {
                                                console.log('Failed to collect like list');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to collect like list'
                                                });
                                            });


                                        }).catch((error) => {
                                            console.log('Error : Failed to collect one post');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect one post!'
                                            });
                                        });
                                    }).catch((error) => {
                                        console.log('Failed to collect my information');
                                        console.log(error);
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect my information'
                                        });
                                    });
                                }).catch((error) => {
                                    console.log('Failed to collect one user information');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect one user information'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Failed to collect group');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect group'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to find group members');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to find group members'
                            });
                        });

                    }).catch((error) => {
                        console.log('Error : Failed to save comment');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to save comment!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });


            }).catch((error) => {
                console.log('Failed to collect my information');
                console.log(error);
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect my information'
                });
            });

        }).catch((error) => {
            console.log('Failed to collect post information');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to collect post information'
            });
        });
    }).catch((error) => {
        console.log('Failed to collect group information');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to collect group information'
        });
    });



});


/* This function will handle group comment setting */
app.post('/groupCommentSetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        console.log('button click mission successfull')
        var settingBtn = req.body.commentBtn;

        var eachCommentUniqueID = req.body.eachCommentUniqueID;
        var eachCommentOwnerID = req.body.eachCommentOwnerID;

        var eachPostUniqueID = req.body.eachPostUniqueID;
        var groupKeyValue = req.body.groupUniqueID;

        console.log(settingBtn);

        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');
            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultComment) {
                console.log('comment delete successfully');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultPost) {

                    console.log('Comment count changed successfully');
                    
                    groupRegNo = groupKeyValue;
                    res.redirect('viewAGroup');

                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });

            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });

        }
        
        else {
            console.log('comment owner er page e jabe akn');

            if (eachCommentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else {

                console.log('eta amr profile na... eta amar friend er profile');

                var friendUserKey = eachCommentOwnerID;

                bestFriend = friendUserKey;
                res.redirect('friendProfile');
            }
        }
    }
});

/* This function will handle group comment setting inside home page*/
app.post('/groupCommentSettingFromHome', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        console.log('button click mission successfull')
        var settingBtn = req.body.commentBtn;

        var eachCommentUniqueID = req.body.eachCommentUniqueID;
        var eachCommentOwnerID = req.body.eachCommentOwnerID;

        var eachPostUniqueID = req.body.eachPostUniqueID;
        var groupKeyValue = req.body.groupUniqueID;

        console.log(settingBtn);

        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');
            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultComment) {
                console.log('comment delete successfully');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultPost) {

                    console.log('Comment count changed successfully');

                    res.redirect('home');

                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });

            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });

        }
        
        else {
            console.log('comment owner er page e jabe akn');

            if (eachCommentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else {

                console.log('eta amr profile na... eta amar friend er profile');

                var friendUserKey = eachCommentOwnerID;

                bestFriend = friendUserKey;
                res.redirect('friendProfile');
            }
        }
    }
});


/* This function will handle group comment setting from a single post*/
app.post('/groupEachPostCommentSetting', urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    if (req.cookies.key === undefined) res.render('index');
    else {
        console.log('button click mission successfull');
        var settingBtn = req.body.commentBtn;

        var eachCommentUniqueID = req.body.eachCommentUniqueID;
        var eachCommentOwnerID = req.body.eachCommentOwnerID;

        var eachPostOwnerUniqueID = req.body.eachPostOwnerUniqueID;


        var eachPostUniqueID = req.body.eachPostUniqueID;
        var groupKeyValue = req.body.groupUniqueID;

        console.log(settingBtn);

        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');
            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultComment) {
                console.log('comment delete successfully');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultPost) {

                    console.log('Comment count changed successfully');

                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                            await Users.findOne({ userUniqueId: eachPostOwnerUniqueID }).then(async function (resultUser) {
                                await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {


                                    await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (resultOnePost) {
                                        console.log('post ta paise')
                                        // console.log(resultOnePost);
                                        resultOnePostOBJ = []
                                        resultOnePostOBJ.push(resultOnePost);

                                        var allMyPost_Like = [];
                                        for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                            allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                        }

                                        await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {



                                            allMyComment = []
                                            await Comments.find({ originPostUniqueID: eachPostUniqueID }).then((resultPerPost) => {
                                                //     // console.log(resultPerPost);
                                                console.log('Comment collect kora shuru korse')
                                                var obj2;
                                                // console.log(resultPerPost);
                                                for (var j = 0; j < resultPerPost.length; j++) {
                                                    obj2 = (resultPerPost[j]);
                                                    // console.log(obj2);
                                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                        // resultPerPost[j].isCommentMine='yes';
                                                        obj2.isCommentMine = 'yes';
                                                    }

                                                    allMyComment.push(obj2);
                                                }

                                                //     // allMyComment.push(resultPerPost);
                                                // console.log(resultOnePost);
                                                // console.log(allMyComment);
                                                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                                                res.render('viewGroupOnePost', {
                                                    myKey: req.cookies.key,
                                                    myName: req.cookies.name,
                                                    myProPic: req.cookies.proPicAddr,
                                                    myCoverPic: req.cookies.proCoverPicAddr,

                                                    singleGroupKey: groupKeyValue,
                                                    youKnowWho: youKnowWho,

                                                    resultUser: resultUser,

                                                    resultOnePost: resultOnePostOBJ,
                                                    allMyComment: allMyComment,

                                                    resultAllLikeList: resultAllLikeList,

                                                    resultAllFreeGroup: resultAllFreeGroup,

                                                    myAllNotification: myAllNotification
                                                });

                                            }).catch((error) => {
                                                console.log('Failed to collect all comment per post');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to collect all comment per post'
                                                });
                                            });
                                        
                                        }).catch((error) => {
                                            console.log('Failed to collect like list');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect like list'
                                            });
                                        });


                                    }).catch((error) => {
                                        console.log('Error : Failed to collect one post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect one post!'
                                        });
                                    });
                                }).catch((error) => {
                                    console.log('Failed to collect my information');
                                    console.log(error);
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect my information'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Failed to collect one user information');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one user information'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });

            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });

        }
        else {
            console.log('comment owner er page e jabe akn');

            if (eachCommentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else {

                console.log('eta amr profile na... eta amar friend er profile');

                var friendUserKey = eachCommentOwnerID;

                bestFriend = friendUserKey;
                res.redirect('friendProfile');
            }
        }
    }
});

/* This function will handle any modify on group comment */

app.post('/editGroupComment', urlencodedParser, async function (req, res) {

    var groupKeyValue = req.body.groupUniqueID;
    var commentKeyValue = req.body.commentKeyValue;

    await Comments.updateOne({
        commentUniqueId: commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then(async function(resultUser) {
        // console.log(resultUser);

        console.log('Comment changed successfully');

        groupRegNo = groupKeyValue;
        res.redirect('viewAGroup');

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });

});
/* This function will handle any modify on group comment inside home page */
app.post('/editGroupCommentFromHome', urlencodedParser, async function (req, res) {

    // var eachPostUniqueID = req.body.eachPostUniqueID;
    // var groupKeyValue = req.body.groupUniqueID;
    var commentKeyValue = req.body.commentKeyValue;

    await Comments.updateOne({
        commentUniqueId: commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then(async function (resultUser) {
        // console.log(resultUser);

        console.log('Comment changed successfully');

        res.redirect('home');

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });

});

/* This function will handle any modification on group comment inside a single post */

app.post('/editGroupCommentEachPost', urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    var eachPostUniqueID = req.body.eachPostUniqueID;
    var groupKeyValue = req.body.groupUniqueID;
    var commentKeyValue = req.body.commentKeyValue;
    var eachPostOwnerUniqueID = req.body.eachPostOwnerUniqueID;

    await Comments.updateOne({
        commentUniqueId: commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then(async function (resultUser) {
        // console.log(resultUser);

        console.log('Comment changed successfully');

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                await Users.findOne({ userUniqueId: eachPostOwnerUniqueID }).then(async function (resultUser) {
                    await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {


                        await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (resultOnePost) {
                            console.log('post ta paise')
                            // console.log(resultOnePost);
                            resultOnePostOBJ = []
                            resultOnePostOBJ.push(resultOnePost);

                            var allMyPost_Like = [];
                            for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                            }

                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {



                                allMyComment = []
                                await Comments.find({ originPostUniqueID: eachPostUniqueID }).then((resultPerPost) => {
                                    //     // console.log(resultPerPost);
                                    console.log('Comment collect kora shuru korse')
                                    var obj2;
                                    // console.log(resultPerPost);
                                    for (var j = 0; j < resultPerPost.length; j++) {
                                        obj2 = (resultPerPost[j]);
                                        // console.log(obj2);
                                        if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                            // resultPerPost[j].isCommentMine='yes';
                                            obj2.isCommentMine = 'yes';
                                        }

                                        allMyComment.push(obj2);
                                    }

                                    //     // allMyComment.push(resultPerPost);
                                    // console.log(resultOnePost);
                                    // console.log(allMyComment);
                                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                                    res.render('viewGroupOnePost', {
                                        myKey: req.cookies.key,
                                        myName: req.cookies.name,
                                        myProPic: req.cookies.proPicAddr,
                                        myCoverPic: req.cookies.proCoverPicAddr,

                                        singleGroupKey: groupKeyValue,
                                        youKnowWho: youKnowWho,

                                        resultUser: resultUser,

                                        resultOnePost: resultOnePostOBJ,
                                        allMyComment: allMyComment,

                                        resultAllLikeList: resultAllLikeList,

                                        resultAllFreeGroup: resultAllFreeGroup,

                                        myAllNotification: myAllNotification
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect all comment per post');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect all comment per post'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Failed to collect like list');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect like list'
                                });
                            });

                        }).catch((error) => {
                            console.log('Error : Failed to collect one post');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect one post!'
                            });
                        });
                    }).catch((error) => {
                        console.log('Failed to collect my information');
                        console.log(error);
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect my information'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect one user information');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect one user information'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });

});


/* This function will handle the issue if you make anyone from the group admin or remove any user from admin list*/

app.post('/groupMakeAdminOrRemove', urlencodedParser, async function (req, res) {

    var groupKeyValue = req.body.groupKey;
    var userKeyValue = req.body.userRequestKey;
    var clickBtn = req.body.status;
    
    console.log(clickBtn);
    console.log(groupKeyValue);
    console.log(userKeyValue);

    if (clickBtn === 'makeAdmin') {
        await groupMembers.updateOne({
            groupUniqueId: groupKeyValue,userUniqueId:userKeyValue
        }, {
            $set: {
                isAdmin: "yes"
            }

        }).then(async function (resultGroup) {

            groupRegNo = groupKeyValue;
            res.redirect('viewAGroup');


        }).catch((error) => {
            console.log('Failed to update user information');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update user information'
            });
        });
    }
    else if (clickBtn === 'removeAdmin') {
        await groupMembers.updateOne({
            groupUniqueId: groupKeyValue, userUniqueId: userKeyValue
        }, {
            $set: {
                isAdmin: "no"
            }

        }).then(async function (resultGroup) {

            groupRegNo = groupKeyValue;
            res.redirect('viewAGroup');

        }).catch((error) => {
            console.log('Failed to update user information');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update user information'
            });
        });
    }
    else if (clickBtn === 'remove') {

        await groupMembers.findOneAndDelete({ groupUniqueId: groupKeyValue, userUniqueId: userKeyValue }).then(async function () {

            if(userKeyValue === req.cookies.key){
                res.redirect('home');
            }
            else{

                groupRegNo = groupKeyValue;
                res.redirect('viewAGroup');
                
            }

        }).catch((error) => {
            console.log('Failed to delete request');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to delete request'
            });
        });

    }

});


/* This function will invoke, you want to leave from a group */

app.post('/groupLeave', urlencodedParser, async function (req, res) {

    var groupKeyValue = req.body.groupKey;
    var userKeyValue = req.body.userRequestKey;
    
    console.log(groupKeyValue);
    console.log(userKeyValue);

    await groupMembers.findOneAndDelete({ groupUniqueId: groupKeyValue, userUniqueId: userKeyValue }).then(async function () {

        res.redirect('home');



    }).catch((error) => {
        console.log('Failed to delete request');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to delete request'
        });
    });

});


/* This function will collect all the groups on this site */

app.get('/viewMyAllGroup', async function (req, res) {
    // req.session.electionUniqueId = null;
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId:  allGroup  }).then(async function (resultAllFreeGroup) {



                console.log('Now in home get function');
                resultAllFreeGroupAll = resultAllFreeGroup
                resultAllFreeGroup = resultAllFreeGroup.slice(0,10);
                // resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                res.render('groupsMine', {
                    myKey: req.cookies.key,
                    myName: req.cookies.name,
                    myProPic: req.cookies.proPicAddr,

                    resultAllFreeGroup: resultAllFreeGroup,
                    resultAllFreeGroupAll: resultAllFreeGroupAll,

                    myAllNotification: myAllNotification

                });



            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
    }

});

app.get('/group', async function (req, res) {
// req.session.electionUniqueId = null;
if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            // console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                await Groups.find({ groupUniqueId:  { $nin: allGroup }  }).then(async function (resultAllOthersGroup) {



                    newResultAllOthersGroup = []

                    for (var index = 0; index < resultAllOthersGroup.length; index++) {
                        var element = resultAllOthersGroup[index];

                        var newElement = {}
                        newElement.groupUniqueId = element.groupUniqueId;
                        newElement.groupName = element.groupName;
                        newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                        newElement.isRequestSent = 'no';

                        await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {

                            if (resultIsPositive.length == 1) {
                                newElement.isRequestSent = 'yes';
                            }
                            newResultAllOthersGroup.push(newElement);

                        }).catch((error) => {
                            console.log('Failed to check is request sent or not');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to check is request sent or not'
                            });
                        });
                    }
                    // console.log('Now in home get function');
                    // resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);
                    // console.log(newResultAllOthersGroup);
                    res.render('groups', {
                        myKey: req.cookies.key,
                        myName: req.cookies.name,
                        myProPic: req.cookies.proPicAddr,
                        resultAllFreeGroup: resultAllFreeGroup,
                        newResultAllOthersGroup: newResultAllOthersGroup,

                        myAllNotification: myAllNotification
                    });



                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
    }
});


/**
 * Handles group join request
 */
app.post('/groupJoinRequest', urlencodedParser ,async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        var groupKeyUnique = req.body.groupKeyUnique;
        var requestMessage = req.body.requestMessage;
        console.log(groupKeyUnique);
        console.log(requestMessage);
        // res.redirect('group');
        newGroupRequest = new groupRequests({
            groupUniqueId: groupKeyUnique,
            userUniqueId: req.cookies.key,
            userName: req.cookies.name,
            userPicAddr: req.cookies.proPicAddr,
            userRequestMessage: requestMessage
        });

        newGroupRequest.save().then(async function (){
            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                // console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                    await Groups.find({ groupUniqueId: { $nin: allGroup } }).then(async function (resultAllOthersGroup) {
                        newResultAllOthersGroup = []

                        for (var index = 0; index < resultAllOthersGroup.length; index++) {
                            var element = resultAllOthersGroup[index];

                            var newElement = {}
                            newElement.groupUniqueId = element.groupUniqueId;
                            newElement.groupName = element.groupName;
                            newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                            newElement.isRequestSent = 'no';

                            await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {
                                
                                if(resultIsPositive.length == 1){
                                    newElement.isRequestSent = 'yes';
                                }
                                newResultAllOthersGroup.push(newElement);
    
                            }).catch((error) => {
                                console.log('Failed to check is request sent or not');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to check is request sent or not'
                                });
                            });
                        }
                        // console.log('Now in home get function');
                        // resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                        resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);
                        res.render('groups', {
                            myKey: req.cookies.key,
                            myName: req.cookies.name,
                            myProPic: req.cookies.proPicAddr,
                            resultAllFreeGroup: resultAllFreeGroup,
                            newResultAllOthersGroup: newResultAllOthersGroup,

                            myAllNotification: myAllNotification

                        });


                    }).catch((error) => {
                        console.log('Failed to collect group');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect group'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });
        }).catch((error) => {
            console.log('Failed to save group request');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save group request'
            });
        });
    }
});


/**
 * Show groups that have requested to join for search option
 */
app.post('/searchGroupJoinRequest', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        var groupKeyUnique = req.body.groupKeyUnique;
        var requestMessage = req.body.requestMessage;
        console.log(groupKeyUnique);
        console.log(requestMessage);
        // res.redirect('group');
        newGroupRequest = new groupRequests({
            groupUniqueId: groupKeyUnique,
            userUniqueId: req.cookies.key,
            userName: req.cookies.name,
            userPicAddr: req.cookies.proPicAddr,
            userRequestMessage: requestMessage
        });

        newGroupRequest.save().then(async function () {
            
            var searchText = req.body.Search;

            searchText = ".*" + searchText + "*.";

            await Users.find({ userName: { "$regex": searchText, "$options": "i" } }).then(async function (searchResultUsers) {

                await Groups.find({ groupName: { "$regex": searchText, "$options": "i" } }).then(async function (searchResultGroups) {

                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllMyGroup) {
                            resultAllMyGroup = resultAllMyGroup.slice(0, 10);

                            // For Groups Section
                            newSearchResultGroups = []

                            for (var index = 0; index < searchResultGroups.length; index++) {
                                var element = searchResultGroups[index];

                                var newElement = {}
                                newElement.groupUniqueId = element.groupUniqueId;
                                newElement.groupName = element.groupName;
                                newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                                newElement.presentCondition = 'Join';

                                await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {

                                    if (resultIsPositive.length == 1) {
                                        newElement.presentCondition = 'Request sent';
                                        newSearchResultGroups.push(newElement);
                                    }
                                    else {
                                        await groupMembers.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive2) {

                                            if (resultIsPositive2.length == 1) {
                                                newElement.presentCondition = 'Enter';
                                                newSearchResultGroups.push(newElement);
                                            }
                                            else {
                                                newElement.presentCondition = 'Join';
                                                newSearchResultGroups.push(newElement);
                                            }

                                        }).catch((error) => {
                                            console.log('Failed to check is request sent or not');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to check is request sent or not'
                                            });
                                        });
                                    }

                                }).catch((error) => {
                                    console.log('Failed to check is request sent or not');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to check is request sent or not'
                                    });
                                });
                            }

                            // For User Section
                            newSearchResultUsers = []
                            for (var index = 0; index < searchResultUsers.length; index++) {
                                var element = searchResultUsers[index];

                                var newElement = {}
                                newElement.userUniqueId = element.userUniqueId;
                                newElement.userName = element.userName;
                                newElement.userEmail = element.userEmail;
                                newElement.userProPicAddr = element.userProPicAddr;
                                newElement.userCoverPicAddr = element.userCoverPicAddr;
                                newElement.presentCondition = 'Follow';

                                await Follows.find({ followingID: element.userUniqueId, followerID: req.cookies.key }).then(async function (resultIsPositive) {

                                    if (resultIsPositive.length == 1) {
                                        newElement.presentCondition = 'Following';
                                        newSearchResultUsers.push(newElement);
                                    }
                                    else {
                                        newElement.presentCondition = 'Follow';
                                        newSearchResultUsers.push(newElement);
                                    }

                                }).catch((error) => {
                                    console.log('Failed to check is follow or not');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to check is follow or not'
                                    });
                                });
                            }

                            res.render('navBarSearchResults', {
                                myKey: req.cookies.key,
                                myName: req.cookies.name,
                                myProPic: req.cookies.proPicAddr,
                                myCoverPic: req.cookies.proCoverPicAddr,

                                resultAllFreeGroup: resultAllMyGroup,

                                searchText: searchText,

                                searchResultUsers: newSearchResultUsers,
                                searchResultGroups: newSearchResultGroups,

                                myAllNotification: myAllNotification
                            });

                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to search word');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to search word'
                    });
                });


            }).catch((error) => {
                console.log('Failed to search word');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to search word'
                });
            });

        }).catch((error) => {
            console.log('Failed to save group request');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save group request'
            });
        });
    }
});

/**
 * Make join request from home page 
 * from the side tab
 */
app.post('/groupJoinRequestFromHome', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        var groupKeyUnique = req.body.groupKeyUnique;
        var requestMessage = req.body.requestMessage;
        console.log(groupKeyUnique);
        console.log(requestMessage);
        // res.redirect('group');
        newGroupRequest = new groupRequests({
            groupUniqueId: groupKeyUnique,
            userUniqueId: req.cookies.key,
            userName: req.cookies.name,
            userPicAddr: req.cookies.proPicAddr,
            userRequestMessage: requestMessage
        });

        newGroupRequest.save().then(async function () {
            
            res.redirect('home');

        }).catch((error) => {
            console.log('Failed to save group request');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save group request'
            });
        });
    }
});



/**
 * Cancel any group request
 */
app.post('/groupRequestCancel', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        var groupKeyUnique = req.body.checkForNewValue;
        // console.log(groupKeyUnique);
        // console.log(req.body.groupKeyUniqueCancel);
        console.log(req.body.checkForNewValue);
        // res.redirect('group');
        

        await groupRequests.findOneAndDelete({groupUniqueId:groupKeyUnique,userUniqueId:req.cookies.key}).then(async function (result) {
            // console.log(result);
            console.log('Request is now canceling');
            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                // console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                    await Groups.find({ groupUniqueId: { $nin: allGroup } }).then(async function (resultAllOthersGroup) {
                        newResultAllOthersGroup = []

                        for (var index = 0; index < resultAllOthersGroup.length; index++) {
                            var element = resultAllOthersGroup[index];

                            var newElement = {}
                            newElement.groupUniqueId = element.groupUniqueId;
                            newElement.groupName = element.groupName;
                            newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                            newElement.isRequestSent = 'no';

                            await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {

                                if (resultIsPositive.length == 1) {
                                    newElement.isRequestSent = 'yes';
                                }
                                newResultAllOthersGroup.push(newElement);

                            }).catch((error) => {
                                console.log('Failed to check is request sent or not');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to check is request sent or not'
                                });
                            });
                        }


                        // console.log('Now in home get function');
                        // resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                        resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);
                        res.render('groups', {
                            myKey: req.cookies.key,
                            myName: req.cookies.name,
                            myProPic: req.cookies.proPicAddr,
                            resultAllFreeGroup: resultAllFreeGroup,
                            newResultAllOthersGroup: newResultAllOthersGroup,

                            myAllNotification: myAllNotification

                        });


                    }).catch((error) => {
                        console.log('Failed to collect group');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect group'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });
        }).catch((error) => {
            console.log('Failed to cancel group request');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to cancel group request'
            });
        });
    }
});


/**
 * Search for groups
 */
app.post('/searchGroupSetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        var groupKeyUnique = req.body.checkForNewValue;
        // console.log(groupKeyUnique);
        // console.log(req.body.groupKeyUniqueCancel);
        console.log(req.body.checkForNewValue);
        // res.redirect('group');
        console.log('Check button click or not');
        console.log(req.body.iAmGroupBtn);

        if(req.body.iAmGroupBtn === 'Enter'){

            var groupKeyValue = groupKeyUnique;

            // console.log(groupKeyValue);

            groupRegNo = groupKeyValue;
            res.redirect('viewAGroup');

        }
        else if(req.body.iAmGroupBtn === 'Request sent'){


            await groupRequests.findOneAndDelete({ groupUniqueId: groupKeyUnique, userUniqueId: req.cookies.key }).then(async function (result) {
                // console.log(result);
                
                var searchText = req.body.Search;

                searchText = ".*"+searchText+"*." ;

                await Users.find({ userName : { "$regex": searchText, "$options": "i" } }).then(async function (searchResultUsers) {

                    await Groups.find({ groupName : { "$regex": searchText, "$options": "i" } }).then(async function (searchResultGroups) {

                        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                            var allGroup = []
                            console.log(resultAllGroup.length);
                            for (var i = 0; i < resultAllGroup.length; i++) {
                                allGroup.push(resultAllGroup[i].groupUniqueId);
                            }
                            // console.log(allMan);
                            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllMyGroup) {
                                resultAllMyGroup = resultAllMyGroup.slice(0, 10);

                                // For Groups Section
                                newSearchResultGroups = []

                                for (var index = 0; index < searchResultGroups.length; index++) {
                                    var element = searchResultGroups[index];

                                    var newElement = {}
                                    newElement.groupUniqueId = element.groupUniqueId;
                                    newElement.groupName = element.groupName;
                                    newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                                    newElement.presentCondition = 'Join';

                                    await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {

                                        if (resultIsPositive.length == 1) {
                                            newElement.presentCondition = 'Request sent';
                                            newSearchResultGroups.push(newElement);
                                        }
                                        else{
                                            await groupMembers.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive2) {

                                                if (resultIsPositive2.length == 1) {
                                                    newElement.presentCondition = 'Enter';
                                                    newSearchResultGroups.push(newElement);
                                                }
                                                else{
                                                    newElement.presentCondition = 'Join';
                                                    newSearchResultGroups.push(newElement);
                                                }
                                                    
                                            }).catch((error) => {
                                                console.log('Failed to check is request sent or not');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to check is request sent or not'
                                                });
                                            });
                                        }

                                    }).catch((error) => {
                                        console.log('Failed to check is request sent or not');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to check is request sent or not'
                                        });
                                    });
                                }

                                // For User Section
                                newSearchResultUsers = []
                                for (var index = 0; index < searchResultUsers.length; index++) {
                                    var element = searchResultUsers[index];

                                    var newElement = {}
                                    newElement.userUniqueId = element.userUniqueId;
                                    newElement.userName = element.userName;
                                    newElement.userEmail = element.userEmail;
                                    newElement.userProPicAddr = element.userProPicAddr;
                                    newElement.userCoverPicAddr = element.userCoverPicAddr;
                                    newElement.presentCondition = 'Follow'; 

                                    await Follows.find({ followingID: element.userUniqueId, followerID: req.cookies.key }).then(async function (resultIsPositive) {

                                        if (resultIsPositive.length == 1) {
                                            newElement.presentCondition = 'Following';
                                            newSearchResultUsers.push(newElement);
                                        }
                                        else {
                                            newElement.presentCondition = 'Follow'; 
                                            newSearchResultUsers.push(newElement);
                                        }

                                    }).catch((error) => {
                                        console.log('Failed to check is follow or not');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to check is follow or not'
                                        });
                                    });
                                }

                                res.render('navBarSearchResults', {
                                    myKey: req.cookies.key,
                                    myName: req.cookies.name,
                                    myProPic: req.cookies.proPicAddr,
                                    myCoverPic: req.cookies.proCoverPicAddr,
                                    
                                    resultAllFreeGroup: resultAllMyGroup,

                                    searchText: searchText,

                                    searchResultUsers: newSearchResultUsers,
                                    searchResultGroups: newSearchResultGroups,

                                    myAllNotification: myAllNotification
                                });

                            }).catch((error) => {
                                console.log('Failed to collect group');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect group'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to find group members');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to find group members'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to search word');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to search word'
                        });
                    });
                    

                }).catch((error) => {
                    console.log('Failed to search word');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to search word'
                    });
                });


            }).catch((error) => {
                console.log('Failed to cancel group request');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to cancel group request'
                });
            });

        }
        
        


    }
});

/**
 * To change group Profile picture
 */
app.post('/groupCoverPicChange', dirCoverPic.single('myImage'), urlencodedParser, async function (req, res) {

    if (!req.file) {
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading a group cover!'
        });
    };

    var fileName = req.file.originalname;
    var preFilePath = req.file.path.substring(4, req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
    var dateFile = "/" + Date.now() + "/" + fileName;
    var newFilePath = path.join(__dirname, './website/media/coverPic/' + dateFile);
    var proFilePath = "/media/coverPic" + dateFile;


    var groupKeyValue = req.body.groupKeyValue;

    console.log(groupKeyValue);

    await fileNewPath(preFilePath, newFilePath).then(async function (result) {
        // console.log(result);
        console.log('File path changed successfully');

        await Groups.updateOne({
            groupUniqueId: groupKeyValue
        }, {
            $set: {
                groupCoverPicAddr: proFilePath
            }

        }).then(async function(resultGroup) {

            console.log('Cover pic changed successfully');

            groupRegNo = groupKeyValue;
            res.redirect('viewAGroup');


        }).catch((error) => {
            console.log('Failed to update cover picture');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update cover picture'
            });
        });

    }).catch((error) => {
        console.log('Error : File path transfer');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Error : File path transfer!'
        });
    });

});

// --------------------------------------------------- End Group----------------------------------- 






/**
 * 
 */

app.get('/people', async function (req, res) {
    // req.session.electionUniqueId = null;
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                await Follows.find({ followerID: req.cookies.key }).then(async function (resultAllUser) {
                    var allMan = []
                    allMan.push(req.cookies.key);
                    console.log(resultAllUser.length);
                    for (var i = 0; i < resultAllUser.length; i++) {
                        allMan.push(resultAllUser[i].followingID);
                    }

                    console.log(allMan);
                    await Users.find({ userUniqueId: { $nin: allMan } }).then(async function (resultAllFreeUser) {
                        // console.log(resultAllUser);
                        // await Follows.find({followingID: { $nin}})

                        console.log(resultAllFreeUser);

                        console.log('Now in home get function');
                        res.render('peoples', {
                            myKey: req.cookies.key,
                            myName: req.cookies.name,
                            myProPic: req.cookies.proPicAddr,
                            resultAllFreeUser: resultAllFreeUser,
                            resultAllFreeGroup: resultAllFreeGroup,

                            myAllNotification: myAllNotification

                        });



                    }).catch((error) => {
                        console.log('Login failed');
                        res.render('login.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Incorrect username or password'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to find follow');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find follow'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
    }
});



//-------------------------------------------------------------- notification------------------------------------------------//

/**
 * Collects notifications
 */
app.get('/notification', async function (req, res) {
    // req.session.electionUniqueId = null;
    if (req.cookies.key === undefined) res.render('index');
    else {
        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('ekhane');
            await Notifications.find({ notifyWhom: req.cookies.key }).then(async function (resultAllNotification) {
            console.log('ekhane');

                await Follows.find({ followerID: req.cookies.key }).then(async function (resultAllUser) {
                    var allMan = []
                    allMan.push(req.cookies.key);
                    console.log(resultAllUser.length);
                    for (var i = 0; i < resultAllUser.length; i++) {
                        allMan.push(resultAllUser[i].followingID);
                    }
                    // console.log(allMan);
                    await Users.find({ userUniqueId: { $nin: allMan } }).then(async function (resultAllFreeUser) {

                        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                            var allGroup = []
                            console.log(resultAllGroup.length);
                            for (var i = 0; i < resultAllGroup.length; i++) {
                                allGroup.push(resultAllGroup[i].groupUniqueId);
                            }
                            // console.log(allMan);
                            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                                await groupRequests.find({ userUniqueId: req.cookies.key }).then(async function (resultAllRequestGroup) {

                                    console.log(resultAllRequestGroup.length);
                                    for (var i = 0; i < resultAllRequestGroup.length; i++) {
                                        allGroup.push(resultAllRequestGroup[i].groupUniqueId);
                                    }

                                    await Groups.find({ groupUniqueId: { $nin: allGroup } }).then(async function (resultAllOthersGroup) {



                                        resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                                        resultAllFreeGroup = resultAllFreeGroup.slice(0, 9);
                                        resultAllOthersGroup = resultAllOthersGroup.slice(0, 12);

                                        resultAllNotification = resultAllNotification.reverse();

                                        res.render('notifications', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            resultAllFreeUser: resultAllFreeUser,
                                            resultAllFreeGroup: resultAllFreeGroup,
                                            resultAllOthersGroup: resultAllOthersGroup,

                                            myAllNotification : resultAllUnreadNotification.length,
                                            resultAllNotification: resultAllNotification

                                        });



                                    }).catch((error) => {
                                        console.log('Failed to collect group');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect group'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect group');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect group'
                                    });
                                });



                            }).catch((error) => {
                                console.log('Failed to collect group');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect group'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to find group members');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to find group members'
                            });
                        });





                    }).catch((error) => {
                        console.log('Failed to collect user');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect user'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to find follow');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find follow'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find notification');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find notification'
                });
            });
        }).catch((error) => {
            console.log('Failed to find notification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find notification'
            });
        });
    }
});


/**
 * Configures notification
 */
app.post('/notifySetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        var notifySettingID = req.body.notifySettingID;
        console.log(notifySettingID);

        await Notifications.updateOne({
            notifyUniqueId: notifySettingID
        }, {
            $set: {
                notifyListColor: "ipPeopleList2"
            }

        }).then(async function (changeNotify) {

            await Notifications.findOne({ notifyUniqueId: notifySettingID }).then(async function (singleNotify) {
                if(singleNotify.isGroup === "yes"){
                    console.log('group related notification');

                    if (singleNotify.notifyLink === singleNotify.notifyLinkGroup){

                    
                        
                        var groupKeyValue = singleNotify.notifyLinkGroup;

                        groupRegNo = groupKeyValue;
                        res.redirect('viewAGroup');

                    }
                    else{

                        var eachPostOwnerUniqueID = singleNotify.notifyWhom;
                        var everyPostUniqueID = singleNotify.notifyLink;
                        var groupKeyValue = singleNotify.notifyLinkGroup;

                        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                            var allGroup = []
                            console.log(resultAllGroup.length);
                            for (var i = 0; i < resultAllGroup.length; i++) {
                                allGroup.push(resultAllGroup[i].groupUniqueId);
                            }
                            // console.log(allMan);
                            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                                await Users.findOne({ userUniqueId: eachPostOwnerUniqueID }).then(async function (resultUser) {
                                    await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {


                                        await Posts.findOne({ postUniqueId: everyPostUniqueID }).then(async function (resultOnePost) {
                                            console.log('post ta paise')
                                            // console.log(resultOnePost);
                                            resultOnePostOBJ = []
                                            resultOnePostOBJ.push(resultOnePost);

                                            var allMyPost_Like = [];
                                            for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                                allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                            }

                                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                                allMyComment = []
                                                await Comments.find({ originPostUniqueID: everyPostUniqueID }).then((resultPerPost) => {
                                                    //     // console.log(resultPerPost);
                                                    console.log('Comment collect kora shuru korse')
                                                    var obj2;
                                                    // console.log(resultPerPost);
                                                    for (var j = 0; j < resultPerPost.length; j++) {
                                                        obj2 = (resultPerPost[j]);
                                                        // console.log(obj2);
                                                        if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                            // resultPerPost[j].isCommentMine='yes';
                                                            obj2.isCommentMine = 'yes';
                                                        }

                                                        allMyComment.push(obj2);
                                                    }

                                                    //     // allMyComment.push(resultPerPost);
                                                    // console.log(resultOnePost);
                                                    // console.log(allMyComment);


                                                    res.render('viewGroupOnePost', {
                                                        myKey: req.cookies.key,
                                                        myName: req.cookies.name,
                                                        myProPic: req.cookies.proPicAddr,
                                                        myCoverPic: req.cookies.proCoverPicAddr,

                                                        singleGroupKey: groupKeyValue,
                                                        youKnowWho: youKnowWho,

                                                        resultUser: resultUser,

                                                        resultOnePost: resultOnePostOBJ,
                                                        allMyComment: allMyComment,
                                                        resultAllLikeList: resultAllLikeList,

                                                        resultAllFreeGroup: resultAllFreeGroup,

                                                        myAllNotification: myAllNotification

                                                    });

                                                }).catch((error) => {
                                                    console.log('Failed to collect all comment per post');
                                                    res.render('test.hbs', {
                                                        alert_name: 'danger',
                                                        alert_msg_visibility: 'visible',
                                                        SorF: 'Failure!',
                                                        status: 'Failed to collect all comment per post'
                                                    });
                                                });
                                            }).catch((error) => {
                                                console.log('Failed to collect like list');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to collect like list'
                                                });
                                            });



                                        }).catch((error) => {
                                            console.log('Error : Failed to collect one post');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect one post!'
                                            });
                                        });
                                    }).catch((error) => {
                                        console.log('Failed to collect my information');
                                        console.log(error);
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect my information'
                                        });
                                    });
                                }).catch((error) => {
                                    console.log('Failed to collect one user information');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect one user information'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Failed to collect group');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect group'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to find group members');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to find group members'
                            });
                        });
                    }
                }
                else if(singleNotify.isFollow === "yes"){
                    console.log('follow related notification');
                    
                    var friendUserKey = singleNotify.notifyLink;
                    
                    if (friendUserKey === req.cookies.key) {
                        console.log('eta to amari profile');

                        res.redirect('myProfile');
                    }
                    else {

                        console.log('eta amr profile na... eta amar friend er profile');

                        bestFriend = friendUserKey;
                        res.redirect('friendProfile');
                    }


                }
                else{
                    console.log('like or comment related notification - nijer profile e kew like or comment dile');

                    var everyPostUniqueID = singleNotify.notifyLink;

                    console.log('view e dhukse');

                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                            resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                            await Posts.findOne({ postUniqueId: everyPostUniqueID }).then(async function (resultOnePost) {
                                console.log('post ta paise')
                                // console.log(resultOnePost);
                                resultOnePostOBJ = []
                                resultOnePostOBJ.push(resultOnePost);

                                var allMyPost_Like = [];
                                for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                    allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                }

                                await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                    allMyComment = []
                                    await Comments.find({ originPostUniqueID: everyPostUniqueID }).then((resultPerPost) => {
                                        //     // console.log(resultPerPost);
                                        console.log('Comment collect kora shuru korse')
                                        var obj2;
                                        // console.log(resultPerPost);
                                        for (var j = 0; j < resultPerPost.length; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                        //     // allMyComment.push(resultPerPost);
                                        // console.log(resultOnePost);
                                        // console.log(allMyComment);


                                        res.render('viewMyOnePost', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,

                                            resultOnePost: resultOnePostOBJ,
                                            allMyComment: allMyComment,

                                            resultAllLikeList:resultAllLikeList,

                                            resultAllFreeGroup: resultAllFreeGroup,

                                            myAllNotification: myAllNotification
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });
                                }).catch((error) => {
                                    console.log('Failed to collect like list');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect like list'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Error : Failed to collect one post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one post!'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });

                }
            }).catch((error) => {
                console.log('Failed to find notification');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find notification'
                });
            });
        
        }).catch((error) => {
            console.log('Failed to change notification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to change notification'
            });
        });
    }
});


app.get('/markAllNotificationAsRead', async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        

        await Notifications.updateMany({
            notifyWhom: req.cookies.key
        }, {
            $set: {
                notifyListColor: "ipPeopleList2"
            }

        }).then(async function (changeNotify) {


            await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
                console.log('ekhane');
                await Notifications.find({ notifyWhom: req.cookies.key }).then(async function (resultAllNotification) {
                    console.log('ekhane');

                    await Follows.find({ followerID: req.cookies.key }).then(async function (resultAllUser) {
                        var allMan = []
                        allMan.push(req.cookies.key);
                        console.log(resultAllUser.length);
                        for (var i = 0; i < resultAllUser.length; i++) {
                            allMan.push(resultAllUser[i].followingID);
                        }
                        // console.log(allMan);
                        await Users.find({ userUniqueId: { $nin: allMan } }).then(async function (resultAllFreeUser) {

                            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                                var allGroup = []
                                console.log(resultAllGroup.length);
                                for (var i = 0; i < resultAllGroup.length; i++) {
                                    allGroup.push(resultAllGroup[i].groupUniqueId);
                                }
                                // console.log(allMan);
                                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                                    await groupRequests.find({ userUniqueId: req.cookies.key }).then(async function (resultAllRequestGroup) {

                                        console.log(resultAllRequestGroup.length);
                                        for (var i = 0; i < resultAllRequestGroup.length; i++) {
                                            allGroup.push(resultAllRequestGroup[i].groupUniqueId);
                                        }

                                        await Groups.find({ groupUniqueId: { $nin: allGroup } }).then(async function (resultAllOthersGroup) {



                                            console.log('Now in home get function');
                                            resultAllFreeUser = resultAllFreeUser.slice(0, 6);
                                            resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);
                                            resultAllOthersGroup = resultAllOthersGroup.slice(0, 12);


                                            resultAllNotification = resultAllNotification.reverse();

                                            res.render('notifications', {
                                                myKey: req.cookies.key,
                                                myName: req.cookies.name,
                                                myProPic: req.cookies.proPicAddr,
                                                resultAllFreeUser: resultAllFreeUser,
                                                resultAllFreeGroup: resultAllFreeGroup,
                                                resultAllOthersGroup: resultAllOthersGroup,

                                                myAllNotification: resultAllUnreadNotification.length,
                                                resultAllNotification: resultAllNotification

                                            });



                                        }).catch((error) => {
                                            console.log('Failed to collect group');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect group'
                                            });
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect group');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect group'
                                        });
                                    });



                                }).catch((error) => {
                                    console.log('Failed to collect group');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect group'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to find group members');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to find group members'
                                });
                            });





                        }).catch((error) => {
                            console.log('Failed to collect user');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect user'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find follow');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find follow'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to find notification');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find notification'
                    });
                });
            }).catch((error) => {
                console.log('Failed to find notification');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find notification'
                });
            });

        }).catch((error) => {
            console.log('Failed to change notification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to change notification'
            });
        });

    }

});


// ------------------------------------------ My Profile Page---------------------------------------------
/**
 * Checks file extention for validation
 * 
 */
function checkFileType(filePathForChecking) {
    return new Promise(function (resolve, reject) {
        detect.fromFile(filePathForChecking, function (err, result) {
            if (err) {
                return reject(err);
            }
            console.log('start checking file type');
            // console.log(result); // { ext: 'jpg', mime: 'image/jpeg' }

            if (result.ext === 'jpg' | result.ext === 'png' | result.ext === 'jpeg') {
                return resolve('image');
            }
            else if (result.ext === 'pdf') {
                return resolve('pdf');
            }
            else if(result.ext === 'mkv' | result.ext === 'mp4'){
                return resolve('video');
            }
            else {
                return reject(err);
            }
        });
    });
}

/**
 * Loads own profile
 */
app.get('/myProfile', async function (req, res) {

    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                await Follows.find({ followerID: req.cookies.key }).then(async function (resultFollower) {

                    await Follows.find({ followingID: req.cookies.key }).then(async function (resultFollowing) {

                        await Posts.find({userORGroupUniqueID: req.cookies.key, isUserOrGroup:'user'}).then( async function (allUserList) {
                            // console.log(allUserList);
                            console.log('Collect all post from database');
                            var allMyPost = allUserList;

                            var allMyPost_Like = [];
                            for (let li = 0; li < allMyPost.length; li++) {
                                allMyPost_Like.push(allMyPost[li].postUniqueId);
                            }

                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {

                                allMyComment = [];
                                for (var i = 0; i < allMyPost.length; i++) {
                                    var obj = (allMyPost[i]);
                                    // console.log(obj);
                                    await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                        var obj2;
                                        // console.log(resultPerPost);

                                        commentLengthHigh = Math.min(5, resultPerPost.length);

                                        for (var j = 0; j < commentLengthHigh; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });
                                }


                                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);
                                allUserList = allUserList.reverse();

                                res.render('myProfile', {
                                    myKey: req.cookies.key,
                                    myName: req.cookies.name,
                                    myProPic: req.cookies.proPicAddr,
                                    myCoverPic: req.cookies.proCoverPicAddr,

                                    sumAllPost: allMyPost.length,
                                    sumAllFollower: resultFollower.length,
                                    sumAllFollowing: resultFollowing.length,

                                    allUserList: allUserList,
                                    allMyComment: allMyComment,

                                    resultAllLikeList: resultAllLikeList,

                                    resultAllFreeGroup: resultAllFreeGroup,

                                    myAllNotification: myAllNotification
                                });

                            }).catch((error) => {
                                console.log('Failed to collect like list');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect like list'
                                });
                            });
                        }).catch((error)=>{
                            console.log('Failed to collect all post');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect all post'
                            });
                        });


                    }).catch((error) => {
                        console.log('Failed to find follow');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find follow'
                        });
                    });
                    

                }).catch((error) => {
                    console.log('Failed to find follow');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find follow'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
    }
})



app.post('/userCoverPicChange', dirCoverPic.single('myImage'), urlencodedParser, async function (req, res) {

    if (!req.file) {
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading a group cover!'
        });
    };
    
    var fileName = req.file.originalname;
    var preFilePath = req.file.path.substring(4, req.file.path.length)
    preFilePath = __dirname + "/" + preFilePath;
    var dateFile = "/" + Date.now() + "/" + fileName;
    var newFilePath = path.join(__dirname, './website/media/coverPic/' + dateFile);
    var proFilePath = "/media/coverPic" + dateFile;
    // console.log(preFilePath);
    // console.log(dateFile);
    // console.log(newFilePath);
    // console.log(proFilePath);
    await fileNewPath(preFilePath, newFilePath).then(async function (result) {
        // console.log(result);
        console.log('File path changed successfully');
        
        await Users.updateOne({
                userEmail: req.cookies.email
        }, {
            $set:{
                userCoverPicAddr: proFilePath
            }

        }).then((resultUser) => {
            res.clearCookie('proCoverPicAddr');
            // console.log(resultUser);
            res.cookie('proCoverPicAddr', proFilePath);
            
            console.log('Cover pic changed successfully');

            res.redirect('myProfile');

        }).catch((error) => {
            console.log('Failed to update cover picture');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update cover picture'
            });
        });

    }).catch((error) => {
        // console.log(error);
        console.log('Error : File path transfer');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading an image!'
        });
    });

});

/**
 * Profile Picture Change
 */
app.post('/userProfilePicChange', dirProPic.single('myImage'), urlencodedParser, async function (req, res) {

    if (!req.file) {
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading a profile picture!'
        });
    };

    var fileName = req.file.originalname;
    var preFilePath = req.file.path.substring(4, req.file.path.length)
    preFilePath = __dirname + "/" + preFilePath;
    var dateFile = "/" + Date.now() + "/" + fileName;
    var newFilePath = path.join(__dirname, './website/media/proPic/' + dateFile);
    var proFilePath = "/media/proPic" + dateFile;
    // console.log(preFilePath);
    // console.log(dateFile);
    // console.log(newFilePath);
    // console.log(proFilePath);
    await fileNewPath(preFilePath, newFilePath).then(async function (result) {
        // console.log(result);
        console.log('File path changed successfully');

        await Users.updateOne({
            userEmail: req.cookies.email
        }, {
            $set: {
                userProPicAddr: proFilePath
            }

        }).then((resultUser) => {
            res.clearCookie('proPicAddr');
            // console.log(resultUser);
            res.cookie('proPicAddr', proFilePath);

            console.log('Profile pic changed successfully');

            res.redirect('myProfile');

        }).catch((error) => {
            console.log('Failed to update profile picture');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update profile picture'
            });
        });

    }).catch((error) => {
        // console.log(error);
        console.log('Error : File path transfer');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'We are sorry you are having trouble uploading an image!'
        });
    });

});


/**
 * Upload Post
 */

app.post('/userPostUpload', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {
    
    var postKey = 'sustCSElifePOST' + Date.now();
    postKey = crypto.createHash('sha256').update(postKey).digest("base64");


    
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    var isFileType="";

    var tillNowPostCount=0;


    await Posts.find({}).then(async function (allPostLenght) {

        tillNowPostCount = allPostLenght.length;


        if(!req.file){

            console.log(dateTime);

            const newPost = new Posts({
                postNumber: tillNowPostCount,
                postUniqueId: postKey,
                userORGroupUniqueID: req.cookies.key,
                postOwnerUniqueID: req.cookies.key,
                postOwnerPic: req.cookies.proPicAddr,
                postOwnerName: req.cookies.name,
                postTime: dateTime,
                postText: req.body.postText,
                postFileAddr: "nan",
                isFileType: "nan",
                isImageFile: '',
                isPdfFile: '',
                isVideoFile: '',
                isUserOrGroup: 'user',
                isGroupName: '',
                isAdmin: '',
                isLike: 'no',
                likeCount: 0,
                commentCount: 0
            });

            await newPost.save().then(async function()  {
                console.log('Post save successfully');
                await Users.find({}).then(async function (allUserList) {
                    for (let li = 0; li < allUserList.length; li++) {
                        var element = allUserList[li];

                        var likeKey = 'sustCSElifeLIKE' + li.toString() + Date.now();
                        likeKey = crypto.createHash('sha256').update(likeKey).digest("base64");

                        const newLike = new Likes({
                            likeUniqueId: likeKey,
                            originPostUniqueID: postKey,
                            ownerLikeUniqueID: element.userUniqueId,
                            isLike: 'no',
                            userPhoto: element.userProPicAddr,
                            userName: element.userName
                        });
                        await newLike.save().then(() => {
                            console.log('Like save successfully');
                            
                        }).catch((error) => {
                            console.log('Error : Failed to save like');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to save like!'
                            });
                        });
                    }

                    res.redirect('myProfile');
                    
                }).catch((error) => {
                    console.log('Error : Failed to users');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to users!'
                    });
                });

            }).catch((error) => {
                console.log('Error : Failed to save post');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to save post!'
                });
            });
        }
        else{

            var fileName = req.file.originalname;
            var preFilePath = req.file.path.substring(4, req.file.path.length)
                preFilePath = __dirname + "/" + preFilePath;
            var dateFile = "/" + Date.now() + "/" + fileName;
            var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
            var proFilePath = "/media/postFile" + dateFile;
            var filePathForChecking = './src/website/media/postFile/' + dateFile;
        
            // console.log(preFilePath);
            // console.log(dateFile);
            // console.log(newFilePath);
            // console.log(proFilePath);
            await fileNewPath(preFilePath, newFilePath).then(async function (result) {
                // console.log(result);
                console.log('File path changed successfully');
                console.log(filePathForChecking);
                await checkFileType(filePathForChecking).then(async function (result) {
                    console.log('File checkup successfully');
                    isFileType = result;
        
                    
                    console.log(dateTime);
                    var ifImage='';
                    var ifPdf='';
                    var ifVideo='';
                    if(isFileType=='image'){
                        ifImage="yes"
                    }
                    else if(isFileType=='pdf'){
                        ifPdf="yes"
                    }
                    else{
                        ifVideo="yes"
                    }
        
                    const newPost = new Posts({
                        postNumber: tillNowPostCount,
                        postUniqueId: postKey,
                        userORGroupUniqueID: req.cookies.key,
                        postOwnerUniqueID: req.cookies.key,
                        postOwnerPic: req.cookies.proPicAddr,
                        postOwnerName: req.cookies.name,
                        postTime: dateTime,
                        postText: req.body.postText,
                        postFileAddr: proFilePath,
                        isFileType: isFileType,
                        isImageFile: ifImage,
                        isPdfFile: ifPdf,
                        isVideoFile: ifVideo,
                        isUserOrGroup: 'user',
                        isGroupName: '',
                        isAdmin: '',
                        likeCount: 0,
                        commentCount: 0
                    }); 
        
                    await newPost.save().then(async function()  {
                        console.log('Post save successfully');
                        await Users.find({}).then(async function (allUserList) {
                            for (let li = 0; li < allUserList.length; li++) {
                                var element = allUserList[li];

                                var likeKey = 'sustCSElifeLIKE' + li.toString() + Date.now();
                                likeKey = crypto.createHash('sha256').update(likeKey).digest("base64");

                                const newLike = new Likes({
                                    likeUniqueId: likeKey,
                                    originPostUniqueID: postKey,
                                    ownerLikeUniqueID: element.userUniqueId,
                                    isLike: 'no',
                                    userPhoto: element.userProPicAddr,
                                    userName: element.userName
                                });
                                await newLike.save().then(() => {
                                    console.log('Like save successfully');

                                }).catch((error) => {
                                    console.log('Error : Failed to save like');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to save like!'
                                    });
                                });
                            }

                            res.redirect('myProfile');

                        }).catch((error) => {
                            console.log('Error : Failed to users');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to users!'
                            });
                        });
                    }).catch((error) => {
                        console.log('Error : Failed to save post');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to save post!'
                        });
                    });
                    
                }).catch((error) => {
                    console.log('Error : Failed to check filetype');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to check filetype!'
                    });
                });
        
            }).catch((error) => {
                // console.log(error);
                console.log('Error : File path transfer');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'We are sorry you are having trouble uploading a file!'
                });
            });
        }

    }).catch((error) => {
        console.log('Failed to collect all post');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to collect all post'
        });
    });
});

app.post('/userPostUploadFromHome', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    var postKey = 'sustCSElifePOST' + Date.now();
    postKey = crypto.createHash('sha256').update(postKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;


    var tillNowPostCount = 0;


    await Posts.find({}).then(async function (allPostLenght) {

        tillNowPostCount = allPostLenght.length;
    

        var isFileType = "";
        await Users.find({}).then(async function (allUserList) {

            for (let li = 0; li < allUserList.length; li++) {
                var element = allUserList[li];

                var likeKey = 'sustCSElifeLIKE' + li.toString() + Date.now();
                likeKey = crypto.createHash('sha256').update(likeKey).digest("base64");

                const newLike = new Likes({
                    likeUniqueId: likeKey,
                    originPostUniqueID: postKey,
                    ownerLikeUniqueID: element.userUniqueId,
                    isLike: 'no',
                    userPhoto: element.userProPicAddr,
                    userName: element.userName
                });
                await newLike.save().then(() => {
                    console.log('Like save successfully');

                }).catch((error) => {
                    console.log('Error : Failed to save like');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save like!'
                    });
                });
            }

            if (!req.file) {

                console.log(dateTime);

                const newPost = new Posts({
                    postNumber: tillNowPostCount,
                    postUniqueId: postKey,
                    userORGroupUniqueID: req.cookies.key,
                    postOwnerUniqueID: req.cookies.key,
                    postOwnerPic: req.cookies.proPicAddr,
                    postOwnerName: req.cookies.name,
                    postTime: dateTime,
                    postText: req.body.postText,
                    postFileAddr: "nan",
                    isFileType: "nan",
                    isImageFile: '',
                    isPdfFile: '',
                    isVideoFile: '',
                    isUserOrGroup: 'user',
                    isGroupName: '',
                    isAdmin: '',
                    likeCount: 0,
                    commentCount: 0
                });

                await newPost.save().then(async function()  {
                    console.log('Post save successfully');
                    
                    res.redirect('home');
                    
                }).catch((error) => {
                    console.log('Error : Failed to save post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save post!'
                    });
                });
            }
            else {

                var fileName = req.file.originalname;
                var preFilePath = req.file.path.substring(4, req.file.path.length)
                preFilePath = __dirname + "/" + preFilePath;
                var dateFile = "/" + Date.now() + "/" + fileName;
                var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
                var proFilePath = "/media/postFile" + dateFile;
                var filePathForChecking = './src/website/media/postFile/' + dateFile;

                // console.log(preFilePath);
                // console.log(dateFile);
                // console.log(newFilePath);
                // console.log(proFilePath);
                await fileNewPath(preFilePath, newFilePath).then(async function (result) {
                    // console.log(result);
                    console.log('File path changed successfully');
                    console.log(filePathForChecking);
                    await checkFileType(filePathForChecking).then(async function (result) {
                        console.log('File checkup successfully');
                        isFileType = result;


                        console.log(dateTime);
                        var ifImage = '';
                        var ifPdf = '';
                        var ifVideo = '';
                        if (isFileType == 'image') {
                            ifImage = "yes"
                        }
                        else if (isFileType == 'pdf') {
                            ifPdf = "yes"
                        }
                        else {
                            ifVideo = "yes"
                        }

                        const newPost = new Posts({
                            postNumber: tillNowPostCount,
                            postUniqueId: postKey,
                            userORGroupUniqueID: req.cookies.key,
                            postOwnerUniqueID: req.cookies.key,
                            postOwnerPic: req.cookies.proPicAddr,
                            postOwnerName: req.cookies.name,
                            postTime: dateTime,
                            postText: req.body.postText,
                            postFileAddr: proFilePath,
                            isFileType: isFileType,
                            isImageFile: ifImage,
                            isPdfFile: ifPdf,
                            isVideoFile: ifVideo,
                            isUserOrGroup: 'user',
                            isGroupName: '',
                            isAdmin: '',
                            likeCount: 0,
                            commentCount: 0
                        });

                        await newPost.save().then(() => {
                            console.log('Post save successfully');
                            res.redirect('home');
                        }).catch((error) => {
                            console.log('Error : Failed to save post');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to save post!'
                            });
                        });

                    }).catch((error) => {
                        console.log('Error : Failed to check filetype');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to check filetype!'
                        });
                    });

                }).catch((error) => {
                    // console.log(error);
                    console.log('Error : File path transfer');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'We are sorry you are having trouble uploading a file!'
                    });
                });
            }
        
        }).catch((error) => {
            console.log('Error : Failed to users');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to users!'
            });
        });
    }).catch((error) => {
        console.log('Error : Failed to collect post');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to collect post!'
        });
    });
});

app.post('/groupPostUpload', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    var postKey = 'sustCSElifePOST' + Date.now();
    postKey = crypto.createHash('sha256').update(postKey).digest("base64");


    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    var isFileType = "";
    
    var groupUniqueKey = req.body.groupUniqueKey;


    console.log('is groupUniqueID printed?')
    console.log(groupUniqueKey);

    var tillNowPostCount = 0;


    await Posts.find({}).then(async function (allPostLenght) {

        tillNowPostCount = allPostLenght.length;


        await Users.find({}).then(async function (allUserList) {
            for (let li = 0; li < allUserList.length; li++) {
                var element = allUserList[li];

                var likeKey = 'sustCSElifeLIKE' + li.toString() + Date.now();
                likeKey = crypto.createHash('sha256').update(likeKey).digest("base64");

                const newLike = new Likes({
                    likeUniqueId: likeKey,
                    originPostUniqueID: postKey,
                    ownerLikeUniqueID: element.userUniqueId,
                    isLike: 'no',
                    userPhoto: element.userProPicAddr,
                    userName: element.userName
                });
                await newLike.save().then(() => {
                    console.log('Like save successfully');

                }).catch((error) => {
                    console.log('Error : Failed to save like');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save like!'
                    });
                });
            }
            if (!req.file) {
                console.log(dateTime);
                await Groups.findOne({ groupUniqueId: groupUniqueKey }).then(async function (resultOneGroup) {
                    await groupMembers.findOne({ groupUniqueId: groupUniqueKey, userUniqueId: req.cookies.key }).then(async function (resultIsAdmin) {
                        var textMessage = req.body.postText;


                        const newPost = new Posts({
                            postNumber: tillNowPostCount,
                            postUniqueId: postKey,
                            userORGroupUniqueID: groupUniqueKey,
                            postOwnerUniqueID: req.cookies.key,
                            postOwnerPic: req.cookies.proPicAddr,
                            postOwnerName: req.cookies.name,
                            postTime: dateTime,
                            postText: textMessage,
                            postFileAddr: "nan",
                            isFileType: "nan",
                            isImageFile: '',
                            isPdfFile: '',
                            isVideoFile: '',
                            isUserOrGroup: 'group',
                            isGroupName: resultOneGroup.groupName,
                            isAdmin: resultIsAdmin.isAdmin,
                            likeCount: 0,
                            commentCount: 0
                        });

                        console.log('now post will save to the database');

                        await newPost.save().then(async function () {
                            console.log('Post save successfully');

                            await Groups.findOne({ groupUniqueId: groupUniqueKey }).then(async function (oneGroupInfo) {

                                await groupMembers.find({ groupUniqueId: groupUniqueKey, userUniqueId: { $ne: req.cookies.key } }).then(async function (allThisGroupMember) {

                                    for (let groupIndex = 0; groupIndex < allThisGroupMember.length; groupIndex++) {
                                        const element = allThisGroupMember[groupIndex];

                                        var notificationKey = 'sustCSElifeNotify' + Date.now();
                                        notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");


                                        var newNotification = new Notifications({
                                            notifyUniqueId: notificationKey,
                                            notifyWhom: element.userUniqueId,
                                            notifyLink: newPost.postUniqueId,
                                            notifyLinkGroup: groupUniqueKey,
                                            notifyUserUniqueID: req.cookies.key,
                                            notifyUserPhoto: req.cookies.proPicAddr,
                                            notifyUserName: req.cookies.name,
                                            notifyTime: dateTime,
                                            notifyText: 'posted in ' + oneGroupInfo.groupName,
                                            isFollow: 'no',
                                            isLike: 'no',
                                            isComment: 'no',
                                            isGroup: 'yes',
                                            notifyListColor: 'ipPeopleList3'
                                        });

                                        await newNotification.save().then(async function (resultNotify) {
                                            console.log('Notification sent successfully');

                                        }).catch((error) => {
                                            console.log('Failed to save notification');
                                            console.log(error);
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to save notification'
                                            });
                                        });


                                    }

                                    groupRegNo = groupUniqueKey;

                                    res.redirect('viewAGroup');




                                }).catch((error) => {
                                    console.log('Failed to collect allThisGroupMember information');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect allThisGroupMember information'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to collect group information');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect group information'
                                });
                            });

                            



                        }).catch((error) => {
                            console.log('Error : Failed to save post');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to save post!'
                            });
                        });


                    }).catch((error) => {
                        console.log('Error : Failed to collect one group Is Admin');
                        console.log(error);
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one group Is Admin!'
                        });
                    });
                }).catch((error) => {
                    console.log('Error : Failed to collect one group information');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect one group information!'
                    });
                });
            }
            else {

                var fileName = req.file.originalname;
                var preFilePath = req.file.path.substring(4, req.file.path.length)
                preFilePath = __dirname + "/" + preFilePath;
                var dateFile = "/" + Date.now() + "/" + fileName;
                var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
                var proFilePath = "/media/postFile" + dateFile;
                var filePathForChecking = './src/website/media/postFile/' + dateFile;

                // console.log(preFilePath);
                // console.log(dateFile);
                // console.log(newFilePath);
                // console.log(proFilePath);
                await fileNewPath(preFilePath, newFilePath).then(async function (result) {
                    // console.log(result);
                    console.log('File path changed successfully');
                    console.log(filePathForChecking);
                    await checkFileType(filePathForChecking).then(async function (result) {
                        console.log('File checkup successfully');
                        isFileType = result;


                        console.log(dateTime);
                        var ifImage = '';
                        var ifPdf = '';
                        var ifVideo = '';
                        if (isFileType == 'image') {
                            ifImage = "yes"
                        }
                        else if (isFileType == 'pdf') {
                            ifPdf = "yes"
                        }
                        else {
                            ifVideo = "yes"
                        }

                        console.log(dateTime);
                        await Groups.findOne({ groupUniqueId: groupUniqueKey }).then(async function (resultOneGroup) {
                            await groupMembers.findOne({ groupUniqueId: groupUniqueKey, userUniqueId: req.cookies.key }).then(async function (resultIsAdmin) {

                                const newPost = new Posts({
                                    postNumber: tillNowPostCount,
                                    postUniqueId: postKey,
                                    userORGroupUniqueID: groupUniqueKey,
                                    postOwnerUniqueID: req.cookies.key,
                                    postOwnerPic: req.cookies.proPicAddr,
                                    postOwnerName: req.cookies.name,
                                    postTime: dateTime,
                                    postText: req.body.postText,
                                    postFileAddr: proFilePath,
                                    isFileType: isFileType,
                                    isImageFile: ifImage,
                                    isPdfFile: ifPdf,
                                    isVideoFile: ifVideo,
                                    isUserOrGroup: 'group',
                                    isGroupName: resultOneGroup.groupName,
                                    isAdmin: resultIsAdmin.isAdmin,
                                    likeCount: 0,
                                    commentCount: 0
                                });

                                await newPost.save().then(async function () {
                                    console.log('Post save successfully');

                                    await Groups.findOne({ groupUniqueId: groupUniqueKey }).then(async function (oneGroupInfo) {

                                        await groupMembers.find({ groupUniqueId: groupUniqueKey, userUniqueId: { $ne: req.cookies.key } }).then(async function (allThisGroupMember) {

                                            for (let groupIndex = 0; groupIndex < allThisGroupMember.length; groupIndex++) {
                                                const element = allThisGroupMember[groupIndex];

                                                var notificationKey = 'sustCSElifeNotify' + Date.now();
                                                notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");


                                                var newNotification = new Notifications({
                                                    notifyUniqueId: notificationKey,
                                                    notifyWhom: element.userUniqueId,
                                                    notifyLink: newPost.postUniqueId,
                                                    notifyLinkGroup: groupUniqueKey,
                                                    notifyUserUniqueID: req.cookies.key,
                                                    notifyUserPhoto: req.cookies.proPicAddr,
                                                    notifyUserName: req.cookies.name,
                                                    notifyTime: dateTime,
                                                    notifyText: 'posted in ' + oneGroupInfo.groupName,
                                                    isFollow: 'no',
                                                    isLike: 'no',
                                                    isComment: 'no',
                                                    isGroup: 'yes',
                                                    notifyListColor: 'ipPeopleList3'
                                                });

                                                await newNotification.save().then(async function (resultNotify) {
                                                    console.log('Notification sent successfully');

                                                }).catch((error) => {
                                                    console.log('Failed to save notification');
                                                    console.log(error);
                                                    res.render('test.hbs', {
                                                        alert_name: 'danger',
                                                        alert_msg_visibility: 'visible',
                                                        SorF: 'Failure!',
                                                        status: 'Failed to save notification'
                                                    });
                                                });


                                            }
                                            //  start here
                                            groupRegNo = groupUniqueKey;
                                            res.redirect('viewAGroup');


                                            

                                        }).catch((error) => {
                                            console.log('Failed to collect allThisGroupMember information');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect allThisGroupMember information'
                                            });
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect group information');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect group information'
                                        });
                                    });


                                }).catch((error) => {
                                    console.log('Error : Failed to save post');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to save post!'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Error : Failed to collect one group Is Admin');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one group Is Admin!'
                                });
                            });
                        }).catch((error) => {
                            console.log('Error : Failed to collect one group information');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect one group information!'
                            });
                        });

                    }).catch((error) => {
                        console.log('Error : Failed to check filetype');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to check filetype!'
                        });
                    });

                }).catch((error) => {
                    // console.log(error);
                    console.log('Error : File path transfer');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'We are sorry you are having trouble uploading a file!'
                    });
                });
            }

        }).catch((error) => {
            console.log('Error : Failed to users');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to users!'
            });
        });
    }).catch((error) => {
        console.log('Error : Failed to collect post');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to collect post!'
        });
    });

});

app.post('/groupPostSetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        // console.log('button click mission successfull')
        var settingBtn = req.body.settingBtn;
        // console.log(req.body.eachPostUniqueID);
        var everyPostUniqueID = req.body.eachPostUniqueID;
        var groupKeyValue = req.body.groupUniqueID;
        var eachPostOwnerUniqueID = req.body.eachPostOwnerUniqueID;
        console.log(everyPostUniqueID);
        console.log(groupKeyValue);
        console.log(eachPostOwnerUniqueID);
        
        
        console.log(settingBtn);
        if (settingBtn === "delete") {
            console.log('delete e dhukse');
            Posts.findOneAndDelete({ postUniqueId: everyPostUniqueID }).then(async function(resultUser)  {

                groupRegNo = groupKeyValue;
                res.redirect('viewAGroup');

            }).catch((error) => {
                console.log('Error : Failed to delete post');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete post!'
                });
            });

        }
        else if (settingBtn === 'view') {
            console.log('view e dhukse');

            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                    await Users.findOne({ userUniqueId: eachPostOwnerUniqueID }).then(async function (resultUser) {
                        await groupMembers.findOne({ groupUniqueId: groupKeyValue, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {


                            await Posts.findOne({ postUniqueId: everyPostUniqueID }).then(async function (resultOnePost) {
                                console.log('post ta paise')
                                // console.log(resultOnePost);
                                resultOnePostOBJ = []
                                resultOnePostOBJ.push(resultOnePost);


                                var allMyPost_Like = [];
                                for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                    allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                }

                                await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                    allMyComment = []
                                    await Comments.find({ originPostUniqueID: everyPostUniqueID }).then((resultPerPost) => {
                                        //     // console.log(resultPerPost);
                                        console.log('Comment collect kora shuru korse')
                                        var obj2;
                                        // console.log(resultPerPost);
                                        for (var j = 0; j < resultPerPost.length; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                        //     // allMyComment.push(resultPerPost);
                                        // console.log(resultOnePost);
                                        // console.log(allMyComment);


                                        res.render('viewGroupOnePost', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,

                                            singleGroupKey: groupKeyValue,
                                            youKnowWho: youKnowWho,

                                            resultUser: resultUser,

                                            resultOnePost: resultOnePostOBJ,
                                            allMyComment: allMyComment,

                                            resultAllLikeList: resultAllLikeList,

                                            resultAllFreeGroup: resultAllFreeGroup,

                                            myAllNotification: myAllNotification

                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect like list');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect like list'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Error : Failed to collect one post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one post!'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect my information');
                            console.log(error);
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect my information'
                            });
                        });
                    }).catch((error) => {
                        console.log('Failed to collect one user information');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one user information'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });
        }
    }
});



app.post('/groupPostSettingEachPost', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        
        // console.log('button click mission successfull')
        var settingBtn = req.body.settingBtn;
        // console.log(req.body.eachPostUniqueID);
        var everyPostUniqueID = req.body.eachPostUniqueID;
        var groupKeyValue = req.body.groupUniqueID;
        var eachPostOwnerUniqueID = req.body.eachPostOwnerUniqueID;
        console.log(everyPostUniqueID);
        console.log(groupKeyValue);
        console.log(eachPostOwnerUniqueID);



        console.log(settingBtn);
        if (settingBtn === "delete") {
            console.log('delete e dhukse');
            Posts.findOneAndDelete({ postUniqueId: everyPostUniqueID }).then(async function (resultUser) {
                groupRegNo = groupKeyValue;
                res.redirect('viewAGroup');

            }).catch((error) => {
                console.log('Error : Failed to delete post');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete post!'
                });
            });

        }
        
        
    }
});

/***
 * Edit Group Post 
 */
app.post('/editGroupPost', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    var groupUniqueKey = req.body.groupKeyValue;
    var postKeyValue = req.body.postKeyValue;

    console.log(groupUniqueKey);
    console.log(postKeyValue);
    
    

    if (!req.file) {
        console.log('file chara');
        await Posts.updateOne({
            postUniqueId: postKeyValue
        }, {
            $set: {
                postText: req.body.postText
            }

        }).then(async function(resultUser) {
            // console.log(resultUser);

            console.log('Post changed successfully');

            groupRegNo = groupUniqueKey;
            res.redirect('viewAGroup');

        }).catch((error) => {
            console.log('Failed to update post');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update post'
            });
        });
    }
    else {
        console.log('file shoho');
        var fileName = req.file.originalname;
        var preFilePath = req.file.path.substring(4, req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
        var dateFile = "/" + Date.now() + "/" + fileName;
        var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
        var proFilePath = "/media/postFile" + dateFile;
        var filePathForChecking = './src/website/media/postFile/' + dateFile;

        var isFileType = "";
        // console.log(preFilePath);
        // console.log(dateFile);
        // console.log(newFilePath);
        // console.log(proFilePath);
        await fileNewPath(preFilePath, newFilePath).then(async function (result) {
            // console.log(result);
            console.log('File path changed successfully');

            await checkFileType(filePathForChecking).then(async function (result2) {
                console.log('File checkup successfully');
                isFileType = result2;


                // console.log(dateTime);
                var ifImage = '';
                var ifPdf = '';
                var ifVideo = '';
                if (isFileType == 'image') {
                    ifImage = "yes"
                }
                else if (isFileType == 'pdf') {
                    ifPdf = "yes"
                }
                else {
                    ifVideo = "yes"
                }

                await Posts.updateOne({
                    postUniqueId: postKeyValue
                }, {
                    $set: {
                        postText: req.body.postText,
                        postFileAddr: proFilePath,
                        isFileType: isFileType,
                        isImageFile: ifImage,
                        isPdfFile: ifPdf,
                        isVideoFile: ifVideo
                    }

                }).then(async function(resultUser) {
                    // console.log(resultUser);

                    console.log('Post changed successfully');

                    groupRegNo = groupUniqueKey;
                    res.redirect('viewAGroup');

                }).catch((error) => {
                    console.log('Failed to update post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update post'
                    });
                });




            }).catch((error) => {
                console.log('Error : Failed to check filetype');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to check filetype!'
                });
            });

        }).catch((error) => {
            // console.log(error);
            console.log('Error : File path transfer');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'File path transfer failed!'
            });
        });
    }


});

/**
 * Edit group posts from home page
 */
app.post('/editGroupPostFromHome', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    var postKeyValue = req.body.postKeyValue;

    console.log(postKeyValue);



    if (!req.file) {
        console.log('file chara');
        await Posts.updateOne({
            postUniqueId: postKeyValue
        }, {
            $set: {
                postText: req.body.postText
            }

        }).then(async function (resultUser) {
            // console.log(resultUser);

            console.log('Post changed successfully');

            if (req.body.nijerPost === 'watch') {
                res.redirect('watch');
            }
            else {
                res.redirect('home');
            }

        }).catch((error) => {
            console.log('Failed to update post');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update post'
            });
        });
    }
    else {
        console.log('file shoho');
        var fileName = req.file.originalname;
        var preFilePath = req.file.path.substring(4, req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
        var dateFile = "/" + Date.now() + "/" + fileName;
        var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
        var proFilePath = "/media/postFile" + dateFile;
        var filePathForChecking = './src/website/media/postFile/' + dateFile;

        var isFileType = "";
        // console.log(preFilePath);
        // console.log(dateFile);
        // console.log(newFilePath);
        // console.log(proFilePath);
        await fileNewPath(preFilePath, newFilePath).then(async function (result) {
            // console.log(result);
            console.log('File path changed successfully');

            await checkFileType(filePathForChecking).then(async function (result2) {
                console.log('File checkup successfully');
                isFileType = result2;


                // console.log(dateTime);
                var ifImage = '';
                var ifPdf = '';
                var ifVideo = '';
                if (isFileType == 'image') {
                    ifImage = "yes"
                }
                else if (isFileType == 'pdf') {
                    ifPdf = "yes"
                }
                else {
                    ifVideo = "yes"
                }

                await Posts.updateOne({
                    postUniqueId: postKeyValue
                }, {
                    $set: {
                        postText: req.body.postText,
                        postFileAddr: proFilePath,
                        isFileType: isFileType,
                        isImageFile: ifImage,
                        isPdfFile: ifPdf,
                        isVideoFile: ifVideo
                    }

                }).then(async function (resultUser) {
                    // console.log(resultUser);

                    console.log('Post changed successfully');

                    if (req.body.nijerPost === 'watch') {
                        res.redirect('watch');
                    }
                    else {
                        res.redirect('home');
                    }

                }).catch((error) => {
                    console.log('Failed to update post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update post'
                    });
                });




            }).catch((error) => {
                console.log('Error : Failed to check filetype');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to check filetype!'
                });
            });

        }).catch((error) => {
            // console.log(error);
            console.log('Error : File path transfer');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'File path transfer failed!'
            });
        });
    }


});

/**
 * 
 */
app.post('/editGroupPostEachPost', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    var groupUniqueKey = req.body.groupKeyValue;
    var postKeyValue = req.body.postKeyValue;
    var eachPostOwnerUniqueID = req.body.eachPostOwnerUniqueID;

    console.log(groupUniqueKey);
    console.log(postKeyValue);
    console.log(eachPostOwnerUniqueID);
    



    if (!req.file) {
        console.log('file chara');
        await Posts.updateOne({
            postUniqueId: postKeyValue
        }, {
            $set: {
                postText: req.body.postText
            }

        }).then(async function (resultUser) {
            // console.log(resultUser);

            console.log('Post changed successfully');

            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {

                    await Users.findOne({ userUniqueId: eachPostOwnerUniqueID }).then(async function (resultUser) {
                        await groupMembers.findOne({ groupUniqueId: groupUniqueKey, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {


                            await Posts.findOne({ postUniqueId: postKeyValue }).then(async function (resultOnePost) {
                                console.log('post ta paise')
                                // console.log(resultOnePost);
                                resultOnePostOBJ = []
                                resultOnePostOBJ.push(resultOnePost);

                                var allMyPost_Like = [];
                                for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                    allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                }

                                await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {

                                
                                    allMyComment = []
                                    await Comments.find({ originPostUniqueID: postKeyValue }).then((resultPerPost) => {
                                        //     // console.log(resultPerPost);
                                        console.log('Comment collect kora shuru korse')
                                        var obj2;
                                        // console.log(resultPerPost);
                                        for (var j = 0; j < resultPerPost.length; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                        //     // allMyComment.push(resultPerPost);
                                        // console.log(resultOnePost);
                                        // console.log(allMyComment);


                                        res.render('viewGroupOnePost', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,

                                            singleGroupKey: groupUniqueKey,
                                            youKnowWho: youKnowWho,

                                            resultUser: resultUser,

                                            resultOnePost: resultOnePostOBJ,
                                            allMyComment: allMyComment,

                                            resultAllLikeList: resultAllLikeList,

                                            resultAllFreeGroup: resultAllFreeGroup,

                                            myAllNotification: myAllNotification
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect like list');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect like list'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Error : Failed to collect one post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one post!'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect my information');
                            console.log(error);
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect my information'
                            });
                        });
                    }).catch((error) => {
                        console.log('Failed to collect one user information');
                        console.log(error);
                        
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one user information'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });

        }).catch((error) => {
            console.log('Failed to update post');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update post'
            });
        });
    }
    else {
        console.log('file shoho');
        var fileName = req.file.originalname;
        var preFilePath = req.file.path.substring(4, req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
        var dateFile = "/" + Date.now() + "/" + fileName;
        var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
        var proFilePath = "/media/postFile" + dateFile;
        var filePathForChecking = './src/website/media/postFile/' + dateFile;

        var isFileType = "";
        // console.log(preFilePath);
        // console.log(dateFile);
        // console.log(newFilePath);
        // console.log(proFilePath);
        await fileNewPath(preFilePath, newFilePath).then(async function (result) {
            // console.log(result);
            console.log('File path changed successfully');

            await checkFileType(filePathForChecking).then(async function (result2) {
                console.log('File checkup successfully');
                isFileType = result2;


                // console.log(dateTime);
                var ifImage = '';
                var ifPdf = '';
                var ifVideo = '';
                if (isFileType == 'image') {
                    ifImage = "yes"
                }
                else if (isFileType == 'pdf') {
                    ifPdf = "yes"
                }
                else {
                    ifVideo = "yes"
                }

                await Posts.updateOne({
                    postUniqueId: postKeyValue
                }, {
                    $set: {
                        postText: req.body.postText,
                        postFileAddr: proFilePath,
                        isFileType: isFileType,
                        isImageFile: ifImage,
                        isPdfFile: ifPdf,
                        isVideoFile: ifVideo
                    }

                }).then(async function (resultUser) {
                    // console.log(resultUser);

                    console.log('Post changed successfully');

                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {


                            await Users.findOne({ userUniqueId: eachPostOwnerUniqueID }).then(async function (resultUser) {
                                await groupMembers.findOne({ groupUniqueId: groupUniqueKey, userUniqueId: req.cookies.key }).then(async function (youKnowWho) {


                                    await Posts.findOne({ postUniqueId: postKeyValue }).then(async function (resultOnePost) {
                                        console.log('post ta paise')
                                        // console.log(resultOnePost);
                                        resultOnePostOBJ = []
                                        resultOnePostOBJ.push(resultOnePost);
                                            

                                        var allMyPost_Like = [];
                                        for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                            allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                        }

                                        await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {

                                            allMyComment = []
                                            await Comments.find({ originPostUniqueID: postKeyValue }).then((resultPerPost) => {
                                                //     // console.log(resultPerPost);
                                                console.log('Comment collect kora shuru korse')
                                                var obj2;
                                                // console.log(resultPerPost);
                                                for (var j = 0; j < resultPerPost.length; j++) {
                                                    obj2 = (resultPerPost[j]);
                                                    // console.log(obj2);
                                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                        // resultPerPost[j].isCommentMine='yes';
                                                        obj2.isCommentMine = 'yes';
                                                    }

                                                    allMyComment.push(obj2);
                                                }

                                                //     // allMyComment.push(resultPerPost);
                                                // console.log(resultOnePost);
                                                // console.log(allMyComment);


                                                res.render('viewGroupOnePost', {
                                                    myKey: req.cookies.key,
                                                    myName: req.cookies.name,
                                                    myProPic: req.cookies.proPicAddr,
                                                    myCoverPic: req.cookies.proCoverPicAddr,

                                                    singleGroupKey: groupUniqueKey,
                                                    youKnowWho: youKnowWho,

                                                    resultUser: resultUser,

                                                    resultOnePost: resultOnePostOBJ,
                                                    allMyComment: allMyComment,

                                                    resultAllLikeList: resultAllLikeList,

                                                    resultAllFreeGroup: resultAllFreeGroup,

                                                    myAllNotification: myAllNotification

                                                });

                                            }).catch((error) => {
                                                console.log('Failed to collect all comment per post');
                                                res.render('test.hbs', {
                                                    alert_name: 'danger',
                                                    alert_msg_visibility: 'visible',
                                                    SorF: 'Failure!',
                                                    status: 'Failed to collect all comment per post'
                                                });
                                            });

                                        }).catch((error) => {
                                            console.log('Failed to collect like list');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect like list'
                                            });
                                        });

                                    }).catch((error) => {
                                        console.log('Error : Failed to collect one post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect one post!'
                                        });
                                    });
                                }).catch((error) => {
                                    console.log('Failed to collect my information');
                                    console.log(error);
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect my information'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Failed to collect one user information');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one user information'
                                });
                            });


                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to update post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update post'
                    });
                });




            }).catch((error) => {
                console.log('Error : Failed to check filetype');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to check filetype!'
                });
            });

        }).catch((error) => {
            // console.log(error);
            console.log('Error : File path transfer');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'File path transfer failed!'
            });
        });
    }


});





app.post('/userCommentUpload', urlencodedParser, async function (req, res) {

    console.log('my profile theke comment kora hoise');

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;


    await Posts.updateOne({
        postUniqueId: req.body.postKeyValue
    }, {
        $inc: {
            commentCount: 1
        }

    }).then(async function (resultUser) {
        // console.log(resultUser);

        console.log('Comment count changed successfully');

        // res.redirect('myProfile');

        const newComment = new Comments({
            commentUniqueId: commentKey,
            originPostUniqueID: req.body.postKeyValue,
            ownerCommentUniqueID: req.cookies.key,
            userPhoto: req.cookies.proPicAddr,
            userName: req.cookies.name,
            commentTime: dateTime,
            commentText: req.body.commentText,
            isCommentMine: '',
            isIamAdmin: ''

        });

        await newComment.save().then(() => {
            console.log('Comment save successfully');
            res.redirect('myProfile');
        }).catch((error) => {
            console.log('Error : Failed to save comment');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save comment!'
            });
        });
    }).catch((error) => {
        console.log('Failed to update comment count');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update comment count'
        });
    });


});

app.post('/userCommentUploadFromHome', urlencodedParser, async function (req, res) {

    console.log('my profile theke comment kora hoise');

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    await Posts.updateOne({
        postUniqueId: req.body.postKeyValue
    }, {
        $inc: {
            commentCount: 1
        }

    }).then(async function (resultUser) {
        // console.log(resultUser);

        console.log('Comment count changed successfully');

        // res.redirect('myProfile');

        const newComment = new Comments({
            commentUniqueId: commentKey,
            originPostUniqueID: req.body.postKeyValue,
            ownerCommentUniqueID: req.cookies.key,
            userPhoto: req.cookies.proPicAddr,
            userName: req.cookies.name,
            commentTime: dateTime,
            commentText: req.body.commentText,
            isCommentMine: '',
            isIamAdmin: ''

        });

        await newComment.save().then(() => {
            console.log('Comment save successfully');
            if (req.body.nijerPost === 'watch') {
                res.redirect('watch');
            }
            else {
                res.redirect('home');
            }
        }).catch((error) => {
            console.log('Error : Failed to save comment');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save comment!'
            });
        });
    }).catch((error) => {
        console.log('Failed to update comment count');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update comment count'
        });
    });

});

/**
 * Upload comment in friends post
 */
app.post('/userFriendCommentUpload', urlencodedParser, async function (req, res) {

    console.log('friend profile theke comment kora hoise');

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    console.log(req.body.postKeyValue);
    console.log(req.body.postOwnerUniqueValue);

    var postKeyValue = req.body.postKeyValue;
    var friendUserKey = req.body.postOwnerUniqueValue;

    var notificationKey = 'sustCSElifeNotify' + Date.now();
    notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");
    

    var newNotification = new Notifications({
        notifyUniqueId: notificationKey,
        notifyWhom: friendUserKey,
        notifyLink: req.body.postKeyValue,
        notifyLinkGroup: req.body.postKeyValue,
        notifyUserUniqueID: req.cookies.key,
        notifyUserPhoto: req.cookies.proPicAddr,
        notifyUserName: req.cookies.name,
        notifyTime: dateTime,
        notifyText: 'commented on your post',
        isFollow: 'no',
        isLike: 'no',
        isComment: 'yes',
        isGroup: 'no',
        notifyListColor: 'ipPeopleList3'
    });
    await newNotification.save().then(async function(resultNotify){

        await Posts.updateOne({
            postUniqueId: postKeyValue
        }, {
            $inc: {
                commentCount: 1
            }

        }).then(async function (resultComment) {
            // console.log(resultUser);

            console.log('Comment count changed successfully');

            // res.redirect('myProfile');

            const newComment = new Comments({
                commentUniqueId: commentKey,
                originPostUniqueID: postKeyValue,
                ownerCommentUniqueID: req.cookies.key,
                userPhoto: req.cookies.proPicAddr,
                userName: req.cookies.name,
                commentTime: dateTime,
                commentText: req.body.commentText,
                isCommentMine: '',
                isIamAdmin: ''

            });

            console.log('ami eikhane');
            await newComment.save().then(async function (resultCommentSave) {
                console.log('Comment save successfully');

                bestFriend = friendUserKey;
                res.redirect('friendProfile');

            }).catch((error) => {
                console.log('Error : Failed to save comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to save comment!'
                });
            });
        }).catch((error) => {
            console.log('Failed to update comment count');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update comment count'
            });
        });

    }).catch((error) => {
        console.log('Failed to save notification');
        console.log(error);
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to save notification'
        });
    });
});

app.post('/userFriendCommentUploadFromHome', urlencodedParser, async function (req, res) {

    console.log('friend profile theke comment kora hoise');

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    console.log(req.body.postKeyValue);
    console.log(req.body.postOwnerUniqueValue);

    var postKeyValue = req.body.postKeyValue;
    var friendUserKey = req.body.postOwnerUniqueValue;

    var notificationKey = 'sustCSElifeNotify' + Date.now();
    notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");
    

    var newNotification = new Notifications({
        notifyUniqueId: notificationKey,
        notifyWhom: friendUserKey,
        notifyLink: req.body.postKeyValue,
        notifyLinkGroup: req.body.postKeyValue,
        notifyUserUniqueID: req.cookies.key,
        notifyUserPhoto: req.cookies.proPicAddr,
        notifyUserName: req.cookies.name,
        notifyTime: dateTime,
        notifyText: 'commented on your post',
        isFollow: 'no',
        isLike: 'no',
        isComment: 'yes',
        isGroup: 'no',
        notifyListColor: 'ipPeopleList3'
    });

    await newNotification.save().then(async function(resultNotify){
        
        await Posts.updateOne({
            postUniqueId: postKeyValue
        }, {
            $inc: {
                commentCount: 1
            }

        }).then(async function (resultComment) {
            // console.log(resultUser);

            console.log('Comment count changed successfully');

            // res.redirect('myProfile');

            const newComment = new Comments({
                commentUniqueId: commentKey,
                originPostUniqueID: postKeyValue,
                ownerCommentUniqueID: req.cookies.key,
                userPhoto: req.cookies.proPicAddr,
                userName: req.cookies.name,
                commentTime: dateTime,
                commentText: req.body.commentText,
                isCommentMine: '',
                isIamAdmin: ''

            });

            console.log('ami eikhane');
            await newComment.save().then(async function (resultCommentSave) {
                console.log('Comment save successfully');

                if (req.body.nijerPost === 'watch') {
                    res.redirect('watch');
                }
                else {
                    res.redirect('home');
                }




            }).catch((error) => {
                console.log('Error : Failed to save comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to save comment!'
                });
            });
        }).catch((error) => {
            console.log('Failed to update comment count');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update comment count'
            });
        });

    }).catch((error) => {
        console.log('Failed to save notification');
        console.log(error);
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to save notification'
        });
    });

    
});



app.post('/userCommentUploadEachPost', urlencodedParser, async function (req, res) {

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;



    
    await Posts.updateOne({
        postUniqueId: req.body.postKeyValue
    }, {
        $inc: {
            commentCount: 1
        }

    }).then(async function (resultUser) {
        // console.log(resultUser);

        console.log('Comment count changed successfully');

        // res.redirect('myProfile');

        const newComment = new Comments({
            commentUniqueId: commentKey,
            originPostUniqueID: req.body.postKeyValue,
            ownerCommentUniqueID: req.cookies.key,
            userPhoto: req.cookies.proPicAddr,
            userName: req.cookies.name,
            commentTime: dateTime,
            commentText: req.body.commentText,
            isCommentMine: '',
            isIamAdmin: ''

        });

        await newComment.save().then(async function()  {
            console.log('Comment save successfully');
            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                    await Posts.findOne({ postUniqueId: req.body.postKeyValue }).then(async function (resultOnePost) {
                        console.log('post ta paise')

                        
                            
                            // console.log(resultOnePost);
                            resultOnePostOBJ = []
                            resultOnePostOBJ.push(resultOnePost);

                            var allMyPost_Like = [];
                            for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                            }

                            await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {
                            
                                allMyComment = []
                                await Comments.find({ originPostUniqueID: req.body.postKeyValue }).then((resultPerPost) => {
                                    //     // console.log(resultPerPost);
                                    console.log('Comment collect kora shuru korse')
                                    var obj2;
                                    // console.log(resultPerPost);
                                    for (var j = 0; j < resultPerPost.length; j++) {
                                        obj2 = (resultPerPost[j]);
                                        // console.log(obj2);
                                        if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                            // resultPerPost[j].isCommentMine='yes';
                                            obj2.isCommentMine = 'yes';
                                        }

                                        allMyComment.push(obj2);
                                    }

                                    //     // allMyComment.push(resultPerPost);
                                    // console.log(resultOnePost);
                                    // console.log(allMyComment);


                                    res.render('viewMyOnePost', {
                                        myKey: req.cookies.key,
                                        myName: req.cookies.name,
                                        myProPic: req.cookies.proPicAddr,
                                        myCoverPic: req.cookies.proCoverPicAddr,

                                        resultOnePost: resultOnePostOBJ,
                                        allMyComment: allMyComment,
                                        resultAllLikeList: resultAllLikeList,
                                        resultAllFreeGroup: resultAllFreeGroup,

                                        myAllNotification: myAllNotification
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect all comment per post');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect all comment per post'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Failed to collect like list');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect like list'
                                });
                            });

                        



                    }).catch((error) => {
                        console.log('Error : Failed to collect one post');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one post!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });
            // res.redirect('myProfile');
        }).catch((error) => {
            console.log('Error : Failed to save comment');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to save comment!'
            });
        });
    }).catch((error) => {
        console.log('Failed to update comment count');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update comment count'
        });
    });



});



app.post('/myPostSetting',urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        // console.log('button click mission successfull')
        var settingBtn = req.body.settingBtn;
        // console.log(req.body.eachPostUniqueID);
        everyPostUniqueID = req.body.eachPostUniqueID;
        console.log(settingBtn);
        if(settingBtn === "delete"){
            console.log('delete e dhukse');
            Posts.findOneAndDelete({ postUniqueId: everyPostUniqueID }).then((resultUser) => {
                
                res.redirect('myProfile');

            }).catch((error) => {
                console.log('Error : Failed to delete post');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete post!'
                });
            });
        
        }
        else{
            console.log('view e dhukse');

            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                    await Posts.findOne({ postUniqueId: everyPostUniqueID }).then(async function (resultOnePost) {
                        console.log('post ta paise')
                        // console.log(resultOnePost);
                        resultOnePostOBJ =[]
                        resultOnePostOBJ.push(resultOnePost);


                        var allMyPost_Like = [];
                        for (let li = 0; li < resultOnePostOBJ.length; li++) {
                            allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                        }

                        await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {
                        
                            allMyComment=[]
                            await Comments.find({ originPostUniqueID: everyPostUniqueID }).then((resultPerPost) => {
                            //     // console.log(resultPerPost);
                                console.log('Comment collect kora shuru korse')
                                var obj2;
                                // console.log(resultPerPost);
                                for (var j = 0; j < resultPerPost.length; j++) {
                                    obj2 = (resultPerPost[j]);
                                    // console.log(obj2);
                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                        // resultPerPost[j].isCommentMine='yes';
                                        obj2.isCommentMine = 'yes';
                                    }

                                    allMyComment.push(obj2);
                                }

                            //     // allMyComment.push(resultPerPost);
                                // console.log(resultOnePost);
                                // console.log(allMyComment);


                                res.render('viewMyOnePost',{
                                    myKey: req.cookies.key,
                                    myName: req.cookies.name,
                                    myProPic: req.cookies.proPicAddr,
                                    myCoverPic: req.cookies.proCoverPicAddr,

                                    resultOnePost: resultOnePostOBJ,
                                    allMyComment: allMyComment,

                                    resultAllLikeList: resultAllLikeList,

                                    resultAllFreeGroup: resultAllFreeGroup,

                                    myAllNotification: myAllNotification
                                });

                            }).catch((error) => {
                                console.log('Failed to collect all comment per post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect all comment per post'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to collect like list');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect like list'
                            });
                        });

                    }).catch((error) => {
                        console.log('Error : Failed to collect one post');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one post!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });
                    
        }
        
    }
});


app.post('/myPostSettingEachPost', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        // console.log('button click mission successfull')
        var settingBtn = req.body.settingBtn;
        // console.log(req.body.eachPostUniqueID);
        everyPostUniqueID = req.body.eachPostUniqueID;
        console.log(settingBtn);
        if (settingBtn === "delete") {
            console.log('delete e dhukse');
            await Posts.findOneAndDelete({ postUniqueId: everyPostUniqueID }).then(async function(resultUser) {

                

                res.redirect('myProfile');

            }).catch((error) => {
                console.log('Error : Failed to delete post');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete post!'
                });
            });

        }
        // else{
        //     res.redirect('myProfile');
        // }
       
    }
});



app.post('/editPost', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    if (!req.file) {
        console.log('file chara');
        await Posts.updateOne({
            postUniqueId: req.body.postKeyValue
        }, {
            $set: {
                postText: req.body.postText
            }

        }).then((resultUser) => {
            // console.log(resultUser);
            console.log('key ',req.body.postKeyValue);
            console.log('Post changed successfully');

            res.redirect('myProfile');

        }).catch((error) => {
            console.log('Failed to update post');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update post'
            });
        });
    }
    else{
        console.log('file shoho');
        var fileName = req.file.originalname;
        var preFilePath = req.file.path.substring(4, req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
        var dateFile = "/" + Date.now() + "/" + fileName;
        var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
        var proFilePath = "/media/postFile" + dateFile;
        var filePathForChecking = './src/website/media/postFile/' + dateFile;

        var isFileType = "";
        // console.log(preFilePath);
        // console.log(dateFile);
        // console.log(newFilePath);
        // console.log(proFilePath);
        await fileNewPath(preFilePath, newFilePath).then(async function (result) {
            // console.log(result);
            console.log('File path changed successfully');
    
            await checkFileType(filePathForChecking).then(async function (result2) {
                console.log('File checkup successfully');
                isFileType = result2;
    
                
                // console.log(dateTime);
                var ifImage='';
                var ifPdf='';
                var ifVideo='';
                if(isFileType=='image'){
                    ifImage="yes"
                }
                else if(isFileType=='pdf'){
                    ifPdf="yes"
                }
                else{
                    ifVideo="yes"
                }
                
                await Posts.updateOne({
                    postUniqueId: req.body.postKeyValue
                }, {
                    $set: {
                        postText: req.body.postText,
                        postFileAddr: proFilePath,
                        isFileType: isFileType,
                        isImageFile: ifImage,
                        isPdfFile: ifPdf,
                        isVideoFile: ifVideo
                    }

                }).then((resultUser) => {
                    // console.log(resultUser);

                    console.log('Post changed successfully');

                    res.redirect('myProfile');

                }).catch((error) => {
                    console.log('Failed to update post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update post'
                    });
                });




            }).catch((error) => {
                console.log('Error : Failed to check filetype');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to check filetype!'
                });
            });

        }).catch((error) => {
            // console.log(error);
            console.log('Error : File path transfer');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'File path transfer failed!'
            });
        });
    }


});

app.post('/editPostFromHome', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    if (!req.file) {
        console.log('file chara');
        await Posts.updateOne({
            postUniqueId: req.body.postKeyValue
        }, {
            $set: {
                postText: req.body.postText
            }

        }).then((resultUser) => {
            // console.log(resultUser);

            console.log('Post changed successfully');
            if(req.body.nijerPost==='watch'){
                res.redirect('watch');
            }
            else{
                res.redirect('home');
            }

        }).catch((error) => {
            console.log('Failed to update post');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update post'
            });
        });
    }
    else {
        console.log('file shoho');
        var fileName = req.file.originalname;
        var preFilePath = req.file.path.substring(4, req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
        var dateFile = "/" + Date.now() + "/" + fileName;
        var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
        var proFilePath = "/media/postFile" + dateFile;
        var filePathForChecking = './src/website/media/postFile/' + dateFile;

        var isFileType = "";
        // console.log(preFilePath);
        // console.log(dateFile);
        // console.log(newFilePath);
        // console.log(proFilePath);
        await fileNewPath(preFilePath, newFilePath).then(async function (result) {
            // console.log(result);
            console.log('File path changed successfully');

            await checkFileType(filePathForChecking).then(async function (result2) {
                console.log('File checkup successfully');
                isFileType = result2;


                // console.log(dateTime);
                var ifImage = '';
                var ifPdf = '';
                var ifVideo = '';
                if (isFileType == 'image') {
                    ifImage = "yes"
                }
                else if (isFileType == 'pdf') {
                    ifPdf = "yes"
                }
                else {
                    ifVideo = "yes"
                }

                await Posts.updateOne({
                    postUniqueId: req.body.postKeyValue
                }, {
                    $set: {
                        postText: req.body.postText,
                        postFileAddr: proFilePath,
                        isFileType: isFileType,
                        isImageFile: ifImage,
                        isPdfFile: ifPdf,
                        isVideoFile: ifVideo
                    }

                }).then((resultUser) => {
                    // console.log(resultUser);

                    console.log('Post changed successfully');

                    if (req.body.nijerPost === 'watch') {
                        res.redirect('watch');
                    }
                    else {
                        res.redirect('home');
                    }

                }).catch((error) => {
                    console.log('Failed to update post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update post'
                    });
                });




            }).catch((error) => {
                console.log('Error : Failed to check filetype');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to check filetype!'
                });
            });

        }).catch((error) => {
            // console.log(error);
            console.log('Error : File path transfer');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'File path transfer failed!'
            });
        });
    }


});



app.post('/editPostEachPost', dirPostFile.single('myFile'), urlencodedParser, async function (req, res) {

    if(req.cookies.token === undefined){
        res.redirect('index');
    }
    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });
    if (!req.file) {
        console.log('file chara');
        await Posts.updateOne({
            postUniqueId: req.body.postKeyValue
        }, {
            $set: {
                postText: req.body.postText
            }

        }).then(async function(resultUser)  {
            // console.log(resultUser);
            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);

                    console.log('Post changed successfully');
                    await Posts.findOne({ postUniqueId: req.body.postKeyValue }).then(async function (resultOnePost) {
                        console.log('post ta paise')
                        // console.log(resultOnePost);
                        resultOnePostOBJ = []
                        resultOnePostOBJ.push(resultOnePost);

                        var allMyPost_Like = [];
                        for (let li = 0; li < resultOnePostOBJ.length; li++) {
                            allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                        }

                        await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {
                        

                            allMyComment = []
                            await Comments.find({ originPostUniqueID: req.body.postKeyValue }).then((resultPerPost) => {
                                //     // console.log(resultPerPost);
                                console.log('Comment collect kora shuru korse')
                                var obj2;
                                // console.log(resultPerPost);
                                for (var j = 0; j < resultPerPost.length; j++) {
                                    obj2 = (resultPerPost[j]);
                                    // console.log(obj2);
                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                        // resultPerPost[j].isCommentMine='yes';
                                        obj2.isCommentMine = 'yes';
                                    }

                                    allMyComment.push(obj2);
                                }

                                //     // allMyComment.push(resultPerPost);
                                // console.log(resultOnePost);
                                // console.log(allMyComment);


                                res.render('viewMyOnePost', {
                                    myKey: req.cookies.key,
                                    myName: req.cookies.name,
                                    myProPic: req.cookies.proPicAddr,
                                    myCoverPic: req.cookies.proCoverPicAddr,

                                    resultOnePost: resultOnePostOBJ,
                                    allMyComment: allMyComment,

                                    resultAllLikeList: resultAllLikeList,

                                    resultAllFreeGroup: resultAllFreeGroup,

                                    myAllNotification: myAllNotification

                                });

                            }).catch((error) => {
                                console.log('Failed to collect all comment per post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect all comment per post'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to collect like list');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect like list'
                            });
                        });

                    }).catch((error) => {
                        console.log('Error : Failed to collect one post');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one post!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });

            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });

        }).catch((error) => {
            console.log('Failed to update post');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update post'
            });
        });
    }
    else {
        console.log('file shoho');
        var fileName = req.file.originalname;
        var preFilePath = req.file.path.substring(4, req.file.path.length)
        preFilePath = __dirname + "/" + preFilePath;
        var dateFile = "/" + Date.now() + "/" + fileName;
        var newFilePath = path.join(__dirname, './website/media/postFile/' + dateFile);
        var proFilePath = "/media/postFile" + dateFile;
        var filePathForChecking = './src/website/media/postFile/' + dateFile;

        var isFileType = "";
        // console.log(preFilePath);
        // console.log(dateFile);
        // console.log(newFilePath);
        // console.log(proFilePath);
        await fileNewPath(preFilePath, newFilePath).then(async function (result) {
            // console.log(result);
            console.log('File path changed successfully');

            await checkFileType(filePathForChecking).then(async function (result2) {
                console.log('File checkup successfully');
                isFileType = result2;


                // console.log(dateTime);
                var ifImage = '';
                var ifPdf = '';
                var ifVideo = '';
                if (isFileType == 'image') {
                    ifImage = "yes"
                }
                else if (isFileType == 'pdf') {
                    ifPdf = "yes"
                }
                else {
                    ifVideo = "yes"
                }

                await Posts.updateOne({
                    postUniqueId: req.body.postKeyValue
                }, {
                    $set: {
                        postText: req.body.postText,
                        postFileAddr: proFilePath,
                        isFileType: isFileType,
                        isImageFile: ifImage,
                        isPdfFile: ifPdf,
                        isVideoFile: ifVideo
                    }

                }).then(async function(resultUser)  {
                    // console.log(resultUser);

                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                            resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                            console.log('Post changed successfully');
                            await Posts.findOne({ postUniqueId: req.body.postKeyValue }).then(async function (resultOnePost) {
                                console.log('post ta paise')
                                // console.log(resultOnePost);
                                resultOnePostOBJ = []
                                resultOnePostOBJ.push(resultOnePost);
                                
                                
                                
                                var allMyPost_Like = [];
                                for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                    allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                }

                                await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                    allMyComment = []
                                    await Comments.find({ originPostUniqueID: req.body.postKeyValue }).then((resultPerPost) => {
                                        //     // console.log(resultPerPost);
                                        console.log('Comment collect kora shuru korse')
                                        var obj2;
                                        // console.log(resultPerPost);
                                        for (var j = 0; j < resultPerPost.length; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                        //     // allMyComment.push(resultPerPost);
                                        // console.log(resultOnePost);
                                        // console.log(allMyComment);


                                        res.render('viewMyOnePost', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,

                                            resultOnePost: resultOnePostOBJ,
                                            allMyComment: allMyComment,

                                            resultAllLikeList: resultAllLikeList,

                                            resultAllFreeGroup: resultAllFreeGroup,

                                            myAllNotification: myAllNotification

                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect like list');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect like list'
                                    });
                                });



                            }).catch((error) => {
                                console.log('Error : Failed to collect one post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one post!'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });



                }).catch((error) => {
                    console.log('Failed to update post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update post'
                    });
                });




            }).catch((error) => {
                console.log('Error : Failed to check filetype');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to check filetype!'
                });
            });

        }).catch((error) => {
            // console.log(error);
            console.log('Error : File path transfer');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'File path transfer failed!'
            });
        });
    }


});



app.post('/myCommentSetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        // console.log('button click mission successfull')
        var settingBtn = req.body.commentBtn;
        console.log(req.body.eachPostUniqueID);
        eachPostUniqueID = req.body.eachPostUniqueID;
        eachCommentUniqueID = req.body.eachCommentUniqueID;
        
        console.log(settingBtn);
        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');
            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function(resultUser)  {
                console.log('comment delete successfully');
                // res.redirect('myProfile');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultUser) {
                    // console.log(resultUser);

                    console.log('Comment count changed successfully');

                    res.redirect('myProfile');

                    
                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });

            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });

        }
        
        else {
            eachCommentOwnerID = req.body.commentOwnerID
            console.log(req.cookies.key);
            console.log(eachCommentOwnerID);
            if(eachCommentOwnerID ===  req.cookies.key){
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else{
                console.log('eta amr profile na... eta amar friend er profile');
                var friendUserKey = eachCommentOwnerID;

                bestFriend = friendUserKey;
                res.redirect('friendProfile');
            
            }
        }
    }
});

/**
 * Own Comment options from home page
 */
app.post('/myCommentSettingFromHome', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        // console.log('button click mission successfull')
        var settingBtn = req.body.commentBtn;
        console.log(req.body.eachPostUniqueID);
        eachPostUniqueID = req.body.eachPostUniqueID;
        eachCommentUniqueID = req.body.eachCommentUniqueID;

        console.log(settingBtn);
        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');
            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultUser) {
                console.log('comment delete successfully');
                // res.redirect('myProfile');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultUser) {
                    // console.log(resultUser);

                    console.log('Comment count changed successfully');

                    res.redirect('home');


                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });

            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });

        }
        
        else {
            eachCommentOwnerID = req.body.commentOwnerID
            console.log(req.cookies.key);
            console.log(eachCommentOwnerID);
            if (eachCommentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else {
                console.log('eta amr profile na... eta amar friend er profile');

                var friendUserKey = eachCommentOwnerID;

                bestFriend = friendUserKey;
                res.redirect('friendProfile');

            }
        }
    }
});




/**
 * Own posts' comment options 
 */
app.post('/myEachPostCommentSetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });
        // console.log('button click mission successfull')
        var settingBtn = req.body.commentBtn;
        console.log(req.body.eachPostUniqueID);
        eachPostUniqueID = req.body.eachPostUniqueID;
        eachCommentUniqueID = req.body.eachCommentUniqueID;

        console.log(settingBtn);
        if (settingBtn === "deleteCommentBtn") {

            console.log('delete e dhukse');
            await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                var allGroup = []
                console.log(resultAllGroup.length);
                for (var i = 0; i < resultAllGroup.length; i++) {
                    allGroup.push(resultAllGroup[i].groupUniqueId);
                }
                // console.log(allMan);
                await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                    resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                    await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultUser) {
                        console.log('comment delete successfully');
                        // res.redirect('myProfile');
                        await Posts.updateOne({
                            postUniqueId: eachPostUniqueID
                        }, {
                            $inc: {
                                commentCount: -1
                            }

                        }).then(async function (resultUser) {
                            // console.log(resultUser);

                            console.log('Comment count changed successfully');

                            await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (resultOnePost) {
                                console.log('post ta paise')
                                // console.log(resultOnePost);
                                resultOnePostOBJ = []
                                resultOnePostOBJ.push(resultOnePost);

                                var allMyPost_Like = [];
                                for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                    allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                }

                                await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {



                                    allMyComment = []
                                    await Comments.find({ originPostUniqueID: eachPostUniqueID }).then((resultPerPost) => {
                                        //     // console.log(resultPerPost);
                                        console.log('Comment collect kora shuru korse')
                                        var obj2;
                                        // console.log(resultPerPost);
                                        for (var j = 0; j < resultPerPost.length; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                        //     // allMyComment.push(resultPerPost);
                                        // console.log(resultOnePost);
                                        // console.log(allMyComment);


                                        res.render('viewMyOnePost', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,

                                            resultOnePost: resultOnePostOBJ,
                                            allMyComment: allMyComment,

                                            resultAllLikeList: resultAllLikeList,
                                            resultAllFreeGroup: resultAllFreeGroup,

                                            myAllNotification: myAllNotification
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Failed to collect like list');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect like list'
                                    });
                                });

                            }).catch((error) => {
                                console.log('Error : Failed to collect one post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one post!'
                                });
                            });


                        }).catch((error) => {
                            console.log('Failed to update comment count');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to update comment count'
                            });
                        });

                    }).catch((error) => {
                        console.log('Error : Failed to delete comment');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to delete comment!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect group');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect group'
                    });
                });
            }).catch((error) => {
                console.log('Failed to find group members');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to find group members'
                });
            });
        }
        
        else {
            eachCommentOwnerID = req.body.commentOwnerID

            if (eachCommentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else{
                
                console.log('eta amr profile na... eta amar friend er profile');

                var friendUserKey = eachCommentOwnerID;

                bestFriend = friendUserKey;
                res.redirect('friendProfile');

            }

        }
    }
});



/**
 * Edit Previously done comments
 */
app.post('/editComment',  urlencodedParser, async function (req, res) {

    console.log(req.body.commentKeyValue);
    await Comments.updateOne({
        commentUniqueId: req.body.commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then((resultUser) => {
        // console.log(resultUser);

        console.log('Comment changed successfully');

        res.redirect('myProfile');

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });

});
/**
 * Edit comment from home page
 */
app.post('/editCommentFromHome', urlencodedParser, async function (req, res) {

    console.log(req.body.commentKeyValue);
    await Comments.updateOne({
        commentUniqueId: req.body.commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then((resultUser) => {
        // console.log(resultUser);

        console.log('Comment changed successfully');

        if (req.body.nijerPost === 'watch') {
            res.redirect('watch');
        }
        else {
            res.redirect('home');
        }

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });

});

/**
 * Edit group comments
 */
app.post('/editCommentFromEachPost', urlencodedParser, async function (req, res) {
    if(req.cookies.token === undefined){
        res.redirect('index');
    }

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
        var allGroup = []
        console.log(resultAllGroup.length);
        for (var i = 0; i < resultAllGroup.length; i++) {
            allGroup.push(resultAllGroup[i].groupUniqueId);
        }
        // console.log(allMan);
        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
            resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



            console.log(req.body.commentKeyValue);
            await Comments.updateOne({
                commentUniqueId: req.body.commentKeyValue
            }, {
                $set: {
                    commentText: req.body.commentText
                }

            }).then( async function (resultUser) {
                // console.log(resultUser);

                console.log('Comment changed successfully');
                postKeyValue = req.body.postKeyValue;
                await Posts.findOne({ postUniqueId: postKeyValue }).then(async function (resultOnePost) {
                    console.log('post ta paise')
                    // console.log(resultOnePost);

                    resultOnePostOBJ = []
                    resultOnePostOBJ.push(resultOnePost);


                    var allMyPost_Like = [];
                    for (let li = 0; li < resultOnePostOBJ.length; li++) {
                        allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                    }

                    await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {
                    


                        allMyComment = []
                        await Comments.find({ originPostUniqueID: postKeyValue }).then((resultPerPost) => {
                            //     // console.log(resultPerPost);
                            console.log('Comment collect kora shuru korse')
                            var obj2;
                            // console.log(resultPerPost);
                            for (var j = 0; j < resultPerPost.length; j++) {
                                obj2 = (resultPerPost[j]);
                                // console.log(obj2);
                                if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                    // resultPerPost[j].isCommentMine='yes';
                                    obj2.isCommentMine = 'yes';
                                }

                                allMyComment.push(obj2);
                            }

                            //     // allMyComment.push(resultPerPost);
                            // console.log(resultOnePost);
                            // console.log(allMyComment);


                            res.render('viewMyOnePost', {
                                myKey: req.cookies.key,
                                myName: req.cookies.name,
                                myProPic: req.cookies.proPicAddr,
                                myCoverPic: req.cookies.proCoverPicAddr,

                                resultOnePost: resultOnePostOBJ,
                                allMyComment: allMyComment,

                                resultAllLikeList: resultAllLikeList,

                                resultAllFreeGroup: resultAllFreeGroup,

                                myAllNotification: myAllNotification
                            });

                        }).catch((error) => {
                            console.log('Failed to collect all comment per post');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect all comment per post'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to collect like list');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect like list'
                        });
                    });

                }).catch((error) => {
                    console.log('Error : Failed to collect one post');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect one post!'
                    });
                });
                // res.redirect('myProfile');

            }).catch((error) => {
                console.log('Failed to update Comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to update Comment'
                });
            });
        }).catch((error) => {
            console.log('Failed to collect group');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to collect group'
            });
        });

    }).catch((error) => {
        console.log('Failed to find group members');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find group members'
        });
    });

});




//  ------------------------------------------End of My Profile Page---------------------------------------




// --------------------------------------------------- Start Friend Profile Page---------------------------------------
/**
 * Go to friend's profile page
 */
app.get('/friendProfile', async function (req, res) {

    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        console.log('hi bestfriend');

        var friendUserKey = bestFriend;

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);


                await Follows.find({ followerID: friendUserKey }).then(async function (resultFollower) {

                    await Follows.find({ followingID: friendUserKey }).then(async function (resultFollowing) {

                        await Users.findOne({ userUniqueId: friendUserKey }).then(async function (resultUser) {

                            await Posts.find({ userORGroupUniqueID: friendUserKey, isUserOrGroup: 'user' }).then(async function (allUserList) {
                                console.log('Collect all post from database')
                                var allMyPost = allUserList;

                                var allMyPost_Like = [];
                                for (let li = 0; li < allMyPost.length; li++) {
                                    allMyPost_Like.push(allMyPost[li].postUniqueId);
                                }

                                await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {


                                    allMyComment = [];
                                    for (var i = 0; i < allMyPost.length; i++) {
                                        var obj = (allMyPost[i]);
                                        // console.log(obj);
                                        await Comments.find({ originPostUniqueID: obj.postUniqueId }).then((resultPerPost) => {
                                            var obj2;
                                            // console.log(resultPerPost);

                                            commentLengthHigh = Math.min(5, resultPerPost.length);

                                            for (var j = 0; j < commentLengthHigh; j++) {
                                                obj2 = (resultPerPost[j]);
                                                // console.log(obj2);
                                                if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                    // resultPerPost[j].isCommentMine='yes';
                                                    obj2.isCommentMine = 'yes';
                                                }

                                                allMyComment.push(obj2);
                                            }

                                        }).catch((error) => {
                                            console.log('Failed to collect all comment per post');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect all comment per post'
                                            });
                                        });
                                    }

                                    await Follows.find({ followerID: req.cookies.key, followingID: resultUser.userUniqueId }).then(async function (resultFollow) {
                                        console.log(resultFollow);


                                        // console.log(resultFollow);
                                        var followBtnText = 'Follow';
                                        var followBtnValue = 'iWantToFollow';
                                        if (resultFollow.length != 0) {
                                            followBtnText = 'Following';
                                            followBtnValue = 'iAlreadyFollow';
                                        }


                                        allMyPost = allMyPost.reverse();

                                        res.render('friendProfile', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,

                                            resultUser: resultUser,
                                            followBtnText: followBtnText,
                                            followBtnValue: followBtnValue,
                                            sumAllPost: allMyPost.length,
                                            sumAllFollower: resultFollower.length,
                                            sumAllFollowing: resultFollowing.length,

                                            allMyPost: allMyPost,
                                            allMyComment: allMyComment,

                                            resultAllLikeList: resultAllLikeList,

                                            resultAllFreeGroup: resultAllFreeGroup,

                                            myAllNotification: myAllNotification

                                        })
                                    }).catch((error) => {
                                        console.log('Failed to find follow');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to find follow'
                                        });
                                    });


                                }).catch((error) => {
                                    console.log('Failed to collect like list');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect like list'
                                    });
                                });
                            }).catch((error) => {
                                console.log('Failed to collect all post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect all post'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to collect one user information');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect one user information'
                            });
                        });
                    }).catch((error) => {
                        console.log('Failed to find follow');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find follow'
                        });
                    });


                }).catch((error) => {
                    console.log('Failed to find follow');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find follow'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
    }
})


app.post('/friendProfile', urlencodedParser,async function (req, res) {

    var friendUserKey = req.body.friendUserKeyValue;
    console.log(friendUserKey);
    console.log(req.cookies.key);

    if(friendUserKey === req.cookies.key){
        console.log('eta to amari profile');
        
        res.redirect('myProfile');
    }
    else{

        console.log('eta amr profile na... eta amar friend er profile');

        bestFriend = friendUserKey;
        res.redirect('friendProfile');
    }

})


app.post('/editCommentIntoMyFriend', urlencodedParser, async function (req, res) {

    if(req.cookies.token===undefined){
        res.redirect('index');
    }

    
    console.log(req.body.commentKeyValue);
    await Comments.updateOne({
        commentUniqueId: req.body.commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then(async function(resultUser)  {
        // console.log(resultUser);

        console.log('Comment changed successfully');



        var friendUserKey = req.body.jarPostTarID;

        bestFriend = friendUserKey;
        res.redirect('friendProfile');

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });
        

});


app.post('/editCommentIntoMyFriendFromHome', urlencodedParser, async function (req, res) {

    if(req.cookies.token === undefined){
        res.redirect('index');
    }

    console.log(req.body.commentKeyValue);
    await Comments.updateOne({
        commentUniqueId: req.body.commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then(async function (resultUser) {
        // console.log(resultUser);

        console.log('Comment changed successfully');
        res.redirect('home');

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });

});


app.post('/myFriendProfileCommentSetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {
        
        // console.log('button click mission successfull')
        var settingBtn = req.body.commentBtn;

        var eachPostUniqueID = req.body.eachPostUniqueID;
        var eachCommentUniqueID = req.body.eachCommentUniqueID;

        var postOwnerUniqueID = req.body.postOwnerID;
        var commentOwnerID = req.body.commentOwnerIDFriendProfile;
        
        console.log(eachPostUniqueID);
        console.log(eachCommentUniqueID);
        console.log(postOwnerUniqueID);
        console.log(commentOwnerID);

        
        console.log(settingBtn);
        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');
            var friendUserKey = postOwnerUniqueID;

            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultUser) {
                console.log('comment delete successfully');
                // res.redirect('myProfile');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultUser) {
                    // console.log(resultUser);

                    bestFriend = friendUserKey;
                    res.redirect('friendProfile');

                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });
            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });
        }
        
        else {
            console.log('comment owner er page e jabe akn');

            if (commentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else {

                console.log('eta amr profile na... eta amar friend er profile');
                
                bestFriend = commentOwnerID;
                res.redirect('friendProfile');
            }
        }
    }
});

/**
 * Comment options from newsfeed 
 * Others' post
 */
app.post('/myFriendProfileCommentSettingFromHome', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        // console.log('button click mission successfull')
        var settingBtn = req.body.commentBtn;

        var eachPostUniqueID = req.body.eachPostUniqueID;
        var eachCommentUniqueID = req.body.eachCommentUniqueID;

        var postOwnerUniqueID = req.body.postOwnerID;
        var commentOwnerID = req.body.commentOwnerIDFriendProfile;

        console.log(eachPostUniqueID);
        console.log(eachCommentUniqueID);
        console.log(postOwnerUniqueID);
        console.log(commentOwnerID);


        console.log(settingBtn);
        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');
            var friendUserKey = postOwnerUniqueID;

            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultUser) {
                console.log('comment delete successfully');
                // res.redirect('myProfile');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultUser) {
                    // console.log(resultUser);

                    res.redirect('home');

                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });
            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });
        }
        
        else {
            console.log('comment owner er page e jabe akn');

            if (commentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else {

                console.log('eta amr profile na... eta amar friend er profile');
                bestFriend = commentOwnerID;
                res.redirect('friendProfile');
            }
        }
    }
});


app.post('/myFriendOnePost', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        // console.log('button click mission successfull')
        // var settingBtn = req.body.settingBtn;
        // console.log(req.body.eachPostUniqueID);
        
        everyPostUniqueID = req.body.eachPostUniqueID;
        postOwnerID = req.body.postOwnerID;
        // console.log(settingBtn);
        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);

                await Users.findOne({ userUniqueId: postOwnerID }).then(async function (resultUser) {

                    console.log('view e dhukse');
                    await Posts.findOne({ postUniqueId: everyPostUniqueID }).then(async function (resultOnePost) {
                        console.log('post ta paise')
                        // console.log(resultOnePost);

                        resultOnePostOBJ = []
                        resultOnePostOBJ.push(resultOnePost);

                        var allMyPost_Like = [];
                        for (let li = 0; li < resultOnePostOBJ.length; li++) {
                            allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                        }

                        await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {
                        
                            allMyComment = []
                            await Comments.find({ originPostUniqueID: everyPostUniqueID }).then((resultPerPost) => {
                                //     // console.log(resultPerPost);
                                console.log('Comment collect kora shuru korse')
                                var obj2;
                                // console.log(resultPerPost);
                                for (var j = 0; j < resultPerPost.length; j++) {
                                    obj2 = (resultPerPost[j]);
                                    // console.log(obj2);
                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                        // resultPerPost[j].isCommentMine='yes';
                                        obj2.isCommentMine = 'yes';
                                    }

                                    allMyComment.push(obj2);
                                }

                                //     // allMyComment.push(resultPerPost);
                                // console.log(resultOnePost);
                                // console.log(allMyComment);


                                res.render('viewMyFriendProfileOnePost', {
                                    myKey: req.cookies.key,
                                    myName: req.cookies.name,
                                    myProPic: req.cookies.proPicAddr,
                                    myCoverPic: req.cookies.proCoverPicAddr,
                                    resultUser: resultUser,

                                    resultOnePost: resultOnePostOBJ,
                                    allMyComment: allMyComment,

                                    resultAllLikeList: resultAllLikeList,

                                    resultAllFreeGroup: resultAllFreeGroup,

                                    myAllNotification: myAllNotification

                                });

                            }).catch((error) => {
                                console.log('Failed to collect all comment per post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect all comment per post'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to collect like list');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect like list'
                            });
                        });



                    }).catch((error) => {
                        console.log('Error : Failed to collect one post');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one post!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect one user information');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect one user information'
                    });
                });
            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
    }
});

app.post('/userFriendCommentUploadEachPost', urlencodedParser, async function (req, res) {
    if(req.cookies.token === undefined){
        res.redirect('index');
    }

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    var commentKey = 'sustCSElifeCOMMENT' + Date.now();
    commentKey = crypto.createHash('sha256').update(commentKey).digest("base64");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;

    var myFriendUserUniqueValue = req.body.myFriendUserUniqueValue;

    var notificationKey = 'sustCSElifeNotify' + Date.now();
    notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");


    var newNotification = new Notifications({
        notifyUniqueId: notificationKey,
        notifyWhom: myFriendUserUniqueValue,
        notifyLink: req.body.postKeyValue,
        notifyLinkGroup: req.body.postKeyValue,
        notifyUserUniqueID: req.cookies.key,
        notifyUserPhoto: req.cookies.proPicAddr,
        notifyUserName: req.cookies.name,
        notifyTime: dateTime,
        notifyText: 'commented on your post',
        isFollow: 'no',
        isLike: 'no',
        isComment: 'yes',
        isGroup: 'no',
        notifyListColor: 'ipPeopleList3'
    });
    await newNotification.save().then(async function (resultNotify) {

        await Posts.updateOne({
            postUniqueId: req.body.postKeyValue
        }, {
            $inc: {
                commentCount: 1
            }

        }).then(async function (resultUser) {
            // console.log(resultUser);

            console.log('Comment count changed successfully');

            // res.redirect('myProfile');

            const newComment = new Comments({
                commentUniqueId: commentKey,
                originPostUniqueID: req.body.postKeyValue,
                ownerCommentUniqueID: req.cookies.key,
                userPhoto: req.cookies.proPicAddr,
                userName: req.cookies.name,
                commentTime: dateTime,
                commentText: req.body.commentText,
                isCommentMine: '',
                isIamAdmin: ''

            });

            await newComment.save().then(async function () {

                console.log('Comment save successfully');

                await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                    var allGroup = []
                    console.log(resultAllGroup.length);
                    for (var i = 0; i < resultAllGroup.length; i++) {
                        allGroup.push(resultAllGroup[i].groupUniqueId);
                    }
                    // console.log(allMan);
                    await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                        resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                        myFriendUserUniqueValue = req.body.myFriendUserUniqueValue;

                        await Users.findOne({ userUniqueId: myFriendUserUniqueValue }).then(async function (resultUser) {

                            await Posts.findOne({ postUniqueId: req.body.postKeyValue }).then(async function (resultOnePost) {
                                console.log('post ta paise')
                                // console.log(resultOnePost);
                                resultOnePostOBJ = []
                                resultOnePostOBJ.push(resultOnePost);

                                var allMyPost_Like = [];
                                for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                    allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                }

                                await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {



                                    allMyComment = []
                                    await Comments.find({ originPostUniqueID: req.body.postKeyValue }).then((resultPerPost) => {
                                        //     // console.log(resultPerPost);
                                        console.log('Comment collect kora shuru korse')
                                        var obj2;
                                        // console.log(resultPerPost);
                                        for (var j = 0; j < resultPerPost.length; j++) {
                                            obj2 = (resultPerPost[j]);
                                            // console.log(obj2);
                                            if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                // resultPerPost[j].isCommentMine='yes';
                                                obj2.isCommentMine = 'yes';
                                            }

                                            allMyComment.push(obj2);
                                        }

                                        //     // allMyComment.push(resultPerPost);
                                        // console.log(resultOnePost);
                                        // console.log(allMyComment);


                                        res.render('viewMyFriendProfileOnePost', {
                                            myKey: req.cookies.key,
                                            myName: req.cookies.name,
                                            myProPic: req.cookies.proPicAddr,
                                            myCoverPic: req.cookies.proCoverPicAddr,
                                            resultUser: resultUser,

                                            resultOnePost: resultOnePostOBJ,
                                            allMyComment: allMyComment,

                                            resultAllLikeList: resultAllLikeList,

                                            resultAllFreeGroup: resultAllFreeGroup,

                                            myAllNotification: myAllNotification

                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect all comment per post');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect all comment per post'
                                        });
                                    });
                                }).catch((error) => {
                                    console.log('Failed to collect like list');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect like list'
                                    });
                                });


                            }).catch((error) => {
                                console.log('Error : Failed to collect one post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one post!'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect one user information');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect one user information'
                            });
                        });
                    }).catch((error) => {
                        console.log('Failed to collect group');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect group'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to find group members');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find group members'
                    });
                });

                // res.redirect('myProfile');
            }).catch((error) => {
                console.log('Error : Failed to save comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to save comment!'
                });
            });
        }).catch((error) => {
            console.log('Failed to update comment count');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to update comment count'
            });
        });


    }).catch((error) => {
        console.log('Failed to save notification');
        console.log(error);
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to save notification'
        });
    });


});



app.post('/myFriendEachPostCommentSetting', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) res.render('index');
    else {

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        // console.log('button click mission successfull')
        console.log('eachpost profile theke arekjoner post e jawa');
        
        var settingBtn = req.body.commentBtn;
        console.log(req.body.eachPostUniqueID);
        var eachPostUniqueID = req.body.eachPostUniqueID;
        var eachCommentUniqueID = req.body.eachCommentUniqueID;

        var postOwnerID = req.body.postOwnerID;

        console.log(settingBtn);
        if (settingBtn === "deleteCommentBtn") {
            console.log('delete e dhukse');


            await Comments.findOneAndDelete({ commentUniqueId: eachCommentUniqueID }).then(async function (resultUser) {
                console.log('comment delete successfully');
                // res.redirect('myProfile');
                await Posts.updateOne({
                    postUniqueId: eachPostUniqueID
                }, {
                    $inc: {
                        commentCount: -1
                    }

                }).then(async function (resultUser) {
                    // console.log(resultUser);

                    console.log('Comment count changed successfully');


                    await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                        var allGroup = []
                        console.log(resultAllGroup.length);
                        for (var i = 0; i < resultAllGroup.length; i++) {
                            allGroup.push(resultAllGroup[i].groupUniqueId);
                        }
                        // console.log(allMan);
                        await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                            resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                            await Users.findOne({ userUniqueId: postOwnerID }).then(async function (resultUser) {


                                await Posts.findOne({ postUniqueId: eachPostUniqueID }).then(async function (resultOnePost) {
                                    console.log('post ta paise')
                                    // console.log(resultOnePost);
                                    resultOnePostOBJ = []
                                    resultOnePostOBJ.push(resultOnePost);

                                    var allMyPost_Like = [];
                                    for (let li = 0; li < resultOnePostOBJ.length; li++) {
                                        allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                                    }

                                    await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {
                                    

                                        allMyComment = []
                                        await Comments.find({ originPostUniqueID: eachPostUniqueID }).then((resultPerPost) => {
                                            //     // console.log(resultPerPost);
                                            console.log('Comment collect kora shuru korse')
                                            var obj2;
                                            // console.log(resultPerPost);
                                            for (var j = 0; j < resultPerPost.length; j++) {
                                                obj2 = (resultPerPost[j]);
                                                // console.log(obj2);
                                                if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                                    // resultPerPost[j].isCommentMine='yes';
                                                    obj2.isCommentMine = 'yes';
                                                }

                                                allMyComment.push(obj2);
                                            }

                                            //     // allMyComment.push(resultPerPost);
                                            // console.log(resultOnePost);
                                            // console.log(allMyComment);


                                            res.render('viewMyFriendProfileOnePost', {
                                                myKey: req.cookies.key,
                                                myName: req.cookies.name,
                                                myProPic: req.cookies.proPicAddr,
                                                myCoverPic: req.cookies.proCoverPicAddr,
                                                resultUser: resultUser,

                                                resultOnePost: resultOnePostOBJ,
                                                allMyComment: allMyComment,
                                                
                                                resultAllLikeList: resultAllLikeList,

                                                resultAllFreeGroup: resultAllFreeGroup,

                                                myAllNotification: myAllNotification

                                            });

                                        }).catch((error) => {
                                            console.log('Failed to collect all comment per post');
                                            res.render('test.hbs', {
                                                alert_name: 'danger',
                                                alert_msg_visibility: 'visible',
                                                SorF: 'Failure!',
                                                status: 'Failed to collect all comment per post'
                                            });
                                        });

                                    }).catch((error) => {
                                        console.log('Failed to collect like list');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to collect like list'
                                        });
                                    });

                                }).catch((error) => {
                                    console.log('Error : Failed to collect one post');
                                    res.render('test.hbs', {
                                        alert_name: 'danger',
                                        alert_msg_visibility: 'visible',
                                        SorF: 'Failure!',
                                        status: 'Failed to collect one post!'
                                    });
                                });
                            
                            }).catch((error) => {
                                console.log('Failed to collect one user information');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect one user information'
                                });
                            });
                        }).catch((error) => {
                            console.log('Failed to collect group');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect group'
                            });
                        });

                    }).catch((error) => {
                        console.log('Failed to find group members');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to find group members'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to update comment count');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to update comment count'
                    });
                });

            }).catch((error) => {
                console.log('Error : Failed to delete comment');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to delete comment!'
                });
            });

        }
        
        else {
            var eachCommentOwnerID = req.body.commentOwnerID

            if (eachCommentOwnerID === req.cookies.key) {
                console.log('eta to ami');
                res.redirect('myProfile');
            }
            else {
                var commentOwnerID = eachCommentOwnerID;

                console.log('eta amr profile na... eta amar friend er profile');
                bestFriend = commentOwnerID;
                res.redirect('friendProfile');
            }

        }
    }
});


app.post('/editCommentFromMyFriendEachPost', urlencodedParser, async function (req, res) {

    if(req.cookies.token === undefined){
        res.redirect('index');
    }

    var myAllNotification = 0;

    await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
        console.log('notification collect kora hoise');

        console.log(resultAllUnreadNotification.length);
        myAllNotification = resultAllUnreadNotification.length;

    }).catch((error) => {
        console.log('Failed to find resultAllUnreadNotification');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to find resultAllUnreadNotification'
        });
    });

    console.log(req.body.commentKeyValue);
    await Comments.updateOne({
        commentUniqueId: req.body.commentKeyValue
    }, {
        $set: {
            commentText: req.body.commentText
        }

    }).then(async function (resultUser) {

        await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
            var allGroup = []
            console.log(resultAllGroup.length);
            for (var i = 0; i < resultAllGroup.length; i++) {
                allGroup.push(resultAllGroup[i].groupUniqueId);
            }
            // console.log(allMan);
            await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllFreeGroup) {
                resultAllFreeGroup = resultAllFreeGroup.slice(0, 10);



                // console.log(resultUser);
                var jarPostTarID = req.body.jarPostTarID;
                console.log('Comment changed successfully');
                postKeyValue = req.body.postKeyValue;
                await Users.findOne({ userUniqueId: jarPostTarID }).then(async function (resultUser) {
                    await Posts.findOne({ postUniqueId: postKeyValue }).then(async function (resultOnePost) {
                        console.log('post ta paise')
                        // console.log(resultOnePost);
                        resultOnePostOBJ = []
                        resultOnePostOBJ.push(resultOnePost);

                        var allMyPost_Like = [];
                        for (let li = 0; li < resultOnePostOBJ.length; li++) {
                            allMyPost_Like.push(resultOnePostOBJ[li].postUniqueId);
                        }

                        await Likes.find({ originPostUniqueID: allMyPost_Like, ownerLikeUniqueID: req.cookies.key }).then(async function (resultAllLikeList) {



                            allMyComment = []
                            await Comments.find({ originPostUniqueID: postKeyValue }).then((resultPerPost) => {
                                //     // console.log(resultPerPost);
                                console.log('Comment collect kora shuru korse')
                                var obj2;
                                // console.log(resultPerPost);
                                for (var j = 0; j < resultPerPost.length; j++) {
                                    obj2 = (resultPerPost[j]);
                                    // console.log(obj2);
                                    if (obj2.ownerCommentUniqueID === req.cookies.key) {
                                        // resultPerPost[j].isCommentMine='yes';
                                        obj2.isCommentMine = 'yes';
                                    }

                                    allMyComment.push(obj2);
                                }

                                //     // allMyComment.push(resultPerPost);
                                // console.log(resultOnePost);
                                // console.log(allMyComment);


                                res.render('viewMyFriendProfileOnePost', {
                                    myKey: req.cookies.key,
                                    myName: req.cookies.name,
                                    myProPic: req.cookies.proPicAddr,
                                    myCoverPic: req.cookies.proCoverPicAddr,
                                    resultUser: resultUser,

                                    resultOnePost: resultOnePostOBJ,
                                    allMyComment: allMyComment,
                                    resultAllLikeList: resultAllLikeList,
                                    resultAllFreeGroup: resultAllFreeGroup,

                                    myAllNotification: myAllNotification

                                });

                            }).catch((error) => {
                                console.log('Failed to collect all comment per post');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to collect all comment per post'
                                });
                            });

                        }).catch((error) => {
                            console.log('Failed to collect like list');
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect like list'
                            });
                        });

                    }).catch((error) => {
                        console.log('Error : Failed to collect one post');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect one post!'
                        });
                    });
                }).catch((error) => {
                    console.log('Failed to collect one user information');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to collect one user information'
                    });
                });

            }).catch((error) => {
                console.log('Failed to collect group');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect group'
                });
            });

        }).catch((error) => {
            console.log('Failed to find group members');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find group members'
            });
        });
        // res.redirect('myProfile');

    }).catch((error) => {
        console.log('Failed to update Comment');
        res.render('test.hbs', {
            alert_name: 'danger',
            alert_msg_visibility: 'visible',
            SorF: 'Failure!',
            status: 'Failed to update Comment'
        });
    });

});


// --------------------------------------------------- NavBar search result
/* This function will handle the search page */
app.post('/search', urlencodedParser, async function (req, res) {
    if (req.cookies.key === undefined) {
        res.render('index')
    }
    else {
        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        //old file
        var searchText = req.body.Search;

        searchText = ".*"+searchText+"*." ;

        await Users.find({ userName : { "$regex": searchText, "$options": "i" } }).then(async function (searchResultUsers) {

            await Groups.find({ groupName : { "$regex": searchText, "$options": "i" } }).then(async function (searchResultGroups) {

                await groupMembers.find({ userUniqueId: req.cookies.key }).then(async function (resultAllGroup) {
                    var allGroup = []
                    console.log(resultAllGroup.length);
                    for (var i = 0; i < resultAllGroup.length; i++) {
                        allGroup.push(resultAllGroup[i].groupUniqueId);
                    }
                    // console.log(allMan);
                    await Groups.find({ groupUniqueId: allGroup }).then(async function (resultAllMyGroup) {
                        resultAllMyGroup = resultAllMyGroup.slice(0, 10);

                        // For Groups Section
                        newSearchResultGroups = []

                        for (var index = 0; index < searchResultGroups.length; index++) {
                            var element = searchResultGroups[index];

                            var newElement = {}
                            newElement.groupUniqueId = element.groupUniqueId;
                            newElement.groupName = element.groupName;
                            newElement.groupCoverPicAddr = element.groupCoverPicAddr;
                            newElement.presentCondition = 'Join';

                            await groupRequests.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive) {

                                if (resultIsPositive.length == 1) {
                                    newElement.presentCondition = 'Request sent';
                                    newSearchResultGroups.push(newElement);
                                }
                                else{
                                    await groupMembers.find({ groupUniqueId: element.groupUniqueId, userUniqueId: req.cookies.key }).then(async function (resultIsPositive2) {

                                        if (resultIsPositive2.length == 1) {
                                            newElement.presentCondition = 'Enter';
                                            newSearchResultGroups.push(newElement);
                                        }
                                        else{
                                            newElement.presentCondition = 'Join';
                                            newSearchResultGroups.push(newElement);
                                        }
                                            
                                    }).catch((error) => {
                                        console.log('Failed to check is request sent or not');
                                        res.render('test.hbs', {
                                            alert_name: 'danger',
                                            alert_msg_visibility: 'visible',
                                            SorF: 'Failure!',
                                            status: 'Failed to check is request sent or not'
                                        });
                                    });
                                }

                            }).catch((error) => {
                                console.log('Failed to check is request sent or not');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to check is request sent or not'
                                });
                            });
                        }

                        // For User Section
                        newSearchResultUsers = []
                        for (var index = 0; index < searchResultUsers.length; index++) {
                            var element = searchResultUsers[index];

                            var newElement = {}
                            newElement.userUniqueId = element.userUniqueId;
                            newElement.userName = element.userName;
                            newElement.userEmail = element.userEmail;
                            newElement.userProPicAddr = element.userProPicAddr;
                            newElement.userCoverPicAddr = element.userCoverPicAddr;
                            newElement.presentCondition = 'Follow'; 

                            await Follows.find({ followingID: element.userUniqueId, followerID: req.cookies.key }).then(async function (resultIsPositive) {

                                if (resultIsPositive.length == 1) {
                                    newElement.presentCondition = 'Following';
                                    newSearchResultUsers.push(newElement);
                                }
                                else {
                                    newElement.presentCondition = 'Follow'; 
                                    newSearchResultUsers.push(newElement);
                                }

                            }).catch((error) => {
                                console.log('Failed to check is follow or not');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to check is follow or not'
                                });
                            });
                        }

                        res.render('navBarSearchResults', {
                            myKey: req.cookies.key,
                            myName: req.cookies.name,
                            myProPic: req.cookies.proPicAddr,
                            myCoverPic: req.cookies.proCoverPicAddr,
                            
                            resultAllFreeGroup: resultAllMyGroup,

                            searchText: searchText,

                            searchResultUsers: newSearchResultUsers,
                            searchResultGroups: newSearchResultGroups,

                            myAllNotification: myAllNotification
                        });

                    }).catch((error) => {
                        console.log('Failed to collect group');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to collect group'
                        });
                    });

                }).catch((error) => {
                    console.log('Failed to find group members');
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to find group members'
                    });
                });

            }).catch((error) => {
                console.log('Failed to search word');
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to search word'
                });
            });
            

        }).catch((error) => {
            console.log('Failed to search word');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to search word'
            });
        });


    }
});





// ---------------------------------------------------- Behind The Scene

/* This function will show us behind the scene page*/
app.get('/behindTheScene', async function (req, res) {
    if (req.cookies.key === undefined){
        res.render('behindTheScene')
    }
    else{

        var myAllNotification = 0;

        await Notifications.find({ notifyWhom: req.cookies.key, notifyListColor: "ipPeopleList3" }).then(async function (resultAllUnreadNotification) {
            console.log('notification collect kora hoise');

            console.log(resultAllUnreadNotification.length);
            myAllNotification = resultAllUnreadNotification.length;

        }).catch((error) => {
            console.log('Failed to find resultAllUnreadNotification');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to find resultAllUnreadNotification'
            });
        });

        res.render('behindTheSceneAuth', {
            myKey: req.cookies.key,
            myName: req.cookies.name,
            myProPic: req.cookies.proPicAddr,
            myCoverPic: req.cookies.proCoverPicAddr,

            myAllNotification: myAllNotification
        })
    }
});



// --------------------------------------------------Ajax functionalities---------------------------------------------------------

/* This function will handle any post related Ajax functionalities */
app.post('/postInfoAjax', async function (req, res) {

    // var postID = JSON.stringify(req.body);

    console.log("post edit funciton e aslam");

    console.log(req.body.id);

    if(req.body.id != ""){
        await Posts.findOne({ postUniqueId: req.body.id }).then(async function (resultOnePost) {
            console.log('post ta paise');

            // console.log(resultOnePost);
            // console.log('ok man');
            res.send(resultOnePost);

        }).catch((error) => {
            console.log('Error : Failed to collect one post');
            // console.log(error);
            // res.render('test.hbs', {
            //     alert_name: 'danger',
            //     alert_msg_visibility: 'visible',
            //     SorF: 'Failure!',
            //     status: 'Failed to collect one post!'
            // });
        });

    // var obj = {};
    // console.log('body: ' + JSON.stringify(req.body));
    // res.send(req.body);
    }


});
/* This function will handle any post related Ajax functionalities */
app.post('/postLikeAjax', async function (req, res) {

    // var postID = JSON.stringify(req.body);

    console.log("Like function e funciton e aslam");

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();
    var AMPM = (today.getHours() < 12) ? "AM" : "PM";
    var time = today.getHours() % 12 + ':' + today.getMinutes() + ' ' + AMPM;
    var date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
    var dateTime = time + ', ' + date;    

    console.log(req.body.id);

    if (req.body.id != "") {

        await Posts.findOne({ postUniqueId: req.body.id }).then(async function (resultOnePost) {
            console.log('post ta paise');

            var notificationKey = 'sustCSElifeNotify' + Date.now();
            notificationKey = crypto.createHash('sha256').update(notificationKey).digest("base64");

            if (resultOnePost.isUserOrGroup === 'user' && resultOnePost.postOwnerUniqueID != req.cookies.key){

                var newNotification = new Notifications({
                    notifyUniqueId: notificationKey,
                    notifyWhom: resultOnePost.postOwnerUniqueID,
                    notifyLink: resultOnePost.postUniqueId,
                    notifyLinkGroup: resultOnePost.postUniqueId,
                    notifyUserUniqueID: req.cookies.key,
                    notifyUserPhoto: req.cookies.proPicAddr,
                    notifyUserName: req.cookies.name,
                    notifyTime: dateTime,
                    notifyText: 'likes on your post',
                    isFollow: 'no',
                    isLike: 'yes',
                    isComment: 'no',
                    isGroup: 'no',
                    notifyListColor: 'ipPeopleList3'
                });
                await newNotification.save().then(async function (resultNotify) {
                    
                    console.log('user like notification sent successfully');
                    
                }).catch((error) => {
                    console.log('Failed to save notification');
                    console.log(error);
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save notification'
                    });
                });
            }
            else if (resultOnePost.isUserOrGroup === 'group' && resultOnePost.postOwnerUniqueID != req.cookies.key) {

                var newNotification = new Notifications({
                    notifyUniqueId: notificationKey,
                    notifyWhom: resultOnePost.postOwnerUniqueID,
                    notifyLink: resultOnePost.postUniqueId,
                    notifyLinkGroup: resultOnePost.userORGroupUniqueID,
                    notifyUserUniqueID: req.cookies.key,
                    notifyUserPhoto: req.cookies.proPicAddr,
                    notifyUserName: req.cookies.name,
                    notifyTime: dateTime,
                    notifyText: 'likes on your post in ' + resultOnePost.isGroupName,
                    isFollow: 'no',
                    isLike: 'yes',
                    isComment: 'no',
                    isGroup: 'yes',
                    notifyListColor: 'ipPeopleList3'
                });
                await newNotification.save().then(async function (resultNotify) {
                    console.log('group like notification sent successfully');

                }).catch((error) => {
                    console.log('Failed to save notification');
                    console.log(error);
                    res.render('test.hbs', {
                        alert_name: 'danger',
                        alert_msg_visibility: 'visible',
                        SorF: 'Failure!',
                        status: 'Failed to save notification'
                    });
                });
            }

            
            await Likes.findOne({ originPostUniqueID: req.body.id, ownerLikeUniqueID: req.cookies.key }).then(async function (resultOnelike) {
                console.log('like ta paise');
            
                console.log(resultOnelike.isLike);
                
                if (resultOnelike.isLike=='no'){
                    await Posts.updateOne({
                        postUniqueId: req.body.id
                    }, {
                        $inc: {
                            likeCount: 1
                        },
                        $set: {
                            isLike: 'yes'
                            }
                            
                    }).then(async function (resultPost) {
                        // console.log(resultUser);

                        console.log('Like count changed(no to yes) successfully');
                        await Posts.findOne({ postUniqueId: req.body.id }).then(async function (resultOnePost2) {
                            await Likes.updateOne({
                                likeUniqueId: resultOnelike.likeUniqueId,
                                ownerLikeUniqueID: req.cookies.key
                            }, {
                                $set: {
                                    isLike: 'yes'
                                }
                                
                            }).then(async function (resultlike2) {
                                res.send(resultOnePost2);
                                
                            }).catch((error) => {
                                console.log('Failed to update like info');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to update like info'
                                });
                            });
                        }).catch((error) => {
                            console.log('Error : Failed to collect one post');
                            // console.log(error);
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect one post!'
                            });
                        });
                        
                    }).catch((error) => {
                        console.log('Failed to update like count');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to update like count'
                        });
                    });
                }
                else{
                    await Posts.updateOne({
                        postUniqueId: req.body.id
                    }, {
                        $inc: {
                            likeCount: -1
                        },
                        $set: {
                            isLike: 'no'
                        }
                        
                    }).then(async function (resultPost) {
                        // console.log(resultUser);
                        
                        console.log('Like count changed(yes to no) successfully');
                        await Posts.findOne({ postUniqueId: req.body.id }).then(async function (resultOnePost2) {
                            await Likes.updateOne({
                                likeUniqueId: resultOnelike.likeUniqueId,
                                ownerLikeUniqueID: req.cookies.key
                            }, {
                                $set: {
                                    isLike: 'no'
                                }
                                
                            }).then(async function (resultlike2) {
                                res.send(resultOnePost2);

                            }).catch((error) => {
                                console.log('Failed to update like info');
                                res.render('test.hbs', {
                                    alert_name: 'danger',
                                    alert_msg_visibility: 'visible',
                                    SorF: 'Failure!',
                                    status: 'Failed to update like info'
                                });
                            });
                        }).catch((error) => {
                            console.log('Error : Failed to collect one post');
                            // console.log(error);
                            res.render('test.hbs', {
                                alert_name: 'danger',
                                alert_msg_visibility: 'visible',
                                SorF: 'Failure!',
                                status: 'Failed to collect one post!'
                            });
                        });
                        
                    }).catch((error) => {
                        console.log('Failed to update like count');
                        res.render('test.hbs', {
                            alert_name: 'danger',
                            alert_msg_visibility: 'visible',
                            SorF: 'Failure!',
                            status: 'Failed to update like count'
                        });
                    });
                    // console.log(resultOnePost);
                    // console.log('ok man');
                    // res.send(resultOnePost);
                }

            }).catch((error) => {
                console.log('Error : Failed to collect one like');
                // console.log(error);
                res.render('test.hbs', {
                    alert_name: 'danger',
                    alert_msg_visibility: 'visible',
                    SorF: 'Failure!',
                    status: 'Failed to collect one like!'
                });
            });
                

           
        }).catch((error) => {
            console.log('Error : Failed to collect one post');
            res.render('test.hbs', {
                alert_name: 'danger',
                alert_msg_visibility: 'visible',
                SorF: 'Failure!',
                status: 'Failed to collect one post!'
            });
        });

    }
    else{
        res.send(req.body);
    }
});

/* This function will handle any comment related Ajax functionalities */
app.post('/commentInfoAjax', async function (req, res) {

    // var postID = JSON.stringify(req.body);
    
    console.log("comment edit funciton e aslam");
    
    console.log(req.body.id);
    
    if (req.body.id != "") {
        await Comments.findOne({ commentUniqueId: req.body.id }).then(async function (resultOneComment) {
            console.log('comment ta paise');

            // console.log(resultOnePost);
            // console.log('ok man');
            res.send(resultOneComment);

        }).catch((error) => {
            console.log('Error : Failed to collect one comment');
            // console.log(error);
            // res.render('test.hbs', {
            //     alert_name: 'danger',
            //     alert_msg_visibility: 'visible',
            //     SorF: 'Failure!',
            //     status: 'Failed to collect one post!'
            // });
        });
    }


});
// ------------------------------------------------------------------Notification Alert + Socket.io --------------------------------

/* Am i a membet or not of this particular group? This function will answer to us of this question*/

app.post('/amIMember', async function (req, res) {

    console.log("amImember funciton e aslam");
    console.log(req.body.id);
    
    if (req.body.id != "") {
        await groupMembers.find({ groupUniqueId: req.body.id, userUniqueId: req.cookies.key }).then(async function (resultOneElement) {
            if(resultOneElement.length != 0){

                res.send('yes');
            }
            else{
                res.send('no');
            }
        }).catch((error) => {
            console.log('Error : Failed to collect one post');
        });
    }
});



io.on('connection', function (socket) {
    console.log('connection established');
    socket.on('likeCommentPostNotification', async function (notificationData) {
        console.log('sever responed');
        console.log('groupPost/groupRequest found');

        notificationData.newFriend = 'newFriend';

        socket.broadcast.emit('postCommentLikeNotification', notificationData);

    });

    socket.on('likeCommentPostNotificationHome', async function (notificationData) {
        
        console.log('sever responed');
        notificationData.newFriend = 'newFriend';

        await Posts.findOne({ postUniqueId: notificationData.postKey }).then(async function (resultOnePost) {
            if (notificationData.likeOrComment === 'like') {
                console.log('like found');
                if(resultOnePost.isUserOrGroup === 'user'){
                    console.log('friend post found');
                    notificationData.friendOrGroup = 'friend';
                    notificationData.postOwnerKey = resultOnePost.postOwnerUniqueID;
                    notificationData.groupKey = resultOnePost.userORGroupUniqueID;
                    notificationData.text = notificationData.fromName+' liked on you post';

                    console.log(notificationData.postOwnerKey);
                    console.log(notificationData.fromName);
                    console.log(notificationData.fromKey);
                    socket.broadcast.emit('postCommentLikeNotification', notificationData);
                }
                else if(resultOnePost.isUserOrGroup === 'group'){
                    console.log('group post found');
                    notificationData.friendOrGroup = 'group';
                    notificationData.postOwnerKey = resultOnePost.postOwnerUniqueID;
                    notificationData.groupKey = resultOnePost.userORGroupUniqueID;
                    notificationData.text = notificationData.fromName + ' liked on you post in ' + resultOnePost.isGroupName;
                    console.log('read here');
                    socket.broadcast.emit('postCommentLikeNotification', notificationData);
                }
            }
            else {
                console.log('comment found');
                if (resultOnePost.isUserOrGroup === 'user') {
                    console.log('friend post found');
                    notificationData.friendOrGroup = 'friend';
                    notificationData.postOwnerKey = resultOnePost.postOwnerUniqueID;
                    notificationData.groupKey = resultOnePost.userORGroupUniqueID;
                    notificationData.text = notificationData.fromName + ' commented on you post';
                    socket.broadcast.emit('postCommentLikeNotification', notificationData);
                }
                else if (resultOnePost.isUserOrGroup === 'group') {
                    console.log('group post found');
                    notificationData.friendOrGroup = 'group';
                    notificationData.postOwnerKey = resultOnePost.postOwnerUniqueID;
                    notificationData.groupKey = resultOnePost.userORGroupUniqueID;
                    notificationData.text = notificationData.fromName + ' commented on you post in ' + resultOnePost.isGroupName;
                    socket.broadcast.emit('postCommentLikeNotification', notificationData);
                }
            }
        }).catch((error) => {
            console.log('Error : Failed to collect one post');
        });
    });

    socket.on('likeCommentPostNotificationFollow', async function (notificationData) {
        console.log('sever responed');
        await Follows.find({ followingID: notificationData.postOwnerKey, followerID: notificationData.fromKey }).then(async function (resultOneElement) {
            console.log('khujtese akn');
            if (resultOneElement.length === 0) {
                console.log('ami archi not achi');
                console.log('follow found');
                console.log(notificationData.text);
                console.log(notificationData.newFriend);
                socket.broadcast.emit('postCommentLikeNotification', notificationData);
            }
        }).catch((error) => {
            console.log('Error : Failed to collect one post');
        });

    });

});


// ------------------------------------------------ END 


app.get('/test', function (req, res) {
    // res.render('SUSTCSELIFE');
    res.render('test2')
    // res.render('friendProfile')
    // res.render('home')
    // res.render('peoples')
    // res.render('groups')
    // res.render('notifications')
});



server.listen(port, function () {
    console.log('Server is up on port ' + port);
});