Component({
  properties: {
    // 标题文本
    title: {
      type: String,
      value: '打卡历史记录'
    },
    // 文字记录列表
    textRecords: {
      type: Array,
      value: []
    },
    // 图片记录列表
    imageRecords: {
      type: Array,
      value: []
    },
    // 语音记录列表
    audioRecords: {
      type: Array,
      value: []
    },
    // 混合记录列表（按时间排序）
    mixedRecords: {
      type: Array,
      value: []
    },
    // 无记录时的提示文本
    emptyText: {
      type: String,
      value: '暂无打卡记录'
    },
    // 当前播放的音频路径
    currentPlayingAudio: {
      type: String,
      value: ''
    }
  },
  
  data: {
    // 本地数据
    sortedRecords: [], // 所有记录按时间排序
    hasRecords: false
  },
  
  observers: {
    'textRecords, imageRecords, audioRecords, mixedRecords': function(textRecords, imageRecords, audioRecords, mixedRecords) {
      // 判断是否有历史记录
      const hasRecords = (
        (textRecords && textRecords.length > 0) || 
        (imageRecords && imageRecords.length > 0) || 
        (audioRecords && audioRecords.length > 0) || 
        (mixedRecords && mixedRecords.length > 0)
      );
      
      // 合并并排序所有记录
      let sortedRecords = [];
      
      // 如果mixedRecords有值，优先使用它
      if (mixedRecords && mixedRecords.length > 0) {
        sortedRecords = [...mixedRecords];
      } else {
        // 否则，手动合并三种记录
        // 处理文字记录
        const textItems = (textRecords || []).map(item => ({
          ...item,
          type: 'text',
          // 确保有统一的字段名
          content: item.content,
          timeFormatted: item.timeFormatted || item.time
        }));
        
        // 处理图片记录
        const imageItems = (imageRecords || []).map(item => ({
          ...item,
          type: 'image',
          // 确保有统一的字段名
          content: item.imgSrc || item.content,
          timeFormatted: item.timeFormatted || item.time
        }));
        
        // 处理音频记录
        const audioItems = (audioRecords || []).map(item => ({
          ...item,
          type: 'audio',
          // 确保有统一的字段名
          content: item.audioSrc || item.content,
          timeFormatted: item.timeFormatted || item.time
        }));
        
        // 合并所有记录
        sortedRecords = [...textItems, ...imageItems, ...audioItems];
      }
      
      // 按时间戳降序排序（最新的在前面）
      sortedRecords.sort((a, b) => {
        // 获取时间戳
        const timestampA = a.timestamp || 0;
        const timestampB = b.timestamp || 0;
        return timestampB - timestampA;
      });
      
      // 更新组件数据
      this.setData({ 
        hasRecords,
        sortedRecords
      });
    }
  },
  
  methods: {
    // 图片点击处理
    onImageTap(e) {
      const src = e.currentTarget.dataset.src;
      if (!src) return;
      
      // 触发图片预览事件
      this.triggerEvent('imagePreview', { src });
      
      // 默认调用微信预览图片API
      wx.previewImage({
        current: src,
        urls: [src]
      });
    },
    
    // 音频点击处理
    onAudioTap(e) {
      const { src, duration } = e.currentTarget.dataset;
      if (!src) return;
      
      // 触发音频播放事件
      this.triggerEvent('audioPlay', { src, duration });
    }
  }
}) 