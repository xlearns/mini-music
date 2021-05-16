//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    item:0,
    tab:0,
    playlist: [{
      　id: 1, 
        title: "seve", 
        singer: "Tez Cadey",
        src: 'pages/assert/seve.mp3', coverImgUrl: 'https://p2.music.126.net/dtkD-uHKpZ0BZk0Fa1Y0nQ==/109951164104796505.jpg'
    },{
        id: 2, 
        title: "我怎么可以这么猛", 
        singer: "钟亚男",
        src: 'pages/assert/我怎么可以这么猛.mp3',
        coverImgUrl: 'https://p2.music.126.net/dtkD-uHKpZ0BZk0Fa1Y0nQ==/109951164104796505.jpg'
    },{
      id: 3, 
      title: "Cool Girl", 
      singer: "战斗吧歌姬",
      src: 'pages/assert/Cool Girl.mp3', 
      coverImgUrl: '../images/1.jpg'
  }],
    state: 'paused',
    playIndex: 0,
    audioCtx: null,
    play: {
      currentTime: '00:00',
      duration: '00:00',
      percent: 0,
      title: '',
      singer: '',
      coverImgUrl: 'https://p2.music.126.net/dtkD-uHKpZ0BZk0Fa1Y0nQ==/109951164104796505.jpg'
    }
  },
  play:function(){
    this.audioCtx.play();
    this.setData({
        state:'running'
    })
  },
  pause:function(){
    this.audioCtx.pause();
    this.setData({
      state:'paused'
    })
  },
  changeTab:function(e){
    this.setData({
      tab:e.detail.current
    })
  },
  changeItem:function(e){
    this.setData({
      item:e.target.dataset.item
    })
  },
  next:function(){
    var index = this.data.playIndex >= this.data.playlist.length - 1 ?
    0: this.data.playIndex + 1 ;
    this.setMusic(index);
    if (this.data.state === 'running') {
      this.play()
    }
  },
  onReady: function() {
    this.audioCtx = wx.createInnerAudioContext();
    var that = this
    //播放失败
    this.audioCtx.onError(function() {
       console.log('播放失败：' + that.audioCtx.src)
   })
    // 播放完成自动换下一曲
    // 当前音乐播放完毕之后会回调onEnded函数
    // 然后调用next得方法即可
    this.audioCtx.onEnded(function() {
      that.next()
    })
    // 自动更新播放进度
    this.audioCtx.onPlay(function() {})
    this.audioCtx.onTimeUpdate(function() {
    that.setData({
        'play.duration': formatTime(that.audioCtx.duration),
        'play.currentTime': formatTime(that.audioCtx.currentTime),
        'play.percent': that.audioCtx.currentTime /　　　　　　　　　　 that.audioCtx.duration * 100　　
      })
   })
    // 格式化时间
    function formatTime(time) {
      var minute = Math.floor(time / 60) % 60;
      var second = Math.floor(time) % 60
      return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
     }
    this.setMusic(0)
  },
  setMusic: function(index) {
    var music = this.data.playlist[index]
    this.audioCtx.src = music.src
    
    this.setData({
      playIndex: index,
      'play.title': music.title,
      'play.singer': music.singer,
      'play.coverImgUrl': music.coverImgUrl,
      'play.currentTime': '00:00',
      'play.duration': '00:00',
      'play.percent': 0
    })
  },
  change: function(e) {
    this.setMusic(e.currentTarget.dataset.zdy);
    this.play();
  },
  sliderChange: function(e) {
    var second = e.detail.value * this.audioCtx.duration / 100
    this.audioCtx.seek(second)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
