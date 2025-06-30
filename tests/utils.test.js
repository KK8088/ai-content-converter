/**
 * 工具函数测试
 */

describe('Utils 工具函数', () => {
    
    describe('字符串工具', () => {
        it('应该正确转义HTML', () => {
            const input = '<script>alert("xss")</script>';
            const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
            expect(Utils.string.escapeHtml(input)).toBe(expected);
        });

        it('应该正确生成文件名', () => {
            const content = '# 测试标题\n这是一些内容';
            const format = 'docx';
            const fileName = Utils.string.generateFileName(content, format);
            
            expect(fileName).toContain('测试标题');
            expect(fileName).toContain('.docx');
        });

        it('应该正确截断长文本', () => {
            const longText = 'a'.repeat(100);
            const truncated = Utils.string.truncate(longText, 50);
            
            expect(truncated.length).toBeLessThan(55); // 包含省略号
            expect(truncated).toContain('...');
        });

        it('应该正确清理文本', () => {
            const dirtyText = '  \n\t  测试文本  \n\t  ';
            const cleaned = Utils.string.clean(dirtyText);
            
            expect(cleaned).toBe('测试文本');
        });
    });

    describe('数组工具', () => {
        it('应该正确去重数组', () => {
            const input = [1, 2, 2, 3, 3, 3, 4];
            const expected = [1, 2, 3, 4];
            expect(Utils.array.unique(input)).toEqual(expected);
        });

        it('应该正确分块数组', () => {
            const input = [1, 2, 3, 4, 5, 6, 7, 8];
            const chunks = Utils.array.chunk(input, 3);
            
            expect(chunks).toHaveLength(3);
            expect(chunks[0]).toEqual([1, 2, 3]);
            expect(chunks[1]).toEqual([4, 5, 6]);
            expect(chunks[2]).toEqual([7, 8]);
        });

        it('应该正确扁平化数组', () => {
            const input = [1, [2, 3], [4, [5, 6]]];
            const flattened = Utils.array.flatten(input);
            
            expect(flattened).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    describe('对象工具', () => {
        it('应该正确合并对象', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { b: 3, c: 4 };
            const merged = Utils.object.merge(obj1, obj2);
            
            expect(merged).toEqual({ a: 1, b: 3, c: 4 });
        });

        it('应该正确获取嵌套属性', () => {
            const obj = { a: { b: { c: 'value' } } };
            const value = Utils.object.get(obj, 'a.b.c');
            
            expect(value).toBe('value');
        });

        it('应该在属性不存在时返回默认值', () => {
            const obj = { a: 1 };
            const value = Utils.object.get(obj, 'b.c.d', 'default');
            
            expect(value).toBe('default');
        });
    });

    describe('验证工具', () => {
        it('应该正确验证邮箱', () => {
            expect(Utils.validation.isEmail('test@example.com')).toBeTrue();
            expect(Utils.validation.isEmail('invalid-email')).toBeFalse();
            expect(Utils.validation.isEmail('')).toBeFalse();
        });

        it('应该正确验证URL', () => {
            expect(Utils.validation.isUrl('https://example.com')).toBeTrue();
            expect(Utils.validation.isUrl('http://example.com')).toBeTrue();
            expect(Utils.validation.isUrl('invalid-url')).toBeFalse();
            expect(Utils.validation.isUrl('')).toBeFalse();
        });

        it('应该正确验证空值', () => {
            expect(Utils.validation.isEmpty('')).toBeTrue();
            expect(Utils.validation.isEmpty(null)).toBeTrue();
            expect(Utils.validation.isEmpty(undefined)).toBeTrue();
            expect(Utils.validation.isEmpty([])).toBeTrue();
            expect(Utils.validation.isEmpty({})).toBeTrue();
            expect(Utils.validation.isEmpty('test')).toBeFalse();
            expect(Utils.validation.isEmpty([1])).toBeFalse();
            expect(Utils.validation.isEmpty({ a: 1 })).toBeFalse();
        });
    });

    describe('存储工具', () => {
        beforeEach(() => {
            // 清空localStorage
            localStorage.clear();
        });

        it('应该正确存储和获取数据', () => {
            const testData = { name: 'test', value: 123 };
            
            Utils.storage.set('testKey', testData);
            const retrieved = Utils.storage.get('testKey');
            
            expect(retrieved).toEqual(testData);
        });

        it('应该在键不存在时返回默认值', () => {
            const defaultValue = 'default';
            const value = Utils.storage.get('nonexistent', defaultValue);
            
            expect(value).toBe(defaultValue);
        });

        it('应该正确删除存储项', () => {
            Utils.storage.set('testKey', 'testValue');
            Utils.storage.remove('testKey');
            
            const value = Utils.storage.get('testKey', 'default');
            expect(value).toBe('default');
        });
    });

    describe('日期工具', () => {
        it('应该正确格式化日期', () => {
            const date = new Date('2025-06-30T12:00:00Z');
            const formatted = Utils.date.format(date, 'YYYY-MM-DD');
            
            expect(formatted).toContain('2025');
            expect(formatted).toContain('06');
            expect(formatted).toContain('30');
        });

        it('应该正确计算相对时间', () => {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            
            const relativeTime = Utils.date.getRelativeTime(oneHourAgo);
            expect(relativeTime).toContain('小时前');
        });
    });

    describe('防抖和节流', () => {
        it('防抖函数应该正确工作', (done) => {
            let callCount = 0;
            const debouncedFn = Utils.debounce(() => {
                callCount++;
            }, 100);

            // 快速调用多次
            debouncedFn();
            debouncedFn();
            debouncedFn();

            // 立即检查，应该还没有执行
            expect(callCount).toBe(0);

            // 等待防抖时间后检查
            setTimeout(() => {
                expect(callCount).toBe(1);
                done();
            }, 150);
        });

        it('节流函数应该正确工作', (done) => {
            let callCount = 0;
            const throttledFn = Utils.throttle(() => {
                callCount++;
            }, 100);

            // 快速调用多次
            throttledFn(); // 应该立即执行
            throttledFn(); // 应该被节流
            throttledFn(); // 应该被节流

            // 立即检查，应该执行了一次
            expect(callCount).toBe(1);

            // 等待节流时间后再次调用
            setTimeout(() => {
                throttledFn(); // 应该可以执行
                expect(callCount).toBe(2);
                done();
            }, 150);
        });
    });

    describe('深拷贝', () => {
        it('应该正确深拷贝对象', () => {
            const original = {
                a: 1,
                b: {
                    c: 2,
                    d: [3, 4, { e: 5 }]
                },
                f: new Date('2025-06-30')
            };

            const copied = Utils.deepClone(original);

            // 检查值相等
            expect(copied).toEqual(original);

            // 检查引用不同
            expect(copied).not.toBe(original);
            expect(copied.b).not.toBe(original.b);
            expect(copied.b.d).not.toBe(original.b.d);
            expect(copied.f).not.toBe(original.f);

            // 修改拷贝不应该影响原对象
            copied.b.c = 999;
            expect(original.b.c).toBe(2);
        });
    });
});

// 运行工具函数测试的函数
async function runUtilsTests() {
    // 查找第一个非null的测试套件
    const availableSuites = testFramework.tests.filter(t => t && t.name);
    console.log('可用的工具函数测试套件:', availableSuites.map(t => t.name));

    // 运行所有工具函数相关的测试套件
    for (const suite of availableSuites) {
        if (suite.name.includes('工具') || suite.name.includes('存储') || suite.name.includes('日期') ||
            suite.name.includes('防抖') || suite.name.includes('深拷贝')) {
            await testFramework.runSuite(suite.name, 'utils-test-results');
        }
    }
}
