import { useState } from 'react'

export default function App() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    // 💡 记得把这里换成你的真实工作邮箱
    navigator.clipboard.writeText("your.email@example.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-slate-900">
      
      {/* 1. 导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-teal-400 tracking-tight text-lg">KP.dev</span>
          <nav className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-teal-400 transition-colors">关于我</a>
            <a href="#projects" className="hover:text-teal-400 transition-colors">精选项目</a>
            <a href="#skills" className="hover:text-teal-400 transition-colors">核心技术</a>
          </nav>
        </div>
      </header>

      {/* 主体核心内容 */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-32">
        
        {/* 2. 个人简介 (Hero Section) */}
        <section id="about" className="py-12 md:py-20 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
            🟢 随时可入职前端开发岗位
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-teal-400 bg-clip-text text-transparent leading-tight">
            专注于构建高性能、响应式的 Web 交互体验。
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
            我是具备 **4年+ 商业项目经验** 的前端开发工程师，核心技术栈为 **React、JavaScript (ES6+) 和现代 CSS 架构**。擅长将复杂的设计稿转化为像素级还原、丝滑流畅的高性能用户界面。
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={handleCopyEmail}
              className="px-5 py-2.5 rounded-lg bg-teal-500 text-slate-950 font-semibold hover:bg-teal-400 transition-all active:scale-95 shadow-lg shadow-teal-500/10"
            >
              {copied ? "✓ 邮箱已复制！" : "联系我 (复制邮箱)"}
            </button>
            <a 
              href="#projects" 
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-semibold hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              浏览项目
            </a>
          </div>
        </section>

        {/* 3. 核心项目展示 (Projects Section) */}
        <section id="projects" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">精选研发项目</h2>
            <p className="text-slate-400">以下是我主导并成功交付的具备代表性的前端系统：</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 项目 1 */}
            <div className="group rounded-xl p-6 bg-slate-900/50 border border-slate-800/60 hover:border-teal-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors">智能植物监测数据可视化看板</h3>
                  <span className="text-xs font-medium text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded">AI / IoT 结合</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  基于 React 构建的大型物联网数据监控系统。深度整合 AI 图像识别技术，实现对植物健康状况的实时解析、自动化分类与动态数据追踪，帮助团队将核心数据处理效率显著提升。
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React.js', 'Node.js', 'AI 图像识别', '实时数据流'].map((tech) => (
                    <span key={tech} className="px-2.5 py-0.5 rounded bg-slate-800 text-xs text-slate-300 font-medium">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 项目 2 */}
            <div className="group rounded-xl p-6 bg-slate-900/50 border border-slate-800/60 hover:border-teal-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors">高性能高并发独立电商系统</h3>
                  <span className="text-xs font-medium text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded">全栈模拟架构</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  针对高转换率场景设计的完整电商解决方案。使用 React 进行严谨的状态管理，完美接入了安全的第三方支付网关（Payment Gateway），并针对动态商品列表与订单处理流水线进行了深度的响应速度优化。
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React.js', '状态管理', '支付网关集成', 'RESTful API'].map((tech) => (
                    <span key={tech} className="px-2.5 py-0.5 rounded bg-slate-800 text-xs text-slate-300 font-medium">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 技术栈分栏 (Skills Section) */}
        <section id="skills" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">核心技术栈</h2>
            <p className="text-slate-400">我熟练掌握并能够在实际业务中迅速上手的技术工具：</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-slate-900/30 border border-slate-800/40 hover:border-slate-700/50 transition-colors">
              <h4 className="font-semibold text-teal-400 mb-3">核心语言</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• JavaScript (ES6+)</li>
                <li>• HTML5 / CSS3 架构</li>
                <li>• 响应式布局 (Flex / Grid)</li>
              </ul>
            </div>
            <div className="p-5 rounded-lg bg-slate-900/30 border border-slate-800/40 hover:border-slate-700/50 transition-colors">
              <h4 className="font-semibold text-teal-400 mb-3">框架与库</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• React.js 核心生态</li>
                <li>• Tailwind CSS 快速开发</li>
                <li>• Next.js / 前端工程化基础</li>
              </ul>
            </div>
            <div className="p-5 rounded-lg bg-slate-900/30 border border-slate-800/40 hover:border-slate-700/50 transition-colors">
              <h4 className="font-semibold text-teal-400 mb-3">开发工具</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Git / GitHub 版本控制</li>
                <li>• npm / Vite 构建工具</li>
                <li>• RESTful API 联调经验</li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* 5. 页脚 */}
      <footer className="border-t border-slate-900 mt-32 bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 KP.dev. Powered by React & Tailwind CSS.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-300 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  )
}