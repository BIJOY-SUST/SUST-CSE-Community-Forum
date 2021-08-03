
// const Users = mongoose.model('Users', {
//     userUniqueId: {
//         type: String,
//         trim: true
//     },
//     userName: {
//         type: String,
//         trim: true
//     },
//     userRegNo: {
//         type: String,
//         trim: true
//     },
//     userEmail: {
//         type: String,
//         unique: true,
//         trim: true
//     },
//     userPassword: {
//         type: String,
//         trim: true
//     },
//     userProPicAddr: {
//         type: String,
//         trim: true
//     },
//     userCoverPicAddr: {
//         type: String,
//         trim: true
//     },
//     userType: {
//         type: String,
//         trim: true
//     },
//     isAdministrator: {
//         type: Number
//     }
// });

// const Follows = mongoose.model('Follows', {

//     followerID: {
//         type: String,
//         trim: true
//     },
//     followerName: {
//         type: String,
//         trim: true
//     },
//     followerProPic: {
//         type: String,
//         trim: true
//     },
//     followingID: {
//         type: String,
//         trim: true
//     },
//     followingName: {
//         type: String,
//         trim: true
//     },
//     followingProPic: {
//         type: String,
//         trim: true
//     }
// });

// const Groups = mongoose.model('Groups', {
//     groupUniqueId: {
//         type: String,
//         trim: true
//     },
//     groupName: {
//         type: String,
//         trim: true
//     },
//     groupCoverPicAddr: {
//         type: String,
//         trim: true
//     }
// });

// const groupRequests = mongoose.model('groupRequests', {
//     groupUniqueId: {
//         type: String,
//         trim: true
//     },
//     userUniqueId: {
//         type: String,
//         trim: true
//     },
//     userName: {
//         type: String,
//         trim: true
//     },
//     userPicAddr: {
//         type: String,
//         trim: true,
//     },
//     userRequestMessage: {
//         type: String,
//         trim: true
//     }
// });

// const groupMembers = mongoose.model('groupMembers', {
//     groupUniqueId: {
//         type: String,
//         trim: true
//     },
//     userUniqueId: {
//         type: String,
//         trim: true
//     },
//     userName: {
//         type: String,
//         trim: true
//     },
//     userPicAddr: {
//         type: String,
//         trim: true
//     }, 
//     isAdmin: {
//         type: String,
//         trim: true
//     }
// });


// const Posts = mongoose.model('Posts', {
//     postNumber: {
//         type: Number
//     },
//     postUniqueId: {
//         type: String,
//         trim: true
//     },
//     userORGroupUniqueID: {
//         type: String,
//         trim: true
//     },
//     postOwnerUniqueID: {
//         type: String,
//         trim: true
//     },
//     postOwnerPic: {
//         type: String,
//         trim: true
//     },
//     postOwnerName: {
//         type: String,
//         trim: true
//     },
//     postTime: {
//         type: String,
//         trim: true
//     },
//     postText: {
//         type: String,
//         trim: true
//     },
//     postFileAddr: {
//         type: String,
//         trim: true
//     },
//     isFileType: {
//         type: String,
//         trim: true
//     },

//     isImageFile: {
//         type: String,
//         trim: true
//     },
//     isPdfFile: {
//         type: String,
//         trim: true
//     },
//     isVideoFile: {
//         type: String,
//         trim: true
//     },
//     isUserOrGroup: {
//         type: String,
//         trim: true
//     },
//     isGroupName: {
//         type: String,
//         trim: true
//     },
//     isAdmin: {
//         type: String,
//         trim: true
//     },
//     isLike:{
//         type: String,
//         trim: true
//     },
//     likeCount: {
//         type: Number
//     },
//     commentCount: {
//         type: Number
//     }
// });

// const Likes = mongoose.model('Likes', {
//     likeUniqueId: {
//         type: String,
//         trim: true
//     },
//     originPostUniqueID: {
//         type: String,
//         trim: true
//     },
//     ownerLikeUniqueID: {
//         type: String,
//         trim: true
//     },
//     isLike: {
//         type: String,
//         trim: true
//     },
//     userPhoto: {
//         type: String,
//         trim: true,
//     },
//     userName: {
//         type: String,
//         trim: true
//     }
// });

// const Comments = mongoose.model('Comments', {
//     commentUniqueId: {
//         type: String,
//         trim: true
//     },
//     originPostUniqueID: {
//         type: String,
//         trim: true
//     },
//     ownerCommentUniqueID: {
//         type: String,
//         trim: true
//     },
//     userPhoto: {
//         type: String,
//         trim: true,
//     },
//     userName: {
//         type: String,
//         trim: true
//     },
//     commentTime: {
//         type: String,
//         trim: true
//     },
//     commentText: {
//         type: String,
//         trim: true
//     },
//     isCommentMine: {
//         type: String,
//         trim: true
//     },
//     isIamAdmin:{
//         type: String,
//         trim: true
//     }

// });

// const Notifications = mongoose.model('Notifications', {
//     notifyUniqueId: {
//         type: String,
//         trim: true
//     },
//     notifyWhom: {
//         type: String,
//         trim: true
//     },
//     notifyLink: {
//         type: String,
//         trim: true
//     },
//     notifyLinkGroup: {
//         type: String,
//         trim: true
//     },
//     notifyUserUniqueID: {
//         type: String,
//         trim: true
//     },
//     notifyUserPhoto: {
//         type: String,
//         trim: true,
//     },
//     notifyUserName: {
//         type: String,
//         trim: true
//     },
//     notifyTime: {
//         type: String,
//         trim: true
//     },
//     notifyText: {
//         type: String,
//         trim: true
//     },
//     isFollow: {
//         type: String,
//         trim: true
//     },
//     isLike: {
//         type: String,
//         trim: true
//     },
//     isComment: {
//         type: String,
//         trim: true
//     },
//     isGroup: {
//         type: String,
//         trim: true
//     },
//     notifyListColor: {
//         type: String,
//         trim: true
//     }
// });

// // Elections Tables - Start From Here

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
    endDate: {
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
    }
});


const dd = new Date();

console.log(dd);
console.log(dd.getHours())


const s = '2021-06-24T05:31:00.000+06:00';
const d = new Date(s);
console.log(d)


const str = '2021-06-24 02:02:00'
const now = '2021-06-24 16:40:00'
rrr = new Date('2030-13-03 22:30:00')

console.log(rrr);
console.log(rrr.getHours());
if (isNaN(rrr.getHours())) {
    console.log('holo')
}
