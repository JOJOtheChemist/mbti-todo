Component({
  properties: {
    task: Object,
    history: Array,
    isUnlocked: Boolean,
    isCompleted: Boolean,
    isRecording: Boolean,
    currentPlayingAudio: String
  },
  methods: {
    // 触发打卡事件
    onCheckin(e) {
      this.triggerEvent('checkin', e.detail);
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