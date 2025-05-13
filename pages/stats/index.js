Page({
  data: {
    mbtiType: "",
    startDate: 0,
    endDate: 0,
    completedDays: 0,
    completedTasks: 0,
    textCheckins: 0,
    imageCheckins: 0,
    audioCheckins: 0,
    currentView: 'stats', // 'stats' or 'report'
    daysData: [],
    tasksByType: [],
    // 新增预计算数据
    startDateFormatted: '',
    endDateFormatted: '',
    completionRate: 0,
    favoriteCheckinMethod: '',
    mostProductiveDay: 0
  },

  onLoad(options) {
    // 如果有view参数，设置当前视图
    if (options.view) {
      this.setData({
        currentView: options.view
      });
    }
    
    // 从本地存储获取MBTI数据和完成数据
    wx.getStorage({
      key: 'mbtiData',
      success: (res) => {
        const { mbtiType, startDate } = res.data;
        
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
        
        // 计算各种统计数据
        const now = new Date().getTime();
        const completedDays = Object.keys(daysCompleted).length;
        
        let completedTasks = 0;
        let textCheckins = 0;
        let imageCheckins = 0;
        let audioCheckins = 0;
        
        Object.values(daysCompleted).forEach(tasks => {
          completedTasks += tasks.length;
          
          tasks.forEach(task => {
            if (task.method === 'text') textCheckins++;
            if (task.method === 'image') imageCheckins++;
            if (task.method === 'audio') audioCheckins++;
          });
        });
        
        // 按日生成数据
        const daysData = [];
        for (let i = 1; i <= 7; i++) {
          daysData.push({
            day: i,
            completed: daysCompleted[i] ? daysCompleted[i].length : 0,
            total: 3, // 假设每天3个任务
            percentage: daysCompleted[i] ? (daysCompleted[i].length / 3) * 100 : 0
          });
        }
        
        // 按类型分析任务完成情况
        const tasksByType = [
          { type: "文字记录", count: textCheckins, color: "#6E7BF2" },
          { type: "图片上传", count: imageCheckins, color: "#4CAF50" },
          { type: "语音记录", count: audioCheckins, color: "#FF6B6B" }
        ];
        
        // 预计算需要在WXML中使用的值
        const startDateFormatted = this.formatDate(startDate);
        const endDateFormatted = this.formatDate(now);
        const completionRate = Math.round((completedTasks / 21) * 100);
        
        // 找出最常用的打卡方式
        let favoriteMethod = tasksByType[0];
        tasksByType.forEach(method => {
          if (method.count > favoriteMethod.count) {
            favoriteMethod = method;
          }
        });
        
        // 找出完成任务最多的一天
        let mostProductiveDay = 1;
        let maxCompleted = 0;
        daysData.forEach(day => {
          if (day.completed > maxCompleted) {
            maxCompleted = day.completed;
            mostProductiveDay = day.day;
          }
        });
        
        this.setData({
          mbtiType,
          startDate,
          endDate: now,
          completedDays,
          completedTasks,
          textCheckins,
          imageCheckins,
          audioCheckins,
          daysData,
          tasksByType,
          // 设置预计算数据
          startDateFormatted,
          endDateFormatted,
          completionRate,
          favoriteCheckinMethod: favoriteMethod.type,
          mostProductiveDay
        });
      }
    });
  },
  
  // 切换查看视图（统计/报告）
  switchView(e) {
    const { view } = e.currentTarget.dataset;
    this.setData({ currentView: view });
  },
  
  // 开始下一个七天
  startNextWeek() {
    wx.showToast({
      title: '下一周功能开发中',
      icon: 'none'
    });
  },
  
  // 返回任务页面
  backToTasks() {
    wx.navigateBack();
  },

  // 格式化日期
  formatDate(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },
}) 