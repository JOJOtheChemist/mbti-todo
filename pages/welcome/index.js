Page({
  data: {
    currentStep: 0,
    steps: [
      { title: "测试MBTI", desc: "了解你的性格类型" },
      { title: "生成定制任务", desc: "根据你的MBTI类型提供个性化任务" },
      { title: "任务打卡", desc: "完成任务并记录进度" },
      { title: "七天训练结束", desc: "自身提升和成长" }
    ]
  },
  
  nextStep() {
    const { currentStep, steps } = this.data;
    if (currentStep < steps.length - 1) {
      this.setData({
        currentStep: currentStep + 1
      });
    } else {
      wx.navigateTo({
        url: '/pages/test/index'
      });
    }
  },
  
  startTest() {
    wx.navigateTo({
      url: '/pages/test/index'
    });
  }
}) 