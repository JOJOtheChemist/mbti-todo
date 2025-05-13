Component({
  properties: {
    currentDay: {
      type: Number,
      value: 1
    },
    unlockedDays: {
      type: Array,
      value: [1]
    },
    completedDays: {
      type: Array,
      value: []
    }
  },

  methods: {
    // 天数点击事件
    handleDayTap(e) {
      const day = e.currentTarget.dataset.day;
      // 只有解锁的天数才能被选中
      if (this.isDayUnlocked(day)) {
        this.triggerEvent('dayChange', { day });
      }
    },

    // 上一天
    navigatePrevDay() {
      if (this.data.currentDay > 1) {
        this.triggerEvent('dayChange', { day: this.data.currentDay - 1 });
      }
    },

    // 下一天
    navigateNextDay() {
      if (this.data.currentDay < 7) {
        this.triggerEvent('dayChange', { day: this.data.currentDay + 1 });
      }
    },

    // 检查天数是否解锁
    isDayUnlocked(day) {
      return this.data.unlockedDays.includes(day);
    },

    // 检查天数是否完成
    isDayCompleted(day) {
      return this.data.completedDays.includes(day);
    }
  }
}) 