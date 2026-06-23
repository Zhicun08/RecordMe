/**
 * 27 Emotions — Cowen & Keltner (2017) taxonomy
 * Quadrant placement based on Russell's Circumplex Model of Affect (1980)
 * Two axes: Valence (positive ↔ negative) × Arousal (high ↔ low)
 *
 * Q1 高能量·积极  High Arousal + Positive Valence
 * Q2 低能量·积极  Low Arousal  + Positive Valence
 * Q3 低能量·消极  Low Arousal  + Negative Valence
 * Q4 高能量·消极  High Arousal + Negative Valence
 */
// Color logic: each emotion's color reflects its quadrant family
// Q1 (高能量·积极) → warm oranges, golds, coral, rose
// Q2 (低能量·积极) → soft greens, sage, warm tans
// Q3 (低能量·消极) → steel blues, grey-blues, slate
// Q4 (高能量·消极) → deep reds, burnt oranges, dark purples

const EMOTIONS = [
  // ── Q1: 高能量·积极 ─────────────────────────────────────────
  {
    id: 'joy', name: '喜悦', en: 'Joy',
    quadrant: 'q1', color: '#e6b993', bg: '#F8F0E7',
    valence: 0.95, arousal: 0.65,
    desc: '内心深处的满足与幸福感，一种纯粹的积极体验，常由美好的人与事触发。',
    func: '增强社会联结，激励我们重复带来快乐的行为；它告诉你——此刻的生活是美好的，值得珍惜。'
  },
  {
    id: 'excitement', name: '兴奋', en: 'Excitement',
    quadrant: 'q1', color: '#e5a48f', bg: '#F7EDE8',
    valence: 0.88, arousal: 0.90,
    desc: '对即将到来的事物的强烈期待与高度活力，身体充满能量的积极状态。',
    func: '激活行动力与冒险精神，帮助你迎接新挑战；它是推动改变的引擎。'
  },
  {
    id: 'amusement', name: '愉悦', en: 'Amusement',
    quadrant: 'q1', color: '#e7b397', bg: '#F8EFE8',
    valence: 0.80, arousal: 0.55,
    desc: '因有趣或好玩的事物产生的轻快感，带有自发的笑意与轻松。',
    func: '缓解压力，促进社交互动；幽默与愉悦是人际关系的润滑剂。'
  },
  {
    id: 'awe', name: '敬畏', en: 'Awe',
    quadrant: 'q1', color: '#e5ae92', bg: '#F6EDE7',
    valence: 0.72, arousal: 0.60,
    desc: '面对宏大、壮观或超越自身理解的事物时产生的震撼与惊叹。',
    func: '拓展认知边界，减少自我中心，增强谦逊感；让你感受到比自我更大的存在。'
  },
  {
    id: 'entrancement', name: '着迷', en: 'Entrancement',
    quadrant: 'q1', color: '#e5a990', bg: '#F6ECE6',
    valence: 0.70, arousal: 0.55,
    desc: '被某事物深深吸引，意识高度聚焦，几乎忘记周围一切的沉浸状态。',
    func: '推动深度探索与专注，是心流状态的前奏；创意工作与技能精进的重要催化剂。'
  },
  {
    id: 'interest', name: '好奇', en: 'Interest',
    quadrant: 'q1', color: '#e4c18b', bg: '#F6F1E6',
    valence: 0.65, arousal: 0.50,
    desc: '对某事物产生的想了解更多的欲望，充满探索的冲动与开放心态。',
    func: '驱动学习与探索，是认知成长的引擎；好奇心是所有发现的起点。'
  },
  {
    id: 'adoration', name: '崇拜', en: 'Adoration',
    quadrant: 'q1', color: '#e9ac9f', bg: '#F8EEE9',
    valence: 0.90, arousal: 0.50,
    desc: '深深的爱与崇敬，带有近乎神圣的情感色彩，是情感依附的最深形式。',
    func: '加深亲密关系，创造归属感；推动我们守护和珍惜所爱之人。'
  },
  {
    id: 'romance', name: '浪漫', en: 'Romance',
    quadrant: 'q1', color: '#e2a2ae', bg: '#F6EAEE',
    valence: 0.85, arousal: 0.60,
    desc: '对特定人产生的柔情、爱意与亲近欲，带有美好憧憬的温暖感受。',
    func: '推动建立和深化亲密关系；激励我们用心表达爱意，创造共同的珍贵记忆。'
  },
  {
    id: 'craving', name: '渴望', en: 'Craving',
    quadrant: 'q1', color: '#e5b38e', bg: '#F8EFE7',
    valence: 0.40, arousal: 0.70,
    desc: '对某事物（食物、体验、人）产生的强烈向往与需求感，带有迫切性。',
    func: '驱动目标导向行为，引导我们追求所需之物；但强烈的渴望也值得留意是否源于真实需求。'
  },
  {
    id: 'surprise', name: '惊讶', en: 'Surprise',
    quadrant: 'q1', color: '#e4bd8b', bg: '#F7F0E5',
    valence: 0.10, arousal: 0.75,
    desc: '遇到完全意料之外事物时的突然反应，可以是愉快的也可以是不适的。',
    func: '迅速将注意力转向新信息，帮助大脑快速评估变化；是学习新事物的重要触发器。'
  },
  // ── Q2: 低能量·积极 ─────────────────────────────────────────
  {
    id: 'calmness', name: '平静', en: 'Calmness',
    quadrant: 'q2', color: '#a3ccba', bg: '#ECF3EF',
    valence: 0.75, arousal: 0.10,
    desc: '内心的安宁与平和，思绪清晰，不受外界纷扰影响的稳定状态。',
    func: '恢复身心平衡，提升专注力与决策质量；平静是高质量思考的基础。'
  },
  {
    id: 'satisfaction', name: '满足', en: 'Satisfaction',
    quadrant: 'q2', color: '#b2ccaf', bg: '#EFF4EC',
    valence: 0.85, arousal: 0.30,
    desc: '完成目标或需求被满足后产生的充实感，是努力之后的自然奖励。',
    func: '强化有益行为，向大脑发出「任务完成」的信号；帮助你积累成就感，建立自信。'
  },
  {
    id: 'relief', name: '释然', en: 'Relief',
    quadrant: 'q2', color: '#a6cfb9', bg: '#EDF4EF',
    valence: 0.78, arousal: 0.20,
    desc: '压力、威胁或担忧解除之后产生的轻松与如释重负感。',
    func: '帮助身心从紧张状态恢复正常；它告诉你危险已过，可以放松了。'
  },
  {
    id: 'gratitude', name: '感恩', en: 'Gratitude',
    quadrant: 'q2', color: '#c6c69a', bg: '#F2F1E6',
    valence: 0.88, arousal: 0.35,
    desc: '对他人给予的帮助、善意或礼物发自内心的珍视与感谢。',
    func: '增强社会联结与互助精神，提升幸福感；感恩是人际关系中最有力的黏合剂之一。'
  },
  {
    id: 'aesthetic', name: '审美愉悦', en: 'Aesthetic Appreciation',
    quadrant: 'q2', color: '#c9be98', bg: '#F2F0E6',
    valence: 0.76, arousal: 0.35,
    desc: '面对美好事物（艺术、音乐、自然）时内心升起的深刻感动与愉悦。',
    func: '帮助你感知生活中的美，培养创造力与感受力；美的体验本身就是一种滋养。'
  },
  {
    id: 'nostalgia', name: '怀旧', en: 'Nostalgia',
    quadrant: 'q2', color: '#cfb79d', bg: '#F4EEE7',
    valence: 0.60, arousal: 0.25,
    desc: '对过去美好时光的温柔思念，带有甜蜜与淡淡忧伤交织的复杂感。',
    func: '增强身份认同感与连续性；在不确定的当下提供心理支撑，让你感受到生命的厚度。'
  },
  {
    id: 'admiration', name: '钦佩', en: 'Admiration',
    quadrant: 'q2', color: '#b8cba6', bg: '#F0F3E9',
    valence: 0.78, arousal: 0.45,
    desc: '对他人卓越品质、才华或成就的高度评价，伴随向往之情。',
    func: '激励你向榜样学习，提升自我；钦佩是成长的催化剂。'
  },
  // ── Q3: 低能量·消极 ─────────────────────────────────────────
  {
    id: 'sadness', name: '悲伤', en: 'Sadness',
    quadrant: 'q3', color: '#9fb3cd', bg: '#ECEFF4',
    valence: -0.80, arousal: 0.20,
    desc: '因失去、失望或分离而产生的沉重与忧郁，心情低落，缺乏活力。',
    func: '帮助我们处理失去与悲痛；向他人传递需要支持的信号；适度的悲伤是情感愈合的过程。'
  },
  {
    id: 'boredom', name: '无聊', en: 'Boredom',
    quadrant: 'q3', color: '#b1b9c5', bg: '#EFF0F3',
    valence: -0.45, arousal: 0.10,
    desc: '缺乏刺激、意义或投入时产生的空洞与停滞感，时间感觉过得很慢。',
    func: '信号当前状态无法满足内在需求，推动我们寻求更有意义的活动；无聊可以是改变的起点。'
  },
  {
    id: 'empathic_pain', name: '共情之痛', en: 'Empathic Pain',
    quadrant: 'q3', color: '#a3b5c3', bg: '#EDF0F3',
    valence: -0.60, arousal: 0.40,
    desc: '因目睹或感知到他人的痛苦而在心中升起的真实心痛感。',
    func: '深化人际联结，激励我们伸出援手；共情之痛是人类善意与道德行为的重要根基。'
  },
  {
    id: 'confusion', name: '困惑', en: 'Confusion',
    quadrant: 'q3', color: '#aeaec8', bg: '#EFEEF5',
    valence: -0.30, arousal: 0.40,
    desc: '面对复杂、矛盾或难以理解的信息时产生的不知所措感。',
    func: '提示你需要更多信息或不同的思考框架；困惑是理解之前必经的状态，是成长的前兆。'
  },
  // ── Q4: 高能量·消极 ─────────────────────────────────────────
  {
    id: 'anger', name: '愤怒', en: 'Anger',
    quadrant: 'q4', color: '#da9a8f', bg: '#F5E9E6',
    valence: -0.75, arousal: 0.85,
    desc: '感到不公平、受到侵犯或阻碍时爆发的激烈情绪，带有强烈冲动。',
    func: '激活自我保护机制，推动我们捍卫边界与权益；愤怒告诉你有重要的价值观被侵犯了。'
  },
  {
    id: 'anxiety', name: '焦虑', en: 'Anxiety',
    quadrant: 'q4', color: '#e2c38f', bg: '#F6F0E4',
    valence: -0.65, arousal: 0.75,
    desc: '对未来不确定性或潜在威胁的持续担忧与紧张，难以放松。',
    func: '预警潜在威胁，推动提前准备与规划；适度焦虑是行动的动力，过度焦虑则需要关照。'
  },
  {
    id: 'fear', name: '恐惧', en: 'Fear',
    quadrant: 'q4', color: '#b7a7c5', bg: '#EFEBF3',
    valence: -0.85, arousal: 0.80,
    desc: '面对真实或想象中的危险时产生的强烈警觉与逃离冲动。',
    func: '激活「战斗或逃跑」反应，帮助我们在危险中生存；恐惧是身体在保护你的重要信号。'
  },
  {
    id: 'horror', name: '恐怖', en: 'Horror',
    quadrant: 'q4', color: '#d09590', bg: '#F3E8E6',
    valence: -0.92, arousal: 0.88,
    desc: '面对极度可怕或令人毛骨悚然的事物时产生的震惊与极度不适。',
    func: '触发强烈的自我保护本能，帮助我们识别并远离极端危险；是比恐惧更强烈的警报信号。'
  },
  {
    id: 'disgust', name: '厌恶', en: 'Disgust',
    quadrant: 'q4', color: '#b7b992', bg: '#EFF0E6',
    valence: -0.78, arousal: 0.45,
    desc: '对令人不适、违背价值观或道德感的事物产生的强烈排斥反应。',
    func: '保护我们远离有害的事物与行为，维护道德边界；厌恶感在社会规范的维系中也发挥重要作用。'
  },
  {
    id: 'awkwardness', name: '尴尬', en: 'Awkwardness',
    quadrant: 'q4', color: '#d0ae98', bg: '#F3EBE6',
    valence: -0.50, arousal: 0.55,
    desc: '违反社会规范或期望、或处于不合时宜情境时产生的不适与自我意识感。',
    func: '提醒我们注意社交规则与他人感受，推动修复关系与行为调整；是社会化的重要信号。'
  },
];

const QUADRANTS = {
  q1: { label: '高能量·积极', color: '#e6b993', bg: '#FAF4EC', axis: '精力充沛 + 正向愉悦' },
  q2: { label: '低能量·积极', color: '#b2ccaf', bg: '#EFF4EC', axis: '平和宁静 + 正向愉悦' },
  q3: { label: '低能量·消极', color: '#9fb3cd', bg: '#ECEFF4', axis: '平和宁静 + 负向不适' },
  q4: { label: '高能量·消极', color: '#da9a8f', bg: '#F5E9E6', axis: '精力充沛 + 负向不适' },
};

// ── Trigger Tags ──────────────────────────────────────────────
const TAGS = [
  {
    id: 'work', name: '工作',
    icon: `<path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="2" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>`
  },
  {
    id: 'food', name: '饮食',
    icon: `<path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><line x1="6" y1="2" x2="6" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="10" y1="2" x2="10" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="14" y1="2" x2="14" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>`
  },
  {
    id: 'exercise', name: '运动',
    icon: `<circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M6 20L9 13L12 15L15 13L18 20" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 13L7 9H17L15 13" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>`
  },
  {
    id: 'body', name: '身体',
    icon: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>`
  },
  {
    id: 'social', name: '关系',
    icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>`
  },
  {
    id: 'sleep', name: '睡眠',
    icon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>`
  },
  {
    id: 'learning', name: '学习',
    icon: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>`
  },
  {
    id: 'finance', name: '财务',
    icon: `<line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>`
  },
  {
    id: 'leisure', name: '休闲',
    icon: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>`
  },
  {
    id: 'family', name: '家庭',
    icon: `<path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>`
  },
  {
    id: 'weather', name: '天气',
    icon: `<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/><line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>`
  },
];

const EMOTION_CATEGORIES = {
  positive: { label: '积极情绪', color: '#e6b993' },
  negative: { label: '消极情绪', color: '#9fb3cd' },
  mixed:    { label: '复杂情绪', color: '#b7a7c5' },
};

// Sample data — dates generated relative to today so demos always have data
function dAgo(days, h, m) {
  const d = new Date(); d.setDate(d.getDate() - days); d.setHours(h, m, 0, 0); return d;
}

const SAMPLE_ENTRIES = [
  { id: 1, ts: dAgo(0, 8, 40),  emotionId: 'anxiety',      tags: ['work'],    event: '早上开会前，担心演示效果不好', feeling: '心跳加速，手有点抖，脑子里一直在想最坏的情况' },
  { id: 2, ts: dAgo(0, 12, 15), emotionId: 'satisfaction', tags: ['work'],    event: '演示顺利完成，老板给了正面反馈', feeling: '整个人松了口气' },
  { id: 3, ts: dAgo(1, 15, 30), emotionId: 'boredom',      tags: ['work'],    event: '下午开了两小时的例会，感觉毫无产出', feeling: '' },
  { id: 4, ts: dAgo(1, 9, 0),   emotionId: 'joy',          tags: ['social'],  event: '收到朋友的突然来访，一起吃了顿早饭', feeling: '很久没有这种轻松愉快的感觉了' },
  { id: 5, ts: dAgo(2, 14, 20), emotionId: 'anger',        tags: ['work'],    event: '合作方临时反悔，前期的工作白做了', feeling: '非常沮丧，感觉被不尊重' },
  { id: 6, ts: dAgo(2, 21, 0),  emotionId: 'calmness',     tags: ['leisure'], event: '睡前读了一会儿书，喝了杯热茶', feeling: '' },
  { id: 7, ts: dAgo(3, 7, 30),  emotionId: 'excitement',   tags: ['leisure'], event: '确认了下周的旅行计划，订好了票', feeling: '迫不及待想出发了' },
  { id: 8, ts: dAgo(3, 16, 0),  emotionId: 'nostalgia',    tags: ['family'],  event: '翻到了几年前的老照片', feeling: '那时候好像没什么烦恼，有点想念' },
  { id: 9, ts: dAgo(4, 11, 0),  emotionId: 'gratitude',    tags: ['social'],  event: '朋友帮我解决了一个困扰很久的问题', feeling: '真的很感激' },
  { id: 10, ts: dAgo(4, 19, 30), emotionId: 'sadness',     tags: ['leisure'], event: '看完了一部电影，结局很遗憾', feeling: '有些莫名的难过，说不清楚为什么' },
  { id: 11, ts: dAgo(5, 10, 0), emotionId: 'interest',     tags: ['learning'], event: '发现了一个很有意思的播客节目', feeling: '' },
  { id: 12, ts: dAgo(6, 18, 30), emotionId: 'relief',      tags: ['work'],    event: '拖了很久的报告终于交了', feeling: '如释重负' },
];

const SAMPLE_WINS = [
  { id: 101, ts: dAgo(0, 9, 30),  text: '早起做了15分钟拉伸，身体舒服多了' },
  { id: 102, ts: dAgo(0, 13, 0),  text: '中午去了那家一直想试的面馆，很好吃' },
  { id: 103, ts: dAgo(1, 20, 0),  text: '给妈妈打了个电话，聊了半小时' },
  { id: 104, ts: dAgo(2, 22, 0),  text: '坚持写完了今天的日记' },
  { id: 105, ts: dAgo(3, 17, 0),  text: '下班绕公园走了一圈，夕阳很美' },
  { id: 106, ts: dAgo(5, 12, 0),  text: '帮同事解决了一个卡了很久的问题，被真诚地谢了' },
];

Object.assign(window, { EMOTIONS, QUADRANTS, TAGS, EMOTION_CATEGORIES, SAMPLE_ENTRIES, SAMPLE_WINS });
