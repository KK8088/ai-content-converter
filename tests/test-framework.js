/**
 * 简单的测试框架
 * 用于AI内容格式转换工具的单元测试
 */

class TestFramework {
    constructor() {
        this.tests = [];
        this.currentSuite = null;
    }

    /**
     * 创建测试套件
     * @param {string} name - 套件名称
     * @param {Function} fn - 测试函数
     */
    describe(name, fn) {
        this.currentSuite = {
            name: name,
            tests: [],
            beforeEach: null,
            afterEach: null
        };
        
        fn();
        this.tests.push(this.currentSuite);
        this.currentSuite = null;
    }

    /**
     * 创建测试用例
     * @param {string} description - 测试描述
     * @param {Function} fn - 测试函数
     */
    it(description, fn) {
        if (!this.currentSuite) {
            throw new Error('测试用例必须在describe块中定义');
        }
        
        this.currentSuite.tests.push({
            description: description,
            fn: fn,
            status: 'pending'
        });
    }

    /**
     * 设置每个测试前的准备工作
     * @param {Function} fn - 准备函数
     */
    beforeEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = fn;
        }
    }

    /**
     * 设置每个测试后的清理工作
     * @param {Function} fn - 清理函数
     */
    afterEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = fn;
        }
    }

    /**
     * 运行指定套件的测试
     * @param {string} suiteName - 套件名称
     * @param {string} containerId - 结果容器ID
     */
    async runSuite(suiteName, containerId) {
        const suite = this.tests.find(s => s && s.name === suiteName);
        if (!suite) {
            console.error(`找不到测试套件: ${suiteName}`);
            console.log('可用的测试套件:', this.tests.map(t => t ? t.name : 'null'));
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`找不到容器: ${containerId}`);
            return;
        }

        console.log(`🧪 运行测试套件: ${suiteName}`);

        for (const test of suite.tests) {
            // 创建测试用例显示元素
            const testElement = document.createElement('div');
            testElement.className = 'test-case running';
            testElement.innerHTML = `
                <span class="test-result running">⏳</span>
                <span class="test-description">${test.description}</span>
            `;
            container.appendChild(testElement);

            testResults.total++;
            testResults.running++;

            try {
                // 执行beforeEach
                if (suite.beforeEach) {
                    await suite.beforeEach();
                }

                // 执行测试
                await test.fn();

                // 测试通过
                test.status = 'passed';
                testElement.className = 'test-case passed';
                testElement.querySelector('.test-result').textContent = '✅';
                testElement.querySelector('.test-result').className = 'test-result passed';
                
                testResults.passed++;
                testResults.running--;

                console.log(`✅ ${test.description}`);

            } catch (error) {
                // 测试失败
                test.status = 'failed';
                test.error = error;
                
                testElement.className = 'test-case failed';
                testElement.querySelector('.test-result').textContent = '❌';
                testElement.querySelector('.test-result').className = 'test-result failed';
                
                // 添加错误详情
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-details';
                errorDiv.textContent = `错误: ${error.message}\n${error.stack || ''}`;
                testElement.appendChild(errorDiv);
                
                testResults.failed++;
                testResults.running--;

                console.error(`❌ ${test.description}:`, error);

            } finally {
                // 执行afterEach
                if (suite.afterEach) {
                    try {
                        await suite.afterEach();
                    } catch (cleanupError) {
                        console.warn('清理函数执行失败:', cleanupError);
                    }
                }
            }

            // 添加小延迟，让UI更新更平滑
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log(`📊 套件 ${suiteName} 完成: ${suite.tests.filter(t => t.status === 'passed').length}/${suite.tests.length} 通过`);
    }

    /**
     * 清空所有测试
     */
    clear() {
        this.tests = [];
        this.currentSuite = null;
    }
}

// 断言函数
const expect = (actual) => {
    return {
        toBe: (expected) => {
            if (actual !== expected) {
                throw new Error(`期望 ${expected}，但得到 ${actual}`);
            }
        },
        
        toEqual: (expected) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`期望 ${JSON.stringify(expected)}，但得到 ${JSON.stringify(actual)}`);
            }
        },
        
        toBeTrue: () => {
            if (actual !== true) {
                throw new Error(`期望 true，但得到 ${actual}`);
            }
        },
        
        toBeFalse: () => {
            if (actual !== false) {
                throw new Error(`期望 false，但得到 ${actual}`);
            }
        },
        
        toBeNull: () => {
            if (actual !== null) {
                throw new Error(`期望 null，但得到 ${actual}`);
            }
        },
        
        toBeUndefined: () => {
            if (actual !== undefined) {
                throw new Error(`期望 undefined，但得到 ${actual}`);
            }
        },
        
        toContain: (expected) => {
            if (!actual.includes(expected)) {
                throw new Error(`期望包含 ${expected}，但在 ${actual} 中未找到`);
            }
        },
        
        toHaveLength: (expected) => {
            if (actual.length !== expected) {
                throw new Error(`期望长度为 ${expected}，但得到 ${actual.length}`);
            }
        },
        
        toBeGreaterThan: (expected) => {
            if (actual <= expected) {
                throw new Error(`期望大于 ${expected}，但得到 ${actual}`);
            }
        },
        
        toBeLessThan: (expected) => {
            if (actual >= expected) {
                throw new Error(`期望小于 ${expected}，但得到 ${actual}`);
            }
        },
        
        toThrow: () => {
            if (typeof actual !== 'function') {
                throw new Error('toThrow 只能用于函数');
            }
            
            let threw = false;
            try {
                actual();
            } catch (e) {
                threw = true;
            }
            
            if (!threw) {
                throw new Error('期望函数抛出异常，但没有抛出');
            }
        }
    };
};

// 创建全局测试框架实例
const testFramework = new TestFramework();

// 导出全局函数
window.describe = testFramework.describe.bind(testFramework);
window.it = testFramework.it.bind(testFramework);
window.beforeEach = testFramework.beforeEach.bind(testFramework);
window.afterEach = testFramework.afterEach.bind(testFramework);
window.expect = expect;
window.testFramework = testFramework;
