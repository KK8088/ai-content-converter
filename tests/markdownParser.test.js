/**
 * Markdown解析器测试
 */

describe('MarkdownParser Markdown解析器', () => {
    let parser;

    beforeEach(() => {
        parser = new MarkdownParser();
    });

    describe('基础解析功能', () => {
        it('应该正确解析标题', () => {
            const content = `
# 一级标题
## 二级标题
### 三级标题
            `.trim();

            const elements = parser.parseMarkdown(content);
            const headings = elements.filter(el => el.type === 'heading');

            expect(headings).toHaveLength(3);
            expect(headings[0].level).toBe(1);
            expect(headings[0].text).toBe('一级标题');
            expect(headings[1].level).toBe(2);
            expect(headings[1].text).toBe('二级标题');
            expect(headings[2].level).toBe(3);
            expect(headings[2].text).toBe('三级标题');
        });

        it('应该正确解析段落', () => {
            const content = `
这是第一个段落。

这是第二个段落，包含**粗体**和*斜体*文本。

这是第三个段落。
            `.trim();

            const elements = parser.parseMarkdown(content);
            const paragraphs = elements.filter(el => el.type === 'paragraph');

            expect(paragraphs.length).toBeGreaterThan(0);
            expect(paragraphs[0].content).toContain('第一个段落');
        });

        it('应该正确解析列表', () => {
            const content = `
- 无序列表项1
- 无序列表项2
- 无序列表项3

1. 有序列表项1
2. 有序列表项2
3. 有序列表项3
            `.trim();

            const elements = parser.parseMarkdown(content);
            const lists = elements.filter(el => el.type === 'list');

            expect(lists.length).toBeGreaterThan(0);
            
            // 检查无序列表
            const unorderedList = lists.find(list => list.ordered === false);
            expect(unorderedList).toBeDefined();
            expect(unorderedList.items.length).toBe(3);

            // 检查有序列表
            const orderedList = lists.find(list => list.ordered === true);
            expect(orderedList).toBeDefined();
            expect(orderedList.items.length).toBe(3);
        });

        it('应该正确解析表格', () => {
            const content = `
| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25 | 北京 |
| 李四 | 30 | 上海 |
| 王五 | 28 | 广州 |
            `.trim();

            const elements = parser.parseMarkdown(content);
            const tables = elements.filter(el => el.type === 'table');

            expect(tables).toHaveLength(1);
            
            const table = tables[0];
            expect(table.headers).toEqual(['姓名', '年龄', '城市']);
            expect(table.rows).toHaveLength(3);
            expect(table.rows[0]).toEqual(['张三', '25', '北京']);
        });

        it('应该正确解析代码块', () => {
            const content = `
\`\`\`javascript
function hello() {
    console.log('Hello World');
}
\`\`\`

\`\`\`python
def hello():
    print("Hello World")
\`\`\`
            `.trim();

            const elements = parser.parseMarkdown(content);
            const codeBlocks = elements.filter(el => el.type === 'code');

            expect(codeBlocks).toHaveLength(2);
            
            expect(codeBlocks[0].language).toBe('javascript');
            expect(codeBlocks[0].content).toContain('function hello()');
            
            expect(codeBlocks[1].language).toBe('python');
            expect(codeBlocks[1].content).toContain('def hello():');
        });

        it('应该正确解析引用块', () => {
            const content = `
> 这是一个引用块
> 包含多行内容
> 
> 这是引用的第二段

> 这是另一个引用块
            `.trim();

            const elements = parser.parseMarkdown(content);
            const quotes = elements.filter(el => el.type === 'quote');

            expect(quotes.length).toBeGreaterThan(0);
            expect(quotes[0].content).toContain('这是一个引用块');
        });
    });

    describe('复杂解析场景', () => {
        it('应该正确解析嵌套列表', () => {
            const content = `
- 主列表项1
  - 子列表项1.1
  - 子列表项1.2
- 主列表项2
  - 子列表项2.1
    - 子子列表项2.1.1
- 主列表项3
            `.trim();

            const elements = parser.parseMarkdown(content);
            const lists = elements.filter(el => el.type === 'list');

            expect(lists.length).toBeGreaterThan(0);
            
            // 检查是否正确处理了嵌套结构
            const mainList = lists[0];
            expect(mainList.items.length).toBe(3);
        });

        it('应该正确解析混合内容', () => {
            const content = `
# 项目文档

## 概述

这是项目的概述部分。

## 功能列表

- 功能1：基础功能
- 功能2：高级功能
- 功能3：扩展功能

## 数据统计

| 指标 | 数值 | 说明 |
|------|------|------|
| 用户数 | 1000 | 活跃用户 |
| 访问量 | 5000 | 日访问量 |

## 代码示例

\`\`\`javascript
const app = {
    name: 'AI转换工具',
    version: '1.4.0'
};
\`\`\`

> 注意：这是一个重要的提示信息。
            `.trim();

            const elements = parser.parseMarkdown(content);

            // 检查是否包含所有类型的元素
            const types = elements.map(el => el.type);
            expect(types).toContain('heading');
            expect(types).toContain('paragraph');
            expect(types).toContain('list');
            expect(types).toContain('table');
            expect(types).toContain('code');
            expect(types).toContain('quote');
        });
    });

    describe('表格解析专项测试', () => {
        it('应该正确解析标准Markdown表格', () => {
            const content = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A1 | B1 | C1 |
| A2 | B2 | C2 |
            `.trim();

            const elements = parser.parseMarkdown(content);
            const table = elements.find(el => el.type === 'table');

            expect(table).toBeDefined();
            expect(table.headers).toEqual(['列1', '列2', '列3']);
            expect(table.rows).toHaveLength(2);
        });

        it('应该正确解析不规则表格', () => {
            const content = `
| 姓名 | 年龄 | 城市 |
| 张三 | 25 | 北京 |
| 李四 | 30 |
| 王五 | | 广州 |
            `.trim();

            const elements = parser.parseMarkdown(content);
            const table = elements.find(el => el.type === 'table');

            expect(table).toBeDefined();
            expect(table.headers).toEqual(['姓名', '年龄', '城市']);
            expect(table.rows).toHaveLength(3);
        });

        it('应该正确处理表格中的特殊字符', () => {
            const content = `
| 名称 | 价格 | 描述 |
|------|------|------|
| 产品A | ¥99.99 | 高质量产品 |
| 产品B | $50.00 | 特价商品 |
| 产品C | €75.50 | 进口商品 |
            `.trim();

            const elements = parser.parseMarkdown(content);
            const table = elements.find(el => el.type === 'table');

            expect(table).toBeDefined();
            expect(table.rows[0]).toContain('¥99.99');
            expect(table.rows[1]).toContain('$50.00');
            expect(table.rows[2]).toContain('€75.50');
        });
    });

    describe('边界情况处理', () => {
        it('应该处理空内容', () => {
            const elements = parser.parseMarkdown('');
            expect(elements).toEqual([]);
        });

        it('应该处理只有空白字符的内容', () => {
            const elements = parser.parseMarkdown('   \n\n\t  ');
            expect(elements).toEqual([]);
        });

        it('应该处理单行内容', () => {
            const elements = parser.parseMarkdown('单行文本');
            expect(elements).toHaveLength(1);
            expect(elements[0].type).toBe('paragraph');
        });

        it('应该正确处理特殊字符', () => {
            const content = '包含特殊字符的文本：@#$%^&*()_+{}|:"<>?[]\\;\',./ 测试';
            const elements = parser.parseMarkdown(content);
            
            expect(elements).toHaveLength(1);
            expect(elements[0].type).toBe('paragraph');
            expect(elements[0].content).toBe(content);
        });
    });

    describe('行内格式处理', () => {
        it('应该正确处理粗体和斜体', () => {
            const content = '这是**粗体**文本和*斜体*文本的示例。';
            const elements = parser.parseMarkdown(content);
            
            expect(elements).toHaveLength(1);
            expect(elements[0].content).toContain('**粗体**');
            expect(elements[0].content).toContain('*斜体*');
        });

        it('应该正确处理行内代码', () => {
            const content = '使用 `console.log()` 函数输出信息。';
            const elements = parser.parseMarkdown(content);
            
            expect(elements).toHaveLength(1);
            expect(elements[0].content).toContain('`console.log()`');
        });

        it('应该正确处理链接', () => {
            const content = '访问 [GitHub](https://github.com) 了解更多信息。';
            const elements = parser.parseMarkdown(content);
            
            expect(elements).toHaveLength(1);
            expect(elements[0].content).toContain('[GitHub](https://github.com)');
        });
    });

    describe('分隔线处理', () => {
        it('应该正确识别分隔线', () => {
            const content = `
段落1

---

段落2
            `.trim();

            const elements = parser.parseMarkdown(content);
            const separators = elements.filter(el => el.type === 'separator');
            
            expect(separators).toHaveLength(1);
        });
    });
});

// 运行Markdown解析器测试的函数
async function runMarkdownParserTests() {
    // 查找解析器相关的测试套件
    const availableSuites = testFramework.tests.filter(t => t && t.name);
    console.log('可用的解析器测试套件:', availableSuites.map(t => t.name));

    // 运行所有解析器相关的测试套件
    for (const suite of availableSuites) {
        if (suite.name.includes('解析') || suite.name.includes('表格') || suite.name.includes('格式')) {
            await testFramework.runSuite(suite.name, 'parser-test-results');
        }
    }
}
