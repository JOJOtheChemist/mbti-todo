Component({
  properties: {
    // 是否已解锁
    isUnlocked: {
      type: Boolean,
      value: true
    },
    // 是否正在录音
    isRecording: {
      type: Boolean,
      value: false
    },
    // 当前任务
    task: {
      type: Object,
      value: {}
    }
  },
  
  methods: {
    // 打开文字打卡
    onTextCheckin() {
      this.triggerEvent('checkin', {
        task: this.data.task,
        method: 'text'
      });
    },
    
    // 打开图片打卡
    onImageCheckin() {
      this.triggerEvent('checkin', {
        task: this.data.task,
        method: 'image'
      });
    },
    
    // 打开语音打卡
    onAudioCheckin() {
      this.triggerEvent('checkin', {
        task: this.data.task,
        method: 'audio'
      });
    }
  }
}) 