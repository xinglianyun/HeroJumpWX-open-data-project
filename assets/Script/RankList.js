
cc.Class({
    extends: cc.Component,

    properties: {
        rankScrollView : {
            default : null,
            type : cc.ScrollView
        },
        rankItemPrefab : {
            default : null,
            type : cc.Prefab
        },
        maxCount : {
            default : 30,
            type : cc.Integer
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
       
    },

    start () {
        this._userGroupData = []
        this.init()
    },

    // update (dt) {},
    //************************************start logic*************************************************//
    init : function(){
        //this.getWXUserData()
        this.getWXGroupUserData()
    },
    /**
     * desc: get the current user data
     */
    getWXUserData : function(){
        var keyArr = ["user_data"]
        var params = {
            keyList : keyArr,
            success : function(dataArray){
                if(dataArray.length > 0){
                    var userData = dataArray[0]
                    if(userData.key === "user_date"){
                        var value = Json.parse(userData.value)
                        Global.wxUserData.score = Number(value.wxgame.score)
                    }
                }
            },
            fail : function(){},
            complete : function(){}
        }
        wx.getUserCloudStorage(params)
    },
    /**
     * desc: get the friend game data
     */
    getWXGroupUserData : function(){
        let _self = this
        this._userGroupData = []
        var keyArr = ["user_data"]
        var groupParams = {
            keyList : keyArr,
            success : function(friendData){
                for(let i = 0; i < friendData.data.length; ++i){
                    var userData = friendData.data[i]
                    _self._userGroupData[i] = {
                        avatarUrl : userData.avatarUrl,
                        nickname : userData.nickname,
                    } 

                    if(userData.KVDataList.length > 0){
                        var data = userData.KVDataList[0]
                        if(data.key === "user_data"){
                            var value = JSON.parse(data.value)
                            _self._userGroupData[i].score = Number(value.wxgame.score)
                        }
                    }
                }

                if(_self._userGroupData.length > 0){
                    _self._userGroupData.sort(
                        function(data1, data2){
                            if(data1.score > data2.score) return 1
                            else if(data1.score < data2.score) return -1
                            else return 0
                        }
                    )
                    _self.refreshRankList()
                }
            },
            fail : function(){},
            complete : function(){}
        }
        wx.getFriendCloudStorage(groupParams)
    },
    /**
     * desc: refresh the rank view
     */
    refreshRankList : function(){
        var showCount = this.maxCount > this._userGroupData.length ? this._userGroupData.length : this.maxCount
        for(let i = 0; i < showCount; ++i){
            var itemNode = cc.instantiate(this.rankItemPrefab)
            itemNode.getComponent("RankItem").init(i+1, this._userGroupData[i])
            this.rankScrollView.content.addChild(itemNode)
        }
    }
    //************************************end logic*************************************************//
});
