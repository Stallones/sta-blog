<script setup lang="ts">
import { useCanvasEffects } from "@/composables/useCanvasEffects";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import canvBgUrl from "@/assets/images/canv-bg.png";

const websiteStore = useWebsiteStore();
const { canvasHeaderH,setImageUrl } = useCanvasEffects();

onMounted(async () => {
  canvasHeaderH.value = window.innerHeight ;
  setImageUrl(canvBgUrl);
});

// JSConfetti 懒加载
import("js-confetti").then(({ default: JSConfetti }) => {
  new JSConfetti().addConfetti();
});

// 技能列表
const skills = [
  { name: "Java", color: "#f89820" },
  { name: "Spring Boot", color: "#6db33f" },
  { name: "Vue", color: "#42b883" },
  { name: "React", color: "#61dafb" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Docker", color: "#2496ed" },
  { name: "MySQL", color: "#4479a1" },
  { name: "Redis", color: "#dc382d" },
  { name: "Python", color: "#3776ab" },
  { name: "Git", color: "#f05032" },
  { name: "Nginx", color: "#009639" },
  { name: "Linux", color: "#fcc624" },
  { name: "Vite", color: "#646cff" },
  { name: "Node.js", color: "#339933" },
  { name: "CSS3", color: "#1572b6" },
  { name: "JavaScript", color: "#f7df1e" },
];

// 重复一份用于无缝滚动
const skillsLoop = [...skills, ...skills];
</script>

<template>
  <div class="about-page">
    <!-- ── 顶部：头像横幅 ── -->
    <section class="hero-banner">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-avatar">
          <img
            :src="websiteStore.webInfo?.webmasterAvatar"
            alt="avatar"
          />
        </div>
        <div class="hero-tags">
          <span class="tag tag-left" v-for="t in ['后端开发', '开源爱好者', '技术博主', '终身学习']" :key="t">{{ t }}</span>
        </div>
        <h1 class="hero-name">{{ websiteStore.webInfo?.webmasterName || 'Marcus' }}</h1>
        <p class="hero-desc">
          <span v-for="t in ['Java 后端', '全栈探索', '源码解析', '技术分享']" :key="t" class="role-tag">{{ t }}</span>
        </p>
      </div>
      <div class="hero-tags hero-tags-right">
        <span class="tag tag-right" v-for="t in ['Spring 生态', '微服务', 'Vue/React', '博客作者']" :key="t">{{ t }}</span>
      </div>
    </section>

    <!-- ── 标题 ── -->
    <h2 class="section-title">关于本站</h2>

    <!-- ── 自我介绍行 ── -->
    <div class="intro-row">
      <div class="greeting-card">
        <div class="greeting-emoji">👋</div>
        <h3>你好，很高兴认识你</h3>
        <p>
          我叫 <strong>{{ websiteStore.webInfo?.webmasterName || 'Marcus' }}</strong>
        </p>
        <p>是一名 Java 后端工程师、开源爱好者、独立开发者、博主</p>
      </div>
      <div class="passion-card">
        <span class="passion-label">追求</span>
        <h3>
          源于<br />
          <span class="passion-words">
            <em v-for="(w, i) in ['热爱而去', '感受', '学习', '编码', '生活', '体验']" :key="i" :style="{ animationDelay: i * 0.8 + 's' }">{{ w }}</em>
          </span>
        </h3>
      </div>
    </div>

    <!-- ── 技能 + 生涯 ── -->
    <div class="mid-row">
      <div class="skills-card surface-card-wrap">
        <div class="card-header">
          <h3>技能</h3>
          <span class="card-subtitle">开启创造力</span>
        </div>
        <div class="skills-marquee">
          <div class="marquee-track">
            <div v-for="(skill, i) in skillsLoop" :key="i" class="skill-item">
              <div class="skill-icon" :style="{ background: skill.color + '22', borderColor: skill.color + '44' }">
                <span class="skill-dot" :style="{ background: skill.color }"></span>
              </div>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="career-card surface-card-wrap">
        <div class="card-header">
          <h3>生涯</h3>
          <span class="card-subtitle">无限进步</span>
        </div>
        <div class="career-body">
          <div class="career-item">
            <span class="career-icon">🎓</span>
            <span>软件工程专业</span>
          </div>
          <div class="career-item">
            <span class="career-icon">💼</span>
            <span>Java 后端工程师</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 数据 + 信息 + 性格 + 照片 ── -->
    <div class="info-grid">
      <div class="stats-card surface-card-wrap">
        <div class="card-header">
          <h3>数据</h3>
          <span class="card-subtitle">访问统计</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ websiteStore.webInfo?.articleCount ?? 0 }}</span>
            <span class="stat-label">文章总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ websiteStore.webInfo?.commentCount ?? 0 }}</span>
            <span class="stat-label">评论总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ websiteStore.webInfo?.categoryCount ?? 0 }}</span>
            <span class="stat-label">分类数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ websiteStore.webInfo?.tagCount ?? 0 }}</span>
            <span class="stat-label">标签数</span>
          </div>
        </div>
      </div>

      <div class="location-card surface-card-wrap">
        <p class="info-line">我现在住在 <strong>中国</strong></p>
        <div class="info-details">
          <span>🏠 热爱技术</span>
          <span>🎂 终身学习</span>
          <span>💻 全栈开发</span>
          <span>🚀 开源贡献</span>
        </div>
      </div>

      <div class="personality-card surface-card-wrap">
        <div class="card-header">
          <h3>性格</h3>
        </div>
        <div class="mbti-type">INTJ-A</div>
        <p class="mbti-name">建筑师</p>
        <p class="mbti-desc">富有想象力和战略性的思想家，一切皆在计划之中</p>
      </div>

      <div class="photo-card surface-card-wrap">
        <div class="photo-placeholder">
          <span>📸</span>
          <p>生活记录</p>
        </div>
      </div>
    </div>

    <!-- ── 座右铭 + 特长 ── -->
    <div class="motto-row">
      <div class="motto-card surface-card-wrap">
        <span class="motto-label">座右铭</span>
        <p class="motto-text">人生如棋落子无悔<br />道心稳固如箭离弦永不回头</p>
      </div>
      <div class="buff-card surface-card-wrap">
        <div class="card-header">
          <h3>特长</h3>
        </div>
        <div class="buff-items">
          <span>源码阅读狂魔 🔍</span>
          <span>Debug 直觉 MAX ⚡</span>
        </div>
      </div>
    </div>

    <!-- ── 爱好 + 偏好 ── -->
    <div class="hobby-row">
      <div class="hobby-card surface-card-wrap">
        <div class="card-header">
          <h3>关注偏好</h3>
        </div>
        <h4>后端架构 & 开源生态</h4>
        <p>Spring 全家桶、微服务、中间件、云原生</p>
      </div>
      <div class="hobby-card surface-card-wrap">
        <div class="card-header">
          <h3>音乐偏好</h3>
        </div>
        <h4>华语流行、民谣、纯音乐</h4>
        <p>编码时听歌效率翻倍 🎧</p>
      </div>
    </div>

    <!-- ── 心路历程 ── -->
    <section class="journey-section surface-card-wrap">
      <div class="card-header">
        <h3>心路历程</h3>
      </div>
      <div class="journey-body">
        <p>
          欢迎来到我的博客 😝，这里是我记录技术成长的地方 🙌。
          虽然有时候会忘记更新 ✋~ 但写博客真的是一个很棒的习惯 💪，
          能把学下来的知识进行积累和沉淀。有一句话说的好，
          能教给别人的知识，才是真正学会了的知识 ⚡
        </p>
        <p class="journey-note">肯定又熬夜了 <del>同学们不要学我，老是熬夜会长痘</del></p>
        <ul class="journey-checklist">
          <li>☑️ 致力于成为一名优秀的后端工程师 🐷</li>
          <li>☑️ 又菜又爱玩 🎮 ctrl+C、ctrl+V 高级 CV 工程师 🏆</li>
          <li>☑️ 精通 Java、Python、Go、TypeScript 等单词的拼写 🎲</li>
          <li>☑️ 熟悉 Windows、Linux、Mac 等系统的开关机 👻</li>
        </ul>
      </div>
    </section>

    <!-- ── 社交链接 ── -->
    <section class="social-section">
      <a href="https://github.com/kuailemao" target="_blank" class="social-card surface-card-wrap">
        <SvgIcon name="github_icon" width="48" height="48" />
        <span>GitHub</span>
      </a>
      <a href="https://gitee.com/kuailemao" target="_blank" class="social-card surface-card-wrap">
        <SvgIcon name="gitee_icon" width="48" height="48" />
        <span>Gitee</span>
      </a>
      <a href="https://space.bilibili.com/299105957" target="_blank" class="social-card surface-card-wrap">
        <SvgIcon name="bilibili_icon" width="48" height="48" />
        <span>Bilibili</span>
      </a>
    </section>
  </div>
</template>

<style lang="scss" scoped>
$bp-tablet: 768px;
$bp-mobile: 480px;

/* ── 页面容器 ── */
.about-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ══════ 通用 surface-card 包裹 ══════ */
.surface-card-wrap {
  @include surface-card;
  padding: 20px 24px;
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .card-subtitle {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
}

/* ══════ Hero 横幅 ══════ */
.hero-banner {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  border-radius: $glass-radius;
  overflow: hidden;
  @include surface-card;
  padding: 48px 24px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, hsla(220, 70%, 50%, 0.15) 0%, hsla(280, 60%, 50%, 0.1) 50%, hsla(180, 60%, 40%, 0.1) 100%);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.hero-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 30px hsla(0, 0%, 0%, 0.15);
  border: 4px solid var(--color-white);
  transition: transform 0.5s ease;

  &:hover {
    transform: rotate(360deg) scale(1.08);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;

  .tag {
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 0.78rem;
    background: hsla(0, 0%, 100%, 0.15);
    border: 1px solid hsla(0, 0%, 100%, 0.2);
    color: var(--text-primary);
    backdrop-filter: blur(4px);
  }
}

.hero-tags-right {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  flex-direction: column;
  z-index: 1;

  @media (max-width: $bp-tablet) {
    position: static;
    transform: none;
    flex-direction: row;
    justify-content: center;
    margin-top: 8px;
  }
}

.hero-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 2px;
}

.hero-desc {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 0;

  .role-tag {
    font-size: 0.85rem;
    color: var(--text-secondary);

    &::after {
      content: " ·";
      color: var(--text-placeholder);
    }

    &:last-child::after {
      content: "";
    }
  }
}

/* ══════ 标题 ══════ */
.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 20px 0 4px;
}

/* ══════ 自我介绍行 ══════ */
.intro-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}

.greeting-card {
  @include surface-card;
  padding: 32px;
  background: linear-gradient(135deg, hsla(250, 80%, 55%, 0.85) 0%, hsla(190, 90%, 55%, 0.85) 100%);
  color: #fff;
  border: none;

  .greeting-emoji {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 1.3rem;
    margin: 0 0 10px;
    font-weight: 700;
  }

  p {
    margin: 4px 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }

  strong {
    font-size: 1.1em;
  }
}

.passion-card {
  @include surface-card;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .passion-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.5;
    margin: 0;
  }

  .passion-words {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;

    em {
      font-style: normal;
      display: inline-block;
      color: var(--accent-primary);
      animation: wordPulse 4s ease-in-out infinite;
    }
  }
}

@keyframes wordPulse {
  0%, 100% { opacity: 0.5; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
}

/* ══════ 技能 + 生涯 ══════ */
.mid-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}

.skills-card {
  overflow: hidden;
}

.skills-marquee {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee-track {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: marquee 30s linear infinite;
  padding: 8px 0;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 70px;
}

.skill-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.15);
  }

  .skill-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
}

.skill-name {
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.career-card {
  display: flex;
  flex-direction: column;
}

.career-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  justify-content: center;
}

.career-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: var(--text-primary);

  .career-icon {
    font-size: 1.4rem;
  }
}

/* ══════ 信息网格 ══════ */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: $bp-mobile) {
    grid-template-columns: 1fr;
  }
}

.stats-card .stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .stat-value {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--accent-primary);
  }

  .stat-label {
    font-size: 0.78rem;
    color: var(--text-secondary);
  }
}

.location-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;

  .info-line {
    font-size: 0.95rem;
    color: var(--text-primary);
    margin: 0;
  }

  .info-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
}

.personality-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .mbti-type {
    font-size: 2rem;
    font-weight: 900;
    color: var(--accent-primary);
    letter-spacing: 3px;
  }

  .mbti-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 4px 0;
  }

  .mbti-desc {
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin: 0;
  }
}

.photo-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;

  .photo-placeholder {
    text-align: center;
    color: var(--text-secondary);

    span {
      font-size: 3rem;
    }

    p {
      margin: 8px 0 0;
      font-size: 0.85rem;
    }
  }
}

/* ══════ 座右铭 + 特长 ══════ */
.motto-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}

.motto-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  .motto-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }

  .motto-text {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.6;
    margin: 0;
  }
}

.buff-card {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .buff-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 1rem;
    color: var(--text-primary);
  }
}

/* ══════ 爱好行 ══════ */
.hobby-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}

.hobby-card {
  h4 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px;
  }

  p {
    font-size: 0.88rem;
    color: var(--text-secondary);
    margin: 0;
  }
}

/* ══════ 心路历程 ══════ */
.journey-section {
  .journey-body {
    p {
      font-size: 0.95rem;
      line-height: 1.75;
      color: var(--text-primary);
      margin: 0 0 12px;
    }

    .journey-note {
      color: var(--text-secondary);
      font-size: 0.88rem;

      del {
        color: var(--text-placeholder);
      }
    }

    .journey-checklist {
      list-style: none;
      padding: 0;
      margin: 16px 0 0;
      display: flex;
      flex-direction: column;
      gap: 10px;

      li {
        font-size: 0.9rem;
        color: var(--text-primary);
        padding: 8px 12px;
        border-radius: 8px;
        background: var(--surface-inner-bg);
        transition: background 0.2s ease;

        &:hover {
          background: hsla(0, 0%, 50%, 0.1);
        }
      }
    }
  }
}

/* ══════ 社交链接 ══════ */
.social-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: $bp-mobile) {
    grid-template-columns: 1fr;
  }
}

.social-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  span {
    font-size: 0.95rem;
    font-weight: 600;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px hsla(0, 0%, 0%, 0.12);
  }
}
</style>
