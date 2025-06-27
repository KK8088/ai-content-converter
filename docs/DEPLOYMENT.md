# 部署指南

本文档详细介绍如何将AI内容格式转换工具部署到各种平台。

## 🚀 快速部署

### 方法一：使用自动化脚本（推荐）

#### Windows用户
```bash
# 在项目根目录运行
scripts\init-git.bat
```

#### macOS/Linux用户
```bash
# 在项目根目录运行
chmod +x scripts/init-git.sh
./scripts/init-git.sh
```

### 方法二：手动部署

#### 1. 初始化Git仓库
```bash
git init
git add .
git commit -m "feat: 初始化AI内容格式转换工具开源项目"
git branch -M main
```

#### 2. 创建GitHub仓库
1. 访问 [GitHub新建仓库页面](https://github.com/new)
2. 仓库名称：`ai-content-converter`
3. 描述：`将AI对话内容完美转换为专业的Word和Excel文档`
4. 选择 **Public**（公开）
5. **不要**初始化README、.gitignore或LICENSE
6. 点击 **Create repository**

#### 3. 推送到GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-content-converter.git
git push -u origin main
```

## 🌐 GitHub Pages部署

### 自动部署（推荐）

项目已配置GitHub Actions自动部署，推送到main分支后会自动部署到GitHub Pages。

### 手动配置

1. 进入GitHub仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择：
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. 点击 **Save**
6. 等待几分钟，访问：`https://YOUR_USERNAME.github.io/ai-content-converter`

## 🐳 Docker部署

### 创建Dockerfile

```dockerfile
# 使用nginx作为基础镜像
FROM nginx:alpine

# 复制项目文件到nginx默认目录
COPY . /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 创建nginx配置

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # 启用gzip压缩
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        
        # 缓存静态资源
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # SPA路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### 构建和运行

```bash
# 构建镜像
docker build -t ai-content-converter .

# 运行容器
docker run -d -p 8080:80 --name ai-converter ai-content-converter

# 访问 http://localhost:8080
```

## ☁️ 云平台部署

### Vercel部署

1. 安装Vercel CLI
```bash
npm i -g vercel
```

2. 部署
```bash
vercel --prod
```

3. 或者通过GitHub集成：
   - 访问 [Vercel](https://vercel.com)
   - 连接GitHub账户
   - 导入仓库
   - 自动部署

### Netlify部署

1. 访问 [Netlify](https://netlify.com)
2. 点击 **New site from Git**
3. 选择GitHub并授权
4. 选择您的仓库
5. 构建设置：
   - **Build command**: `npm run build`（如果有）
   - **Publish directory**: `.`（根目录）
6. 点击 **Deploy site**

### GitHub Codespaces

1. 在GitHub仓库页面点击 **Code** > **Codespaces**
2. 点击 **Create codespace on main**
3. 等待环境启动
4. 在终端运行：
```bash
python -m http.server 8080
```
5. 点击弹出的端口转发链接

## 🔧 自定义域名

### GitHub Pages自定义域名

1. 在仓库根目录创建 `CNAME` 文件：
```
your-domain.com
```

2. 在域名DNS设置中添加CNAME记录：
```
CNAME  www  your-username.github.io
```

3. 在GitHub Pages设置中启用 **Enforce HTTPS**

### Cloudflare配置

1. 添加站点到Cloudflare
2. 配置DNS记录
3. 启用以下优化：
   - **Auto Minify**: CSS, JavaScript, HTML
   - **Brotli**: 启用
   - **Always Use HTTPS**: 启用
   - **HTTP/2**: 启用

## 📊 性能优化

### 资源压缩

```bash
# 安装压缩工具
npm install -g clean-css-cli terser

# 压缩CSS
cleancss -o dist/css/styles.min.css css/styles.css css/themes.css

# 压缩JavaScript
terser js/*.js -o dist/js/app.min.js
```

### CDN配置

更新HTML中的外部依赖为CDN链接：

```html
<!-- 使用CDN加速 -->
<script src="https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

## 🔒 安全配置

### Content Security Policy

在HTML头部添加CSP：

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self';
">
```

### HTTPS重定向

```javascript
// 强制HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace('https:' + window.location.href.substring(window.location.protocol.length));
}
```

## 📈 监控和分析

### Google Analytics

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 错误监控

```javascript
// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // 发送错误报告到监控服务
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // 发送错误报告到监控服务
});
```

## 🚨 故障排除

### 常见问题

1. **GitHub Pages 404错误**
   - 检查仓库是否为Public
   - 确认Pages设置正确
   - 等待几分钟让部署生效

2. **CORS错误**
   - 确保所有资源使用HTTPS
   - 检查CSP设置
   - 使用相对路径

3. **JavaScript错误**
   - 检查浏览器控制台
   - 确认所有依赖已加载
   - 检查文件路径

4. **样式不生效**
   - 检查CSS文件路径
   - 确认MIME类型正确
   - 清除浏览器缓存

### 调试工具

```bash
# 本地测试服务器
python -m http.server 8080

# 或使用Node.js
npx serve .

# 或使用PHP
php -S localhost:8080
```

## 📞 获取帮助

如果遇到部署问题，可以：

1. 查看 [GitHub Issues](https://github.com/your-username/ai-content-converter/issues)
2. 创建新的Issue描述问题
3. 参与 [GitHub Discussions](https://github.com/your-username/ai-content-converter/discussions)
4. 发送邮件至 support@aiconverter.com

---

**祝您部署顺利！🚀**
