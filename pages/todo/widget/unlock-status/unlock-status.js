Component({
  properties: {
    currentDay: {
      type: Number,
      value: 1
    }
  },

  data: {
    // 可以添加需要的数据
  },

  methods: {
    unlockNextDay() {
      const nextDay = this.properties.currentDay + 1;
      this.triggerEvent('unlock', { day: nextDay });
    }
  }
}) 