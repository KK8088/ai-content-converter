#!/usr/bin/env node

/**
 * 版本同步检查脚本 v1.5.5
 * 确保所有项目文件中的版本号保持同步
 */

const fs = require('fs');
const path = require('path');

class VersionSyncChecker {
    constructor() {
        this.projectRoot = process.cwd();
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.targetVersion = null;
    }

    /**
     * 运行版本同步检查
     */
    async check() {
        console.log('🔍 开始版本同步检查...\n');

        // 获取目标版本
        this.getTargetVersion();
        
        // 检查各个文件的版本
        this.checkPackageJson();
        this.checkIndexHtml();
        this.checkConfigJs();
        this.checkReadmeMd();
        this.checkReadmeEnMd();
        this.checkSecurityMd();
        
        // 输出结果
        this.outputResults();
        
        return {
            success: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            info: this.info,
            targetVersion: this.targetVersion
        };
    }

    /**
     * 获取目标版本（从package.json）
     */
    getTargetVersion() {
        try {
            const packagePath = path.join(this.projectRoot, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            this.targetVersion = packageJson.version;
            this.info.push(`🎯 目标版本: ${this.targetVersion}`);
        } catch (error) {
            this.errors.push(`无法读取package.json: ${error.message}`);
        }
    }

    /**
     * 检查package.json版本
     */
    checkPackageJson() {
        const filePath = path.join(this.projectRoot, 'package.json');
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const version = content.version;
            
            if (version === this.targetVersion) {
                this.info.push(`✅ package.json: ${version}`);
            } else {
                this.errors.push(`❌ package.json版本不匹配: ${version} (期望: ${this.targetVersion})`);
            }
        } catch (error) {
            this.errors.push(`无法检查package.json: ${error.message}`);
        }
    }

    /**
     * 检查index.html版本
     */
    checkIndexHtml() {
        const filePath = path.join(this.projectRoot, 'index.html');
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const versionMatch = content.match(/开源版\s+v([\d.]+)/);
            const version = versionMatch ? versionMatch[1] : null;
            
            if (version === this.targetVersion) {
                this.info.push(`✅ index.html: v${version}`);
            } else {
                this.errors.push(`❌ index.html版本不匹配: v${version} (期望: v${this.targetVersion})`);
            }
        } catch (error) {
            this.errors.push(`无法检查index.html: ${error.message}`);
        }
    }

    /**
     * 检查js/config.js版本
     */
    checkConfigJs() {
        const filePath = path.join(this.projectRoot, 'js/config.js');
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const versionMatch = content.match(/version:\s*['"`]([^'"`]+)['"`]/);
            const version = versionMatch ? versionMatch[1] : null;
            
            if (version === this.targetVersion) {
                this.info.push(`✅ js/config.js: ${version}`);
            } else {
                this.errors.push(`❌ js/config.js版本不匹配: ${version} (期望: ${this.targetVersion})`);
            }
        } catch (error) {
            this.errors.push(`无法检查js/config.js: ${error.message}`);
        }
    }

    /**
     * 检查README.md版本
     */
    checkReadmeMd() {
        const filePath = path.join(this.projectRoot, 'README.md');
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const versionMatch = content.match(/version-v([\d.]+)-blue/);
            const version = versionMatch ? versionMatch[1] : null;
            
            if (version === this.targetVersion) {
                this.info.push(`✅ README.md: v${version}`);
            } else {
                this.errors.push(`❌ README.md版本不匹配: v${version} (期望: v${this.targetVersion})`);
            }
        } catch (error) {
            this.errors.push(`无法检查README.md: ${error.message}`);
        }
    }

    /**
     * 检查README_EN.md版本
     */
    checkReadmeEnMd() {
        const filePath = path.join(this.projectRoot, 'README_EN.md');
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const versionMatch = content.match(/version-v([\d.]+)-blue/);
            const version = versionMatch ? versionMatch[1] : null;
            
            if (version === this.targetVersion) {
                this.info.push(`✅ README_EN.md: v${version}`);
            } else {
                this.errors.push(`❌ README_EN.md版本不匹配: v${version} (期望: v${this.targetVersion})`);
            }
        } catch (error) {
            this.errors.push(`无法检查README_EN.md: ${error.message}`);
        }
    }

    /**
     * 检查SECURITY.md版本支持
     */
    checkSecurityMd() {
        const filePath = path.join(this.projectRoot, 'SECURITY.md');
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const majorMinor = this.targetVersion.split('.').slice(0, 2).join('.');
            const supportPattern = new RegExp(`${majorMinor}\\.x.*✅\\s*支持`);
            
            if (supportPattern.test(content)) {
                this.info.push(`✅ SECURITY.md: ${majorMinor}.x 已支持`);
            } else {
                this.warnings.push(`⚠️ SECURITY.md: ${majorMinor}.x 可能需要添加到支持列表`);
            }
        } catch (error) {
            this.warnings.push(`无法检查SECURITY.md: ${error.message}`);
        }
    }

    /**
     * 输出检查结果
     */
    outputResults() {
        console.log('\n📊 版本同步检查结果:\n');
        
        // 输出信息
        if (this.info.length > 0) {
            console.log('ℹ️  信息:');
            this.info.forEach(msg => console.log(`  ${msg}`));
            console.log();
        }
        
        // 输出警告
        if (this.warnings.length > 0) {
            console.log('⚠️  警告:');
            this.warnings.forEach(msg => console.log(`  ${msg}`));
            console.log();
        }
        
        // 输出错误
        if (this.errors.length > 0) {
            console.log('❌ 错误:');
            this.errors.forEach(msg => console.log(`  ${msg}`));
            console.log();
        }
        
        // 总结
        if (this.errors.length === 0) {
            console.log('🎉 版本同步检查通过！所有文件版本一致。');
        } else {
            console.log(`💥 发现 ${this.errors.length} 个版本不一致问题，请修复后重新检查。`);
        }
        
        console.log(`\n📋 检查统计: ${this.info.length} 个文件正确, ${this.warnings.length} 个警告, ${this.errors.length} 个错误`);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const checker = new VersionSyncChecker();
    checker.check().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('检查过程中发生错误:', error);
        process.exit(1);
    });
}

module.exports = VersionSyncChecker;
