Component({
  properties: {
    // 任务数据
    task: {
      type: Object,
      value: {}
    },
    // 是否已完成
    isCompleted: {
      type: Boolean,
      value: false
    },
    // 是否被锁定
    isLocked: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        console.log(`isLocked changed from ${oldVal} to ${newVal}`);
      }
    },
    history: Array,
    isUnlocked: Boolean,
    isRecording: Boolean,
    currentPlayingAudio: String
  },

  data: {
    // 组件内部数据
  },

  lifetimes: {
    attached: function() {
      console.log('Task card attached, isLocked:', this.properties.isLocked);
    },
    
    ready: function() {
      console.log('Task card ready, isLocked:', this.properties.isLocked);
    }
  },

  methods: {
    // 处理文字打卡
    onTextCheckin() {
      if (this.properties.isLocked) return;
      this.triggerEvent('checkin', {
        task: this.properties.task,
        method: 'text'
      });
    },
    
    // 处理图片打卡
    onImageCheckin() {
      if (this.properties.isLocked) return;
      this.triggerEvent('checkin', {
        task: this.properties.task,
        method: 'image'
      });
    },
    
    // 处理语音打卡
    onAudioCheckin() {
      if (this.properties.isLocked) return;
      this.triggerEvent('checkin', {
        task: this.properties.task,
        method: 'audio'
      });
    },
    // 图片预览
    onImagePreview(e) {
      this.triggerEvent('imagePreview', e.detail);
    },
    // 音频播放
    onAudioPlay(e) {
      this.triggerEvent('audioPlay', e.detail);
    }
  }
}) 