为以下内容编写测试：$ARGUMENTS

遵循这些约定：
- 使用 Jest 和 TypeScript
- 使用 `describe` / `it` 块（不是 `test()`）
- 按行为分组，而不是按方法名称分组
- Mock 外部服务（数据库、API）- 永远不要调用真实的端点
- 包含边缘情况：空输入、null、边界值、错误路径
- 使用描述性测试名称：`it('当用户不存在时返回 404')`

结构：
```
describe('组件或函数', () => {
  describe('当条件', () => {
    it('应该预期行为', () => {
      // Arrange → Act → Assert
    });
  });
});
```

在编写测试后，运行 `npm test` 验证它们通过。