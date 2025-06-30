#!/usr/bin/env node

/**
 * 项目验证脚本
 * 检查项目完整性、文件结构、版本一致性等
 */

const fs = require('fs');
const path = require('path');

class ProjectValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.projectRoot = process.cwd();
    }

    /**
     * 运行所有验证
     */
    async validate() {
        console.log('🔍 开始项目验证...\n');

        // 检查文件结构
        this.validateFileStructure();
        
        // 检查版本一致性
        this.validateVersionConsistency();
        
        // 检查配置文件
        this.validateConfigFiles();
        
        // 检查代码质量
        this.validateCodeQuality();
        
        // 检查文档完整性
        this.validateDocumentation();
        
        // 输出结果
        this.outputResults();
        
        // 返回验证结果
        return {
            success: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            info: this.info
        };
    }

    /**
     * 验证文件结构
     */
    validateFileStructure() {
        console.log('📁 检查文件结构...');
        
        const requiredFiles = [
            'index.html',
            'package.json',
            'README.md',
            'LICENSE',
            'CHANGELOG.md',
            'js/app.js',
            'js/config.js',
            'js/utils.js',
            'js/contentDetector.js',
            'js/markdownParser.js',
            'js/errorHandler.js',
            'js/performanceMonitor.js',
            'css/styles.css',
            'css/themes.css'
        ];

        const requiredDirectories = [
            'js',
            'css',
            'tests',
            'tools'
        ];

        // 检查必需文件
        for (const file of requiredFiles) {
            const filePath = path.join(this.projectRoot, file);
            if (!fs.existsSync(filePath)) {
                this.errors.push(`缺少必需文件: ${file}`);
            } else {
                this.info.push(`✅ 文件存在: ${file}`);
            }
        }

        // 检查必需目录
        for (const dir of requiredDirectories) {
            const dirPath = path.join(this.projectRoot, dir);
            if (!fs.existsSync(dirPath)) {
                this.errors.push(`缺少必需目录: ${dir}`);
            } else {
                this.info.push(`✅ 目录存在: ${dir}`);
            }
        }

        // 检查测试文件
        const testFiles = [
            'tests/test-runner.html',
            'tests/test-framework.js',
            'tests/utils.test.js',
            'tests/contentDetector.test.js',
            'tests/markdownParser.test.js',
            'tests/integration.test.js'
        ];

        for (const testFile of testFiles) {
            const filePath = path.join(this.projectRoot, testFile);
            if (!fs.existsSync(filePath)) {
                this.warnings.push(`缺少测试文件: ${testFile}`);
            } else {
                this.info.push(`✅ 测试文件存在: ${testFile}`);
            }
        }
    }

    /**
     * 验证版本一致性
     */
    validateVersionConsistency() {
        console.log('🔢 检查版本一致性...');
        
        try {
            // 读取package.json版本
            const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
            const packageVersion = packageJson.version;
            
            // 读取config.js版本
            const configPath = path.join(this.projectRoot, 'js/config.js');
            if (fs.existsSync(configPath)) {
                const configContent = fs.readFileSync(configPath, 'utf8');
                const versionMatch = configContent.match(/version:\s*['"`]([^'"`]+)['"`]/);
                const configVersion = versionMatch ? versionMatch[1] : null;
                
                if (configVersion && configVersion !== packageVersion) {
                    this.errors.push(`版本不一致: package.json(${packageVersion}) vs config.js(${configVersion})`);
                } else if (configVersion) {
                    this.info.push(`✅ 版本一致: ${packageVersion}`);
                }
            }
            
            // 检查index.html中的版本
            const indexPath = path.join(this.projectRoot, 'index.html');
            if (fs.existsSync(indexPath)) {
                const indexContent = fs.readFileSync(indexPath, 'utf8');
                const versionMatch = indexContent.match(/v(\d+\.\d+\.\d+)/);
                const indexVersion = versionMatch ? versionMatch[1] : null;
                
                if (indexVersion && indexVersion !== packageVersion) {
                    this.errors.push(`版本不一致: package.json(${packageVersion}) vs index.html(${indexVersion})`);
                } else if (indexVersion) {
                    this.info.push(`✅ HTML版本一致: ${indexVersion}`);
                }
            }
            
        } catch (error) {
            this.errors.push(`版本检查失败: ${error.message}`);
        }
    }

    /**
     * 验证配置文件
     */
    validateConfigFiles() {
        console.log('⚙️ 检查配置文件...');
        
        // 检查package.json
        try {
            const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
            
            const requiredFields = ['name', 'version', 'description', 'author', 'license'];
            for (const field of requiredFields) {
                if (!packageJson[field]) {
                    this.warnings.push(`package.json缺少字段: ${field}`);
                } else {
                    this.info.push(`✅ package.json包含: ${field}`);
                }
            }
            
            // 检查脚本
            if (!packageJson.scripts || !packageJson.scripts.start) {
                this.warnings.push('package.json缺少start脚本');
            }
            
        } catch (error) {
            this.errors.push(`package.json解析失败: ${error.message}`);
        }

        // 检查.gitignore
        const gitignorePath = path.join(this.projectRoot, '.gitignore');
        if (!fs.existsSync(gitignorePath)) {
            this.warnings.push('缺少.gitignore文件');
        } else {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
            const requiredIgnores = ['node_modules/', '.DS_Store', '*.log'];
            
            for (const ignore of requiredIgnores) {
                if (!gitignoreContent.includes(ignore)) {
                    this.warnings.push(`.gitignore缺少: ${ignore}`);
                }
            }
        }
    }

    /**
     * 验证代码质量
     */
    validateCodeQuality() {
        console.log('🔍 检查代码质量...');
        
        const jsFiles = [
            'js/app.js',
            'js/config.js',
            'js/utils.js',
            'js/contentDetector.js',
            'js/markdownParser.js',
            'js/errorHandler.js',
            'js/performanceMonitor.js'
        ];

        for (const jsFile of jsFiles) {
            const filePath = path.join(this.projectRoot, jsFile);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // 检查基本代码质量
                if (content.includes('console.log(')) {
                    this.warnings.push(`${jsFile} 包含console.log语句`);
                }
                
                if (content.includes('alert(')) {
                    this.warnings.push(`${jsFile} 包含alert语句`);
                }
                
                if (content.includes('eval(')) {
                    this.errors.push(`${jsFile} 包含危险的eval语句`);
                }
                
                // 检查文件头注释
                if (!content.startsWith('/**')) {
                    this.warnings.push(`${jsFile} 缺少文件头注释`);
                }
                
                // 检查文件大小
                const stats = fs.statSync(filePath);
                if (stats.size > 100000) { // 100KB
                    this.warnings.push(`${jsFile} 文件过大 (${Math.round(stats.size/1024)}KB)`);
                }
                
                this.info.push(`✅ 代码文件检查: ${jsFile}`);
            }
        }
    }

    /**
     * 验证文档完整性
     */
    validateDocumentation() {
        console.log('📚 检查文档完整性...');
        
        // 检查README.md
        const readmePath = path.join(this.projectRoot, 'README.md');
        if (fs.existsSync(readmePath)) {
            const readmeContent = fs.readFileSync(readmePath, 'utf8');
            
            const requiredSections = [
                '# ',           // 标题
                '## ',          // 二级标题
                '功能特色',      // 功能说明
                '快速开始',      // 使用指南
                '安装',         // 安装说明
                'LICENSE'       // 许可证
            ];
            
            for (const section of requiredSections) {
                if (!readmeContent.includes(section)) {
                    this.warnings.push(`README.md缺少部分: ${section}`);
                }
            }
            
            // 检查README长度
            if (readmeContent.length < 1000) {
                this.warnings.push('README.md内容过少，建议补充更多信息');
            }
            
            this.info.push('✅ README.md存在且包含基本内容');
        }

        // 检查CHANGELOG.md
        const changelogPath = path.join(this.projectRoot, 'CHANGELOG.md');
        if (fs.existsSync(changelogPath)) {
            const changelogContent = fs.readFileSync(changelogPath, 'utf8');
            
            if (!changelogContent.includes('## [')) {
                this.warnings.push('CHANGELOG.md格式不标准');
            }
            
            this.info.push('✅ CHANGELOG.md存在');
        }

        // 检查LICENSE
        const licensePath = path.join(this.projectRoot, 'LICENSE');
        if (fs.existsSync(licensePath)) {
            this.info.push('✅ LICENSE文件存在');
        } else {
            this.warnings.push('缺少LICENSE文件');
        }
    }

    /**
     * 输出验证结果
     */
    outputResults() {
        console.log('\n📊 验证结果:');
        console.log('='.repeat(50));
        
        if (this.errors.length > 0) {
            console.log('\n❌ 错误:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️ 警告:');
            this.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
        
        if (this.info.length > 0) {
            console.log('\n✅ 信息:');
            this.info.forEach(info => console.log(`  - ${info}`));
        }
        
        console.log('\n📈 统计:');
        console.log(`  - 错误: ${this.errors.length}`);
        console.log(`  - 警告: ${this.warnings.length}`);
        console.log(`  - 信息: ${this.info.length}`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 项目验证通过！');
        } else {
            console.log('\n💥 项目验证失败，请修复错误后重试');
        }
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const validator = new ProjectValidator();
    validator.validate().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('验证过程出错:', error);
        process.exit(1);
    });
}

module.exports = ProjectValidator;
