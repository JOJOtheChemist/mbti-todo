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
    checkinContent: "",
    // 添加示例数据，用于模拟占位
    placeholderData: {
      text: "这是一条示例文字记录...",
      image: "/images/placeholder-image.svg", 
      audio: "00:30"
    },
    touchStartX: 0, // 记录触摸开始位置
    isRecording: false, // 是否正在录音
    // 预设7天的任务
    presetTasks: [
      // 第1天任务
      [
        {
          title: "早起晨跑20分钟",
          reason: "增强体质，提高效率",
          type: "运动",
          difficulty: "中等"
        },
        {
          title: "阅读30分钟",
          reason: "拓展思维，提高认知",
          type: "学习",
          difficulty: "简单"
        },
        {
          title: "整理工作计划",
          reason: "提高工作效率",
          type: "工作",
          difficulty: "简单"
        }
      ],
      // 第2天任务
      [
        {
          title: "学习新技能1小时",
          reason: "提升专业能力",
          type: "学习",
          difficulty: "中等"
        },
        {
          title: "与朋友交流",
          reason: "建立社交联系",
          type: "社交",
          difficulty: "简单"
        },
        {
          title: "写日记总结",
          reason: "反思成长",
          type: "自我提升",
          difficulty: "简单"
        }
      ],
      // 第3天任务
      [
        {
          title: "健身锻炼45分钟",
          reason: "保持健康身体",
          type: "运动",
          difficulty: "中等"
        },
        {
          title: "冥想放松15分钟",
          reason: "缓解压力",
          type: "心理健康",
          difficulty: "简单"
        },
        {
          title: "完成一个工作难题",
          reason: "突破瓶颈",
          type: "工作",
          difficulty: "困难"
        }
      ],
      // 第4天任务
      [
        {
          title: "尝试新的烹饪菜谱",
          reason: "拓展生活技能",
          type: "生活",
          difficulty: "中等"
        },
        {
          title: "观看一部纪录片",
          reason: "拓展知识面",
          type: "学习",
          difficulty: "简单"
        },
        {
          title: "整理居住环境",
          reason: "提升生活品质",
          type: "生活",
          difficulty: "中等"
        }
      ],
      // 第5天任务
      [
        {
          title: "户外徒步2小时",
          reason: "亲近自然，放松身心",
          type: "休闲",
          difficulty: "中等"
        },
        {
          title: "学习一个新概念",
          reason: "持续学习成长",
          type: "学习",
          difficulty: "中等"
        },
        {
          title: "与家人深入交流",
          reason: "维护亲情关系",
          type: "家庭",
          difficulty: "简单"
        }
      ],
      // 第6天任务
      [
        {
          title: "参加社区活动",
          reason: "扩展社交圈",
          type: "社交",
          difficulty: "中等"
        },
        {
          title: "阅读一篇专业文章",
          reason: "保持行业敏感度",
          type: "专业",
          difficulty: "中等"
        },
        {
          title: "规划下周目标",
          reason: "保持方向感",
          type: "规划",
          difficulty: "简单"
        }
      ],
      // 第7天任务
      [
        {
          title: "全面回顾本周成果",
          reason: "总结经验教训",
          type: "回顾",
          difficulty: "中等"
        },
        {
          title: "放松休息，做自己喜欢的事",
          reason: "恢复精力",
          type: "休息",
          difficulty: "简单"
        },
        {
          title: "制定下周关键计划",
          reason: "未雨绸缪",
          type: "规划",
          difficulty: "中等"
        }
      ]
    ],
    allDayTasks: [], // 存储所有天的任务
    checkinRecords: {}  // 存储各任务的打卡记录，按时间顺序保存
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
        
        // 使用预设任务替代原来的任务
        const allTasks = this.data.presetTasks;
        
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
        
        // 读取打卡记录
        let checkinRecords = {};
        try {
          const recordsData = wx.getStorageSync('checkinRecords');
          if (recordsData) {
            checkinRecords = JSON.parse(recordsData);
          }
        } catch (e) {
          console.error('读取打卡记录失败', e);
        }
        
        // 设置当前页面数据
        this.setData({
          mbtiType,
          tasks: tasks || [],
          startDate,
          currentDay,
          expandedDay: currentDay,
          dayTasks: allTasks[currentDay - 1],
          allDayTasks: allTasks,
          daysCompleted,
          checkinRecords
        });
      },
      fail: () => {
        // 如果没有存储数据，使用默认设置
        const now = new Date().getTime();
        const currentDay = 1;
        
        this.setData({
          mbtiType: "默认MBTI类型",
          startDate: now,
          currentDay,
          expandedDay: currentDay,
          dayTasks: this.data.presetTasks[0],
          allDayTasks: this.data.presetTasks
        });
      }
    });
  },

  // 触摸开始事件
  handleTouchStart(e) {
    this.setData({
      touchStartX: e.touches[0].pageX
    });
  },
  
  // 触摸结束事件
  handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].pageX;
    const diff = touchEndX - this.data.touchStartX;
    
    // 判断是否是左右滑动（大于50px视为有效滑动）
    if (Math.abs(diff) > 50) {
      if (diff > 0 && this.data.expandedDay > 1) {
        // 向右滑动，显示前一天
        this.navigatePrevDay();
      } else if (diff < 0 && this.data.expandedDay < 7) {
        // 向左滑动，显示后一天
        this.navigateNextDay();
      }
    }
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
    const { checkinRecords } = this.data;
    let count = 0;
    
    Object.values(checkinRecords).forEach(taskRecords => {
      if (taskRecords && taskRecords.length) {
        taskRecords.forEach(record => {
          if (record.method === mediaType) {
            count++;
          }
        });
      }
    });
    
    return count;
  },
  
  // 获取任务的打卡记录
  getTaskCheckinRecords(day, taskTitle) {
    const { checkinRecords } = this.data;
    const taskKey = `day${day}_${taskTitle}`;
    
    return checkinRecords[taskKey] || [];
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

  // 判断天数是否已解锁（当前天数可以查看未来两天，但状态为灰色）
  isDayUnlocked(day) {
    // 确保第1天始终解锁
    if (day === 1) return true;
    const { currentDay } = this.data;
    return day <= currentDay;
  },
  
  // 获取天数状态文本
  getDayStatusText(day) {
    // 确保第1天显示为"已解锁"
    if (day === 1) return "今日任务";
    const { currentDay } = this.data;
    if (day <= currentDay) {
      return "今日任务";
    } else {
      return "未解锁";
    }
  },

  // 获取指定日期的数据
  getDayData(day) {
    if (day < 1 || day > 7) return null;
    return this.data.allDayTasks[day - 1] || [];
  },
  
  // 查看前一天
  navigatePrevDay() {
    if (this.data.expandedDay > 1) {
      const expandedDay = this.data.expandedDay - 1;
      
      this.setData({
        expandedDay,
        dayTasks: this.data.allDayTasks[expandedDay - 1]
      });
    }
  },
  
  // 查看后一天
  navigateNextDay() {
    const { expandedDay } = this.data;
    if (expandedDay < 7) {
      const newDay = expandedDay + 1;
      
      this.setData({
        expandedDay: newDay,
        dayTasks: this.data.allDayTasks[newDay - 1]
      });
    }
  },
  
  // 展开某一天的任务
  expandDay(e) {
    const { day } = e.currentTarget.dataset;
    const expandedDay = parseInt(day);
    
    this.setData({
      expandedDay,
      dayTasks: this.data.allDayTasks[expandedDay - 1]
    });
  },
  
  // 处理点击天数
  handleDayTap(e) {
    const { day } = e.currentTarget.dataset;
    const dayNumber = parseInt(day);
    
    this.expandDay(e);
    
    if (!this.isDayUnlocked(dayNumber)) {
      // 显示未解锁提示
      wx.showToast({
        title: '该天尚未解锁',
        icon: 'none'
      });
    }
  },
  
  // 添加打卡记录
  addCheckinRecord(task, method) {
    const { expandedDay } = this.data;
    if (!this.isDayUnlocked(expandedDay) && expandedDay !== 1) {
      wx.showToast({
        title: '当前日期未解锁，无法打卡',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      isCheckinModalVisible: true,
      activeTask: task,
      activeCheckinMethod: method,
      checkinContent: ""
    });
  },
  
  // 打开文字打卡
  openTextCheckin(e) {
    const { task } = e.currentTarget.dataset;
    this.addCheckinRecord(task, 'text');
  },
  
  // 打开图片打卡
  openImageCheckin(e) {
    const { task } = e.currentTarget.dataset;
    this.addCheckinRecord(task, 'image');
  },
  
  // 打开语音打卡
  openAudioCheckin(e) {
    const { task } = e.currentTarget.dataset;
    this.addCheckinRecord(task, 'audio');
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
      
      this.setData({
        isRecording: true
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
          checkinContent: res.tempFilePath,
          isRecording: false
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
    const { expandedDay, activeTask, activeCheckinMethod, checkinContent, checkinRecords, daysCompleted } = this.data;
    
    if (!checkinContent) {
      wx.showToast({
        title: '请完成打卡内容',
        icon: 'none'
      });
      return;
    }
    
    // 创建记录
    const timestamp = new Date().getTime();
    const newRecord = {
      taskTitle: activeTask.title,
      method: activeCheckinMethod,
      content: checkinContent,
      timestamp: timestamp,
      timeFormatted: this.formatTime(new Date(timestamp))
    };
    
    // 更新记录列表
    const taskKey = `day${expandedDay}_${activeTask.title}`;
    if (!checkinRecords[taskKey]) {
      checkinRecords[taskKey] = [];
    }
    
    // 添加新记录到记录列表
    checkinRecords[taskKey].push(newRecord);
    
    // 更新完成状态
    const newDaysCompleted = { ...daysCompleted };
    if (!newDaysCompleted[expandedDay]) {
      newDaysCompleted[expandedDay] = [];
    }
    
    if (newDaysCompleted[expandedDay].findIndex(t => t.taskTitle === activeTask.title) === -1) {
      newDaysCompleted[expandedDay].push({
        taskTitle: activeTask.title,
        method: activeCheckinMethod,
        content: checkinContent,
        timestamp: timestamp
      });
    }
    
    // 保存到本地存储
    wx.setStorage({
      key: 'checkinRecords',
      data: JSON.stringify(checkinRecords)
    });
    
    wx.setStorage({
      key: 'daysCompleted',
      data: JSON.stringify(newDaysCompleted)
    });
    
    this.setData({
      checkinRecords,
      daysCompleted: newDaysCompleted,
      isCheckinModalVisible: false
    });
    
    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    });
  },
  
  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    // 返回格式: MM-DD HH:MM
    return `${this.formatNumber(month)}-${this.formatNumber(day)} ${this.formatNumber(hour)}:${this.formatNumber(minute)}`;
  },
  
  // 格式化数字
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : `0${n}`;
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