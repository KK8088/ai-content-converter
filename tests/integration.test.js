/**
 * 集成测试
 * 测试各模块之间的协作和整体功能
 */

describe('Integration 集成测试', () => {
    let detector, parser;

    beforeEach(() => {
        detector = new ContentDetector();
        parser = new MarkdownParser();
    });

    describe('检测器与解析器协作', () => {
        it('检测为表格的内容应该能被正确解析', () => {
            const tableContent = `
| 产品 | 价格 | 库存 |
|------|------|------|
| iPhone | ¥6999 | 50 |
| MacBook | ¥12999 | 20 |
| iPad | ¥3999 | 100 |
            `.trim();

            // 检测内容类型
            const detectedType = detector.detectContentType(tableContent);
            expect(detectedType).toBe('table');

            // 解析内容
            const elements = parser.parseMarkdown(tableContent);
            const table = elements.find(el => el.type === 'table');

            expect(table).toBeDefined();
            expect(table.headers).toEqual(['产品', '价格', '库存']);
            expect(table.rows).toHaveLength(3);
        });

        it('检测为Markdown的内容应该能被完整解析', () => {
            const markdownContent = `
# 项目报告

## 概述
这是一个重要的项目报告。

## 数据分析
- 用户增长：**15%**
- 收入增长：*20%*
- 满意度：`95%`

## 结论
> 项目进展顺利，建议继续投入。

\`\`\`javascript
const result = {
    success: true,
    growth: 0.15
};
\`\`\`
            `.trim();

            // 检测内容类型
            const detectedType = detector.detectContentType(markdownContent);
            expect(detectedType).toBe('markdown');

            // 解析内容
            const elements = parser.parseMarkdown(markdownContent);
            
            // 验证解析结果包含所有预期元素
            const types = elements.map(el => el.type);
            expect(types).toContain('heading');
            expect(types).toContain('paragraph');
            expect(types).toContain('list');
            expect(types).toContain('quote');
            expect(types).toContain('code');
        });

        it('检测为列表的内容应该能被正确解析', () => {
            const listContent = `
任务清单：

- [ ] 完成需求分析
- [x] 设计系统架构
- [ ] 编写核心代码
- [x] 单元测试
- [ ] 集成测试
- [ ] 部署上线

优先级排序：

1. 核心功能开发
2. 性能优化
3. 用户体验改进
4. 文档完善
            `.trim();

            // 检测内容类型
            const detectedType = detector.detectContentType(listContent);
            expect(detectedType).toBe('list');

            // 解析内容
            const elements = parser.parseMarkdown(listContent);
            const lists = elements.filter(el => el.type === 'list');

            expect(lists.length).toBeGreaterThan(0);
        });
    });

    describe('内容结构分析与解析一致性', () => {
        it('结构分析结果应该与解析结果一致', () => {
            const complexContent = `
# 技术文档

## API接口

### 用户管理

| 接口 | 方法 | 描述 |
|------|------|------|
| /api/users | GET | 获取用户列表 |
| /api/users | POST | 创建用户 |

### 响应示例

\`\`\`json
{
    "code": 200,
    "data": {
        "users": []
    }
}
\`\`\`

## 注意事项

- 所有接口需要认证
- 请求频率限制：100次/分钟
- 返回数据格式：JSON

> 重要：请妥善保管API密钥
            `.trim();

            // 分析内容结构
            const structure = detector.analyzeContentStructure(complexContent);
            
            // 解析内容
            const elements = parser.parseMarkdown(complexContent);

            // 验证标题数量一致
            const headingElements = elements.filter(el => el.type === 'heading');
            expect(headingElements.length).toBe(structure.headings.length);

            // 验证表格数量一致
            const tableElements = elements.filter(el => el.type === 'table');
            expect(tableElements.length).toBe(structure.tables.length);

            // 验证代码块数量一致
            const codeElements = elements.filter(el => el.type === 'code');
            expect(codeElements.length).toBe(structure.codeBlocks.length);

            // 验证列表数量一致
            const listElements = elements.filter(el => el.type === 'list');
            expect(listElements.length).toBe(structure.lists.length);

            // 验证引用数量一致
            const quoteElements = elements.filter(el => el.type === 'quote');
            expect(quoteElements.length).toBe(structure.quotes.length);
        });
    });

    describe('数据类型识别集成', () => {
        it('应该正确识别表格中的数据类型', () => {
            const dataTable = `
| 项目 | 金额 | 增长率 | 日期 | 状态 |
|------|------|--------|------|------|
| 项目A | ¥12,345.67 | +15.5% | 2025-06-30 | 是 |
| 项目B | $9,876.54 | -8.2% | 2025-07-01 | 否 |
| 项目C | €5,432.10 | +23.8% | 2025-07-02 | √ |
            `.trim();

            // 解析表格
            const elements = parser.parseMarkdown(dataTable);
            const table = elements.find(el => el.type === 'table');

            expect(table).toBeDefined();

            // 检查数据类型识别
            const row1 = table.rows[0];
            expect(detector.isCurrency(row1[1])).toBeTrue(); // ¥12,345.67
            expect(detector.isPercentage(row1[2])).toBeTrue(); // +15.5%
            expect(detector.isDate(row1[3])).toBeTrue(); // 2025-06-30
            expect(detector.isBoolean(row1[4])).toBeTrue(); // 是

            const row2 = table.rows[1];
            expect(detector.isCurrency(row2[1])).toBeTrue(); // $9,876.54
            expect(detector.isPercentage(row2[2])).toBeTrue(); // -8.2%
            expect(detector.isDate(row2[3])).toBeTrue(); // 2025-07-01
            expect(detector.isBoolean(row2[4])).toBeTrue(); // 否
        });
    });

    describe('错误处理集成', () => {
        it('应该优雅处理格式错误的内容', () => {
            const malformedContent = `
# 标题

| 不完整的表格
| 缺少分隔符

\`\`\`
未闭合的代码块

> 不完整的引用
没有引用标记的行

- 列表项1
普通文本混在列表中
- 列表项2
            `.trim();

            // 检测应该不会抛出异常
            expect(() => {
                const type = detector.detectContentType(malformedContent);
                expect(typeof type).toBe('string');
            }).not.toThrow();

            // 解析应该不会抛出异常
            expect(() => {
                const elements = parser.parseMarkdown(malformedContent);
                expect(Array.isArray(elements)).toBeTrue();
            }).not.toThrow();
        });

        it('应该处理极大的内容', () => {
            // 生成大量内容
            const largeContent = Array(1000).fill('这是一行测试内容。').join('\n');

            expect(() => {
                const type = detector.detectContentType(largeContent);
                expect(typeof type).toBe('string');
            }).not.toThrow();

            expect(() => {
                const elements = parser.parseMarkdown(largeContent);
                expect(Array.isArray(elements)).toBeTrue();
            }).not.toThrow();
        });
    });

    describe('性能测试', () => {
        it('检测器性能应该在可接受范围内', () => {
            const testContent = `
# 性能测试内容

## 数据表格

| 序号 | 名称 | 数值 | 百分比 | 日期 |
|------|------|------|--------|------|
${Array(100).fill(0).map((_, i) => 
    `| ${i+1} | 项目${i+1} | ¥${(Math.random() * 10000).toFixed(2)} | ${(Math.random() * 100).toFixed(1)}% | 2025-06-${String(i % 30 + 1).padStart(2, '0')} |`
).join('\n')}

## 代码示例

\`\`\`javascript
${Array(50).fill(0).map((_, i) => 
    `console.log('测试行 ${i+1}');`
).join('\n')}
\`\`\`

## 列表内容

${Array(200).fill(0).map((_, i) => 
    `- 列表项 ${i+1}`
).join('\n')}
            `.trim();

            const startTime = performance.now();
            
            const detectedType = detector.detectContentType(testContent);
            const structure = detector.analyzeContentStructure(testContent);
            
            const endTime = performance.now();
            const duration = endTime - startTime;

            // 检测时间应该在合理范围内（小于1秒）
            expect(duration).toBeLessThan(1000);
            expect(typeof detectedType).toBe('string');
            expect(typeof structure).toBe('object');
        });

        it('解析器性能应该在可接受范围内', () => {
            const testContent = `
# 解析性能测试

${Array(100).fill(0).map((_, i) => `
## 章节 ${i+1}

这是第 ${i+1} 个章节的内容。

- 要点1
- 要点2
- 要点3

\`\`\`javascript
function test${i+1}() {
    return ${i+1};
}
\`\`\`
`).join('\n')}
            `.trim();

            const startTime = performance.now();
            
            const elements = parser.parseMarkdown(testContent);
            
            const endTime = performance.now();
            const duration = endTime - startTime;

            // 解析时间应该在合理范围内（小于2秒）
            expect(duration).toBeLessThan(2000);
            expect(Array.isArray(elements)).toBeTrue();
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    describe('实际使用场景模拟', () => {
        it('应该正确处理AI对话转换场景', () => {
            const aiConversation = `
用户: 请帮我分析一下这个季度的销售数据

AI助手: 好的，我来为您分析这个季度的销售数据：

## 销售数据分析

### 总体概况

| 指标 | Q1 | Q2 | Q3 | 增长率 |
|------|----|----|----|----|
| 总销售额 | ¥120万 | ¥135万 | ¥158万 | +31.7% |
| 订单数量 | 1,200 | 1,350 | 1,580 | +31.7% |
| 客单价 | ¥1,000 | ¥1,000 | ¥1,000 | 0% |

### 关键发现

1. **销售额稳步增长**：连续三个季度保持增长
2. **订单量增加**：客户基数在扩大
3. **客单价稳定**：定价策略有效

### 建议

- 继续当前的营销策略
- 考虑推出高端产品提升客单价
- 加强客户留存工作

用户: 有什么具体的行动计划吗？

AI助手: 基于分析结果，我建议以下行动计划：

## 行动计划

### 短期目标（1-3个月）

- [ ] 启动客户满意度调研
- [ ] 分析高价值客户特征
- [ ] 制定客户分层策略

### 中期目标（3-6个月）

- [ ] 推出会员体系
- [ ] 开发高端产品线
- [ ] 优化客户服务流程

### 长期目标（6-12个月）

- [ ] 建立客户数据平台
- [ ] 实施个性化营销
- [ ] 拓展新的销售渠道

> **重要提醒**：所有计划都需要定期评估和调整
            `.trim();

            // 检测内容类型
            const detectedType = detector.detectContentType(aiConversation);
            expect(['markdown', 'list', 'table']).toContain(detectedType);

            // 解析内容
            const elements = parser.parseMarkdown(aiConversation);
            
            // 验证包含预期的元素类型
            const types = elements.map(el => el.type);
            expect(types).toContain('heading');
            expect(types).toContain('table');
            expect(types).toContain('list');
            expect(types).toContain('quote');

            // 验证表格数据
            const tables = elements.filter(el => el.type === 'table');
            expect(tables.length).toBeGreaterThan(0);
            
            const salesTable = tables[0];
            expect(salesTable.headers).toContain('指标');
            expect(salesTable.headers).toContain('增长率');
        });
    });
});

// 运行集成测试的函数
async function runIntegrationTests() {
    // 查找集成测试相关的测试套件
    const availableSuites = testFramework.tests.filter(t => t && t.name);
    console.log('可用的集成测试套件:', availableSuites.map(t => t.name));

    // 运行所有集成测试相关的测试套件
    for (const suite of availableSuites) {
        if (suite.name.includes('集成') || suite.name.includes('协作') || suite.name.includes('性能') || suite.name.includes('场景')) {
            await testFramework.runSuite(suite.name, 'integration-test-results');
        }
    }
}
