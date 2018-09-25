cc.Class({
    extends: cc.Component,

    properties: {
        rankBG: {
            default : null,
            type : cc.Sprite
        },
        labelRank : {
            default : null,
            type : cc.Label
        },
        labelPlayerName : {
            default : null,
            type : cc.Label
        },
        labelScore : {
            default : null,
            type : cc.Label
        },
        playerPhoto : {
            default : null,
            type : cc.Sprite
        },
        texRankBG : {
            default : [],
            type : [cc.SpriteFrame]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    //************************************start logic*************************************************//
    init : function(rank, userGameData){
        if (rank <= 3) { // should display trophy
            this.labelRank.node.active = false;
            this.rankBG.spriteFrame = this.texRankBG[rank-1];
        } else {
            this.labelRank.node.active = true;
            this.labelRank.string = String(rank);
        }

        this.labelPlayerName.string = userGameData.nickname;
        this.labelScore.string = String(userGameData.score);

        cc.loader.load({
            url: userGameData.avatarUrl, 
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            console.log(texture);
            this.playerPhoto.spriteFrame = new cc.SpriteFrame(texture);
        });     
    }
    //************************************end logic*************************************************//

});
