import { generateService } from '@umijs/openapi'

generateService({
  schemaPath: 'http://localhost:48080/v3/api-docs/blog-app',
  serversPath: './src',
  projectName: 'api',
  requestLibPath: "import request from '@/utils/request'",
  dataFields: ['data'],
  namespace: 'API',
  isCamelCase: false,
  hook: {
    /**
     * 用 operationId 前缀 + Controller 后缀作为文件名，不再依赖 Tag
     * operationId 格式：AppArticle_getArticle → AppArticleController.ts
     * Java 侧 @Tag 保持中文，Swagger 文档不受影响
     */
    customFileNames: (operationObject: any) => {
      const operationId = operationObject.operationId
      if (!operationId) {
        return operationObject.tags || []
      }
      const classPrefix = operationId.split('_')[0]
      return classPrefix ? [`${classPrefix}Controller`] : operationObject.tags || []
    },
    /** operationId 格式为 "AppArticle_getArticle"，取 "_" 后面的部分 */
    customFunctionName: (data: any) => {
      const parts = data.operationId?.split('_')
      return parts?.length > 1 ? parts.slice(1).join('_') : data.operationId
    },
  },
})
