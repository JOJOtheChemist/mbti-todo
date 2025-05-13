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
    textInputHistory: [], // 存储所有文字打卡历史
    imageInputHistory: [], // 存储所有图片打卡历史
    audioInputHistory: [], // 存储所有语音打卡历史
    combinedHistory: [], // 新增：存储混合排序的所有类型打卡历史
    // 添加任务2的历史记录数组
    task2History: [],
    // 添加任务3的历史记录数组
    task3History: [],
    currentPlayingAudio: '', // 当前正在播放的语音
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
    checkinRecords: {},  // 存储各任务的打卡记录，按时间顺序保存
    // 修改解锁模式状态为对象，存储每个天数的解锁状态
    unlockModeStates: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false
    },
    showTomatoTimer: false,
    isTomatoRunning: false,
    tomatoTimeLeft: 5,
    tomatoTimer: null,
    isTomatoStarted: false, // 新增：是否已经开始计时
    isRecordsExpanded: false,
    expandedRecords: {}, // 存储每个任务的展开状态
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
        
        // 读取文字输入历史
        let textInputHistory = [];
        try {
          const textHistoryData = wx.getStorageSync('textInputHistory');
          if (textHistoryData) {
            textInputHistory = JSON.parse(textHistoryData);
          }
        } catch (e) {
          console.error('读取文字历史记录失败', e);
        }
        
        // 读取图片输入历史
        let imageInputHistory = [];
        try {
          const imageHistoryData = wx.getStorageSync('imageInputHistory');
          if (imageHistoryData) {
            imageInputHistory = JSON.parse(imageHistoryData);
          }
        } catch (e) {
          console.error('读取图片历史记录失败', e);
        }
        
        // 读取语音输入历史
        let audioInputHistory = [];
        try {
          const audioHistoryData = wx.getStorageSync('audioInputHistory');
          if (audioHistoryData) {
            audioInputHistory = JSON.parse(audioHistoryData);
          }
        } catch (e) {
          console.error('读取语音历史记录失败', e);
        }
        
        // 读取任务2历史记录
        let task2History = [];
        try {
          const task2HistoryData = wx.getStorageSync('task2History');
          if (task2HistoryData) {
            task2History = JSON.parse(task2HistoryData);
          }
        } catch (e) {
          console.error('读取任务2历史记录失败', e);
        }
        
        // 读取任务3历史记录
        let task3History = [];
        try {
          const task3HistoryData = wx.getStorageSync('task3History');
          if (task3HistoryData) {
            task3History = JSON.parse(task3HistoryData);
          }
        } catch (e) {
          console.error('读取任务3历史记录失败', e);
        }
        
        // 合并所有历史记录并按时间排序
        const combinedHistory = this.getCombinedHistory(textInputHistory, imageInputHistory, audioInputHistory);
        
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
          checkinRecords,
          textInputHistory,
          imageInputHistory,
          audioInputHistory,
          task2History,
          task3History,
          combinedHistory,
          'unlockModeStates.1': true, // 确保第一天始终解锁
          expandedRecords: {} // 初始化展开状态
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
          allDayTasks: this.data.presetTasks,
          combinedHistory: [], // 初始化空的合并历史
          task2History: [], // 初始化任务2历史
          task3History: [], // 初始化任务3历史
          'unlockModeStates.1': true, // 确保第一天始终解锁
          expandedRecords: {} // 初始化展开状态
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
  
  // 新增：获取指定任务的混合排序历史记录
  getTaskMixedHistory(day, taskTitle) {
    // 获取任务的打卡记录
    const taskRecords = this.getTaskCheckinRecords(day, taskTitle);
    
    if (!taskRecords || taskRecords.length === 0) {
      return [];
    }
    
    // 给每个记录添加索引和类型信息
    const processedRecords = taskRecords.map((record, index) => {
      // 创建索引从1开始，按照记录类型分组计数
      // 计算同类型记录的数量
      const sameTypeRecords = taskRecords.filter(r => r.method === record.method);
      const typeIndex = sameTypeRecords.findIndex(r => r.timestamp === record.timestamp) + 1;
      
      // 返回处理后的记录
      return {
        ...record,
        type: record.method,  // 确保每条记录有type字段
        index: typeIndex,     // 同类型记录的索引
        // 根据记录类型区分content字段
        displayContent: record.content
      };
    });
    
    // 按时间戳降序排序（最新的在前面）
    return processedRecords.sort((a, b) => b.timestamp - a.timestamp);
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
    
    const { currentDay, unlockModeStates, checkinRecords } = this.data;
    
    // 如果当前天数在解锁模式下，返回true
    if (unlockModeStates[day]) return true;
    
    // 如果天数超过当前天数，返回false
    if (day > currentDay) return false;
    
    // 获取前一天的任务
    const prevDayTasks = this.data.allDayTasks[day - 2]; // 前一天的任务
    if (!prevDayTasks) return false;
    
    // 检查前一天的所有任务是否都有打卡记录
    const allTasksCompleted = prevDayTasks.every(task => {
      const taskKey = `day${day - 1}_${task.title}`;
      const records = checkinRecords[taskKey] || [];
      return records.length > 0; // 只要有一条记录就算完成
    });
    
    return allTasksCompleted;
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
    const { audioSrc } = e.currentTarget.dataset;
    // 如果是从组件传递过来的事件
    if (e.detail && e.detail.src) {
      this._playAudio(e.detail.src);
      return;
    }
    
    // 如果没有音频源，直接返回
    if (!audioSrc) {
      console.error('缺少音频源');
      return;
    }
    
    this._playAudio(audioSrc);
  },
  
  // 内部处理播放音频的方法
  _playAudio(audioSrc) {
    // 如果有正在播放的语音，先停止它
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
    }
    
    // 同一段语音，点击暂停
    if (this.data.currentPlayingAudio === audioSrc) {
      this.setData({
        currentPlayingAudio: ''
      });
      return;
    }
    
    // 创建新的音频上下文
    const innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext = innerAudioContext;
    
    innerAudioContext.src = audioSrc;
    
    // 监听播放开始
    innerAudioContext.onPlay(() => {
      this.setData({
        currentPlayingAudio: audioSrc
      });
    });
    
    // 监听播放结束
    innerAudioContext.onEnded(() => {
      this.setData({
        currentPlayingAudio: ''
      });
    });
    
    // 监听播放错误
    innerAudioContext.onError((res) => {
      console.error('播放错误', res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none'
      });
      this.setData({
        currentPlayingAudio: ''
      });
    });
    
    // 开始播放
    innerAudioContext.play();
  },
  
  // 估算语音时长（简化版，实际项目中可能需要更准确的方法）
  estimateAudioDuration(audioSrc) {
    // 这里简单返回一个固定值，实际中可能需要从录音结果中获取实际时长
    return '00:15'; // 假设15秒
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
    
    const now = new Date();
    const timestamp = now.getTime();
    const formattedTime = this.formatTime(now);
    
    // 创建记录
    const newRecord = {
      taskTitle: activeTask.title,
      method: activeCheckinMethod,
      content: checkinContent,
      timestamp: timestamp,
      timeFormatted: formattedTime
    };
    
    // 更新记录列表
    const taskKey = `day${expandedDay}_${activeTask.title}`;
    if (!checkinRecords[taskKey]) {
      checkinRecords[taskKey] = [];
    }
    
    // 添加新记录到记录列表 - 始终放在数组最前面
    checkinRecords[taskKey].unshift(newRecord);
    
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

    // 更新当前任务列表中的记录
    const updatedDayTasks = this.data.dayTasks.map(task => {
      if (task.title === activeTask.title) {
        return {
          ...task,
          records: checkinRecords[taskKey] || []
        };
      }
      return task;
    });
    
    // 更新数据
    this.setData({
      checkinRecords: checkinRecords,
      daysCompleted: newDaysCompleted,
      dayTasks: updatedDayTasks,
      isCheckinModalVisible: false, // 关闭模态框
      checkinContent: "" // 清空内容
    });
    
    // 保存到本地存储
    wx.setStorage({
      key: 'checkinRecords',
      data: JSON.stringify(checkinRecords)
    });
    
    wx.setStorage({
      key: 'daysCompleted',
      data: JSON.stringify(newDaysCompleted)
    });
    
    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    });
  },
  
  // 新增：合并并排序所有类型的历史记录
  getCombinedHistory(textHistory, imageHistory, audioHistory) {
    // 处理文字历史
    const textRecords = textHistory.map(item => ({
      ...item,
      type: 'text',
      content: item.content
    }));
    
    // 处理图片历史
    const imageRecords = imageHistory.map(item => ({
      ...item,
      type: 'image',
      content: item.imgSrc
    }));
    
    // 处理音频历史
    const audioRecords = audioHistory.map(item => ({
      ...item,
      type: 'audio',
      content: item.audioSrc
    }));
    
    // 合并所有记录
    const allRecords = [...textRecords, ...imageRecords, ...audioRecords];
    
    // 按时间戳降序排序（最新的在前面）
    return allRecords.sort((a, b) => b.timestamp - a.timestamp);
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
  },
  
  // 预览图片
  previewImage(e) {
    const { imgSrc } = e.currentTarget.dataset;
    // 如果是从组件传递过来的事件
    if (e.detail && e.detail.src) {
      this._previewImage(e.detail.src);
      return;
    }
    
    if (!imgSrc) {
      return;
    }
    
    this._previewImage(imgSrc);
  },
  
  // 内部处理图片预览的方法
  _previewImage(imgSrc) {
    // 获取当前任务的所有图片记录和历史图片记录
    const { expandedDay, dayTasks, imageInputHistory } = this.data;
    const currentTask = dayTasks[0]; // 第一个任务
    
    if (currentTask) {
      // 获取当前任务记录中的图片
      const taskKey = `day${expandedDay}_${currentTask.title}`;
      const records = this.data.checkinRecords[taskKey] || [];
      const recordImageUrls = records
        .filter(record => record.method === 'image')
        .map(record => record.content);
      
      // 获取历史图片记录中的图片
      const historyImageUrls = imageInputHistory.map(item => item.imgSrc);
      
      // 合并所有图片URL（去重）
      const allImageUrls = [...new Set([...recordImageUrls, ...historyImageUrls])];
      
      // 如果有图片，预览所有图片
      if (allImageUrls.length > 0) {
        wx.previewImage({
          current: imgSrc, // 当前显示图片的链接
          urls: allImageUrls // 需要预览的图片链接列表
        });
      } else {
        // 如果没有找到图片记录，只预览当前图片
        wx.previewImage({
          current: imgSrc,
          urls: [imgSrc]
        });
      }
    } else {
      // 如果找不到当前任务，只预览当前图片
      wx.previewImage({
        current: imgSrc,
        urls: [imgSrc]
      });
    }
  },
  
  // 新增：获取所有混合排序的历史记录用于组件展示
  getAllHistoryRecords(textHistory, imageHistory, audioHistory) {
    // 处理文字历史
    const textRecords = textHistory.map(item => ({
      ...item,
      type: 'text',
      content: item.content || item.displayContent,
      timeFormatted: item.timeFormatted || item.time
    }));
    
    // 处理图片历史
    const imageRecords = imageHistory.map(item => ({
      ...item,
      type: 'image',
      content: item.imgSrc || item.content,
      timeFormatted: item.timeFormatted || item.time
    }));
    
    // 处理音频历史
    const audioRecords = audioHistory.map(item => ({
      ...item,
      type: 'audio',
      content: item.audioSrc || item.content,
      timeFormatted: item.timeFormatted || item.time
    }));
    
    // 合并所有记录
    const allRecords = [...textRecords, ...imageRecords, ...audioRecords];
    
    // 按时间戳降序排序（最新的在前面）
    return allRecords.sort((a, b) => b.timestamp - a.timestamp);
  },

  // 切换解锁模式
  toggleUnlockMode() {
    const { expandedDay, unlockModeStates } = this.data;
    const newUnlockModeStates = { ...unlockModeStates };
    newUnlockModeStates[expandedDay] = !unlockModeStates[expandedDay];
    
    this.setData({
      unlockModeStates: newUnlockModeStates
    });
    
    // 如果进入解锁模式，更新当前天的任务显示
    if (newUnlockModeStates[expandedDay]) {
      this.setData({
        dayTasks: this.data.allDayTasks[expandedDay - 1]
      });
    }
  },

  // 获取第2天的任务文字
  getDay2TaskText(taskIndex) {
    const day2Tasks = this.data.presetTasks[1]; // 获取第2天的任务
    if (day2Tasks && day2Tasks[taskIndex]) {
      return day2Tasks[taskIndex].title;
    }
    return '';
  },

  // 获取第2天的任务原因
  getDay2TaskReason(taskIndex) {
    const day2Tasks = this.data.presetTasks[1]; // 获取第2天的任务
    if (day2Tasks && day2Tasks[taskIndex]) {
      return day2Tasks[taskIndex].reason;
    }
    return '';
  },

  startTomatoTimer(e) {
    const task = e.currentTarget.dataset.task;
    this.setData({
      showTomatoTimer: true,
      isTomatoRunning: false,
      isTomatoStarted: false,
      tomatoTimeLeft: 5,
      activeTask: task // 保存当前任务信息
    });
  },

  startCountdown() {
    // 清除可能存在的旧定时器
    if (this.data.tomatoTimer) {
      clearInterval(this.data.tomatoTimer);
    }

    // 创建新的定时器
    const timer = setInterval(() => {
      if (this.data.tomatoTimeLeft > 0) {
        this.setData({
          tomatoTimeLeft: this.data.tomatoTimeLeft - 1
        });
      } else {
        // 倒计时结束
        clearInterval(timer);
        this.setData({
          isTomatoRunning: false,
          isTomatoStarted: true,
          tomatoTimeLeft: 5,
          showTomatoTimer: true
        });
      }
    }, 1000);

    this.setData({
      tomatoTimer: timer
    });
  },

  toggleTomatoTimer() {
    if (!this.data.isTomatoStarted) {
      // 如果还没开始，则开始计时
      this.setData({
        isTomatoRunning: true,
        isTomatoStarted: true
      });
      this.startCountdown();
    } else if (this.data.isTomatoRunning) {
      // 如果正在运行，则暂停计时
      clearInterval(this.data.tomatoTimer);
      this.setData({
        isTomatoRunning: false,
        tomatoTimer: null
      });
    } else if (this.data.tomatoTimeLeft < 5) {
      // 如果已经暂停，则继续计时
      this.setData({
        isTomatoRunning: true
      });
      this.startCountdown();
    } else {
      // 如果计时结束，则关闭遮罩层并记录番茄打卡
      const now = new Date();
      const timestamp = now.getTime();
      const formattedTime = this.formatTime(now);
      
      // 创建番茄打卡记录
      const newRecord = {
        taskTitle: this.data.activeTask.title,
        method: 'tomato',
        content: '番茄打卡完成',
        timestamp: timestamp,
        timeFormatted: formattedTime
      };
      
      // 更新记录列表
      const taskKey = `day${this.data.expandedDay}_${this.data.activeTask.title}`;
      const checkinRecords = { ...this.data.checkinRecords };
      if (!checkinRecords[taskKey]) {
        checkinRecords[taskKey] = [];
      }
      
      // 添加新记录到记录列表 - 始终放在数组最前面
      checkinRecords[taskKey].unshift(newRecord);
      
      // 更新完成状态
      const newDaysCompleted = { ...this.data.daysCompleted };
      if (!newDaysCompleted[this.data.expandedDay]) {
        newDaysCompleted[this.data.expandedDay] = [];
      }
      
      if (newDaysCompleted[this.data.expandedDay].findIndex(t => t.taskTitle === this.data.activeTask.title) === -1) {
        newDaysCompleted[this.data.expandedDay].push({
          taskTitle: this.data.activeTask.title,
          method: 'tomato',
          content: '番茄打卡完成',
          timestamp: timestamp
        });
      }

      // 更新当前任务列表中的记录
      const updatedDayTasks = this.data.dayTasks.map(task => {
        if (task.title === this.data.activeTask.title) {
          return {
            ...task,
            records: checkinRecords[taskKey] || []
          };
        }
        return task;
      });
      
      // 更新数据
      this.setData({
        showTomatoTimer: false,
        tomatoTimeLeft: 5,
        isTomatoStarted: false,
        isTomatoRunning: false,
        checkinRecords: checkinRecords,
        daysCompleted: newDaysCompleted,
        dayTasks: updatedDayTasks
      });
      
      // 保存到本地存储
      wx.setStorage({
        key: 'checkinRecords',
        data: JSON.stringify(checkinRecords)
      });
      
      wx.setStorage({
        key: 'daysCompleted',
        data: JSON.stringify(newDaysCompleted)
      });
      
      wx.showToast({
        title: '番茄打卡完成！',
        icon: 'success'
      });
    }
  },

  toggleRecords(e) {
    const { day, taskTitle } = e.currentTarget.dataset;
    const key = `day${day}_${taskTitle}`;
    const expandedRecords = { ...this.data.expandedRecords };
    expandedRecords[key] = !expandedRecords[key];
    
    this.setData({
      expandedRecords
    });
  },
}) 