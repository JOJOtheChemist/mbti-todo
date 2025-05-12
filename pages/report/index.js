Page({
  data: {
    mbtiResult: "",
    mbtiDescription: "",
    mbtiTasks: []
  },

  onLoad(options) {
    const { result } = options;
    
    // 设置MBTI结果
    this.setData({ mbtiResult: result });
    
    // 获取MBTI描述和推荐任务
    this.getMbtiInfo(result);
  },
  
  getMbtiInfo(mbtiType) {
    // 这里可以根据MBTI类型给出个性化描述和任务推荐
    const mbtiInfo = {
      "INTJ": {
        description: "战略家：独立思考，善于规划，追求知识和能力提升",
        tasks: [
          { title: "深度阅读一本专业书籍", reason: "提升专业知识深度" },
          { title: "制定一个长期目标的执行计划", reason: "发挥您的战略规划能力" },
          { title: "尝试一种新的思维方法解决问题", reason: "拓展思维边界" }
        ]
      },
      "INTP": {
        description: "思想家：理论型，喜欢分析问题，追求逻辑和理解",
        tasks: [
          { title: "研究一个感兴趣的理论或概念", reason: "满足您的求知欲" },
          { title: "解决一个复杂的逻辑问题", reason: "锻炼分析能力" },
          { title: "尝试用新方法优化日常流程", reason: "发挥创新思维" }
        ]
      },
      "ENTJ": {
        description: "指挥官：果断自信，擅长领导，追求效率和成就",
        tasks: [
          { title: "带领小组完成一个项目", reason: "发挥领导才能" },
          { title: "优化工作流程提高效率", reason: "满足您对高效的追求" },
          { title: "制定并实施一个挑战性目标", reason: "激发您的成就动机" }
        ]
      },
      // 可以继续添加其他MBTI类型
      "ENTP": {
        description: "辩论家：创新思维，善于辩论，喜欢新挑战",
        tasks: [
          { title: "尝试一种新的创意活动", reason: "激发您的创新思维" },
          { title: "参与一次辩论或头脑风暴", reason: "发挥您的辩论才能" },
          { title: "探索一个从未接触过的领域", reason: "满足好奇心和新鲜感" }
        ]
      },
      "INFJ": {
        description: "提倡者：有洞察力，充满理想，追求意义和价值",
        tasks: [
          { title: "参与一次有意义的志愿活动", reason: "实现您的价值追求" },
          { title: "写下您对未来的愿景和计划", reason: "明确理想蓝图" },
          { title: "与朋友进行一次深度交流", reason: "建立有意义的联系" }
        ]
      }
    };
    
    // 如果没有对应类型的信息，提供默认描述
    if (!mbtiInfo[mbtiType]) {
      this.setData({
        mbtiDescription: "您的性格类型具有独特的特质和优势。",
        mbtiTasks: [
          { title: "制定一个个人成长计划", reason: "提升自我认知" },
          { title: "尝试一次新的挑战", reason: "拓展能力边界" },
          { title: "反思并记录一天的感受", reason: "增强情绪认知" }
        ]
      });
    } else {
      this.setData({
        mbtiDescription: mbtiInfo[mbtiType].description,
        mbtiTasks: mbtiInfo[mbtiType].tasks
      });
    }
  },
  
  startTraining() {
    // 将MBTI结果和推荐任务保存到本地存储
    const { mbtiResult, mbtiTasks } = this.data;
    
    wx.setStorage({
      key: 'mbtiData',
      data: {
        mbtiType: mbtiResult,
        tasks: mbtiTasks,
        startDate: new Date().getTime()
      },
      success: () => {
        // 跳转到todo页面
        wx.navigateTo({
          url: '/pages/todo/index'
        });
      }
    });
  },
  
  retakeTest() {
    wx.navigateTo({
      url: '/pages/test/index'
    });
  }
}) 