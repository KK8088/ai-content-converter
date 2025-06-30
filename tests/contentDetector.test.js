/**
 * 内容检测器测试
 */

describe('ContentDetector 内容检测器', () => {
    let detector;

    beforeEach(() => {
        detector = new ContentDetector();
    });

    describe('基础内容类型检测', () => {
        it('应该正确检测表格内容', () => {
            const tableContent = `
| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25 | 北京 |
| 李四 | 30 | 上海 |
            `.trim();

            const result = detector.detectContentType(tableContent);
            expect(result).toBe('table');
        });

        it('应该正确检测Markdown内容', () => {
            const markdownContent = `
# 标题

这是一个**粗体**文本和*斜体*文本。

## 子标题

- 列表项1
- 列表项2

> 这是一个引用块

\`\`\`javascript
console.log('Hello World');
\`\`\`
            `.trim();

            const result = detector.detectContentType(markdownContent);
            expect(result).toBe('markdown');
        });

        it('应该正确检测列表内容', () => {
            const listContent = `
- 第一项
- 第二项
- 第三项
  - 子项1
  - 子项2
- 第四项

1. 有序列表项1
2. 有序列表项2
3. 有序列表项3
            `.trim();

            const result = detector.detectContentType(listContent);
            expect(result).toBe('list');
        });

        it('应该正确检测普通文章', () => {
            const articleContent = `
这是一篇普通的文章内容。文章包含多个段落，但没有特殊的格式标记。

这是第二个段落。文章内容比较简单，主要是纯文本。

这是第三个段落，继续描述文章的内容。
            `.trim();

            const result = detector.detectContentType(articleContent);
            expect(result).toBe('article');
        });
    });

    describe('复杂内容检测', () => {
        it('应该正确检测混合内容', () => {
            const mixedContent = `
# 项目报告

## 数据统计

| 指标 | 数值 | 增长率 |
|------|------|--------|
| 用户数 | 1000 | +15% |
| 收入 | ¥50万 | +20% |

## 代码示例

\`\`\`javascript
function test() {
    return 'Hello World';
}
\`\`\`

## 要点列表

- 重要发现1
- 重要发现2
- 重要发现3
            `.trim();

            const result = detector.detectContentType(mixedContent);
            // 混合内容应该被识别为markdown或table，取决于哪个特征更突出
            expect(['markdown', 'table']).toContain(result);
        });

        it('应该正确检测AI对话内容', () => {
            const conversationContent = `
用户: 请帮我分析一下这个数据

AI: 好的，我来为您分析这个数据。根据您提供的信息：

1. 数据趋势显示上升
2. 增长率为15%
3. 预期下个月会继续增长

用户: 那有什么建议吗？

AI: 基于分析结果，我建议：
- 继续当前策略
- 加大投入力度
- 监控关键指标
            `.trim();

            const result = detector.detectContentType(conversationContent);
            // AI对话可能被识别为list或article
            expect(['list', 'article', 'markdown']).toContain(result);
        });
    });

    describe('边界情况处理', () => {
        it('应该处理空内容', () => {
            expect(detector.detectContentType('')).toBe('article');
            expect(detector.detectContentType('   ')).toBe('article');
            expect(detector.detectContentType('\n\n\n')).toBe('article');
        });

        it('应该处理单行内容', () => {
            expect(detector.detectContentType('单行文本')).toBe('article');
            expect(detector.detectContentType('# 单行标题')).toBe('markdown');
            expect(detector.detectContentType('- 单行列表')).toBe('list');
        });

        it('应该处理特殊字符', () => {
            const specialContent = '特殊字符：@#$%^&*()_+{}|:"<>?[]\\;\',./ 测试';
            const result = detector.detectContentType(specialContent);
            expect(result).toBe('article');
        });
    });

    describe('内容结构分析', () => {
        it('应该正确分析内容结构', () => {
            const content = `
# 主标题

## 子标题1

这是一个段落。

| 表格 | 数据 |
|------|------|
| A | 1 |
| B | 2 |

### 子标题2

- 列表项1
- 列表项2

\`\`\`javascript
console.log('代码');
\`\`\`

> 引用内容

[链接](https://example.com)

![图片](image.jpg)
            `.trim();

            const structure = detector.analyzeContentStructure(content);

            expect(structure.headings.length).toBeGreaterThan(0);
            expect(structure.tables.length).toBeGreaterThan(0);
            expect(structure.lists.length).toBeGreaterThan(0);
            expect(structure.codeBlocks.length).toBeGreaterThan(0);
            expect(structure.quotes.length).toBeGreaterThan(0);
            expect(structure.links.length).toBeGreaterThan(0);
            expect(structure.images.length).toBeGreaterThan(0);
        });

        it('应该正确计算内容复杂度', () => {
            const simpleContent = '简单的文本内容';
            const complexContent = `
# 标题
## 子标题
### 三级标题

| 表格1 | 数据 |
|-------|------|
| A | 1 |

| 表格2 | 数据 |
|-------|------|
| B | 2 |

\`\`\`js
code1();
\`\`\`

\`\`\`python
code2()
\`\`\`

- 列表1
- 列表2

> 引用1
> 引用2

[链接1](url1) [链接2](url2)
![图片1](img1) ![图片2](img2) ![图片3](img3)
            `.trim();

            const simpleStructure = detector.analyzeContentStructure(simpleContent);
            const complexStructure = detector.analyzeContentStructure(complexContent);

            const simpleComplexity = detector.calculateComplexity(simpleStructure);
            const complexComplexity = detector.calculateComplexity(complexStructure);

            expect(simpleComplexity).toBe('simple');
            expect(complexComplexity).toBe('complex');
        });
    });

    describe('特殊格式检测', () => {
        it('应该检测CSV格式', () => {
            const csvContent = `
姓名,年龄,城市
张三,25,北京
李四,30,上海
王五,28,广州
            `.trim();

            expect(detector.isSimpleCSV(csvContent)).toBeTrue();
        });

        it('应该检测表格分隔符', () => {
            const separatorLine = '|------|------|------|';
            expect(detector.isTableSeparator(separatorLine)).toBeTrue();

            const normalLine = '这是普通文本';
            expect(detector.isTableSeparator(normalLine)).toBeFalse();
        });

        it('应该检测代码块', () => {
            const codeContent = `
\`\`\`javascript
function hello() {
    console.log('Hello World');
}
\`\`\`
            `.trim();

            expect(detector.hasCodeBlocks(codeContent)).toBeTrue();

            const normalContent = '普通文本内容';
            expect(detector.hasCodeBlocks(normalContent)).toBeFalse();
        });
    });

    describe('数据类型识别', () => {
        it('应该识别货币格式', () => {
            expect(detector.isCurrency('¥1,234.56')).toBeTrue();
            expect(detector.isCurrency('$999.99')).toBeTrue();
            expect(detector.isCurrency('€850.00')).toBeTrue();
            expect(detector.isCurrency('普通文本')).toBeFalse();
        });

        it('应该识别百分比格式', () => {
            expect(detector.isPercentage('15.6%')).toBeTrue();
            expect(detector.isPercentage('-8.2%')).toBeTrue();
            expect(detector.isPercentage('+23.8%')).toBeTrue();
            expect(detector.isPercentage('普通文本')).toBeFalse();
        });

        it('应该识别日期格式', () => {
            expect(detector.isDate('2025-06-30')).toBeTrue();
            expect(detector.isDate('2025年6月30日')).toBeTrue();
            expect(detector.isDate('06/30/2025')).toBeTrue();
            expect(detector.isDate('普通文本')).toBeFalse();
        });

        it('应该识别布尔值', () => {
            expect(detector.isBoolean('是')).toBeTrue();
            expect(detector.isBoolean('否')).toBeTrue();
            expect(detector.isBoolean('√')).toBeTrue();
            expect(detector.isBoolean('×')).toBeTrue();
            expect(detector.isBoolean('true')).toBeTrue();
            expect(detector.isBoolean('false')).toBeTrue();
            expect(detector.isBoolean('普通文本')).toBeFalse();
        });
    });
});

// 运行内容检测器测试的函数
async function runContentDetectorTests() {
    // 查找内容检测相关的测试套件
    const availableSuites = testFramework.tests.filter(t => t && t.name);
    console.log('可用的内容检测测试套件:', availableSuites.map(t => t.name));

    // 运行所有内容检测相关的测试套件
    for (const suite of availableSuites) {
        if (suite.name.includes('内容') || suite.name.includes('检测') || suite.name.includes('数据类型')) {
            await testFramework.runSuite(suite.name, 'detector-test-results');
        }
    }
}
