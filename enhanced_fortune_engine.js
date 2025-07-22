class EnhancedDeltaFortuneEngine {
  constructor() {
    this.elementCycle = ['木', '火', '土', '金', '水'];
    this.elementGeneration = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    this.elementDestruction = {
      '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };
    
    // 天干地支
    this.heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    this.earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 添加十二时辰定义
    this.timeSlots = [
      {name: '子时', range: '23:00-01:00', element: '水', meaning: '夜半，一阳生'},
      {name: '丑时', range: '01:00-03:00', element: '土', meaning: '鸡鸣，阴气渐消'},
      {name: '寅时', range: '03:00-05:00', element: '木', meaning: '平旦，阳气初升'},
      {name: '卯时', range: '05:00-07:00', element: '木', meaning: '日出，万物苏醒'},
      {name: '辰时', range: '07:00-09:00', element: '土', meaning: '食时，朝气蓬勃'},
      {name: '巳时', range: '09:00-11:00', element: '火', meaning: '隅中，阳气旺盛'},
      {name: '午时', range: '11:00-13:00', element: '火', meaning: '日中，阳气最盛'},
      {name: '未时', range: '13:00-15:00', element: '土', meaning: '日昳，阳气渐衰'},
      {name: '申时', range: '15:00-17:00', element: '金', meaning: '晡时，凉风习习'},
      {name: '酉时', range: '17:00-19:00', element: '金', meaning: '日入，万物归息'},
      {name: '戌时', range: '19:00-21:00', element: '土', meaning: '黄昏，阴气初生'},
      {name: '亥时', range: '21:00-23:00', element: '水', meaning: '人定，夜深人静'}
    ];
    
    // 奇门遁甲九宫
    this.qimenPalaces = {
      '乾宫': {position: 6, element: '金', meaning: '天门'},
      '坎宫': {position: 1, element: '水', meaning: '生门'},
      '艮宫': {position: 8, element: '土', meaning: '伤门'},
      '震宫': {position: 3, element: '木', meaning: '杜门'},
      '中宫': {position: 5, element: '土', meaning: '中央'},
      '巽宫': {position: 4, element: '木', meaning: '景门'},
      '离宫': {position: 9, element: '火', meaning: '死门'},
      '坤宫': {position: 2, element: '土', meaning: '惊门'},
      '兑宫': {position: 7, element: '金', meaning: '开门'}
    };
    
    // 三角洲皮肤抽奖数据结构
    this.skinDrawSystem = {
      // 人物红皮抽奖系统
      characterSkin: {
        name: '人物红皮',
        type: 'character',
        drawCosts: [1, 3, 5, 10, 15, 20, 25, 30], // 研究券消耗
        guaranteedDraw: 8, // 第8发保底
        baseRedProbability: 0.12, // 基础红皮概率
        element: '火', // 红皮对应火属性
        rewards: {
          red: { name: '红色皮肤', probability: 0.12, color: '#ff0000' },
          gold: { name: '金色奖励', probability: 0.88, color: '#ffd700' }
        }
      },
      // 枪皮抽奖系统
      weaponSkin: {
        name: '曼德尔砖枪皮',
        type: 'weapon',
        categories: {
          premium: { name: '极品', element: '金', baseRate: 0.15 },
          excellent: { name: '优品', element: '银', baseRate: 0.35 }
        },
        qualities: {
          S: { name: 'S级', probability: 0.05, color: '#ff6b35', element: '金' },
          A: { name: 'A级', probability: 0.15, color: '#9b59b6', element: '木' },
          B: { name: 'B级', probability: 0.30, color: '#3498db', element: '水' },
          C: { name: 'C级', probability: 0.50, color: '#95a5a6', element: '土' }
        }
      }
    };
    
    this.operators = null;
    this.maps = null;
    this.containers = null;
    this.dataLoaded = false;
    this.loadData();
  }
  
  async loadJSON(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('加载JSON文件失败:', error);
      return null;
    }
  }
  
  async loadData() {
    try {
      this.operators = await this.loadJSON('./operators_data.json');
      this.maps = await this.loadJSON('./enhanced_map_zones.json');
      this.containers = await this.loadJSON('./containers_data.json');
      this.dataLoaded = true;
      console.log('增强数据加载完成');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataLoaded'));
      }
    } catch (error) {
      console.error('数据加载失败:', error);
    }
  }
  
  isDataLoaded() {
    return this.dataLoaded && this.operators && this.maps && this.containers;
  }
  
  calculateGanZhi(date = new Date()) {
    const baseYear = 1984;
    const year = date.getFullYear();
    const yearOffset = year - baseYear;
    
    const ganIndex = yearOffset % 10;
    const zhiIndex = yearOffset % 12;
    
    const dayOffset = Math.floor((date - new Date(1984, 0, 1)) / (1000 * 60 * 60 * 24));
    const dayGanIndex = dayOffset % 10;
    const dayZhiIndex = dayOffset % 12;
    
    return {
      year: this.heavenlyStems[ganIndex] + this.earthlyBranches[zhiIndex],
      day: this.heavenlyStems[dayGanIndex] + this.earthlyBranches[dayZhiIndex],
      yearElement: this.getGanZhiElement(ganIndex, zhiIndex),
      dayElement: this.getGanZhiElement(dayGanIndex, dayZhiIndex)
    };
  }
  
  getGanZhiElement(ganIndex, zhiIndex) {
    const ganElements = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
    return ganElements[ganIndex];
  }
  
  calculateWealthPosition(operatorElement, date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const dayElement = ganZhi.dayElement;
    
    const wealthPositions = {
      '木': ['西南', '西北'],
      '火': ['西北', '西'],
      '土': ['北', '东北'],
      '金': ['东', '东南'],
      '水': ['南', '西南']
    };
    
    return {
      primary: wealthPositions[operatorElement][0],
      secondary: wealthPositions[operatorElement][1],
      element: this.elementDestruction[operatorElement]
    };
  }
  
  calculateJoyGodPosition(date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const dayGan = ganZhi.day[0];
    
    const joyPositions = {
      '甲': '艮', '乙': '乾', '丙': '坤', '丁': '兑',
      '戊': '坤', '己': '离', '庚': '艮', '辛': '乾',
      '壬': '离', '癸': '坎'
    };
    
    return joyPositions[dayGan] || '中宫';
  }
  
  calculateQimenAnalysis(date = new Date()) {
    const hour = date.getHours();
    const timeIndex = Math.floor(hour / 2);
    
    const analysis = {};
    for (const [palace, data] of Object.entries(this.qimenPalaces)) {
      const timeBonus = (timeIndex + data.position) % 9 === 0 ? 1.3 : 1.0;
      analysis[palace] = {
        ...data,
        timeBonus: timeBonus,
        recommendation: timeBonus > 1.2 ? '大吉' : timeBonus > 1.0 ? '吉' : '平'
      };
    }
    
    return analysis;
  }
  
  calculatePlumBlossomAnalysis(operatorCodename, date = new Date()) {
    const operator = this.operators?.operators.find(op => op.codename === operatorCodename);
    if (!operator) return null;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    
    const upperGua = (year + month + day) % 8;
    const lowerGua = (year + month + day + hour) % 8;
    const changeLine = (year + month + day + hour) % 6;
    
    const guaNames = ['坤', '震', '坎', '兑', '艮', '离', '巽', '乾'];
    const guaElements = ['土', '木', '水', '金', '土', '火', '木', '金'];
    
    return {
      upperGua: guaNames[upperGua],
      lowerGua: guaNames[lowerGua],
      upperElement: guaElements[upperGua],
      lowerElement: guaElements[lowerGua],
      changeLine: changeLine + 1,
      compatibility: this.calculateElementCompatibility(operator.element, guaElements[upperGua]),
      prediction: this.getPlumBlossomPrediction(guaElements[upperGua], guaElements[lowerGua])
    };
  }
  
  getPlumBlossomPrediction(upper, lower) {
    if (this.elementGeneration[lower] === upper) return '吉，下卦生上卦，事业有成';
    if (this.elementGeneration[upper] === lower) return '平，上卦生下卦，需要付出';
    if (this.elementDestruction[upper] === lower) return '凶，上克下，阻力重重';
    if (this.elementDestruction[lower] === upper) return '险，下克上，需防小人';
    return '平，五行平和，按部就班';
  }
  
  // 在 analyzeContainerFortune 方法中，修复第230行左右
  analyzeContainerFortune(operatorElement, date = new Date()) {
    const dayElement = this.getDayElement(date);
    const timeSlot = this.getCurrentTimeSlot(date);
    
    const containerAnalysis = {};
    
    // 修复：使用 Object.values() 来遍历容器对象
    for (const container of Object.values(this.containers.containers)) {
      const elementBonus = this.calculateElementCompatibility(operatorElement, container.element);
      const dayBonus = this.calculateElementCompatibility(dayElement, container.element);
      const timeBonus = this.calculateElementCompatibility(timeSlot.element, container.element);
      
      const totalBonus = (elementBonus + dayBonus + timeBonus) / 3;
      const finalDropRate = container.baseDropRate * totalBonus;
      
      containerAnalysis[container.name] = {
        ...container,
        elementBonus,
        dayBonus,
        timeBonus,
        totalBonus,
        finalDropRate,
        recommendation: this.getContainerRecommendation(totalBonus)
      };
    }
    
    return containerAnalysis;
  }
  
  // 在类的末尾添加缺失的方法
  getContainerRecommendation(totalBonus) {
    if (totalBonus >= 1.3) return { level: '极佳', color: '#ffd700', advice: '强烈推荐！' };
    if (totalBonus >= 1.2) return { level: '很好', color: '#00ff00', advice: '推荐使用！' };
    if (totalBonus >= 1.1) return { level: '不错', color: '#00cc00', advice: '可以尝试！' };
    if (totalBonus >= 0.9) return { level: '一般', color: '#808080', advice: '普通运势！' };
    return { level: '不佳', color: '#ff6464', advice: '不建议使用！' };
  }
  
  getRecommendedContainers(operatorElement, date = new Date()) {
    const analysis = this.analyzeContainerFortune(operatorElement, date);
    if (!analysis) return [];
    
    return Object.entries(analysis)
      .sort(([,a], [,b]) => b.finalDropRate - a.finalDropRate)
      .slice(0, 3)
      .map(([name, data]) => ({
        name,
        dropRate: data.finalDropRate,
        bonus: data.totalBonus,
        recommendation: data.recommendation
      }));
  }
  
  getContainerAdvice(operatorElement, date = new Date()) {
    const analysis = this.analyzeContainerFortune(operatorElement, date);
    if (!analysis) return ['容器数据加载中...'];
    
    const advice = [];
    const topContainer = Object.entries(analysis)
      .sort(([,a], [,b]) => b.finalDropRate - a.finalDropRate)[0];
    
    if (topContainer && topContainer[1].totalBonus > 1.2) {
      advice.push(`今日最佳容器：${topContainer[0]}，出货率提升${((topContainer[1].finalDropRate - 1) * 100).toFixed(1)}%。`);
    }
    
    return advice;
  }
  
  calculateElement(birthday) {
    const date = new Date(birthday);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const elementIndex = (year + month) % 5;
    return this.elementCycle[elementIndex];
  }
  
  getDayElement(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    return this.elementCycle[dayOfYear % 5];
  }
  
  calculateElementCompatibility(element1, element2) {
    if (this.elementGeneration[element1] === element2) {
      return 1.3;
    } else if (this.elementDestruction[element1] === element2) {
      return 0.7;
    } else if (element1 === element2) {
      return 1.1;
    } else {
      return 1.0;
    }
  }
  
  getCurrentTimeSlot(date = new Date()) {
    const hour = date.getHours();
    let timeIndex;
    
    if (hour >= 23 || hour < 1) timeIndex = 0;
    else timeIndex = Math.floor((hour + 1) / 2);
    
    return this.timeSlots[timeIndex];
  }
  
  getLunarDate(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const lunarOffset = Math.floor((year - 1900) * 12.368) + month - 1;
    const lunarMonth = (lunarOffset % 12) + 1;
    const lunarDay = ((day + lunarOffset) % 30) + 1;
    
    const lunarMonths = [
      '正月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '冬月', '腊月'
    ];
    
    return {
      year: year,
      month: lunarMonths[lunarMonth - 1],
      day: this.numberToChinese(lunarDay)
    };
  }
  
  numberToChinese(num) {
    const units = ['', '十', '二十', '三十'];
    const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    
    if (num <= 10) return digits[num] || '十';
    if (num < 20) return '十' + digits[num - 10];
    return units[Math.floor(num / 10)] + digits[num % 10];
  }
  
  getDetailedWealthAnalysis(operatorElement, date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const timeSlot = this.getCurrentTimeSlot(date);
    const wealthPos = this.calculateWealthPosition(operatorElement, date);
    const joyPos = this.calculateJoyGodPosition(date);
    
    return {
      wealth: {
        primary: wealthPos.primary,
        secondary: wealthPos.secondary,
        element: wealthPos.element,
        description: `今日${ganZhi.day}，${operatorElement}命干员财位在${wealthPos.primary}方。此方位五行属${wealthPos.element}，宜寻找${wealthPos.element}属性装备和容器。财位宜静不宜动，宜放置贵重物品，忌污秽杂乱。`,
        timeAdvice: `当前${timeSlot.name}(${timeSlot.range})，时辰五行属${timeSlot.element}，${this.getElementInteraction(timeSlot.element, wealthPos.element)}`
      },
      joy: {
        position: joyPos,
        description: `喜神方位在${joyPos}方，此方位行动多有贵人相助，宜在此方向进行重要决策和行动。喜神临门，万事如意，是今日最吉利的方位。`,
        timeBonus: this.calculateTimeBonus(timeSlot.element, joyPos)
      }
    };
  }
  
  getElementInteraction(timeElement, wealthElement) {
    if (this.elementGeneration[timeElement] === wealthElement) {
      return '时辰生财位，财运亨通，宜积极行动。';
    } else if (this.elementGeneration[wealthElement] === timeElement) {
      return '财位生时辰，需要付出努力，但收获可期。';
    } else if (this.elementDestruction[timeElement] === wealthElement) {
      return '时辰克财位，需谨慎理财，避免损失。';
    } else if (this.elementDestruction[wealthElement] === timeElement) {
      return '财位克时辰，财运较弱，宜保守行事。';
    }
    return '时辰与财位五行平和，按部就班即可。';
  }
  
  calculateTimeBonus(timeElement, direction) {
    return 1.1;
  }
  
  // 皮肤运势相关方法
  calculateSkinFortune(operatorElement, date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const dayElement = ganZhi.dayElement;
    const timeSlot = this.getCurrentTimeSlot(date);
    
    const characterFortune = this.calculateCharacterSkinFortune(operatorElement, dayElement, timeSlot);
    const weaponFortune = this.calculateWeaponSkinFortune(operatorElement, dayElement, timeSlot);
    const bestTime = this.calculateBestSkinTime(operatorElement, date);
    
    return {
      characterSkin: characterFortune,
      weaponSkin: weaponFortune,
      bestTime,
      dayElement,
      timeSlot: timeSlot.name,
      overallAdvice: this.getSkinOverallAdvice(characterFortune, weaponFortune)
    };
  }
  
  calculateCharacterSkinFortune(operatorElement, dayElement, timeSlot) {
    const system = this.skinDrawSystem.characterSkin;
    
    const operatorBonus = this.calculateElementCompatibility(operatorElement, system.element);
    const dayBonus = this.calculateElementCompatibility(dayElement, system.element);
    const timeBonus = this.calculateElementCompatibility(timeSlot.element, system.element);
    
    const totalBonus = (operatorBonus + dayBonus + timeBonus) / 3;
    const adjustedRedRate = Math.min(system.baseRedProbability * totalBonus, system.baseRedProbability * 2);
    
    const drawProbabilities = [];
    let cumulativeFailRate = 1;
    
    for (let i = 0; i < system.drawCosts.length - 1; i++) {
      const drawRate = adjustedRedRate * cumulativeFailRate;
      drawProbabilities.push({
        draw: i + 1,
        cost: system.drawCosts[i],
        probability: drawRate,
        cumulativeCost: system.drawCosts.slice(0, i + 1).reduce((a, b) => a + b, 0)
      });
      cumulativeFailRate *= (1 - adjustedRedRate);
    }
    
    drawProbabilities.push({
      draw: 8,
      cost: system.drawCosts[7],
      probability: cumulativeFailRate,
      cumulativeCost: system.drawCosts.reduce((a, b) => a + b, 0),
      guaranteed: true
    });
    
    const oneDrawLuck = adjustedRedRate;
    const beforeGuaranteed = 1 - cumulativeFailRate;
    
    return {
      type: 'character',
      name: system.name,
      baseRate: system.baseRedProbability,
      adjustedRate: adjustedRedRate,
      bonus: totalBonus,
      oneDrawLuck,
      beforeGuaranteed,
      drawProbabilities,
      recommendation: this.getCharacterSkinRecommendation(totalBonus, oneDrawLuck)
    };
  }
  
  calculateWeaponSkinFortune(operatorElement, dayElement, timeSlot) {
    const system = this.skinDrawSystem.weaponSkin;
    const qualityFortunes = {};
    
    for (const [quality, data] of Object.entries(system.qualities)) {
      const operatorBonus = this.calculateElementCompatibility(operatorElement, data.element);
      const dayBonus = this.calculateElementCompatibility(dayElement, data.element);
      const timeBonus = this.calculateElementCompatibility(timeSlot.element, data.element);
      
      const totalBonus = (operatorBonus + dayBonus + timeBonus) / 3;
      const adjustedRate = Math.min(data.probability * totalBonus, data.probability * 2);
      
      qualityFortunes[quality] = {
        ...data,
        bonus: totalBonus,
        adjustedRate,
        recommendation: this.getSkinRecommendation(totalBonus)
      };
    }
    
    const premiumSRate = qualityFortunes.S.adjustedRate * system.categories.premium.baseRate;
    const oneDrawPremiumS = premiumSRate;
    
    return {
      type: 'weapon',
      name: system.name,
      qualities: qualityFortunes,
      premiumSRate,
      oneDrawPremiumS,
      recommendation: this.getWeaponSkinRecommendation(oneDrawPremiumS)
    };
  }
  
  getCharacterSkinRecommendation(bonus, oneDrawLuck) {
    if (oneDrawLuck >= 0.25) return { level: '极佳', color: '#ff0000', advice: '一发入魂概率极高！' };
    if (oneDrawLuck >= 0.18) return { level: '很好', color: '#ff6b35', advice: '红皮概率大幅提升！' };
    if (bonus >= 1.2) return { level: '不错', color: '#ffd700', advice: '运势不错，可以尝试！' };
    return { level: '一般', color: '#95a5a6', advice: '建议等待更好时机！' };
  }
  
  getWeaponSkinRecommendation(premiumSRate) {
    if (premiumSRate >= 0.08) return { level: '极佳', color: '#ff6b35', advice: '极品S概率爆表！' };
    if (premiumSRate >= 0.05) return { level: '很好', color: '#9b59b6', advice: '极品S概率提升！' };
    if (premiumSRate >= 0.03) return { level: '不错', color: '#3498db', advice: '有机会出极品！' };
    return { level: '一般', color: '#95a5a6', advice: '平常心对待！' };
  }
  
  getSkinOverallAdvice(characterFortune, weaponFortune) {
    const advice = [];
    
    if (characterFortune.oneDrawLuck >= 0.2) {
      advice.push('🔥 人物红皮一发入魂概率很高，强烈推荐！');
    }
    
    if (weaponFortune.oneDrawPremiumS >= 0.06) {
      advice.push('⚡ 枪皮极品S概率提升，值得一试！');
    }
    
    if (characterFortune.beforeGuaranteed >= 0.8) {
      advice.push('💎 保底前出红皮概率很高！');
    }
    
    if (advice.length === 0) {
      advice.push('🌟 今日运势平稳，建议积累研究券等待更好时机！');
    }
    
    return advice;
  }
  
  getSkinRecommendation(bonus) {
    if (bonus >= 1.3) return '大吉';
    if (bonus >= 1.2) return '吉';
    if (bonus >= 1.1) return '小吉';
    if (bonus >= 0.9) return '平';
    return '不宜';
  }
  
  // 辅助方法：获取运势建议
  getRecommendation(bonus, danger) {
    if (bonus >= 1.3) return danger <= 3 ? '大吉' : '吉中带险';
    if (bonus >= 1.1) return danger <= 3 ? '小吉' : '平';
    if (bonus >= 0.9) return '平';
    return '凶';
  }
  
  calculateBestSkinTime(operatorElement, date) {
    const bestSlots = [];
    
    for (const slot of this.timeSlots) {
      const compatibility = this.calculateElementCompatibility(operatorElement, slot.element);
      if (compatibility >= 1.2) {
        bestSlots.push({
          name: slot.name,
          range: slot.range,
          bonus: compatibility
        });
      }
    }
    
    return bestSlots.length > 0 ? bestSlots : [{
      name: '当前时辰',
      range: '随时可抽',
      bonus: 1.0
    }];
  }
  
  // 增强版每日运势计算 - 整合所有功能
  calculateEnhancedDailyFortune(operatorCodename, analysisType = 'comprehensive', date = new Date()) {
    if (!this.operators || !this.maps || !this.containers) {
      console.error('数据尚未加载完成');
      return null;
    }
    
    const operator = this.operators.operators.find(op => op.codename === operatorCodename);
    if (!operator) {
      console.error('未找到指定干员:', operatorCodename);
      return null;
    }
    
    const operatorElement = operator.element;
    const ganZhi = this.calculateGanZhi(date);
    const dayElement = ganZhi.dayElement;
    const timeSlot = this.getCurrentTimeSlot(date);
    const compatibility = this.calculateElementCompatibility(dayElement, operatorElement);
    
    // 修复 calculateEnhancedDailyFortune 方法中的地图分析部分 (587-630行)
    // 基础地图分析 - 完全修复版本
    const mapAnalysis = {};
    const allZones = [];
    
    for (const [mapName, mapData] of Object.entries(this.maps.maps)) {
        mapAnalysis[mapName] = {};
        
        // 正确访问 bagua 数据结构
        if (mapData.bagua) {
            for (const [baguaName, zoneData] of Object.entries(mapData.bagua)) {
                const zoneCompatibility = this.calculateElementCompatibility(operatorElement, zoneData.element);
                const timeCompatibility = this.calculateElementCompatibility(timeSlot.element, zoneData.element);
                const finalBonus = zoneData.lootBonus * zoneCompatibility * compatibility * timeCompatibility;
                
                // 计算运势等级
                let fortuneLevel = '平';
                if (finalBonus >= 2.0) fortuneLevel = '极吉';
                else if (finalBonus >= 1.5) fortuneLevel = '大吉';
                else if (finalBonus >= 1.2) fortuneLevel = '吉';
                else if (finalBonus >= 0.8) fortuneLevel = '平';
                else if (finalBonus >= 0.6) fortuneLevel = '带险';
                else if (finalBonus >= 0.4) fortuneLevel = '凶';
                else if (finalBonus >= 0.2) fortuneLevel = '大凶';
                else fortuneLevel = '极险';
                
                const zoneResult = {
                    element: zoneData.element,
                    direction: zoneData.direction,
                    finalBonus: finalBonus,
                    danger: zoneData.danger,
                    meaning: zoneData.meaning,
                    fortune: fortuneLevel,
                    originalFortune: zoneData.fortune,
                    recommendation: this.getRecommendation(finalBonus, zoneData.danger),
                    bagua: baguaName,
                    lootBonus: zoneData.lootBonus
                };
                
                mapAnalysis[mapName][baguaName] = zoneResult;
                allZones.push({
                    map: mapName,
                    direction: baguaName,
                    ...zoneResult
                });
            }
        }
    }
    
    // 容器分析
    const containerAnalysis = this.analyzeContainerFortune(operatorElement, date);
    const recommendedContainers = this.getRecommendedContainers(containerAnalysis);
    
    // 皮肤运势分析
    const skinFortune = this.calculateSkinFortune(operatorElement, date);
    
    // 财位喜神分析
    const wealthAnalysis = this.getDetailedWealthAnalysis(operatorElement, date);
    
    // 奇门遁甲分析
    const qimenAnalysis = this.calculateQimenAnalysis(date);
    
    // 梅花易数分析
    const plumBlossomAnalysis = this.calculatePlumBlossomAnalysis(operatorCodename, date);
    
    // 找出最佳和最差区域
    const bestZones = allZones.sort((a, b) => b.finalBonus - a.finalBonus).slice(0, 3);
    const worstZones = allZones.sort((a, b) => a.finalBonus - b.finalBonus).slice(0, 3);
    
    // 生成每日建议
    const dailyAdvice = this.generateEnhancedDailyAdvice(operator, dayElement, compatibility, skinFortune, wealthAnalysis);
    
    // 根据分析类型返回特定分析
    let specificAnalysis = null;
    switch (analysisType) {
      case 'qimen':
        specificAnalysis = qimenAnalysis;
        break;
      case 'plum_blossom':
        specificAnalysis = plumBlossomAnalysis;
        break;
      case 'skin_fortune':
        specificAnalysis = skinFortune;
        break;
      case 'wealth_analysis':
        specificAnalysis = wealthAnalysis;
        break;
      default:
        specificAnalysis = {
          qimen: qimenAnalysis,
          plumBlossom: plumBlossomAnalysis,
          skinFortune: skinFortune,
          wealthAnalysis: wealthAnalysis
        };
    }
    
    return {
      operator: operator,
      date: date.toLocaleDateString('zh-CN'),
      ganZhi: ganZhi,
      dayElement: dayElement,
      timeSlot: timeSlot,
      overallLuck: compatibility,
      mapAnalysis: mapAnalysis,
      containerAnalysis: containerAnalysis,
      recommendedContainers: recommendedContainers,
      skinFortune: skinFortune,
      wealthAnalysis: wealthAnalysis,
      bestZones: bestZones,
      worstZones: worstZones,
      dailyAdvice: dailyAdvice,
      analysisType: analysisType,
      specificAnalysis: specificAnalysis
    };
  }
  
  // 修复 getRecommendedContainers 方法 - 添加重载版本
  getRecommendedContainers(containerAnalysis) {
    if (!containerAnalysis) return [];
    
    return Object.entries(containerAnalysis)
      .sort(([,a], [,b]) => b.finalDropRate - a.finalDropRate)
      .slice(0, 3)
      .map(([name, data]) => ({ name, ...data }));
  }
  
  // 添加缺失的 generateEnhancedDailyAdvice 方法
  generateEnhancedDailyAdvice(operator, dayElement, compatibility, skinFortune, wealthAnalysis) {
    const advice = [];
    
    // 基础运势建议
    if (compatibility >= 1.2) {
      advice.push(`🌟 今日${dayElement}气旺盛，与${operator.codename}(${operator.element})相合，运势极佳！`);
    } else if (compatibility <= 0.8) {
      advice.push(`⚠️ 今日${dayElement}气与${operator.codename}(${operator.element})相冲，需谨慎行动。`);
    } else {
      advice.push(`📊 今日运势平稳，适合正常作战。`);
    }
    
    // 皮肤运势建议
    if (skinFortune && skinFortune.characterSkin.oneDrawLuck >= 0.2) {
      advice.push(`🎨 人物红皮运势极佳，一发入魂概率${(skinFortune.characterSkin.oneDrawLuck * 100).toFixed(1)}%！`);
    }
    
    if (skinFortune && skinFortune.weaponSkin.oneDrawPremiumS >= 0.06) {
      advice.push(`⚔️ 枪皮极品S运势提升，概率${(skinFortune.weaponSkin.oneDrawPremiumS * 100).toFixed(1)}%！`);
    }
    
    // 财位建议
    if (wealthAnalysis && wealthAnalysis.wealth) {
      advice.push(`💰 今日财位在${wealthAnalysis.wealth.primary}方，宜寻找${wealthAnalysis.wealth.element}属性装备。`);
    }
    
    // 喜神建议
    if (wealthAnalysis && wealthAnalysis.joy) {
      advice.push(`🎭 喜神方位在${wealthAnalysis.joy.position}方，此方向行动多有贵人相助。`);
    }
    
    return advice;
  }
} // 类的正确结束位置