Page({
  data: {
    mbtiType: "",
    tasks: [],
    startDate: 0,
    currentDay: 1,
    expandedDay: 1,
    dayTasks: [],
    daysCompleted: {},
    isCheckinModalVisible: false,
    activeTask: null,
    activeCheckinMethod: 'text', // 'text', 'image', 'audio'
    checkinContent: ""
  },

  onLoad() {
    // 从本地存储获取MBTI数据
    wx.getStorage({
      key: 'mbtiData',
      success: (res) => {
        const { mbtiType, tasks, startDate } = res.data;
        
        // 计算当前是第几天
        const now = new Date().getTime();
        const daysPassed = Math.floor((now - startDate) / (24 * 60 * 60 * 1000)) + 1;
        const currentDay = daysPassed > 7 ? 7 : daysPassed;
        
        // 初始化任务
        const sevenDayTasks = this.generateWeekTasks(tasks);
        
        // 读取已完成的天数
        let daysCompleted = {};
        try {
          const completedData = wx.getStorageSync('daysCompleted');
          if (completedData) {
            daysCompleted = JSON.parse(completedData);
          }
        } catch (e) {
          console.error('读取完成数据失败', e);
        }
        
        this.setData({
          mbtiType,
          tasks,
          startDate,
          currentDay,
          expandedDay: currentDay,
          dayTasks: sevenDayTasks[currentDay - 1],
          daysCompleted
        });
      }
    });
  },
  
  // 统计已完成的天数
  getCompletedDaysCount() {
    const { daysCompleted } = this.data;
    return Object.keys(daysCompleted).length;
  },
  
  // 统计已完成的任务数
  getCompletedTasksCount() {
    const { daysCompleted } = this.data;
    let count = 0;
    
    Object.values(daysCompleted).forEach(tasks => {
      count += tasks.length;
    });
    
    return count;
  },
  
  // 统计特定类型的媒体上传数
  getMediaUploadsCount(mediaType) {
    const { daysCompleted } = this.data;
    let count = 0;
    
    Object.values(daysCompleted).forEach(tasks => {
      tasks.forEach(task => {
        if (task.method === mediaType) {
          count++;
        }
      });
    });
    
    return count;
  },
  
  // 获取任务的打卡详情
  getTaskCheckinDetails(day, taskTitle) {
    const { daysCompleted } = this.data;
    if (!daysCompleted[day] || !daysCompleted[day].length) {
      return null;
    }
    
    const checkin = daysCompleted[day].find(t => t.taskTitle === taskTitle);
    return checkin || null;
  },
  
  // 判断任务是否已完成
  isTaskCompleted(day, taskTitle) {
    const { daysCompleted } = this.data;
    if (!daysCompleted[day] || !daysCompleted[day].length) {
      return false;
    }
    return daysCompleted[day].findIndex(t => t.taskTitle === taskTitle) !== -1;
  },
  
  // 判断天数是否有任务完成
  isDayCompleted(day) {
    const { daysCompleted } = this.data;
    return daysCompleted[day] && daysCompleted[day].length > 0;
  },
  
  // 生成七天的任务，每天都有3个任务
  generateWeekTasks(tasks) {
    const weekTasks = [];
    
    // 简单处理：每天都是相同的3个任务
    for (let i = 0; i < 7; i++) {
      weekTasks.push(tasks.map(task => ({
        ...task,
        completed: false,
        day: i + 1
      })));
    }
    
    return weekTasks;
  },
  
  // 查看前一天
  navigatePrevDay() {
    if (this.data.expandedDay > 1) {
      const expandedDay = this.data.expandedDay - 1;
      const weekTasks = this.generateWeekTasks(this.data.tasks);
      
      this.setData({
        expandedDay,
        dayTasks: weekTasks[expandedDay - 1]
      });
    }
  },
  
  // 查看后一天
  navigateNextDay() {
    const { expandedDay, currentDay } = this.data;
    if (expandedDay < 7 && expandedDay < currentDay) {
      const newDay = expandedDay + 1;
      const weekTasks = this.generateWeekTasks(this.data.tasks);
      
      this.setData({
        expandedDay: newDay,
        dayTasks: weekTasks[newDay - 1]
      });
    }
  },
  
  // 展开某一天的任务
  expandDay(e) {
    const { day } = e.currentTarget.dataset;
    const expandedDay = parseInt(day);
    
    // 获取该天的任务
    const weekTasks = this.generateWeekTasks(this.data.tasks);
    
    this.setData({
      expandedDay,
      dayTasks: weekTasks[expandedDay - 1]
    });
  },
  
  // 处理点击天数
  handleDayTap(e) {
    const { day } = e.currentTarget.dataset;
    const { currentDay } = this.data;
    
    if (currentDay >= parseInt(day)) {
      this.expandDay(e);
    }
  },
  
  // 打开文字打卡
  openTextCheckin(e) {
    const { task } = e.currentTarget.dataset;
    
    this.setData({
      isCheckinModalVisible: true,
      activeTask: task,
      activeCheckinMethod: 'text',
      checkinContent: ""
    });
  },
  
  // 打开图片打卡
  openImageCheckin(e) {
    const { task } = e.currentTarget.dataset;
    
    this.setData({
      isCheckinModalVisible: true,
      activeTask: task,
      activeCheckinMethod: 'image',
      checkinContent: ""
    });
  },
  
  // 打开语音打卡
  openAudioCheckin(e) {
    const { task } = e.currentTarget.dataset;
    
    this.setData({
      isCheckinModalVisible: true,
      activeTask: task,
      activeCheckinMethod: 'audio',
      checkinContent: ""
    });
  },
  
  // 关闭打卡模态框
  closeCheckinModal() {
    this.setData({
      isCheckinModalVisible: false
    });
  },
  
  // 输入文字打卡内容
  inputCheckinText(e) {
    this.setData({
      checkinContent: e.detail.value
    });
  },
  
  // 选择图片打卡
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          checkinContent: res.tempFilePaths[0]
        });
      }
    });
  },
  
  // 开始录音
  startRecording() {
    const recorderManager = wx.getRecorderManager();
    
    recorderManager.onStart(() => {
      wx.showToast({
        title: '正在录音...',
        icon: 'none',
        duration: 60000
      });
    });
    
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    };
    
    recorderManager.start(options);
    
    this.setData({
      recorderManager
    });
  },
  
  // 停止录音
  stopRecording() {
    const { recorderManager } = this.data;
    
    if (recorderManager) {
      recorderManager.onStop((res) => {
        wx.hideToast();
        this.setData({
          checkinContent: res.tempFilePath
        });
      });
      
      recorderManager.stop();
    }
  },
  
  // 播放录音
  playAudio(e) {
    const { audio } = e.currentTarget.dataset;
    const innerAudioContext = wx.createInnerAudioContext();
    
    innerAudioContext.src = audio;
    innerAudioContext.play();
  },
  
  // 提交打卡
  submitCheckin() {
    const { expandedDay, activeTask, activeCheckinMethod, checkinContent } = this.data;
    
    if (!checkinContent) {
      wx.showToast({
        title: '请完成打卡内容',
        icon: 'none'
      });
      return;
    }
    
    // 更新完成状态
    const daysCompleted = { ...this.data.daysCompleted };
    if (!daysCompleted[expandedDay]) {
      daysCompleted[expandedDay] = [];
    }
    
    daysCompleted[expandedDay].push({
      taskTitle: activeTask.title,
      method: activeCheckinMethod,
      content: checkinContent,
      timestamp: new Date().getTime()
    });
    
    // 保存到本地存储
    wx.setStorage({
      key: 'daysCompleted',
      data: JSON.stringify(daysCompleted)
    });
    
    this.setData({
      daysCompleted,
      isCheckinModalVisible: false
    });
    
    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    });
  },
  
  // 查看详细统计数据
  viewDetailedStats() {
    wx.navigateTo({
      url: '/pages/stats/index'
    });
  },
  
  // 查看总报告
  viewTotalReport() {
    wx.navigateTo({
      url: '/pages/stats/index?view=report'
    });
  },
  
  // 开始下一个七天
  startNextWeek() {
    wx.showToast({
      title: '下一周功能开发中',
      icon: 'none'
    });
  },
  
  // 重新测试
  retakeTest() {
    wx.navigateTo({
      url: '/pages/test/index'
    });
  }
}) 