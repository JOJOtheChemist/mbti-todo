Page({
  data: {
    currentQuestion: 0,
    progress: 0,
    questions: [
      {
        question: "你更喜欢在哪种环境中工作？",
        options: [
          { text: "安静的独立空间", value: "I" },
          { text: "充满活力的团队环境", value: "E" }
        ]
      },
      {
        question: "当面对新信息时，你更注重：",
        options: [
          { text: "具体的事实和细节", value: "S" },
          { text: "整体概念和可能性", value: "N" }
        ]
      },
      {
        question: "做决定时，你更倾向于：",
        options: [
          { text: "基于逻辑和客观分析", value: "T" },
          { text: "考虑人的感受和价值观", value: "F" }
        ]
      },
      {
        question: "你更喜欢的生活方式是：",
        options: [
          { text: "有计划和结构的", value: "J" },
          { text: "灵活和适应性强的", value: "P" }
        ]
      },
      {
        question: "在压力下，你通常会：",
        options: [
          { text: "需要独处来恢复能量", value: "I" },
          { text: "通过与他人交流获得能量", value: "E" }
        ]
      }
    ],
    answers: [],
    mbtiResult: ""
  },

  onLoad() {
    this.updateProgress();
  },

  selectOption(e) {
    const { value } = e.currentTarget.dataset;
    const { currentQuestion, questions, answers } = this.data;
    
    // 保存当前答案
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    
    this.setData({ answers: newAnswers });
    
    // 如果不是最后一题，前进到下一题
    if (currentQuestion < questions.length - 1) {
      this.setData({
        currentQuestion: currentQuestion + 1
      }, () => {
        this.updateProgress();
      });
    } else {
      // 计算MBTI结果
      this.calculateResult();
    }
  },
  
  previousQuestion() {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1
      }, () => {
        this.updateProgress();
      });
    }
  },
  
  updateProgress() {
    const progress = (this.data.currentQuestion / this.data.questions.length) * 100;
    this.setData({ progress });
  },
  
  calculateResult() {
    const { answers } = this.data;
    
    // 计数各维度选项
    let countE = 0, countI = 0;
    let countS = 0, countN = 0;
    let countT = 0, countF = 0;
    let countJ = 0, countP = 0;
    
    answers.forEach(answer => {
      switch(answer) {
        case 'E': countE++; break;
        case 'I': countI++; break;
        case 'S': countS++; break;
        case 'N': countN++; break;
        case 'T': countT++; break;
        case 'F': countF++; break;
        case 'J': countJ++; break;
        case 'P': countP++; break;
      }
    });
    
    // 确定每个维度的结果
    const dimension1 = countE > countI ? 'E' : 'I';
    const dimension2 = countS > countN ? 'S' : 'N';
    const dimension3 = countT > countF ? 'T' : 'F';
    const dimension4 = countJ > countP ? 'J' : 'P';
    
    const mbtiResult = dimension1 + dimension2 + dimension3 + dimension4;
    
    // 保存结果并跳转到结果页面
    this.setData({ mbtiResult }, () => {
      wx.navigateTo({
        url: `/pages/report/index?result=${mbtiResult}`
      });
    });
  }
}) 